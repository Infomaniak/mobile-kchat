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
  func onConferenceTerminated(conferenceId: String?)
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
    Task { @MainActor in
      guard let conferenceJWT = meetCall.conferenceJWT,
            let conferenceURL = meetCall.conferenceURL else {
        delegate?.onConferenceTerminated(conferenceId: meetCall.conferenceId)
        return
      }

      async let userProfileRequest = Network.default.fetchUserProfile(forServerUrl: meetCall.serverURL)
      async let channelRequest = Network.default.fetchChannel(id: meetCall.channelId, serverUrl: meetCall.serverURL)

      let userProfile: MeUserProfile
      let channel: Channel
      do {
        userProfile = try await userProfileRequest
        channel = try await channelRequest
      } catch {
        LegacyLogger.callViewController.log(level: .error, message: "An error occurred in initializeConference \(error)")
        delegate?.onConferenceTerminated(conferenceId: meetCall.conferenceId)
        return
      }

      let avatarURL: URL?
      if let publicPictureUrl = userProfile.publicPictureUrl {
        // Use the public_picture_url if available
        avatarURL = URL(string: publicPictureUrl)
      } else {
        // Construct API URL if not
        let lastPictureUpdate = userProfile.lastPictureUpdate ?? 0
        avatarURL = URL(string: "\(meetCall.serverURL)/api/v4/users/{userProfile.id}/image?_={\(lastPictureUpdate)}")
      }

      let isDM = channel.type == "D"

      let isCurrentUserInitiator = meetCall.initiatorUserId == userProfile.id

      let isAppInBackground = UIApplication.shared.applicationState == .background

      let options = JitsiMeetConferenceOptions.fromBuilder { builder in
        builder.room = self.meetCall.channelId
        builder.serverURL = URL(string: conferenceURL)

        builder.token = conferenceJWT
        builder.userInfo = JitsiMeetUserInfo(
          displayName: "\(userProfile.firstName) \(userProfile.lastName)",
          andEmail: userProfile.email,
          andAvatar: avatarURL
        )

        builder.setFeatureFlag("prejoinpage.enabled", withBoolean: !isDM && !isCurrentUserInitiator && !isAppInBackground)
      }

      jitsiView?.join(options)
    }
  }
}

extension CallViewController: JitsiMeetViewDelegate {
  func conferenceTerminated(_ data: [AnyHashable: Any]!) {
    let conferenceId = meetCall.conferenceId
    UIView.animate(withDuration: 0.25) { [weak self] in
      self?.view.alpha = 0
    } completion: { [weak self] _ in
      self?.delegate?.onConferenceTerminated(conferenceId: conferenceId)
    }
  }

  func audioMutedChanged(_ data: [AnyHashable: Any]!) {
    guard let conferenceId = meetCall.conferenceId else { return }
    delegate?.onAudioMuted(conferenceId: conferenceId, isMuted: (data["muted"] as? Int ?? 0) == 1)
  }

  func videoMutedChanged(_ data: [AnyHashable: Any]!) {
    guard let conferenceId = meetCall.conferenceId else { return }
    delegate?.onVideoMuted(conferenceId: conferenceId, isMuted: (data["muted"] as? Int ?? 0) == 4)
  }
}
