//
//  CallManager.swift
//  kChat
//
//  Created by Philippe on 21.05.2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import CallKit
import Foundation

struct MeetCall {
  let localUUID: UUID
  let serverId: String
  let channelId: String
  let conferenceId: String
  let conferenceJWT: String
  var joined = false
  var audioMuted = false

  init(serverId: String, channelId: String, conferenceId: String, conferenceJWT: String) {
    guard let conferenceUUID = UUID(uuidString: conferenceId) else {
      fatalError("Couldn't convert conference UUID \(conferenceId)")
    }
    localUUID = conferenceUUID
    self.serverId = serverId
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

  @objc var callAnsweredCallback: ((String, String, String) -> Void)?
  @objc var callEndedCallback: ((String, String) -> Void)?
  @objc var callMutedCallback: ((Bool) -> Void)?

  override private init() {
    let configuration: CXProviderConfiguration
    if #available(iOS 14.0, *) {
      configuration = CXProviderConfiguration()
    } else {
      configuration = CXProviderConfiguration(localizedName: "kChat")
    }
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

  @objc public func reportCallMuted(conferenceId: String, isMuted: Bool) {
    guard let existingCall = currentCalls.first(where: { $0.value.conferenceId == conferenceId })?.value else { return }

    let muteCallAction = CXSetMutedCallAction(call: existingCall.localUUID, muted: isMuted)
    callController.requestTransaction(with: [muteCallAction]) { error in
      if let error {
        print("An error occured muting call \(error)")
      } else {
        self.currentCalls[existingCall.localUUID]?.audioMuted = isMuted
      }
    }
  }

  @objc public func reportCallVideoMuted(conferenceId: String, isMuted: Bool) {
    guard let existingCall = currentCalls.first(where: { $0.value.conferenceId == conferenceId })?.value else { return }

    let update = CXCallUpdate()
    update.hasVideo = isMuted
    callProvider.reportCall(with: existingCall.localUUID, updated: update)
  }

  @objc public func reportCallEnded(conferenceId: String) {
    guard let existingCall = currentCalls.first(where: { $0.value.conferenceId == conferenceId })?.value else { return }

    let endCallAction = CXEndCallAction(call: existingCall.localUUID)
    callController.requestTransaction(with: [endCallAction]) { error in
      if let error {
        print("An error occured ending call \(error)")
      } else {
        self.currentCalls[existingCall.localUUID]?.joined = false
        self.currentCalls[existingCall.localUUID] = nil
      }
    }
  }

  @objc public func reportCallStarted(serverId: String, channelId: String, conferenceId: String, callName: String) {
    let call = MeetCall(
      serverId: serverId,
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
        print("An error occured starting call \(error)")
      } else {
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

extension CallManager: CXProviderDelegate {
  public func provider(_ provider: CXProvider, perform action: CXAnswerCallAction) {
    guard let existingCall = currentCalls[action.callUUID] else { return }
    callAnsweredCallback?(existingCall.serverId, existingCall.channelId, existingCall.conferenceJWT)
    currentCalls[action.callUUID]?.joined = true
    action.fulfill()
  }

  public func provider(_ provider: CXProvider, perform action: CXEndCallAction) {
    guard let existingCall = currentCalls[action.callUUID] else { return }
    callEndedCallback?(existingCall.serverId, existingCall.conferenceId)
    currentCalls[action.callUUID]?.joined = false
    currentCalls[existingCall.localUUID] = nil
    action.fulfill()
  }

  public func provider(_ provider: CXProvider, perform action: CXSetMutedCallAction) {
    guard let existingCall = currentCalls[action.callUUID] else { return }
    callMutedCallback?(action.isMuted)
    currentCalls[existingCall.localUUID]?.audioMuted = action.isMuted
    action.fulfill()
  }

  public func providerDidReset(_ provider: CXProvider) {
    print("providerDidReset")
  }
}

extension CallManager: PKPushRegistryDelegate {
  public func pushRegistry(_ registry: PKPushRegistry, didUpdate pushCredentials: PKPushCredentials, for type: PKPushType) {
    guard pushCredentials.type == .voIP else { return }

    let tokenParts = pushCredentials.token.map { data in String(format: "%02.2hhx", data) }
    let token = tokenParts.joined()
    print("PushKit Token \(token)")
    self.token = token
  }

  public func pushRegistry(
    _ registry: PKPushRegistry,
    didReceiveIncomingPushWith payload: PKPushPayload,
    for type: PKPushType,
    completion: @escaping () -> Void
  ) {
    guard type == .voIP else { return }

    print("Received voip notification")

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
      print("We are not reporting a call ! This can lead to crash and errors.")
      completion()
      return
    }

    let meetCall = MeetCall(
      serverId: serverId,
      channelId: channelId,
      conferenceId: conferenceId,
      conferenceJWT: conferenceJWT
    )
    reportIncomingCall(call: meetCall, callName: channelName) {
      completion()
    }
  }

  public func pushRegistry(_ registry: PKPushRegistry, didInvalidatePushTokenFor type: PKPushType) {
    print("pushRegistry didInvalidatePushTokenFor")
  }
}
