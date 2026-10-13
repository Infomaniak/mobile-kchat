#import "AppDelegate.h"

#import <ReactNativeNavigation/ReactNativeNavigation.h>
#import <os/log.h>

// Adopts the UIScene life cycle required by the iOS 27 SDK (TN3187): the window
// is created from the connecting UIWindowScene and React Native bootstraps on
// scene connect instead of from didFinishLaunchingWithOptions.

@interface SceneDelegate : UIResponder <UIWindowSceneDelegate>
@end

@implementation SceneDelegate

- (AppDelegate *)appDelegate
{
  return (AppDelegate *)UIApplication.sharedApplication.delegate;
}

- (void)scene:(UIScene *)scene willConnectToSession:(UISceneSession *)session options:(UISceneConnectionOptions *)connectionOptions
{
  if (![scene isKindOfClass:[UIWindowScene class]]) {
    os_log_error(OS_LOG_DEFAULT, "Mattermost SceneDelegate: connected scene is not a UIWindowScene; skipping connect handling");
    return;
  }
  UIWindowScene *windowScene = (UIWindowScene *)scene;
  AppDelegate *appDelegate = self.appDelegate;

  if ([ReactNativeNavigation getBridge]) {
    // Scene re-connect with the process alive: re-home the existing RNN UI
    // onto the new window instead of bootstrapping a second React instance.
    // Known limitation: RNN captured this app's window at bridge creation
    // (RNNCommandsHandler._mainWindow), so a later Navigation.setRoot() (logout,
    // login, server switch) would render into the detached window. Fixing it
    // requires patching RNN, which is out of scope for this hotfix; the app
    // recovers on relaunch.
    UIWindow *window = [[UIWindow alloc] initWithWindowScene:windowScene];
    window.rootViewController = appDelegate.window.rootViewController;
    appDelegate.window = window;
    [window makeKeyAndVisible];
    for (UIOpenURLContext *context in connectionOptions.URLContexts) {
      [appDelegate handleOpenURL:context.URL options:@{}];
    }
    for (NSUserActivity *activity in connectionOptions.userActivities) {
      [appDelegate handleUserActivity:activity];
    }
    return;
  }

  UIWindow *window = [[UIWindow alloc] initWithWindowScene:windowScene];
  appDelegate.window = window;

  // Scene lifecycle: URLs, universal links and notification taps no longer
  // arrive in didFinishLaunchingWithOptions on cold start. Re-inject them into
  // the launch options so RCTLinkingManager.getInitialURL() and RNNotifications'
  // initial notification keep working (JS observers are not running yet, so
  // forwarding the events directly would drop them).
  NSMutableDictionary *launchOptions = [NSMutableDictionary dictionary];
  if (appDelegate.launchOptions) {
    [launchOptions addEntriesFromDictionary:appDelegate.launchOptions];
  }
  NSURL *url = connectionOptions.URLContexts.anyObject.URL;
  if (url) {
    launchOptions[UIApplicationLaunchOptionsURLKey] = url;
  }
  for (NSUserActivity *activity in connectionOptions.userActivities) {
    if ([activity.activityType isEqualToString:NSUserActivityTypeBrowsingWeb]) {
      launchOptions[UIApplicationLaunchOptionsUserActivityDictionaryKey] = @{
        UIApplicationLaunchOptionsUserActivityTypeKey: activity.activityType,
        @"UIApplicationLaunchOptionsUserActivityKey": activity,
      };
      break;
    }
  }
  if (connectionOptions.notificationResponse) {
    launchOptions[UIApplicationLaunchOptionsRemoteNotificationKey] =
        connectionOptions.notificationResponse.notification.request.content.userInfo;
  }

  os_log(OS_LOG_DEFAULT, "Mattermost SceneDelegate: bootstrapping React Native from scene connect!!");
  [ReactNativeNavigation bootstrapWithDelegate:appDelegate launchOptions:launchOptions];
  [window makeKeyAndVisible];
}

- (void)scene:(UIScene *)scene openURLContexts:(NSSet<UIOpenURLContext *> *)URLContexts
{
  AppDelegate *appDelegate = self.appDelegate;
  for (UIOpenURLContext *context in URLContexts) {
    [appDelegate handleOpenURL:context.URL options:@{}];
  }
}

- (void)scene:(UIScene *)scene continueUserActivity:(NSUserActivity *)userActivity
{
  [self.appDelegate handleUserActivity:userActivity];
}

// MARK: - App Life-Cycle

// UIKit no longer forwards these transitions to UIApplicationDelegate once the
// scene life cycle is adopted; forward them to keep Gekidou foreground tracking
// and the database lock protection working.

- (void)sceneDidBecomeActive:(UIScene *)scene
{
  [self.appDelegate applicationDidBecomeActive:UIApplication.sharedApplication];
}

- (void)sceneWillResignActive:(UIScene *)scene
{
  [self.appDelegate applicationWillResignActive:UIApplication.sharedApplication];
}

- (void)sceneDidEnterBackground:(UIScene *)scene
{
  [self.appDelegate applicationDidEnterBackground:UIApplication.sharedApplication];
}

@end
