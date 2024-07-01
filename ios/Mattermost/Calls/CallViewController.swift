//
//  CallViewController.swift
//  kChat
//
//  Created by Philippe on 01.07.2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

import JitsiMeetSDK
import UIKit

protocol CallViewControllerDelegate: AnyObject {
  func onConferenceTerminated()
}

class CallWindow: UIWindow {
  private let callViewController: CallViewController

  init(meetCall: MeetCall, delegate: CallViewControllerDelegate, windowScene: UIWindowScene) {
    callViewController = CallViewController(delegate: delegate)
    super.init(windowScene: windowScene)
    rootViewController = callViewController
    makeKeyAndVisible()
  }

  @available(*, unavailable)
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
}

private class CallViewController: UIViewController {
  private weak var delegate: CallViewControllerDelegate?

  init(delegate: CallViewControllerDelegate) {
    self.delegate = delegate
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
  }

  override func loadView() {
    view = JitsiMeetView()
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
}
