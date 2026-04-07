//
//  CallWebSocketService.swift
//  kChat
//
//  Created by Boris Trombert on 02.04.2026.
//  Copyright © 2026 Facebook. All rights reserved.
//

import Foundation
import Gekidou

/// Opens a native WebSocket connection (URLSessionWebSocketTask) when an incoming
/// VoIP call is reported to CallKit. Implements the Pusher wire protocol directly
/// to listen for `conference_deleted` on the user's presence channel so that
/// CallKit can be cancelled in real-time — even when the JS layer is not running.
class CallWebSocketService {
  static let shared = CallWebSocketService()

  private var connections: [String: URLSessionWebSocketTask] = [:] // keyed by conferenceId
  private var sessions: [String: URLSession] = [:]
  private let lock = NSLock()

  private init() {}

  // MARK: - Public

  func connect(conferenceId: String, channelId: String, serverURL: String) {
    guard let credentials = try? Keychain.default.getCredentials(for: serverURL),
          let token = credentials.token else {
      LegacyLogger.calls.log(level: .error, message: "[CallWebSocketService] No token for \(serverURL)")
      return
    }

    Task {
      do {
        let profile = try await Network.default.fetchUserProfile(forServerUrl: serverURL)
        let channelName = "presence-teamUser.\(profile.id)"

        let task = try await openPusherConnection(
          serverURL: serverURL,
          token: token,
          channelName: channelName
        )

        lock.lock()
        connections[conferenceId] = task
        lock.unlock()

        LegacyLogger.calls.log(message: "[CallWebSocketService] Subscribed to \(channelName) for conf \(conferenceId)")
        receive(task: task, conferenceId: conferenceId, channelId: channelId)
      } catch {
        LegacyLogger.calls.log(level: .error, message: "[CallWebSocketService] Connection error: \(error)")
      }
    }
  }

  func disconnect(conferenceId: String) {
    lock.lock()
    let task = connections.removeValue(forKey: conferenceId)
    sessions.removeValue(forKey: conferenceId)
    lock.unlock()
    task?.cancel(with: .normalClosure, reason: nil)
  }

  // MARK: - Pusher wire protocol

  private func openPusherConnection(serverURL: String, token: String, channelName: String) async throws -> URLSessionWebSocketTask {
    let wsBaseURL = Database.default.getConfig(serverURL, "WebsocketURL") ?? serverURL
    let wsHost = wsBaseURL
      .replacingOccurrences(of: "https://", with: "")
      .replacingOccurrences(of: "http://", with: "")
      .replacingOccurrences(of: "wss://", with: "")
      .replacingOccurrences(of: "ws://", with: "")
    let scheme = serverURL.hasPrefix("https") ? "wss" : "ws"

    guard let url = URL(string: "\(scheme)://\(wsHost)/app/kchat-key?protocol=7&client=swift&version=1.0&flash=false") else {
      throw CallWSError.invalidURL
    }

    var wsRequest = URLRequest(url: url)
    wsRequest.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

    let config = URLSessionConfiguration.default
    config.waitsForConnectivity = false
    config.timeoutIntervalForRequest = 30

    let session = URLSession(configuration: config)
    let task = session.webSocketTask(with: wsRequest)
    task.resume()

    let socketId = try await waitForConnectionEstablished(task: task)

    let (authToken, channelData) = try await fetchPusherAuth(
      serverURL: serverURL,
      token: token,
      socketId: socketId,
      channelName: channelName
    )

    var subscribeFields: [String: Any] = ["channel": channelName, "auth": authToken]
    if let channelData { subscribeFields["channel_data"] = channelData }
    let subscribePayload: [String: Any] = ["event": "pusher:subscribe", "data": subscribeFields]
    let subscribeData = try JSONSerialization.data(withJSONObject: subscribePayload)
    guard let subscribeString = String(data: subscribeData, encoding: .utf8) else {
      throw CallWSError.encodingError
    }
    try await task.send(.string(subscribeString))

    lock.lock()
    sessions[socketId] = session
    lock.unlock()

    return task
  }

  private func waitForConnectionEstablished(task: URLSessionWebSocketTask) async throws -> String {
    for _ in 0..<10 {
      let message = try await task.receive()
      guard case .string(let text) = message,
            let json = try? JSONSerialization.jsonObject(with: Data(text.utf8)) as? [String: Any],
            let event = json["event"] as? String else { continue }

      if event == "pusher:connection_established",
         let dataStr = json["data"] as? String,
         let dataJson = try? JSONSerialization.jsonObject(with: Data(dataStr.utf8)) as? [String: Any],
         let socketId = dataJson["socket_id"] as? String {
        return socketId
      }
      if event == "pusher:error" { throw CallWSError.pusherError(text) }
    }
    throw CallWSError.connectionEstablishedTimeout
  }

  private func fetchPusherAuth(serverURL: String, token: String, socketId: String, channelName: String) async throws -> (String, String?) {
    guard let url = URL(string: "\(serverURL)/broadcasting/auth") else {
      throw CallWSError.invalidURL
    }

    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
    request.setValue("XMLHttpRequest", forHTTPHeaderField: "X-Requested-With")
    request.setValue(serverURL, forHTTPHeaderField: "Origin")
    request.httpBody = "socket_id=\(socketId)&channel_name=\(channelName)"
      .addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)
      .flatMap { $0.data(using: .utf8) }

    let (data, response) = try await URLSession.shared.data(for: request)
    let statusCode = (response as? HTTPURLResponse)?.statusCode ?? 0
    if statusCode != 200 { throw CallWSError.authFailed(statusCode) }

    guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
          let auth = json["auth"] as? String else {
      throw CallWSError.authFailed(0)
    }
    return (auth, json["channel_data"] as? String)
  }

  // MARK: - Message loop

  private func receive(task: URLSessionWebSocketTask, conferenceId: String, channelId: String) {
    task.receive { [weak self] result in
      switch result {
      case .success(let message):
        if case .string(let text) = message {
          self?.handleMessage(text: text, conferenceId: conferenceId, channelId: channelId)
        }
        self?.lock.lock()
        let stillActive = self?.connections[conferenceId] === task
        self?.lock.unlock()
        if stillActive {
          self?.receive(task: task, conferenceId: conferenceId, channelId: channelId)
        }
      case .failure(let error):
        LegacyLogger.calls.log(level: .error, message: "[CallWebSocketService] Receive error for \(conferenceId): \(error)")
      }
    }
  }

  private func handleMessage(text: String, conferenceId: String, channelId: String) {
    guard let json = try? JSONSerialization.jsonObject(with: Data(text.utf8)) as? [String: Any],
          let event = json["event"] as? String else { return }

    if event == "pusher:ping" {
      lock.lock()
      let task = connections[conferenceId]
      lock.unlock()
      try? task?.send(.string("{\"event\":\"pusher:pong\",\"data\":{}}")) { _ in }
      return
    }

    guard event == "conference_deleted",
          let dataStr = json["data"] as? String,
          let dataJson = try? JSONSerialization.jsonObject(with: Data(dataStr.utf8)) as? [String: Any],
          let eventChannelId = dataJson["channel_id"] as? String,
          eventChannelId == channelId else { return }

    LegacyLogger.calls.log(message: "[CallWebSocketService] conference_deleted for conf \(conferenceId)")
    disconnect(conferenceId: conferenceId)
    DispatchQueue.main.async {
      CallManager.shared.cancelIncomingCall(conferenceId: conferenceId)
    }
  }
}

// MARK: - Errors

private enum CallWSError: Error {
  case invalidURL
  case encodingError
  case connectionEstablishedTimeout
  case pusherError(String)
  case authFailed(Int)
}
