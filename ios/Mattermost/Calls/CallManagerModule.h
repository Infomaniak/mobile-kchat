//
//  CallManagerModule.h
//  kChat
//
//  Created by Philippe on 23.05.2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface CallManagerModule : RCTEventEmitter <RCTBridgeModule>

+ (instancetype)callManagerSharedInstance;

- (void)sendCallAnswered:(NSString*)serverId channelId:(NSString*)channelId conferenceJWT:(NSString*)conferenceJWT;
- (void)sendCallEnded:(NSString*)serverId conferenceId:(NSString*)conferenceId;

@end
