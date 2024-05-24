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
- (void)callAnsweredEvent:(NSString *)serverUrl channelId: (NSString *)channelId;
- (void)callDeclinedEvent:(NSString *)serverUrl conferenceId: (NSString *)conferenceId;
@end
