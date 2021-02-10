import React, { createContext, useReducer, useContext } from "react";
import {
  asyncStoreJson,
  asyncRemoveItem,
  closeWsSafely,
} from "../modules/support";

const NotificationReducer = (prevState, action) => {
  const notifications = prevState.notifications.concat();
  switch (action.type) {
    case "ADD":
      /** 1つのnotificationを追加
       * @param {Object} action [type, notification] */

      let incrementNum = 0;
      if (!notifications[action.notification.id]) {
        notifications.unshift(action.notification);
        incrementNum = 1;
        asyncStoreJson("notifications", notifications);
      }
      return {
        ...prevState,
        notifications: notifications,
        unreadNum: prevState.unreadNum + incrementNum,
      };

    case "MERGE":
      /** 受け取ったnotificationsを統合 重複・順序を考慮し、重複が発見されなければaction.notDuplicateFunc()を実行
       * @param {Object} action [type, notifications, notDuplicateFunc] */

      let isDuplicate = false;
      let unreadNum = 0;
      const notificationsIDObj = [
        ...notifications,
        ...action.notifications,
      ].reduce((obj, notification) => {
        if (obj[notification.id]) {
          // 重複発見
          isDuplicate = true;
        } else {
          if (!notification.read) unreadNum += 1;
        }
        obj[notification.id] = notification;
        return obj;
      }, {});
      let mergedNotifications = Object.values(notificationsIDObj);
      mergedNotifications.sort((a, b) => {
        const dateA = new Date(a.date),
          dateB = new Date(b.date);
        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;
        return 0;
      });
      if (!isDuplicate && action.notDuplicateFunc) action.notDuplicateFunc();

      asyncStoreJson("notifications", mergedNotifications);
      return {
        ...prevState,
        notifications: mergedNotifications,
        unreadNum: unreadNum,
      };

    case "PUT_READ":
      /** 未読のnotificationのIDリストをPUT 事前にSET_WSを実行し、wsをsetする必要がある
       * @param {Object} action [type, token] */

      let tempNotifications = [];
      if (prevState.unreadNum > 0) {
        let unreadIDList = [];
        for (const notification of notifications) {
          if (!notification.read) {
            notification.read = true;
            unreadIDList.push(notification.id);
          }
        }
        if (unreadIDList.length > 0) {
          prevState.ws.send(
            JSON.stringify({
              type: "read",
              notification_ids: unreadIDList,
              token: action.token,
            })
          );
          tempNotifications = notifications;
        }
      }
      return {
        ...prevState,
        tempNotifications: tempNotifications,
      };

    case "COMPLETE_READ":
      /** 既読処理 全てのnotificationを既読に 事前にPUT_READを実行し、tempNotificationsを作成する必要がある
       * @param {Object} action [type] */

      if (prevState.tempNotifications) {
        asyncStoreJson("notifications", prevState.tempNotifications);
        return {
          ...prevState,
          notification: prevState.tempNotifications,
          tempNotifications: [],
          unreadNum: 0,
        };
      } else {
        return { ...prevState };
      }

    case "SET_WS":
      /** set ws。 もしwsにすでにwsオブジェクトがあれば, closeし上書きする。
       * @param {Object} action [type, ws] */

      if (prevState.ws !== null) {
        closeWsSafely(prevState.ws);
      }
      return {
        ...prevState,
        ws: action.ws,
      };

    case "RESET":
      /** リセット wsの切断
       * @param {Object} action [type] */

      closeWsSafely(prevState.ws);
      asyncRemoveItem("notifications");
      return {
        ...prevState,
        notifications: [],
        unreadNum: 0,
        tempNotifications: [],
        ws: null,
      };

    default:
      console.warn(`Not found "${action.type}" action.type.`);
      return;
  }
};

const NotificationStateContext = createContext({
  notifications: [],
  unreadNum: 0,
  tempNotifications: [],
  ws: null,
});
const NotificationDispatchContext = createContext(undefined);

export const useNotificationState = () => {
  const context = useContext(NotificationStateContext);
  return context;
};
export const useNotificationDispatch = () => {
  const context = useContext(NotificationDispatchContext);
  return context;
};

export const NotificationProvider = ({ children, notifications }) => {
  const [notificationState, notificationDispatch] = useReducer(
    NotificationReducer,
    {
      notifications: notifications ? notifications : [],
      unreadNum: getUnreadNum(notifications ? notifications : []),
      tempNotifications: [],
      ws: null,
    }
  );

  return (
    <NotificationStateContext.Provider value={notificationState}>
      <NotificationDispatchContext.Provider value={notificationDispatch}>
        {children}
      </NotificationDispatchContext.Provider>
    </NotificationStateContext.Provider>
  );
};

const getUnreadNum = (notifications) => {
  let unreadNum = 0;
  for (const notification of notifications) {
    if (!notification.read) unreadNum += 1;
  }
  return unreadNum;
};
