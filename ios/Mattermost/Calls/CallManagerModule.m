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
  reject(@"", @"Implemented natively", NULL);
}

RCT_EXPORT_METHOD(reportCallMuted: (NSString*)conferenceId
                  isMuted:(BOOL) isMuted
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  reject(@"", @"Implemented natively", NULL);
}

RCT_EXPORT_METHOD(reportCallVideoMuted: (NSString*)conferenceId
                  isMuted:(BOOL) isMuted
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  reject(@"", @"Implemented natively", NULL);
}

-(void)startObserving {
    hasListeners = YES;
}

-(void)stopObserving {
    hasListeners = NO;
}

- (NSArray<NSString *> *)supportedEvents  {
  return @[];
}

@end

