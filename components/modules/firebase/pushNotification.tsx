import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";

const configurePushNotification = (): Promise<null | string> => {
  const initPushNotification = async (): Promise<null | string> => {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      return initFcm();
    } else {
      try {
        await messaging().requestPermission();
        return initFcm();
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  };

  const initFcm = async (): Promise<null | string> => {
    const _deviceToken = await messaging().getToken();

    // バッジリセット
    PushNotification.getApplicationIconBadgeNumber(
      (badgeCount: number): void => {
        if (badgeCount > 0) {
          PushNotification.setApplicationIconBadgeNumber(0);
        }
      }
    );

    PushNotification.configure({
      requestPermissions: false,
      onNotification: (notification) => {
        console.log("プッシュ通知をタップした");
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
    });

    messaging().onTokenRefresh(() => {
      console.log("トークンリフレッシュ");
    });
    messaging().onMessage((message) => {
      console.log("Foreground時にリモートプッシュ通知を受信した");
      _localNotification(message);
    });

    return _deviceToken;
  };

  const _localNotification = (
    message: FirebaseMessagingTypes.RemoteMessage
  ): void => {
    PushNotification.localNotification({
      title: message?.notification?.title ? message.notification.title : "",
      message: message?.notification?.body ? message.notification.body : "",
      userInfo: message.data,
    });
  };

  const deviceToken = initPushNotification();
  return deviceToken;
};

export default configurePushNotification;
