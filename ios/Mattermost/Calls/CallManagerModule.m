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

static NSString * const kCallAnswered = @"CallAnswered";
static NSString * const kCallEnded = @"CallEnded";
static NSString * const kCallMuted = @"CallMuted";

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

RCT_EXPORT_METHOD(reportCallStarted: (NSString*)serverId
                  channelId: (NSString*)channelId
                  conferenceId: (NSString*)conferenceId
                  callName: (NSString*)callName
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [[CallManager shared] reportCallStartedWithServerId:serverId channelId:channelId conferenceId:conferenceId callName:callName];
  resolve(@[]);
}

RCT_EXPORT_METHOD(reportCallEnded: (NSString*)conferenceId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [[CallManager shared] reportCallEndedWithConferenceId:conferenceId];
  resolve(@[]);
}

-(void)startObserving {
    hasListeners = YES;
  
  [[CallManager shared] setCallAnsweredCallback:^(NSString * _Nonnull serverId, NSString * _Nonnull channelId, NSString * _Nonnull conferenceJWT) {
    [self callAnsweredEvent:serverId channelId:channelId conferenceJWT:conferenceJWT];
  }];
  
  [[CallManager shared] setCallEndedCallback:^(NSString * _Nonnull serverId, NSString * _Nonnull conferenceId) {
    [self callEndedEvent:serverId conferenceId:conferenceId];
  }];
  
  [[CallManager shared] setCallMutedCallback:^(NSString * _Nonnull serverId, BOOL isMuted) {
    [self callMutedEvent:serverId isMuted:isMuted];
  }];
}

-(void)stopObserving {
    hasListeners = NO;
}

- (void)callAnsweredEvent:(NSString *)serverId channelId: (NSString *)channelId conferenceJWT: (NSString *)conferenceJWT
{
  if (hasListeners) {
    [self sendEventWithName:kCallAnswered body:@{@"serverId": serverId, @"channelId": channelId, @"conferenceJWT": conferenceJWT}];
  }
}

- (void)callEndedEvent:(NSString *)serverId conferenceId: (NSString *)conferenceId
{
  if (hasListeners) {
    [self sendEventWithName:kCallEnded body:@{@"serverId": serverId, @"conferenceId": conferenceId}];
  }
}

- (void)callMutedEvent:(NSString *)serverId isMuted: (BOOL) isMuted
{
  if (hasListeners) {
    [self sendEventWithName:kCallMuted body:@{@"serverId": serverId, @"isMuted": isMuted ? @"true" : @"false"}];
  }
}

- (NSArray<NSString *> *)supportedEvents  {
  return @[kCallAnswered, kCallEnded, kCallMuted];
}

@end

