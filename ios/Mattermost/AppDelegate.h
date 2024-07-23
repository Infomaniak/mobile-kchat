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
@property (nonatomic, weak) id<RNAppAuthAuthorizationFlowManagerDelegate> authorizationFlowManagerDelegate;

@end
