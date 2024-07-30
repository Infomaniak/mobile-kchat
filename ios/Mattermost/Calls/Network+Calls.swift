//
//  Network+Calls.swift
//  kChat
//
//  Created by Philippe on 02.07.2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import Foundation
import Gekidou

public extension Network {
  func request(
    _ url: URL,
    withMethod method: String,
    withBody body: Data?,
    andHeaders headers: [String: String]?,
    forServerUrl serverUrl: String
  ) async throws -> (Data, URLResponse) {
    return try await withCheckedThrowingContinuation { continuation in
      request(url, withMethod: method, withBody: body, andHeaders: headers, forServerUrl: serverUrl) { (
        data: Data?,
        response: URLResponse?,
        error: Error?
      ) in
        guard let data, let response else {
          continuation.resume(throwing: error ?? URLError(.unknown))
          return
        }

        continuation.resume(returning: (data, response))
      }
    }
  }
}

extension Network {
  func fetchUserProfile(forServerUrl serverUrl: String) async throws -> MeUserProfile {
    let endpoint = "/users/me"
    let url = buildApiUrl(serverUrl, endpoint)

    let (userProfileData, _) = try await request(
      url,
      withMethod: "GET",
      withBody: nil,
      andHeaders: nil,
      forServerUrl: serverUrl
    )

    let decoder = JSONDecoder()
    decoder.keyDecodingStrategy = .convertFromSnakeCase

    return try decoder.decode(MeUserProfile.self, from: userProfileData)
  }

  func fetchChannel(id channelId: String, serverUrl: String) async throws -> Channel {
    let channelUrl = buildApiUrl(serverUrl, "/channels/\(channelId)")

    let (channelData, _) = try await request(
      channelUrl,
      withMethod: "GET",
      withBody: nil,
      andHeaders: nil,
      forServerUrl: serverUrl
    )

    return try JSONDecoder().decode(Channel.self, from: channelData)
  }

  func startCall(forServerUrl serverUrl: String, channelId: String) async throws -> (Data, URLResponse) {
    let endpoint = "/conferences"
    let url = buildApiUrl(serverUrl, endpoint)

    let headers = ["Content-Type": "application/json; charset=utf-8"]
    let data = try? JSONSerialization.data(withJSONObject: ["channel_id": channelId], options: [])

    return try await request(
      url,
      withMethod: "POST",
      withBody: data,
      andHeaders: headers,
      forServerUrl: serverUrl
    )
  }

  func answerCall(forServerUrl serverUrl: String, conferenceId: String) async throws -> (Data, URLResponse) {
    let endpoint = "/conferences/\(conferenceId)"
    let url = buildApiUrl(serverUrl, endpoint)

    return try await request(
      url,
      withMethod: "GET",
      withBody: nil,
      andHeaders: nil,
      forServerUrl: serverUrl
    )
  }

  func declineCall(forServerUrl serverUrl: String, conferenceId: String) async throws -> (Data, URLResponse) {
    let endpoint = "/conferences/\(conferenceId)/decline"
    let url = buildApiUrl(serverUrl, endpoint)

    return try await request(
      url,
      withMethod: "POST",
      withBody: nil,
      andHeaders: nil,
      forServerUrl: serverUrl
    )
  }
}
