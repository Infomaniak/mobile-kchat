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

public extension Network {
  func fetchUserProfile(forServerUrl serverUrl: String) async throws -> (Data, URLResponse) {
    let endpoint = "/users/me"
    let url = buildApiUrl(serverUrl, endpoint)

    return try await request(
      url,
      withMethod: "GET",
      withBody: nil,
      andHeaders: nil,
      forServerUrl: serverUrl
    )
  }
}
