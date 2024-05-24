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
  var answered = false
}

public class CallManager: NSObject {
  @objc public static let shared = CallManager()

  private let callProvider: CXProvider
  private let voipRegistry: PKPushRegistry

  private var currentCalls = [UUID: MeetCall]()

  @objc public private(set) var token: String?

  private let callManagerModule = CallManagerModule()

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
    super.init()
    callProvider.setDelegate(self, queue: nil)

    registerForVoIPPushes()
  }

  @objc public func registerForVoIPPushes() {
    voipRegistry.delegate = self
    voipRegistry.desiredPushTypes = [.voIP]
  }

  func reportIncomingCall(call: MeetCall, callName: String, completion: @escaping () -> Void) {
    let update = CXCallUpdate()
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
    // TODO: Start call RN Side
    guard let existingCall = currentCalls[action.callUUID] else { return }
    callManagerModule.callAnsweredEvent(existingCall.serverId, channelId: existingCall.channelId)
    currentCalls[action.callUUID]?.answered = true
    action.fulfill()
  }

  public func provider(_ provider: CXProvider, perform action: CXEndCallAction) {
    // TODO: Stop call RN Side
    guard let existingCall = currentCalls[action.callUUID] else { return }
    callManagerModule.callDeclinedEvent(existingCall.serverId, conferenceId: existingCall.conferenceId)
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
    self.token = token
  }

  public func pushRegistry(
    _ registry: PKPushRegistry,
    didReceiveIncomingPushWith payload: PKPushPayload,
    for type: PKPushType,
    completion: @escaping () -> Void
  ) {
    guard type == .voIP else { return }

    guard let serverId = payload.dictionaryPayload["server_id"] as? String,
          let channelId = payload.dictionaryPayload["channel_id"] as? String,
          let conferenceId = payload.dictionaryPayload["conference_id"] as? String,
          let channelName = payload.dictionaryPayload["channel_name"] as? String else {
      return
    }

    let meetCall = MeetCall(localUUID: UUID(), serverId: serverId, channelId: channelId, conferenceId: conferenceId)
    reportIncomingCall(call: meetCall, callName: channelName) {
      completion()
    }
  }

  public func pushRegistry(_ registry: PKPushRegistry, didInvalidatePushTokenFor type: PKPushType) {
    print("pushRegistry didInvalidatePushTokenFor")
  }
}
