import React from "react";

import NotificationTemplate from "../componentsEx/templates/NotificationTemplate";
import { BASE_URL_WS } from "../constantsEx/env";
import { initWs, URLJoin } from "../componentsEx/tools/support";
import { initConnectWsChat } from "./Talk";


const Notification = (props) => {
  const { notificationState } = props;

  return (
    <NotificationTemplate {...props} notifications={notificationState.notifications} />
  );
}

export default Notification;


export const connectWsNotification = (token, notificationDispatch, profileDispatch, chatState, chatDispatch) => {
  let newestPage = 1;
  const paginateBy = 10;

  const wsSettings = {
    url: URLJoin(BASE_URL_WS, "notification/"),

    onopen: (e, ws) => {
      alert("websocket接続が完了しました(notification)");
      ws.send(JSON.stringify({ type: "auth", token: token }));
    },
    onmessage: (e, ws, isReconnect) => {
      const data = JSON.parse(e.data);
      console.log(data);

      if (data.type === "auth") {
        console.log("websocket認証OK(notification)");
        profileDispatch({ type: "SET_ALL", profile: data.profile });
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
        if (data.notification.message) {
          console.log(data.notification.message);
          notificationDispatch({ type: "ADD", notification: data.notification });
        }

        if (data.notification.type === "talk_request") {
          // チャットリクエスト通知
          chatDispatch({ type: "APPEND_INCOLLECTION", roomID: data.room_id, user: data.notification.subject, date: data.notification.date });
        } else if (data.notification.type === "talk_response") {
          // チャットレスポンス通知
          initConnectWsChat(data.room_id, token, chatState, chatDispatch, profileDispatch);
        } else if (data.notification.type === "cancel_talk_request_to_res") {
          // レスポンスユーザへのキャンセルトークリクエスト通知
          chatDispatch({ type: "DELETE_IN_OBJ", roomID: data.room_id });
        } else if (data.notification.type === "cancel_talk_request_to_req") {
          // リクエストユーザへのキャンセルトークリクエスト通知
          chatDispatch({ type: "DELETE_SEND_OBJ", roomID: data.room_id });
        } else {
          // 通常の通知
        }
      }

      else if (data.type === "read") {
        notificationDispatch({ type: "COMPLETE_READ" });
      }
    },
    onclose: (e, ws) => {
      // alert("切断されました(notification)");
    },

    registerWs: (ws) => {
      notificationDispatch({ type: "SET_WS", ws: ws });
    }
  }

  initWs(wsSettings);
}