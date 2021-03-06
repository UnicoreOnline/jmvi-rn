//
//  UtilityController.m
//  MagnumHubTVApp
//
//  Created by Vivek Cyber on 12/13/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "UtilityController.h"
//#import "RNFIRMessaging.h"

@implementation UtilityController
{
  NSMutableDictionary *_callbacks;
}
  
- (instancetype)init
{
  if ((self = [super init])) {
    _callbacks = [[NSMutableDictionary alloc] init];
    
    [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];
    //    [FIRApp configure];
//      if([FIRApp defaultApp] == nil){
//        [FIRApp configure];
//      }
    
  }
  return self;
}
  
- (dispatch_queue_t)methodQueue
  {
    return dispatch_get_main_queue();
  }
  
  
  RCT_EXPORT_MODULE()
  
  
  RCT_EXPORT_METHOD(shareApp:(NSString *)accessID) {
    
    NSString *downloadUrl = @"www.google.com";
    NSString *inviteContent = [NSString stringWithFormat:@"%@ %@",accessID,downloadUrl];
    [self inviteUser:inviteContent];
  }
  
  RCT_EXPORT_METHOD(shareRefLink:(NSString *)refLink) {
    
    NSString *inviteContent = [NSString stringWithFormat:@"%@",refLink];
    [self inviteUser:inviteContent];
  }
  
  RCT_EXPORT_METHOD(callFromReactNative:(BOOL)isFromInbox) {
    
    
    _isFromReactNative = isFromInbox;
    NSLog(@"callFromReactNAtive %hhd",_isFromReactNative);
    //  //Construct the Notification
    //  NSNotification *myNotification = [NSNotification notificationWithName:@"comingFromReactNative"
    //                                                                 object:self //object is usually the object posting the notification
    //                                                               userInfo:nil]; //userInfo is an optional dictionary
    //
    //  //Post it to the default notification center
    //  [[NSNotificationCenter defaultCenter] postNotification:myNotification];
    
    //  [[NSNotificationCenter defaultCenter] addObserver:self
    //                                           selector:@SEL(methodYouWantToInvoke:) //note the ":" - should take an NSNotification as parameter
    //                                               name:@"comingFromReactNative"
    //                                             object:objectOfNotification]; //if you specify nil for object, you get all the notifications with the matching name, regardless of who sent them
  }
  
  
  
  
- (void)inviteUser:(NSString *)text
  {
    NSMutableArray *sharingItems = [NSMutableArray new];
    [sharingItems addObject:text];
    UIActivityViewController *activityController = [[UIActivityViewController alloc] initWithActivityItems:sharingItems applicationActivities:nil];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
      [[self topViewController] presentViewController:activityController animated:YES completion:nil];
    });
  }
  
  
  
- (UIViewController*)topViewController {
  return [self topViewControllerWithRootViewController:[UIApplication sharedApplication].keyWindow.rootViewController];
}
  
- (UIViewController*)topViewControllerWithRootViewController:(UIViewController*)rootViewController {
  if ([rootViewController isKindOfClass:[UITabBarController class]]) {
    UITabBarController* tabBarController = (UITabBarController*)rootViewController;
    return [self topViewControllerWithRootViewController:tabBarController.selectedViewController];
  } else if ([rootViewController isKindOfClass:[UINavigationController class]]) {
    UINavigationController* navigationController = (UINavigationController*)rootViewController;
    return [self topViewControllerWithRootViewController:navigationController.visibleViewController];
  } else if (rootViewController.presentedViewController) {
    UIViewController* presentedViewController = rootViewController.presentedViewController;
    return [self topViewControllerWithRootViewController:presentedViewController];
  } else {
    if (rootViewController) {
      return rootViewController;
    }else{
      UIViewController *recentView = self;
      
      while (recentView.parentViewController != nil) {
        recentView = recentView.parentViewController;
      }
      return recentView;
      
    }
  }
}
  
#pragma mark Private
  
  static NSString *RCTKeyForInstance(id instance)
  {
    return [NSString stringWithFormat:@"%p", instance];
  }
  
  
  //Notification
//- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
//  {
//    if(_isFromReactNative == true){
//      
//      NSLog(@"callFromReactNAtive %hhd",_isFromReactNative);
//    }else{
//      [RNFIRMessaging willPresentNotification:notification withCompletionHandler:completionHandler];
//    }
//    
//  }
//  
//#if defined(__IPHONE_11_0)
//- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler
//  {
//    [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
//  }
//#else
//- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)())completionHandler
//  {
//    [RNFIRMessaging didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
//  }
//#endif
//  
//  //You can skip this method if you don't want to use local notification
//-(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
//  [RNFIRMessaging didReceiveLocalNotification:notification];
//}
//  
//- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
//  [RNFIRMessaging didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
//}
//  
//  
//  
  @end
