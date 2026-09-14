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
  // Events emitted before JS attached its listener (cold start, e.g. answering
  // a CallKit call from the lock screen). Replayed on startObserving.
  NSMutableArray<NSDictionary *> *pendingEvents;
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
    pendingEvents = [NSMutableArray array];
    [CallManager shared]; // ensure singleton exists early
    [[CallManager shared] nativeModuleDidInitialize];
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
    [self flushPendingEvents];
}

-(void)stopObserving {
    hasListeners = NO;
}

- (NSArray<NSString *> *)supportedEvents  {
  return @[@"CallAnswered", @"CallEnded"];
}

- (void)sendCallAnswered:(NSString*)serverId channelId:(NSString*)channelId conferenceJWT:(NSString*)conferenceJWT {
  [self dispatchEventWithName:@"CallAnswered" body:@{
    @"serverId": serverId,
    @"channelId": channelId,
    @"conferenceJWT": conferenceJWT,
  }];
}

- (void)sendCallEnded:(NSString*)serverId conferenceId:(NSString*)conferenceId {
  [self dispatchEventWithName:@"CallEnded" body:@{
    @"serverId": serverId,
    @"conferenceId": conferenceId,
  }];
}

// Sends immediately when JS is listening, otherwise queues the event until
// startObserving. Dropping CallAnswered/CallEnded here would strand the user
// in a call with no in-app UI (no way to hang up) after a cold-start answer.
- (void)dispatchEventWithName:(NSString*)name body:(NSDictionary*)body {
  @synchronized (self) {
    if (!hasListeners) {
      [pendingEvents addObject:@{@"name": name, @"body": body}];
      return;
    }
  }
  [self sendEventWithName:name body:body];
}

- (void)flushPendingEvents {
  NSArray<NSDictionary *> *queued;
  @synchronized (self) {
    queued = [pendingEvents copy];
    [pendingEvents removeAllObjects];
  }
  for (NSDictionary *event in queued) {
    [self sendEventWithName:event[@"name"] body:event[@"body"]];
  }
}

@end
