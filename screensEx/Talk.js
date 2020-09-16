import React from 'react';

import TalkTemplate from '../componentsEx/templates/TalkTemplate';
import { BASE_URL_WS } from '../constantsEx/env';
import { URLJoin } from '../componentsEx/tools/support';
import { useChatState } from '../componentsEx/contexts/ChatContext';
import authAxios from '../componentsEx/tools/authAxios';

const Talk = (props) => {
  const chatState = useChatState();

  return (
    <TalkTemplate {...props} sendCollection={chatState.sendCollection} inCollection={chatState.inCollection} talkCollection={chatState.talkCollection} connectWsChat={connectWsChat} />
  );
}

export default Talk;


/** 
 * request chat. */
export const requestChat = (user, token, chatState, chatDispatch) => {
  const url = URLJoin(BASE_URL, "chat-request/", user.id);

  authAxios(token)
    .get(url)
    .then(res => {
      chatDispatch({ type: "APPEND_SENDCOLLECTION", roomID: res.data.room_id, user: res.data.target_user, date: new Date(Date.now()) });
    })
    .catch(err => {
    });
}

/** 
 * request chat. */
export const connectWsChatRequest = (user, token, chatState, chatDispatch) => {
  const url = URLJoin(BASE_URL_WS, "chat-request/", user.id);

  let ws = new WebSocket(url);
  ws.onopen = (e) => {
    alert("websocket接続が完了しました(chat-request)");
    ws.send(JSON.stringify({ type: "auth", token: token }));
  };
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.type === "auth") {
      console.log("websocket認証OK(chat-request)");
      chatDispatch({ type: "APPEND_SENDCOLLECTION", roomID: data.room_id, user: data.target_user, date: new Date(Date.now()) });
    } else if (data.type === "notice_response") {
      chatDispatch({ type: "START_TALK", roomID: data.room_id, user: data.target_user, ws: ws });
    }
    handleChatMessage(data, chatState, chatDispatch);
  };
  ws.onclose = (e) => {
    alert("切断されました(chat-request)");
    if (e.wasClean) {
    } else {
      // e.g. サーバのプロセスが停止、あるいはネットワークダウン
      // この場合、event.code は通常 1006 になります
    }
  };
}

/** 
 * response chat request. */
export const connectWsChat = (roomID, token, chatState, chatDispatch) => {
  const url = URLJoin(BASE_URL_WS, "chat/", roomID);

  let ws = new WebSocket(url);
  ws.onopen = (e) => {
    alert("websocket接続が完了しました(chat-request)");
    ws.send(JSON.stringify({ type: "auth", token: token }));
  };
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.type === "auth") {
      console.log("websocket認証OK(chat-request)");
      chatDispatch({ type: "START_TALK", roomID: data.room_id, user: data.target_user, ws: ws });
    }
    handleChatMessage(data, chatState, chatDispatch);
  };
  ws.onclose = (e) => {
    alert("切断されました(chat-request)");
    if (e.wasClean) {
    } else {
      // e.g. サーバのプロセスが停止、あるいはネットワークダウン
      // この場合、event.code は通常 1006 になります
    }
  };
}

const handleChatMessage = (data, chatState, chatDispatch) => {
  if (data.type === "chat_message") {
    const roomID = data.room_id;
    const talkObj = chatState.talkCollection[roomID];
    const offlineMessages = talkObj.offlineMessages;

    if (data.me) {
      // appendMessage → offlineMessagesの該当messageを削除
      const offlineMsgIDs = offlineMessages.map(offlineMessage => offlineMessage.id)
      if (offlineMsgIDs.indexOf(data.message_id) >= 0) {
        chatDispatch({ type: "APPEND_MESSAGE", roomID: roomID, messageID: data.message_id, message: data.message, me: data.me, time: data.time });
        chatDispatch({ type: "DELETE_OFFLINE_MESSAGE", roomID: roomID, messageID: data.message_id });
      } else {
      }
    } else {
      chatDispatch({ type: "APPEND_MESSAGE", roomID: roomID, messageID: data.message_id, message: data.message, me: data.me, time: data.time });
    }
  }
}