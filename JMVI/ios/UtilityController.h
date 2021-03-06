//
//  UtilityController.h
//  MagnumHubTVApp
//
//  Created by Vivek Cyber on 12/13/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

//#ifndef UtilityController_h
//#define UtilityController_h
//
//
//#endif /* UtilityController_h */

#import <UIKit/UIKit.h>

#import <React/RCTBridgeModule.h>

#import <React/RCTLog.h>
#import <React/RCTBridge.h>
#import <MessageUI/MessageUI.h>
#import <React/RCTConvert.h>

@import UserNotifications;

@interface UtilityController : NSObject <RCTBridgeModule,MFMessageComposeViewControllerDelegate,UNUserNotificationCenterDelegate>
  
  @property (assign) BOOL isFromReactNative;
  @end
