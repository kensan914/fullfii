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


export const conectWsNotification = (token, notificationDispatch) => {
  const url = URLJoin(BASE_URL_WS, "notification/");
  let newestPage = 1;
  const paginateBy = 10;

  let ws = new WebSocket(url);
  ws.onopen = (e) => {
    alert("websocket接続が完了しました(notification)");
    ws.send(JSON.stringify({ type: "auth", token: token }));
  };

  ws.onmessage = (e) => {
    const receivedMsgData = JSON.parse(e.data);

    if (receivedMsgData.type === "auth") {
      console.log("websocket認証OK(notification)");
      // get newest notifications
      ws.send(JSON.stringify({ type: "get", page: newestPage, token: token }));
    } 
    
    else if (receivedMsgData.type === "get") {
      // merge newest notifications
      console.log(receivedMsgData);
      const newestNotifications = receivedMsgData.notifications;
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
    
    else if (receivedMsgData.type === "notice") {
      alert(receivedMsgData.notification.message + receivedMsgData.notification.url);
      notificationDispatch({ type: "APPEND", notification: receivedMsgData.notification });
    } 

    else if (receivedMsgData.type === "read") {
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