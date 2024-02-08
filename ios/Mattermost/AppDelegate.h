// #import <RCTAppDelegate.h>
#import <Expo/Expo.h>
#import <UIKit/UIKit.h>
#import "RNNotifications.h"
#import "RNAppAuthAuthorizationFlowManager.h"

@interface AppDelegate : EXAppDelegateWrapper <RNAppAuthAuthorizationFlowManager>

@property(nonatomic,assign)BOOL allowRotation;
@property (nonatomic, weak) id<RNAppAuthAuthorizationFlowManagerDelegate>authorizationFlowManagerDelegate;

@end
