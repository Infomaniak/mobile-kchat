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
    let jitisiOptions = JitsiMeetConferenceOptions.fromBuilder { builder in
      builder.setFeatureFlag("prejoinpage.enabled", withBoolean: false)
      builder.setFeatureFlag("settings.enabled", withBoolean: false)
      builder.setFeatureFlag("unsaferoomwarning.enabled", withBoolean: false)
      builder.setFeatureFlag("welcomepage.enable", withBoolean: false)
      builder.setFeatureFlag("recording.enabled", withBoolean: false)
      builder.setFeatureFlag("video-share.enabled", withBoolean: false)
      builder.setFeatureFlag("meeting-name.enabled", withBoolean: false)
      builder.setFeatureFlag("add-people.enabled", withBoolean: false)
      builder.setFeatureFlag("invite.enabled", withBoolean: false)
      builder.setFeatureFlag("invite-dial-in.enabled", withBoolean: false)
      builder.setFeatureFlag("breakout-rooms.enabled", withBoolean: false)
      builder.setFeatureFlag("live-streaming.enabled", withBoolean: false)
      builder.setFeatureFlag("call-integration.enabled", withBoolean: false)
    }
    JitsiMeet.sharedInstance().defaultConferenceOptions = jitisiOptions

    guard let jitsiView = view as? JitsiMeetView else { return }

    jitsiView.delegate = self
    initializeConference()
  }

  override func loadView() {
    view = JitsiMeetView()
  }

  func initializeConference() {
    Task {
      let meetCall = meetCall

      let decoder = JSONDecoder()
      decoder.keyDecodingStrategy = .convertFromSnakeCase

      let (userProfileData, _) = try await Network.default.fetchUserProfile(forServerUrl: meetCall.serverURL)

      let userProfile = try decoder.decode(MeUserProfile.self, from: userProfileData)

      let avatarURL: URL?
      if let publicPictureUrl = userProfile.publicPictureUrl {
        // Use the public_picture_url if available
        avatarURL = URL(string: publicPictureUrl)
      } else {
        // Construct API URL if not
        let lastPictureUpdate = userProfile.lastPictureUpdate ?? 0
        avatarURL = URL(string: "\(meetCall.serverURL)/api/v4/users/{userProfile.id}/image?_={\(lastPictureUpdate)}")
      }

      let (startCallData, startCallResponse) = try await Network.default.startCall(
        forServerUrl: meetCall.serverURL,
        channelId: meetCall.channelId
      )

      let conference: Conference
      if let startCallHttpResponse = startCallResponse as? HTTPURLResponse,
         startCallHttpResponse.statusCode == 409 {
        let partialConference = try decoder.decode(PartialConference.self, from: startCallData)
        let (conferenceData, _) = try await Network.default.answerCall(
          forServerUrl: meetCall.serverURL,
          conferenceId: partialConference.id
        )
        conference = try decoder.decode(Conference.self, from: conferenceData)
      } else {
        conference = try decoder.decode(Conference.self, from: startCallData)
      }

      guard let conferenceJWT = !meetCall.conferenceJWT.isEmpty ? meetCall.conferenceJWT : conference.jwt else {
        return
      }

      let options = JitsiMeetConferenceOptions.fromBuilder { builder in
        builder.room = conference.channelId
        builder.serverURL = URL(string: conference.url)
        
        builder.token = conferenceJWT
        builder.userInfo = JitsiMeetUserInfo(
          displayName: "\(userProfile.firstName) \(userProfile.lastName)",
          andEmail: userProfile.email,
          andAvatar: avatarURL
        )
      }

      jitsiView?.join(options)
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
