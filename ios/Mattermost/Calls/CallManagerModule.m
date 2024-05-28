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

static NSString * const kCallAnswered  = @"CallAnswered";
static NSString * const kCallDeclined  = @"CallDeclined";

@implementation CallManagerModule
{
  bool hasListeners;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getToken:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *token = [[CallManager shared] token];
  resolve(token);
}

-(void)startObserving {
    hasListeners = YES;
  
  [[CallManager shared] setCallAnsweredCallback:^(NSString * _Nonnull serverId, NSString * _Nonnull channelId, NSString * _Nonnull conferenceJWT) {
    [self callAnsweredEvent:serverId channelId:channelId conferenceJWT:conferenceJWT];
  }];
}

-(void)stopObserving {
    hasListeners = NO;
}

- (void)callAnsweredEvent:(NSString *)serverId channelId: (NSString *)channelId conferenceJWT: (NSString *)conferenceJWT
{
  if (hasListeners) {
    [self sendEventWithName:kCallAnswered body:@{@"serverId": serverId,  @"channelId": channelId, @"conferenceJWT": conferenceJWT}];
  }
}

- (void)callDeclinedEvent:(NSString *)serverId conferenceId: (NSString *)conferenceId
{
  if (hasListeners) {
    [self sendEventWithName:kCallDeclined body:@{@"serverId": serverId,  @"conferenceId": conferenceId}];
  }
}

- (NSArray<NSString *> *)supportedEvents  {
  return @[kCallAnswered, kCallDeclined];
}

@end

