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
  let remoteUUID: String
  var answered = false
}

public class CallManager: NSObject {
  @objc public static let shared = CallManager()

  private let callProvider: CXProvider
  private let voipRegistry: PKPushRegistry

  private var currentCalls = [UUID: MeetCall]()

  @objc public private(set) var token: String?

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

  func registerForVoIPPushes() {
    voipRegistry.delegate = self
    voipRegistry.desiredPushTypes = [.voIP]
  }

  @objc public func reportIncomingCall(remoteUUID: String, callName: String, completion: @escaping () -> Void) {
    let update = CXCallUpdate()
    update.remoteHandle = CXHandle(type: .generic, value: callName)

    let localUUID = UUID()
    let meetCall = MeetCall(localUUID: localUUID, remoteUUID: remoteUUID)

    callProvider.reportNewIncomingCall(with: localUUID, update: update) { error in
      guard error == nil else {
        completion()
        return
      }

      self.currentCalls[localUUID] = meetCall
      completion()
    }
  }

  @objc public func testCall() {
    DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
      //self.reportIncomingCall(remoteUUID: "", callName: "kChat-dev") {}
    }
  }
}

extension CallManager: CXProviderDelegate {
  public func provider(_ provider: CXProvider, perform action: CXAnswerCallAction) {
    // TODO: Start call RN Side
    // startCallRN()
    currentCalls[action.callUUID]?.answered = true
    action.fulfill()
  }

  public func provider(_ provider: CXProvider, perform action: CXEndCallAction) {
    // TODO: Stop call RN Side
    // stopCallRN()
    currentCalls[action.callUUID]?.answered = false // Maybe clear the list ?
    action.fulfill()
  }

  public func providerDidReset(_ provider: CXProvider) {}
}

extension CallManager: PKPushRegistryDelegate {
  public func pushRegistry(_ registry: PKPushRegistry, didUpdate pushCredentials: PKPushCredentials, for type: PKPushType) {
    guard pushCredentials.type == .voIP else { return }

    let tokenParts = pushCredentials.token.map { data in String(format: "%02.2hhx", data) }
    let token = tokenParts.joined()
    self.token = token
    // TODO: Forward push credentials to server with RN
    // registerForVoipPush(pushCredentials.token)
  }

  public func pushRegistry(
    _ registry: PKPushRegistry,
    didReceiveIncomingPushWith payload: PKPushPayload,
    for type: PKPushType,
    completion: @escaping () -> Void
  ) {
    guard type == .voIP else { return }

    guard let remoteCallUUID = payload.dictionaryPayload["callUUID"] as? String,
          let callName = payload.dictionaryPayload["callName"] as? String else {
      return
    }

    reportIncomingCall(remoteUUID: remoteCallUUID, callName: callName) {
      completion()
    }
  }
}
