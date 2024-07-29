//
//  CallManager.swift
//  kChat
//
//  Created by Philippe on 21.05.2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import AVFAudio
import CallKit
import Foundation
import Gekidou

struct MeetCall {
  let localUUID: UUID
  let serverURL: String
  let channelId: String
  let name: String
  var initiatorUserId: String?
  var conferenceId: String?
  var conferenceJWT: String?
  var conferenceURL: String?
  var joined = false

  var remoteHandle: CXHandle {
    CXHandle(type: .generic, value: "\(serverURL)/channels/\(channelId)/conference")
  }

  init(
    serverURL: String,
    channelId: String,
    conferenceId: String?,
    conferenceJWT: String?,
    conferenceURL: String? = nil,
    name: String
  ) {
    localUUID = UUID()
    self.serverURL = serverURL
    self.channelId = channelId
    self.conferenceId = conferenceId
    self.conferenceJWT = conferenceJWT
    self.conferenceURL = conferenceURL
    self.name = name
  }
}

public class CallManager: NSObject {
  static let videoEnabledByDefault = false

  @objc public static let shared = CallManager()

  private let callProvider: CXProvider
  private let callController: CXCallController
  private let voipRegistry: PKPushRegistry

  private var currentCalls = [UUID: MeetCall]()

  @objc public private(set) var token: String?

  private var callWindow: CallWindow?

  override private init() {
    let configuration: CXProviderConfiguration
    if #available(iOS 14.0, *) {
      configuration = CXProviderConfiguration()
    } else {
      configuration = CXProviderConfiguration(localizedName: "kChat")
    }
    configuration.iconTemplateImageData = UIImage(named: "monochrome_call_icon")?.pngData()
    configuration.ringtoneSound = "ringtone.wav"
    configuration.supportsVideo = true
    configuration.supportedHandleTypes = [.generic]
    configuration.maximumCallsPerCallGroup = 1

    callProvider = CXProvider(configuration: configuration)
    voipRegistry = PKPushRegistry(queue: nil)
    callController = CXCallController()
    super.init()
    callProvider.setDelegate(self, queue: nil)

    registerForVoIPPushes()
  }

  @objc public func registerForVoIPPushes() {
    voipRegistry.delegate = self
    voipRegistry.desiredPushTypes = [.voIP]
  }

  func declineCall(_ call: MeetCall) async throws {
    guard let conferenceId = call.conferenceId else { return }
    _ = try await Network.default.declineCall(forServerUrl: call.serverURL, conferenceId: conferenceId)
  }

  func startCall(_ partialCall: MeetCall) async throws -> MeetCall {
    var call = partialCall
    let (startCallData, startCallResponse) = try await Network.default.startCall(
      forServerUrl: call.serverURL,
      channelId: call.channelId
    )

    let decoder = JSONDecoder()
    decoder.keyDecodingStrategy = .convertFromSnakeCase

    let conference: Conference
    if let startCallHttpResponse = startCallResponse as? HTTPURLResponse,
       startCallHttpResponse.statusCode == 409 {
      let partialConference = try decoder.decode(PartialConference.self, from: startCallData)
      let (conferenceData, _) = try await Network.default.answerCall(
        forServerUrl: call.serverURL,
        conferenceId: partialConference.id
      )
      conference = try decoder.decode(Conference.self, from: conferenceData)
    } else {
      conference = try decoder.decode(Conference.self, from: startCallData)
    }

    call.conferenceURL = conference.url
    call.conferenceId = conference.id
    call.conferenceJWT = call.conferenceJWT ?? conference.jwt
    call.initiatorUserId = conference.userId
    return call
  }

  func reportCallEnded(conferenceId: String) {
    guard let existingCall = currentCalls.first(where: { $0.value.conferenceId == conferenceId })?.value else { return }

    let endCallAction = CXEndCallAction(call: existingCall.localUUID)
    callController.requestTransaction(with: [endCallAction]) { error in
      if let error {
        LegacyLogger.calls.log(level: .error, message: "An error occurred ending call \(error)")
      } else {
        self.currentCalls[existingCall.localUUID]?.joined = false
        self.currentCalls[existingCall.localUUID] = nil
      }
    }
  }

  @objc public func reportCallStarted(
    serverURL: String,
    channelId: String,
    callName: String,
    conferenceId: String,
    conferenceJWT: String,
    conferenceURL: String
  ) {
    Task { @MainActor in
      let call = MeetCall(
        serverURL: serverURL,
        channelId: channelId,
        conferenceId: conferenceId,
        conferenceJWT: conferenceJWT,
        conferenceURL: conferenceURL,
        name: callName
      )

      currentCalls[call.localUUID] = call

      let startCallAction = CXStartCallAction(call: call.localUUID, handle: call.remoteHandle)
      startCallAction.isVideo = CallManager.videoEnabledByDefault

      callController.requestTransaction(with: [startCallAction]) { error in
        if let error {
          LegacyLogger.calls.log(level: .error, message: "An error occurred starting call \(error)")
        }
      }
    }
  }

  func reportIncomingCall(call: MeetCall, completion: @escaping () -> Void) {
    let update = CXCallUpdate()
    update.localizedCallerName = call.name
    update.hasVideo = CallManager.videoEnabledByDefault
    update.remoteHandle = call.remoteHandle

    callProvider.reportNewIncomingCall(with: call.localUUID, update: update) { error in
      guard error == nil else {
        completion()
        return
      }

      self.currentCalls[call.localUUID] = call
      completion()
    }
  }
}

extension CallManager: CallViewControllerDelegate {
  func onConferenceTerminated(conferenceId: String?) {
    callWindow = nil

    guard let conferenceId else { return }
    reportCallEnded(conferenceId: conferenceId)
  }

  func onVideoMuted(conferenceId: String, isMuted: Bool) {
    guard let existingCall = currentCalls.first(where: { $0.value.conferenceId == conferenceId })?.value else { return }

    let update = CXCallUpdate()
    update.hasVideo = isMuted
    callProvider.reportCall(with: existingCall.localUUID, updated: update)
  }

  func onAudioMuted(conferenceId: String, isMuted: Bool) {
    guard let existingCall = currentCalls.first(where: { $0.value.conferenceId == conferenceId })?.value else { return }

    let muteCallAction = CXSetMutedCallAction(call: existingCall.localUUID, muted: isMuted)
    callController.requestTransaction(with: [muteCallAction]) { error in
      if let error {
        LegacyLogger.calls.log(level: .error, message: "An error occurred muting call \(error)")
      }
    }
  }
}

extension CallManager: CXProviderDelegate {
  public func provider(_ provider: CXProvider, perform action: CXStartCallAction) {
    guard let existingCall = currentCalls[action.callUUID] else {
      action.fail()
      return
    }

    Task { @MainActor in
      let callUpdate = CXCallUpdate()
      callUpdate.remoteHandle = existingCall.remoteHandle
      callUpdate.localizedCallerName = existingCall.name
      callProvider.reportCall(with: action.callUUID, updated: callUpdate)

      action.fulfill()

      let answerCallAction = CXAnswerCallAction(call: existingCall.localUUID)
      callController.requestTransaction(with: [answerCallAction]) { error in
        if let error {
          LegacyLogger.calls.log(level: .error, message: "An error occurred starting call \(error)")
        }
      }
    }
  }

  public func provider(_ provider: CXProvider, perform action: CXAnswerCallAction) {
    guard let existingCall = currentCalls[action.callUUID] else {
      action.fail()
      return
    }

    Task { @MainActor in
      do {
        try AVAudioSession.sharedInstance().setCategory(.playback, mode: .voiceChat, options: [])
      } catch {
        LegacyLogger.calls.log(level: .error, message: "Failed to set audio session category \(error)")
      }

      do {
        let completeCall: MeetCall
        if existingCall.conferenceURL != nil {
          completeCall = existingCall
        } else {
          completeCall = try await startCall(existingCall)
        }

        if let rootWindowScene = (UIApplication.shared.delegate as? AppDelegate)?.window.windowScene {
          LegacyLogger.calls.log(message: "Presenting call window")
          let callWindow = CallWindow(meetCall: completeCall, delegate: self, windowScene: rootWindowScene)
          self.callWindow = callWindow
          currentCalls[action.callUUID] = completeCall
          currentCalls[action.callUUID]?.joined = true
          action.fulfill()
        }
      } catch {
        LegacyLogger.calls.log(level: .error, message: "Error while calling start call \(error)")
        action.fail()
      }
    }
  }

  public func provider(_ provider: CXProvider, perform action: CXEndCallAction) {
    Task { @MainActor in
      guard let existingCall = currentCalls[action.callUUID] else {
        action.fail()
        return
      }
      // The user is in the current call
      if currentCalls[action.callUUID]?.joined == true {
        callWindow?.leaveCurrentCall()
      } else {
        // The user declined the call from native UI
        Task {
          try await self.declineCall(existingCall)
        }
      }
      currentCalls[action.callUUID]?.joined = false
      currentCalls[existingCall.localUUID] = nil
      action.fulfill()
    }
  }

  public func provider(_ provider: CXProvider, perform action: CXSetMutedCallAction) {
    Task { @MainActor in
      callWindow?.setCurrentCallMuted(action.isMuted)
      action.fulfill()
    }
  }

  public func providerDidReset(_ provider: CXProvider) {
    LegacyLogger.calls.log(level: .debug, message: "providerDidReset")
  }
}

extension CallManager: PKPushRegistryDelegate {
  public func pushRegistry(_ registry: PKPushRegistry, didUpdate pushCredentials: PKPushCredentials, for type: PKPushType) {
    guard pushCredentials.type == .voIP else { return }

    let tokenParts = pushCredentials.token.map { data in String(format: "%02.2hhx", data) }
    let token = tokenParts.joined()
    LegacyLogger.calls.log(level: .debug, message: "PushKit Token \(token)")
    self.token = token
  }

  public func pushRegistry(
    _ registry: PKPushRegistry,
    didReceiveIncomingPushWith payload: PKPushPayload,
    for type: PKPushType,
    completion: @escaping () -> Void
  ) {
    guard type == .voIP else { return }

    LegacyLogger.calls.log(message: "Received voip notification")

    let notificationPayload = payload.dictionaryPayload

    handleCallIncomingNotification(notificationPayload: notificationPayload, completion: completion)
  }

  @objc public func handleCallCancelled(notificationPayload: [AnyHashable: Any], completion: @escaping () -> Void) {
    guard let conferenceId = notificationPayload["conference_id"] as? String,
          let existingCall = currentCalls.first(where: { $0.value.conferenceId == conferenceId })?.value else {
      completion()
      return
    }

    reportCallEnded(conferenceId: conferenceId)
    callProvider.reportCall(with: existingCall.localUUID, endedAt: nil, reason: .remoteEnded)
    completion()
  }

  @objc public func handleJoinedCall(notificationPayload: [AnyHashable: Any], completion: @escaping () -> Void) {
    guard let conferenceId = notificationPayload["conference_id"] as? String,
          let existingCall = currentCalls.first(where: { $0.value.conferenceId == conferenceId })?.value,
          // Only hide call UI if the user joined the call on an other device than this one
          !existingCall.joined else {
      completion()
      return
    }

    reportCallEnded(conferenceId: conferenceId)
    callProvider.reportCall(with: existingCall.localUUID, endedAt: nil, reason: .answeredElsewhere)
    completion()
  }

  public func handleCallIncomingNotification(notificationPayload: [AnyHashable: Any], completion: @escaping () -> Void) {
    guard let serverId = notificationPayload["server_id"] as? String,
          let channelId = notificationPayload["channel_id"] as? String,
          let conferenceId = notificationPayload["conference_id"] as? String,
          let channelName = notificationPayload["channel_name"] as? String,
          let conferenceJWT = notificationPayload["conference_jwt"] as? String else {
      LegacyLogger.calls.log(level: .error, message: "We are not reporting a call ! This can lead to crash and errors.")
      completion()
      return
    }

    guard let serverURL = try? Database.default.getServerUrlForServer(serverId) else {
      LegacyLogger.calls.log(
        level: .error,
        message: "We are not reporting a call because we couldn't find a server for id \(serverId) ! This can lead to crash and errors."
      )
      completion()
      return
    }

    let meetCall = MeetCall(
      serverURL: serverURL,
      channelId: channelId,
      conferenceId: conferenceId,
      conferenceJWT: conferenceJWT,
      name: channelName
    )
    reportIncomingCall(call: meetCall) {
      completion()
    }
  }

  public func pushRegistry(_ registry: PKPushRegistry, didInvalidatePushTokenFor type: PKPushType) {
    LegacyLogger.calls.log(level: .debug, message: "pushRegistry didInvalidatePushTokenFor")
  }
}
