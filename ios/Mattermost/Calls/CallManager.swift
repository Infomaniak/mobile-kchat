//
//  CallManager.swift
//  kChat
//
//  Created by Philippe on 21.05.2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import CallKit
import Foundation
import Gekidou

struct MeetCall {
  let localUUID: UUID
  let serverURL: String
  let channelId: String
  let conferenceId: String
  let conferenceJWT: String
  var joined = false

  init(serverURL: String, channelId: String, conferenceId: String, conferenceJWT: String) {
    guard let conferenceUUID = UUID(uuidString: conferenceId) else {
      fatalError("Couldn't convert conference UUID \(conferenceId)")
    }
    localUUID = conferenceUUID
    self.serverURL = serverURL
    self.channelId = channelId
    self.conferenceId = conferenceId
    self.conferenceJWT = conferenceJWT
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

  func declineCall(_ call: MeetCall) {
    Task {
      try await Network.default.declineCall(forServerUrl: call.serverURL, conferenceId: call.conferenceId)
    }
  }

  func reportCallAudioMuted(conferenceId: String, isMuted: Bool) {
    guard let existingCall = currentCalls.first(where: { $0.value.conferenceId == conferenceId })?.value else { return }

    let muteCallAction = CXSetMutedCallAction(call: existingCall.localUUID, muted: isMuted)
    callController.requestTransaction(with: [muteCallAction]) { error in
      if let error {
        LegacyLogger.calls.log(level: .error, message: "An error occurred muting call \(error)")
      }
    }
  }

  func reportCallVideoMuted(conferenceId: String, isMuted: Bool) {
    guard let existingCall = currentCalls.first(where: { $0.value.conferenceId == conferenceId })?.value else { return }

    let update = CXCallUpdate()
    update.hasVideo = isMuted
    callProvider.reportCall(with: existingCall.localUUID, updated: update)
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

  @objc public func reportCallStarted(serverId: String, channelId: String, conferenceId: String, callName: String) {
    guard let serverURL = try? Database.default.getServerUrlForServer(serverId) else {
      return
    }
    
    let call = MeetCall(
      serverURL: serverURL,
      channelId: channelId,
      conferenceId: conferenceId,
      conferenceJWT: ""
    )
    currentCalls[call.localUUID] = call
    callProvider.reportOutgoingCall(with: call.localUUID, startedConnectingAt: Date(timeIntervalSinceNow: -3))
    callProvider.reportOutgoingCall(with: call.localUUID, connectedAt: Date())

    let startCallAction = CXStartCallAction(call: call.localUUID, handle: CXHandle(type: .generic, value: callName))
    startCallAction.isVideo = CallManager.videoEnabledByDefault
    callController.requestTransaction(with: [startCallAction]) { error in
      if let error {
        LegacyLogger.calls.log(level: .error, message: "An error occurred starting call \(error)")
      } else if let rootWindowScene = (UIApplication.shared.delegate as? AppDelegate)?.window.windowScene {
        let callWindow = CallWindow(meetCall: call, delegate: self, windowScene: rootWindowScene)
        self.callWindow = callWindow
        self.currentCalls[call.localUUID]?.joined = true
      }
    }
  }

  func reportIncomingCall(call: MeetCall, callName: String, completion: @escaping () -> Void) {
    let update = CXCallUpdate()
    update.hasVideo = CallManager.videoEnabledByDefault
    update.remoteHandle = CXHandle(type: .generic, value: callName)

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
  func onConferenceTerminated() {
    callWindow = nil
  }

  func onVideoMuted(conferenceId: String, isMuted: Bool) {
    reportCallVideoMuted(conferenceId: conferenceId, isMuted: isMuted)
  }

  func onAudioMuted(conferenceId: String, isMuted: Bool) {
    reportCallAudioMuted(conferenceId: conferenceId, isMuted: isMuted)
  }
}

extension CallManager: CXProviderDelegate {
  public func provider(_ provider: CXProvider, perform action: CXAnswerCallAction) {
    guard let existingCall = currentCalls[action.callUUID] else { return }

    DispatchQueue.main.async { [weak self] in
      guard let self else {
        action.fulfill()
        return
      }

      if let rootWindowScene = (UIApplication.shared.delegate as? AppDelegate)?.window.windowScene {
        let callWindow = CallWindow(meetCall: existingCall, delegate: self, windowScene: rootWindowScene)
        self.callWindow = callWindow
      }

      currentCalls[action.callUUID]?.joined = true
      action.fulfill()
    }
  }

  public func provider(_ provider: CXProvider, perform action: CXEndCallAction) {
    guard let existingCall = currentCalls[action.callUUID] else { return }
    DispatchQueue.main.async { [weak self] in
      guard let self else {
        action.fulfill()
        return
      }

      // The user is in the current call
      if currentCalls[action.callUUID]?.joined == true {
        callWindow?.leaveCurrentCall()
      } else {
        // The user declined the call from native UI
        declineCall(existingCall)
      }
      currentCalls[action.callUUID]?.joined = false
      currentCalls[existingCall.localUUID] = nil
      action.fulfill()
    }
  }

  public func provider(_ provider: CXProvider, perform action: CXSetMutedCallAction) {
    guard let existingCall = currentCalls[action.callUUID] else { return }
    DispatchQueue.main.async { [weak self] in
      guard let self else {
        action.fulfill()
        return
      }

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

    callProvider.reportCall(with: existingCall.localUUID, endedAt: nil, reason: .remoteEnded)
    currentCalls[existingCall.localUUID] = nil
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
      conferenceJWT: conferenceJWT
    )
    reportIncomingCall(call: meetCall, callName: channelName) {
      completion()
    }
  }

  public func pushRegistry(_ registry: PKPushRegistry, didInvalidatePushTokenFor type: PKPushType) {
    LegacyLogger.calls.log(level: .debug, message: "pushRegistry didInvalidatePushTokenFor")
  }
}
