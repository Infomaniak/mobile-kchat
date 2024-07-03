//
//  Logger.swift
//  kChat
//
//  Created by Philippe on 02.07.2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import Foundation
import OSLog

struct LegacyLogger {
  let subsystem: String
  let category: String

  static let calls = LegacyLogger(subsystem: "Calls", category: "CallManager")
  static let callViewController = LegacyLogger(subsystem: "Calls", category: "CallViewController")

  func log(level: OSLogType = .info, message: String) {
    if #available(iOS 14.0, *) {
      let logger = Logger(subsystem: subsystem, category: category)
      logger.log(level: level, "\(message)")
    }
  }
}
