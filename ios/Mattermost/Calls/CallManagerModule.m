//
//  CallManagerModule.m
//  kChat
//
//  Created by Philippe on 23.05.2024.
//  Copyright © 2024 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import "CallManagerModule.h"
#import "kChat-Swift.h"

@implementation CallManagerModule {
  bool hasListeners;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getToken:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *token = [[CallManager shared] token];
  resolve(@[token]);
}

-(void)startObserving {
    hasListeners = YES;
}

-(void)stopObserving {
    hasListeners = NO;
}

- (void)callAnsweredEvent:(NSString *)serverId channelId: (NSString *)channelId
{
  if (hasListeners) {
    [self sendEventWithName:@"CallAnswered" body:@{@"serverId": serverId,  @"channelId": channelId}];
  }
}

- (void)callDeclinedEvent:(NSString *)serverId conferenceId: (NSString *)conferenceId
{
  if (hasListeners) {
    [self sendEventWithName:@"CallDeclined" body:@{@"serverId": serverId,  @"conferenceId": conferenceId}];
  }
}
@end

