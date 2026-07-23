import AVFoundation
import Expo
import Intents
import React
import ReactAppDependencyProvider
import RNKeychain
import RNNotifications
import TurboLogIOSNative
import UIKit
import mattermost_rnutils
import mattermost_hardware_keyboard
import os.log

#if canImport(react_native_paste_input)
import react_native_paste_input
#endif

private let notificationClearAction = "clear"
private let notificationTestAction = "test"

@main
@objc(AppDelegate)
class AppDelegate: ExpoAppDelegate, OrientationLockable, RNAppAuthAuthorizationFlowManager {
    @objc var orientationLock: UIInterfaceOrientationMask = .allButUpsideDown
    @objc weak var authorizationFlowManagerDelegate: RNAppAuthAuthorizationFlowManagerDelegate?

    @objc var window: UIWindow?
    var reactNativeDelegate: ExpoReactNativeFactoryDelegate?
    var reactNativeFactory: RCTReactNativeFactory?

    private var databaseLockBackgroundTask: UIBackgroundTaskIdentifier = .invalid

    override func application(
        _ application: UIApplication,
        handleEventsForBackgroundURLSession identifier: String,
        completionHandler: @escaping () -> Void
    ) {
        os_log("Mattermost will attach session from handleEventsForBackgroundURLSession!! identifier=%{public}@", identifier)
        GekidouWrapper.default.attachSession(identifier, completionHandler: completionHandler)
        os_log("Mattermost session ATTACHED from handleEventsForBackgroundURLSession!! identifier=%{public}@", identifier)
    }

    override func application(
        _ application: UIApplication,
        willFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        return super.application(application, willFinishLaunchingWithOptions: launchOptions)
    }

    override func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        configureTurboLog()
        GekidouWrapper.default.configureTurboLogForGekidou()

        OrientationManager.shared.delegate = self
        clearKeychainOnFirstRun()

        try? AVAudioSession.sharedInstance().setCategory(.playback)
        GekidouWrapper.default.setPreference("true", forKey: "ApplicationIsRunning")

        RNNotifications.startMonitorNotifications()

        let delegate = ReactNativeDelegate()
        let factory = ExpoReactNativeFactory(delegate: delegate)
        delegate.dependencyProvider = RCTAppDependencyProvider()

        reactNativeDelegate = delegate
        reactNativeFactory = factory
        bindReactNativeFactory(factory)

        window = UIWindow(frame: UIScreen.main.bounds)
        factory.startReactNative(
            withModuleName: "Mattermost",
            in: window,
            launchOptions: launchOptions
        )

        let result = super.application(application, didFinishLaunchingWithOptions: launchOptions)

        #if canImport(react_native_paste_input)
        PasteInputModule.setup(factory.rootViewFactory)
        #endif

        os_log("Mattermost started!!")
        return result
    }

    override func application(
        _ application: UIApplication,
        didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
    ) {
        RNNotifications.didRegisterForRemoteNotifications(withDeviceToken: deviceToken)
    }

    override func application(
        _ application: UIApplication,
        didFailToRegisterForRemoteNotificationsWithError error: Error
    ) {
        RNNotifications.didFailToRegisterForRemoteNotificationsWithError(error)
    }

    override func application(
        _ application: UIApplication,
        didReceiveRemoteNotification userInfo: [AnyHashable: Any],
        fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void
    ) {
        let state = UIApplication.shared.applicationState
        let action = userInfo["type"] as? String
        let isClearAction = action == notificationClearAction
        let isTestAction = action == notificationTestAction

        if isTestAction {
            completionHandler(.noData)
            return
        }

        if !GekidouWrapper.default.verifySignature(userInfo) {
            var notification = userInfo
            notification["verified"] = "false"
            RNNotifications.didReceiveBackgroundNotification(notification, withCompletionHandler: completionHandler)
            return
        }

        if isClearAction {
            NotificationHelper.default.clearChannelOrThreadNotifications(userInfo: userInfo as NSDictionary)
            GekidouWrapper.default.postNotificationReceipt(userInfo)
            RNNotifications.didReceiveBackgroundNotification(userInfo, withCompletionHandler: completionHandler)
            return
        }

        if state != .active {
            GekidouWrapper.default.fetchDataForPushNotification(userInfo) { data in
                var notification = userInfo
                if let data {
                    do {
                        if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] {
                            notification["data"] = json
                        } else {
                            TurboLogger.write(level: .warning, message: "Mattermost AppDelegate: JSON serialization returned nil without error")
                        }
                    } catch {
                        TurboLogger.write(level: .error, message: "Mattermost AppDelegate: JSON serialization error", error.localizedDescription)
                    }
                }

                RNNotifications.didReceiveBackgroundNotification(notification, withCompletionHandler: completionHandler)
            }
        } else {
            completionHandler(.newData)
        }
    }

    override func application(
        _ application: UIApplication,
        open url: URL,
        options: [UIApplication.OpenURLOptionsKey: Any] = [:]
    ) -> Bool {
        if authorizationFlowManagerDelegate?.resumeExternalUserAgentFlow(with: url) == true {
            return true
        }

        return RCTLinkingManager.application(application, open: url, options: options)
    }

    func application(
        _ application: UIApplication,
        open url: URL,
        sourceApplication: String?,
        annotation: Any
    ) -> Bool {
        RCTLinkingManager.application(application, open: url, sourceApplication: sourceApplication, annotation: annotation)
    }

    override func application(
        _ application: UIApplication,
        continue userActivity: NSUserActivity,
        restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
    ) -> Bool {
        if userActivity.activityType == NSUserActivityTypeBrowsingWeb,
           let url = userActivity.webpageURL,
           authorizationFlowManagerDelegate?.resumeExternalUserAgentFlow(with: url) == true {
            return true
        }

        if let intent = userActivity.interaction?.intent as? INStartAudioCallIntent,
           let rawStartCall = intent.contacts?.first?.personHandle?.value,
           let startCallURL = URL(string: rawStartCall) {
            return RCTLinkingManager.application(application, open: startCallURL, options: [:])
        }

        return RCTLinkingManager.application(
            application,
            continue: userActivity,
            restorationHandler: restorationHandler
        )
    }

    override func applicationDidBecomeActive(_ application: UIApplication) {
        super.applicationDidBecomeActive(application)
        GekidouWrapper.default.setPreference("true", forKey: "ApplicationIsForeground")
        endDatabaseLockProtection()
    }

    override func applicationWillResignActive(_ application: UIApplication) {
        super.applicationWillResignActive(application)
        GekidouWrapper.default.setPreference("false", forKey: "ApplicationIsForeground")
        beginDatabaseLockProtection()
    }

    override func applicationDidEnterBackground(_ application: UIApplication) {
        super.applicationDidEnterBackground(application)
        GekidouWrapper.default.setPreference("false", forKey: "ApplicationIsForeground")
        beginDatabaseLockProtection()
    }

    override func applicationWillTerminate(_ application: UIApplication) {
        super.applicationWillTerminate(application)
        GekidouWrapper.default.setPreference("false", forKey: "ApplicationIsForeground")
        GekidouWrapper.default.setPreference("false", forKey: "ApplicationIsRunning")
        endDatabaseLockProtection()
    }

    override func application(
        _ application: UIApplication,
        supportedInterfaceOrientationsFor window: UIWindow?
    ) -> UIInterfaceOrientationMask {
        orientationLock
    }

    override var keyCommands: [UIKeyCommand]? {
        MattermostHardwareKeyboardWrapper.registerKeyCommands(
            enterPressed: #selector(sendEnter(_:)),
            shiftEnterPressed: #selector(sendShiftEnter(_:)),
            findChannels: #selector(sendFindChannels(_:))
        ) as? [UIKeyCommand]
    }

    @objc private func sendEnter(_ sender: UIKeyCommand) {
        MattermostHardwareKeyboardWrapper.enterKeyPressed()
    }

    @objc private func sendShiftEnter(_ sender: UIKeyCommand) {
        MattermostHardwareKeyboardWrapper.shiftEnterKeyPressed()
    }

    @objc private func sendFindChannels(_ sender: UIKeyCommand) {
        MattermostHardwareKeyboardWrapper.findChannels()
    }

    private func configureTurboLog() {
        guard let appGroupId = Bundle.main.object(forInfoDictionaryKey: "AppGroupIdentifier") as? String,
              let containerURL = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: appGroupId) else {
            return
        }

        do {
            try TurboLogger.configure(
                dailyRolling: false,
                maximumFileSize: 1024 * 1024,
                maximumNumberOfFiles: 2,
                logsDirectory: containerURL.appendingPathComponent("Logs").path,
                logsFilename: "MMLogs"
            )
        } catch {
            NSLog("Failed to configure TurboLog: %@", error.localizedDescription)
        }

        TurboLogger.write(level: .info, message: "Configured turbolog")
    }

    private func clearKeychainOnFirstRun() {
        guard UserDefaults.standard.object(forKey: "FirstRun") == nil else {
            return
        }

        let keychain = RNKeychainManager()
        if let servers = keychain.getAllServersForInternetPasswords() {
            TurboLogger.write(level: .info, message: "Servers", servers)
            for server in servers {
                keychain.deleteCredentials(forServer: server, withOptions: nil)
            }
        }

        UserDefaults.standard.set(true, forKey: "FirstRun")
        UserDefaults.standard.synchronize()
    }

    private func beginDatabaseLockProtection() {
        guard databaseLockBackgroundTask == .invalid else {
            return
        }

        databaseLockBackgroundTask = UIApplication.shared.beginBackgroundTask(withName: "MMDatabaseLockProtection") { [weak self] in
            self?.endDatabaseLockProtection()
        }

        TurboLogger.write(level: .info, message: "MMDatabaseLockProtection: begin taskId", databaseLockBackgroundTask.rawValue)
    }

    private func endDatabaseLockProtection() {
        guard databaseLockBackgroundTask != .invalid else {
            return
        }

        TurboLogger.write(level: .info, message: "MMDatabaseLockProtection: end taskId", databaseLockBackgroundTask.rawValue)
        UIApplication.shared.endBackgroundTask(databaseLockBackgroundTask)
        databaseLockBackgroundTask = .invalid
    }
}

private final class ReactNativeDelegate: ExpoReactNativeFactoryDelegate {
    override func bundleURL() -> URL? {
        #if DEBUG
        return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
        #else
        return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
        #endif
    }
}
