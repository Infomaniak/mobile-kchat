internal import Expo
import React
import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(
        _ scene: UIScene,
        willConnectTo session: UISceneSession,
        options connectionOptions: UIScene.ConnectionOptions
    ) {
        guard let windowScene = scene as? UIWindowScene else { return }
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate,
              let factory = appDelegate.reactNativeFactory else {
            os_log("SceneDelegate: missing app delegate or React Native factory, skipping launch")
            return
        }

        window = UIWindow(windowScene: windowScene)
        appDelegate.window = window

        if appDelegate.hasStartedReactNative {
            // Scene re-connect: the React instance is already running, attach a
            // fresh root view to the new window instead of starting it twice.
            let rootView = factory.recreateRootView(
                withBundleURL: nil,
                moduleName: "kChat",
                initialProps: nil,
                launchOptions: nil
            )
            let rootViewController = UIViewController()
            rootViewController.view = rootView
            window?.rootViewController = rootViewController
            window?.makeKeyAndVisible()
            // The bridge is live, so events delivered in connectionOptions can
            // be forwarded straight to JS instead of being dropped.
            for urlContext in connectionOptions.urlContexts {
                appDelegate.handleOpenURL(urlContext.url, options: [:])
            }
            for activity in connectionOptions.userActivities {
                appDelegate.handleUserActivity(activity)
            }
            return
        }

        // Scene lifecycle: URL/user activities no longer arrive in
        // didFinishLaunchingWithOptions; re-inject them so
        // RCTLinkingManager.getInitialURL() keeps working on cold-start deep links.
        var launchOptions = appDelegate.launchOptions ?? [:]
        if let url = connectionOptions.urlContexts.first?.url {
            launchOptions[.url] = url
        }
        if let activity = connectionOptions.userActivities.first(where: {$0.activityType == NSUserActivityTypeBrowsingWeb}) {
            launchOptions[.userActivityDictionary] = [
                UIApplication.LaunchOptionsKey.userActivityType.rawValue: activity.activityType,
                "UIApplicationLaunchOptionsUserActivityKey": activity,
            ]
        }

        appDelegate.hasStartedReactNative = true
        factory.startReactNative(
            withModuleName: "kChat",
            in: window,
            launchOptions: launchOptions
        )

        for urlContext in connectionOptions.urlContexts {
            appDelegate.handleOpenURL(urlContext.url, options: [:])
        }
        for activity in connectionOptions.userActivities {
            appDelegate.handleUserActivity(activity)
        }
    }

    func sceneDidDisconnect(_ scene: UIScene) {
        // The scene may reconnect later with a new session; drop the reference to
        // the destroyed window. The React instance is kept alive on the app delegate.
        (UIApplication.shared.delegate as? AppDelegate)?.window = nil
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else { return }
        for context in URLContexts {
            appDelegate.handleOpenURL(context.url, options: [:])
        }
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else { return }
        appDelegate.handleUserActivity(userActivity)
    }

    // MARK: - App Life-Cycle

    // UIKit no longer forwards these transitions to UIApplicationDelegate once the
    // scene life cycle is adopted, so forward them to the app delegate to keep the
    // ExpoAppDelegate subscribers and app-level state handling working.

    func sceneWillEnterForeground(_ scene: UIScene) {
        (UIApplication.shared.delegate as? AppDelegate)?.applicationWillEnterForeground(UIApplication.shared)
    }

    func sceneDidBecomeActive(_ scene: UIScene) {
        (UIApplication.shared.delegate as? AppDelegate)?.applicationDidBecomeActive(UIApplication.shared)
    }

    func sceneWillResignActive(_ scene: UIScene) {
        (UIApplication.shared.delegate as? AppDelegate)?.applicationWillResignActive(UIApplication.shared)
    }

    func sceneDidEnterBackground(_ scene: UIScene) {
        (UIApplication.shared.delegate as? AppDelegate)?.applicationDidEnterBackground(UIApplication.shared)
    }
}
