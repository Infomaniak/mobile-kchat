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

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getToken:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString *token = [[CallManager shared] token];
  resolve(@[token]);
}

@end

