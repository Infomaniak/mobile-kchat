//
//  CallViewController.swift
//  kChat
//
//  Created by Philippe on 01.07.2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import Gekidou
import JitsiMeetSDK
import UIKit

protocol CallViewControllerDelegate: AnyObject {
  func onConferenceTerminated()
  func onVideoMuted(conferenceId: String, isMuted: Bool)
  func onAudioMuted(conferenceId: String, isMuted: Bool)
}

class CallWindow: UIWindow {
  private let callViewController: CallViewController

  init(meetCall: MeetCall, delegate: CallViewControllerDelegate, windowScene: UIWindowScene) {
    callViewController = CallViewController(meetCall: meetCall, delegate: delegate)
    super.init(windowScene: windowScene)
    rootViewController = callViewController
    makeKeyAndVisible()
  }

  @available(*, unavailable)
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  func setCurrentCallMuted(_ isMuted: Bool) {
    callViewController.jitsiView?.setAudioMuted(isMuted)
  }

  func leaveCurrentCall() {
    callViewController.jitsiView?.leave()
  }
}

private class CallViewController: UIViewController {
  private weak var delegate: CallViewControllerDelegate?
  private let meetCall: MeetCall

  var jitsiView: JitsiMeetView? {
    return view as? JitsiMeetView
  }

  init(meetCall: MeetCall, delegate: CallViewControllerDelegate) {
    self.delegate = delegate
    self.meetCall = meetCall
    super.init(nibName: nil, bundle: nil)
  }

  @available(*, unavailable)
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override func viewDidLoad() {
    super.viewDidLoad()

    guard let jitsiView = view as? JitsiMeetView else { return }

    jitsiView.delegate = self
    let options = JitsiMeetConferenceOptions.fromBuilder { builder in
      builder.room = "lxywemuqygmqvqtv"
      builder.serverURL = URL(string: "https://kmeet.infomaniak.com")
      builder.userInfo = JitsiMeetUserInfo(displayName: "Philou", andEmail: nil, andAvatar: nil)
      builder.setFeatureFlag("prejoinpage.enabled", withBoolean: false)
      builder.setFeatureFlag("settings.enabled", withBoolean: false)
      builder.setFeatureFlag("unsaferoomwarning.enabled", withBoolean: false)
      builder.setFeatureFlag("welcomepage.enable", withBoolean: false)
      builder.setFeatureFlag("recording.enabled", withBoolean: false)
      builder.setFeatureFlag("video-share.enabled", withBoolean: false)
      builder.setFeatureFlag("live-streaming.enabled", withBoolean: false)
      builder.setFeatureFlag("call-integration.enabled", withBoolean: false)
    }
    jitsiView.join(options)
    initializeConference()
  }

  override func loadView() {
    view = JitsiMeetView()
  }

  func initializeConference() {
    Task {
      let kMeetServerUrl = URL(string: "https://kchat.infomaniak.com")
      
      guard let serverURL = try? Database.default.getServerUrlForServer(meetCall.serverId) else {
        LegacyLogger.callViewController.log(message: "Couldn't find serverURL for \(meetCall.serverId)")
        return
      }
      
      let decoder = JSONDecoder()
      decoder.keyDecodingStrategy = .convertFromSnakeCase
      
      let (userProfileData, response) = try await Network.default.fetchUserProfile(forServerUrl: serverURL)
      
      let user = try decoder.decode(MeUserProfile.self, from: userProfileData)
      print(user)
    }
  }
}

extension CallViewController: JitsiMeetViewDelegate {
  func conferenceTerminated(_ data: [AnyHashable: Any]!) {
    UIView.animate(withDuration: 0.25) { [weak self] in
      self?.view.alpha = 0
    } completion: { [weak self] _ in
      self?.delegate?.onConferenceTerminated()
    }
  }

  func audioMutedChanged(_ data: [AnyHashable: Any]!) {
    delegate?.onAudioMuted(conferenceId: meetCall.conferenceId, isMuted: (data["muted"] as? Int ?? 0) == 1)
  }

  func videoMutedChanged(_ data: [AnyHashable: Any]!) {
    delegate?.onVideoMuted(conferenceId: meetCall.conferenceId, isMuted: (data["muted"] as? Int ?? 0) == 4)
  }
}
