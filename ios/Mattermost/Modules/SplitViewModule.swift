import Foundation

@objc(SplitViewModule)
class SplitViewModule: RCTEventEmitter {
  var hasListeners = false
  
  static let isMacOS = ProcessInfo.processInfo.isMacCatalystApp
  
  @objc
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
      
  @objc
  override func supportedEvents() -> [String]! {
    return ["SplitViewChanged"]
  }
  
  @objc
  override func startObserving() {
    hasListeners = true
    NotificationCenter.default.addObserver(self,
                                           selector: #selector(isSplitView), name: NSNotification.Name.RCTUserInterfaceStyleDidChange,
                                           object: nil)
  }
  
  @objc
  override func stopObserving() {
    hasListeners = false
    NotificationCenter.default.removeObserver(self,
                                              name: NSNotification.Name.RCTUserInterfaceStyleDidChange,
                                              object: nil)
  }
  
  @objc func isRunningInFullScreen() -> Bool {
    if SplitViewModule.isMacOS {
      return true
    }
    guard let w = UIApplication.shared.delegate?.window, let window = w else { return false }
    return window.frame.equalTo(window.screen.bounds)
  }
  
  @objc func isSplitView() {
    if hasListeners && (UIDevice.current.userInterfaceIdiom == .pad || SplitViewModule.isMacOS) {
      sendEvent(withName: "SplitViewChanged", body: [
        "isSplitView": !isRunningInFullScreen(),
        "isTablet": UIDevice.current.userInterfaceIdiom == .pad || SplitViewModule.isMacOS,
      ])
    }
  }
  
  @objc(isRunningInSplitView:withRejecter:)
  func isRunningInSplitView(resolve:@escaping RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
    DispatchQueue.main.async { [weak self] in
      resolve([
        "isSplitView": !(self?.isRunningInFullScreen() ?? false),
        "isTablet": UIDevice.current.userInterfaceIdiom == .pad || SplitViewModule.isMacOS,
      ])
    }
  }
  
  @objc(unlockOrientation)
  func unlockOrientation() {
    DispatchQueue.main.async {
      let appDelegate = UIApplication.shared.delegate as! AppDelegate
      appDelegate.allowRotation = true
      UIDevice.current.setValue(UIInterfaceOrientation.unknown, forKey: "orientation")
    }
  }
  
  @objc(lockPortrait)
  func lockPortrait() {
    DispatchQueue.main.async {
      let appDelegate = UIApplication.shared.delegate as! AppDelegate
      appDelegate.allowRotation = false
      UIDevice.current.setValue(UIInterfaceOrientation.unknown, forKey: "orientation")
      UIDevice.current.setValue(UIInterfaceOrientation.portrait, forKey: "orientation")
    }
  }
}
