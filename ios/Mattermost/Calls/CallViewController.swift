//
//  CallViewController.swift
//  kChat
//
//  Created by Philippe on 01.07.2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import UIKit

protocol CallViewControllerDelegate: AnyObject {
  func onConferenceTerminated(conferenceId: String?)
  func onVideoMuted(conferenceId: String, isMuted: Bool)
  func onAudioMuted(conferenceId: String, isMuted: Bool)
}
