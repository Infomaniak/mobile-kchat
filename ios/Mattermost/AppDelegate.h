#import <RNNAppDelegate.h>
#import <UIKit/UIKit.h>
#import "RNNotifications.h"
#import <Expo/Expo.h>
#import "ExpoModulesCore-Swift.h"
#import <mattermost_rnutils-Swift.h>
#import <mattermost_hardware_keyboard-Swift.h>
#import <CallKit/CallKit.h>
#import <React/RCTLinkingManager.h>
#import "RNAppAuthAuthorizationFlowManager.h"


@interface AppDelegate : EXAppDelegateWrapper<OrientationLockable, RNAppAuthAuthorizationFlowManager>

@property (nonatomic) UIInterfaceOrientationMask orientationLock;
@property (nonatomic, assign) UIBackgroundTaskIdentifier databaseLockBackgroundTask;
@property (nonatomic, weak) id<RNAppAuthAuthorizationFlowManagerDelegate> authorizationFlowManagerDelegate;
@property (nonatomic, strong) NSDictionary *launchOptions;

// Shared deep-link handlers, also called by the SceneDelegate (URLs and user
// activities are delivered through the scene once the scene life cycle is
// adopted instead of the UIApplicationDelegate).
- (BOOL)handleOpenURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options;
- (BOOL)handleUserActivity:(NSUserActivity *)userActivity;

@end
