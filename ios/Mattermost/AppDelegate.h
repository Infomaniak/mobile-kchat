#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import "RNNotifications.h"
#import "RNAppAuthAuthorizationFlowManager.h"

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, RNAppAuthAuthorizationFlowManager>

@property (nonatomic, strong) UIWindow *window;
@property(nonatomic,assign)BOOL allowRotation;
@property (nonatomic, weak) id<RNAppAuthAuthorizationFlowManagerDelegate>authorizationFlowManagerDelegate;

@end
