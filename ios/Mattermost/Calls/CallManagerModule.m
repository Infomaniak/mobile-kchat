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

