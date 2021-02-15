/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <UIKit/UIKit.h>
#import <UMReactNativeAdapter/UMModuleRegistryAdapter.h>
#import <React/RCTBridgeDelegate.h>
#import <UMCore/UMAppDelegateWrapper.h>

#import <EXUpdates/EXUpdatesAppController.h>

/* push notification https://qiita.com/iwashi1t/items/517cda73dba715025b6c */
#import <UserNotifications/UNUserNotificationCenter.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>
/* push notification */
@property(nonatomic, strong) UMModuleRegistryAdapter *moduleRegistryAdapter;
@property(nonatomic, strong) UIWindow *window;

@end
