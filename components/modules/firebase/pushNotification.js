import { useEffect, useRef, useState } from "react";
import { Platform, Alert } from "react-native";
import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";

const usePushNotification = () => {
  const [deviceToken, setDeviceToken] = useState(null);
  const listenerRemovingFunctions = useRef([]);

  useEffect(() => {
    PushNotification.configure({
      requestPermissions: false,
      onNotification: (notification) => {
        console.log("プッシュ通知をタップした01");
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
    });

    initPushNotification();
    return () => {
      listenerRemovingFunctions.current &&
        listenerRemovingFunctions.current.forEach((remove) => remove());
    };
  }, []);

  const initPushNotification = async () => {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      initFcm();
    } else {
      try {
        await messaging().requestPermission();
        initFcm();
      } catch (e) {
        console.log(e);
      }
    }
  };

  const initFcm = async () => {
    const _deviceToken = await messaging().getToken();
    console.log(`deviceToken: ${_deviceToken}`);
    setDeviceToken(_deviceToken);

    PushNotification.configure({
      requestPermissions: false,
      onNotification: (notification) => {
        console.log("プッシュ通知をタップした02");
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
    });

    listenerRemovingFunctions.current = [
      messaging().onTokenRefresh((token) => {
        console.log("トークンリフレッシュ");
      }),
      messaging().onMessage((message) => {
        console.log("Foreground時にリモートプッシュ通知を受信した");
        _localNotification(message);
      }),
    ];
  };

  const _localNotification = (message) => {
    PushNotification.localNotification({
      title: message.notification.title,
      message: message.notification.body,
      userInfo: message.data,
    });
  };
  return deviceToken;
};

export default usePushNotification;
