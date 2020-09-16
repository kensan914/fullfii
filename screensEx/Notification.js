import React from 'react';

import NotificationTemplate from '../componentsEx/templates/NotificationTemplate';
import { BASE_URL_WS } from "../constantsEx/env";
import { URLJoin } from "../componentsEx/tools/support";


const Notification = (props) => {
  const { notificationState } = props;

  return (
    <NotificationTemplate {...props} notifications={notificationState.notifications} />
  );
}

export default Notification;


export const conectWsNotification = (token, notificationDispatch, chatDispatch) => {
  const url = URLJoin(BASE_URL_WS, "notification/");
  let newestPage = 1;
  const paginateBy = 10;

  let ws = new WebSocket(url);
  ws.onopen = (e) => {
    alert("websocket接続が完了しました(notification)");
    ws.send(JSON.stringify({ type: "auth", token: token }));
  };

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    console.log(data);

    if (data.type === "auth") {
      console.log("websocket認証OK(notification)");
      // get newest notifications
      ws.send(JSON.stringify({ type: "get", page: newestPage, token: token }));
    }

    else if (data.type === "get") {
      // merge newest notifications
      const newestNotifications = data.notifications;
      notificationDispatch({
        type: "MERGE", notifications: newestNotifications, notDuplicateFunc: () => {
          if (newestNotifications.length >= paginateBy) {
            // paginateBy分の長さかつ重複がなければ次ページのnotificationsをget
            newestPage += 1;
            ws.send(JSON.stringify({ type: "get", page: newestPage, token: token }));
          }
        }
      });
    }

    else if (data.type === "notice") {
      if (data.notification.type === "chat_request") {
        // チャットリクエストの通知
        alert(data.notification.message + data.room_id);
        notificationDispatch({ type: "ADD", notification: data.notification });
        chatDispatch({type: "APPEND_INCOLLECTION", roomID: data.room_id, user: data.notification.subject, date: data.notification.date});
      } else {
        // 通常の通知
        notificationDispatch({ type: "ADD", notification: data.notification });
      }
    }

    else if (data.type === "read") {
      notificationDispatch({ type: "COMPLETE_READ" });
    }
  };

  ws.onclose = (e) => {
    alert("切断されました(notification)");
    if (e.wasClean) {
    } else {
      // e.g. サーバのプロセスが停止、あるいはネットワークダウン
      // この場合、event.code は通常 1006 になります
    }
  };

  notificationDispatch({ type: "SET_WS", ws: ws });
}