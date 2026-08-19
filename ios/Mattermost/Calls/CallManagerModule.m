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

@implementation CallManagerModule
{
  bool hasListeners;
}

static CallManagerModule *sharedModule = nil;

+ (instancetype)callManagerSharedInstance {
  return sharedModule;
}

RCT_EXPORT_MODULE();

- (instancetype)init {
  self = [super init];
  if (self) {
    sharedModule = self;
    [CallManager shared]; // ensure singleton exists early
  }
  return self;
}

RCT_EXPORT_METHOD(getToken:(RCTPromiseResolveBlock)resolve
                   rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *token = [[CallManager shared] token];
  resolve(token);
}

RCT_EXPORT_METHOD(reportCallStarted: (NSString*)serverURL
                   channelId: (NSString*)channelId
                   callName: (NSString*)callName
                   conferenceId: (NSString*)conferenceId
                   conferenceJWT: (NSString*)conferenceJWT
                   conferenceURL: (NSString*)conferenceURL
                   resolver:(RCTPromiseResolveBlock)resolve
                   rejecter:(RCTPromiseRejectBlock)reject)
{
  [[CallManager shared] reportCallStartedWithServerURL:serverURL
                                        channelId:channelId
                                        callName:callName
                                        conferenceId:conferenceId
                                        conferenceJWT:conferenceJWT
                                        conferenceURL:conferenceURL];
  resolve(@[]);
}

RCT_EXPORT_METHOD(cancelIncomingCallForChannel:(NSString*)channelId
                   resolver:(RCTPromiseResolveBlock)resolve
                   rejecter:(RCTPromiseRejectBlock)reject)
{
  [[CallManager shared] cancelIncomingCallForChannel:channelId];
  resolve(@[]);
}

RCT_EXPORT_METHOD(cancelIncomingCallAnsweredElsewhere:(NSString*)channelId
                   resolver:(RCTPromiseResolveBlock)resolve
                   rejecter:(RCTPromiseRejectBlock)reject)
{
  [[CallManager shared] cancelIncomingCallAnsweredElsewhere:channelId];
  resolve(@[]);
}

RCT_EXPORT_METHOD(reportCallEnded: (NSString*)conferenceId
                   resolver:(RCTPromiseResolveBlock)resolve
                   rejecter:(RCTPromiseRejectBlock)reject)
{
  [[CallManager shared] reportCallEndedWithConferenceId:conferenceId];
  resolve(@[]);
}

RCT_EXPORT_METHOD(reportCallMuted: (NSString*)conferenceId
                   isMuted:(BOOL) isMuted
                   resolver:(RCTPromiseResolveBlock)resolve
                   rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve(@[]);
}

RCT_EXPORT_METHOD(reportCallVideoMuted: (NSString*)conferenceId
                   isMuted:(BOOL) isMuted
                   resolver:(RCTPromiseResolveBlock)resolve
                   rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve(@[]);
}

-(void)startObserving {
    hasListeners = YES;
}

-(void)stopObserving {
    hasListeners = NO;
}

- (NSArray<NSString *> *)supportedEvents  {
  return @[@"CallAnswered", @"CallEnded"];
}

- (void)sendCallAnswered:(NSString*)serverId channelId:(NSString*)channelId conferenceJWT:(NSString*)conferenceJWT {
  if (hasListeners) {
    [self sendEventWithName:@"CallAnswered" body:@{
      @"server_id": serverId,
      @"channel_id": channelId,
      @"conference_jwt": conferenceJWT,
    }];
  }
}

- (void)sendCallEnded:(NSString*)serverId conferenceId:(NSString*)conferenceId {
  if (hasListeners) {
    [self sendEventWithName:@"CallEnded" body:@{
      @"server_id": serverId,
      @"conference_id": conferenceId,
    }];
  }
}

@end
