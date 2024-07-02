//
//  MeUserProfile.swift
//  kChat
//
//  Created by Philippe on 02.07.2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import Foundation

struct MeUserProfile: Codable {
  let id: String
  let publicPictureUrl: String?
  let firstName: String
  let lastName: String
  let email: String
}
