import { useEffect, useRef, useState } from "react";
import { Platform, Alert } from "react-native";
import firebase from "@react-native-firebase/app";
import messaging from "@react-native-firebase/messaging";

const usePushNotification = () => {
  const [messaging] = useState(firebase.messaging());

  const [deviceToken, setDeviceToken] = useState(null);
  const [notificationType, setNotificationType] = useState("");
  const listenerRemovingFunctions = useRef([]);

  useEffect(() => {
    initPushNotification();
    return () => {
      listenerRemovingFunctions.current &&
        listenerRemovingFunctions.current.forEach((remove) => remove());
    };
  }, []);

  const initPushNotification = async () => {
    console.log(0);
    const enabled = await messaging.hasPermission();
    if (enabled) {
      initFcm();
    } else {
      try {
        await messaging.requestPermission();
        initFcm();
      } catch (e) {
        console.log(e);
      }
    }
  };

  const initFcm = async () => {
    const _deviceToken = await messaging.getToken();
    console.log(`deviceToken: ${_deviceToken}`);
    setDeviceToken(_deviceToken);

    listenerRemovingFunctions.current = [
      messaging.onTokenRefresh(onFcmTokenRefresh),
      messaging.onNotification(handleNotification("onNotification")),
      messaging.onNotificationOpened(
        handleNotification("onNotificationOpened")
      ),
      messaging.onNotificationDisplayed(
        handleNotification("onNotificationDisplayed")
      ),
      messaging.onMessage(onMessage),
    ];
    console.log(1);
    const notificationOpen = await messaging.getInitialNotification();
    console.log(2);
    if (notificationOpen) {
      console.log("2-1");
      handleNotification("initial")(notificationOpen);
    }
    console.log(3);
    const channel = new firebase.notifications.Android.Channel(
      "local",
      "local notification",
      firebase.notifications.Android.Importance.Max
    );
    console.log(4);
    await messaging.android.createChannel(channel);
    console.log(5);
  };

  const onFcmTokenRefresh = (_deviceToken) => {
    setDeviceToken(_deviceToken);
  };

  const onMessage = (message) => {
    Alert.alert("MESSAGE", JSON.stringify(message));
    setNotificationType("message");
  };

  const handleNotification = (type) => {
    return (notification) => {
      console.log("ノーティフィケーション");
      console.log("ノーティフィケーション");
      console.log("ノーティフィケーション");
      console.log("ノーティフィケーション");
      console.log(type, notification);
      if (type === "onNotification") {
        if (Platform.OS === "android") {
          const localNotification = notification.android
            .setChannelId("local")
            .android.setSmallIcon("ic_stat_ic_notification")
            .android.setColor("#1A73E8")
            .android.setPriority(firebase.notifications.Android.Priority.High);
          messaging.displayNotification(localNotification);
        } else if (Platform.OS === "ios") {
          messaging.displayNotification(notification);
        }
      }
      Alert.alert("NOTIFICATION", type);
      setNotificationType(type);
    };
  };

  return [deviceToken, notificationType];
};

export default usePushNotification;

// d-Ba-1eavkDYv10jvPUqnk:APA91bEBzvfhqdmuNJmY2DRpUVZZp0RkV4rE_YoWNoAQW7wwZ1e6_hq7D_XgVxpsTxxE5dYhqo-YhitDzfxxBi3ZoD2lT0N5oiqEUyZZnXlJoG-RqSfWfIa36aMCCTpln6cP7aj2RE9T
// d-Ba-1eavkDYv10jvPUqnk:APA91bEBzvfhqdmuNJmY2DRpUVZZp0RkV4rE_YoWNoAQW7wwZ1e6_hq7D_XgVxpsTxxE5dYhqo-YhitDzfxxBi3ZoD2lT0N5oiqEUyZZnXlJoG-RqSfWfIa36aMCCTpln6cP7aj2RE9T
