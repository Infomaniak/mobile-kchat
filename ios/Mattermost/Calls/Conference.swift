//
//  Conference.swift
//  kChat
//
//  Created by Philippe on 02.07.2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import Foundation

struct Conference: Codable {
  let id: String
  let channelId: String
  let userId: String
  let url: String
  let jwt: String?
}

struct PartialConference: Codable {
  let id: String
  let url: String
}
