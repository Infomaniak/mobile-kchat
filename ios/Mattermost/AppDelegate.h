#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>
#import "RNNotifications.h"
#import "RNAppAuthAuthorizationFlowManager.h"

@interface AppDelegate : RCTAppDelegate <RNAppAuthAuthorizationFlowManager>

@property(nonatomic,assign)BOOL allowRotation;
@property (nonatomic, weak) id<RNAppAuthAuthorizationFlowManagerDelegate>authorizationFlowManagerDelegate;

@end
