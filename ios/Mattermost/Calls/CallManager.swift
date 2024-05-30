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
}

public class CallManager: NSObject {
  @objc public static let shared = CallManager()

  private let callProvider: CXProvider
  private let callController: CXCallController
  private let voipRegistry: PKPushRegistry

  private var currentCalls = [UUID: MeetCall]()

  @objc public private(set) var token: String?

  @objc var callAnsweredCallback: ((String, String, String) -> Void)?
  @objc var callEndedCallback: ((String, String) -> Void)?
  @objc var callMutedCallback: ((String, Bool) -> Void)?

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
  
  @objc public func reportCallMuted(conferenceId: String, muted: Bool) {
    guard let existingCall = currentCalls.first(where: { $0.value.conferenceId == conferenceId })?.value else { return }

    let muteCallAction = CXSetMutedCallAction(call: existingCall.localUUID, muted: muted)
    callController.requestTransaction(with: [muteCallAction]) { error in
      if let error {
        print("An error occured muting call \(error)")
      }
    }
  }

  @objc public func reportCallEnded(conferenceId: String) {
    guard let existingCall = currentCalls.first(where: { $0.value.conferenceId == conferenceId })?.value else { return }
    callProvider.reportCall(with: existingCall.localUUID, endedAt: nil, reason: .remoteEnded)
  }

  @objc public func reportCallStarted(serverId: String, channelId: String, conferenceId: String, callName: String) {
    let call = MeetCall(
      localUUID: UUID(),
      serverId: serverId,
      channelId: channelId,
      conferenceId: conferenceId,
      conferenceJWT: ""
    )
    currentCalls[call.localUUID] = call
    callProvider.reportOutgoingCall(with: call.localUUID, startedConnectingAt: Date(timeIntervalSinceNow: -3))
    callProvider.reportOutgoingCall(with: call.localUUID, connectedAt: Date())

    let startCallAction = CXStartCallAction(call: call.localUUID, handle: CXHandle(type: .generic, value: callName))
    callController.requestTransaction(with: [startCallAction]) { error in
      if let error {
        print("An error occured starting call \(error)")
      }
    }
  }

  func reportIncomingCall(call: MeetCall, callName: String, completion: @escaping () -> Void) {
    let update = CXCallUpdate()
    update.hasVideo = true
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
    action.fulfill()
  }

  public func provider(_ provider: CXProvider, perform action: CXEndCallAction) {
    guard let existingCall = currentCalls[action.callUUID] else { return }
    callEndedCallback?(existingCall.serverId, existingCall.conferenceId)
    action.fulfill()
  }

  public func provider(_ provider: CXProvider, perform action: CXSetMutedCallAction) {
    guard let existingCall = currentCalls[action.callUUID] else { return }
    callMutedCallback?(existingCall.serverId, action.isMuted)
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

    print("Received voip notification \(payload.dictionaryPayload)")
    guard let serverId = payload.dictionaryPayload["server_id"] as? String,
          let channelId = payload.dictionaryPayload["channel_id"] as? String,
          let conferenceId = payload.dictionaryPayload["conference_id"] as? String,
          let channelName = payload.dictionaryPayload["channel_name"] as? String,
          let conferenceJWT = payload.dictionaryPayload["conference_jwt"] as? String else {
      return
    }

    let meetCall = MeetCall(
      localUUID: UUID(),
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
