import React, { useEffect } from 'react';

import TalkTemplate from '../componentsEx/templates/TalkTemplate';
import { BASE_URL_WS, BASE_URL } from '../constantsEx/env';
import { URLJoin, asyncGetJson } from '../componentsEx/tools/support';
import { useChatState } from '../componentsEx/contexts/ChatContext';
import authAxios from '../componentsEx/tools/authAxios';

const Talk = (props) => {
  const chatState = useChatState();

  return (
    <TalkTemplate {...props} sendCollection={chatState.sendCollection} inCollection={chatState.inCollection} talkCollection={chatState.talkCollection}
      initConnectWsChat={initConnectWsChat} cancelTalkRequest={cancelTalkRequest} />
  );
}

export default Talk;


/** 
 * request talk. */
export const requestTalk = (user, token, chatDispatch) => {
  const url = URLJoin(BASE_URL, "users/", user.id, "talk-request/");

  authAxios(token)
    .post(url)
    .then(res => {
      chatDispatch({ type: "APPEND_SENDCOLLECTION", roomID: res.data.room_id, user: res.data.target_user, date: new Date(Date.now()) });
    })
    .catch(err => {
    });
}

/** 
 * response talk request. 
 * If you are a request user and you are starting a talk, init is true. */
const _connectWsChat = (roomID, token, chatState, chatDispatch, init, callbackSuccess) => {
  const url = URLJoin(BASE_URL_WS, "chat/", roomID);

  let ws = new WebSocket(url);
  ws.onopen = (e) => {
    alert("websocket接続が完了しました(talk-request)");
    ws.send(JSON.stringify({ type: "auth", token: token, init: init }));
  };
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.type === "auth") {
      console.log("websocket認証OK(talk-request)");
      callbackSuccess(data, ws);
    }

    else if (data.type === "error") {
      console.log(data);
      if (data.message) alert(data.message);
      ws.close();
    }
    handleChatMessage(data, chatState, chatDispatch, token);
  };
  ws.onclose = (e) => {
    // alert("切断されました(talk-request)");
    if (e.wasClean) {
    } else {
      // e.g. サーバのプロセスが停止、あるいはネットワークダウン
      // この場合、event.code は通常 1006 になります
    }
  };
}

export const initConnectWsChat = (roomID, token, chatState, chatDispatch) => {
  _connectWsChat(roomID, token, chatState, chatDispatch, true, callbackSuccess = (data, ws) => {
    chatDispatch({ type: "START_TALK", roomID: data.room_id, user: data.target_user, ws: ws });
  });
}

const _reconnectWsChat = (roomID, token, chatState, chatDispatch, talkCollection) => {
  _connectWsChat(roomID, token, chatState, chatDispatch, false, callbackSuccess = (data, ws) => {
    chatDispatch({ type: "RESTART_TALK", roomID: data.room_id, user: data.target_user, ws: ws, talkCollection: talkCollection });
  });
}


const handleChatMessage = (data, chatState, chatDispatch, token) => {
  if (data.type === "chat_message") {
    const roomID = data.room_id;
    const messageID = data.message.message_id;
    const message = data.message.message;
    const isMe = data.message.is_me;
    const time = data.message.time;

    const talkObj = chatState.talkCollection[roomID];
    const offlineMessages = talkObj.offlineMessages;

    if (isMe) {
      // appendMessage → offlineMessagesの該当messageを削除
      const offlineMsgIDs = offlineMessages.map(offlineMessage => offlineMessage.id)
      if (offlineMsgIDs.indexOf(messageID) >= 0) {
        chatDispatch({ type: "APPEND_MESSAGE", roomID: roomID, messageID: messageID, message: message, isMe: isMe, time: time, token: token });
        chatDispatch({ type: "DELETE_OFFLINE_MESSAGE", roomID: roomID, messageID: messageID });
      } else {
      }
    } else {
      chatDispatch({ type: "APPEND_MESSAGE", roomID: roomID, messageID: messageID, message: message, isMe: isMe, time: time, token: token });
    }
  }

  else if (data.type === "multi_chat_messages") {
    const roomID = data.room_id;
    const messages = data.messages;
    chatDispatch({ type: "MERGE_MESSAGES", roomID: roomID, messages: messages, token: token });
  }
}


/** 
 *  cansel talk request. */
export const cancelTalkRequest = (roomID, token, chatDispatch) => {
  const url = URLJoin(BASE_URL, "rooms/", roomID, "cancel/");

  authAxios(token)
    .post(url)
    .then(res => {
      chatDispatch({ type: "DELETE_SEND_OBJ", roomID: roomID });
    })
    .catch(err => {
    });
}

export const reconnectWsChat = async (token, chatState, chatDispatch) => {
  const talkCollection = await asyncGetJson("talkCollection");
  if (talkCollection) {
    const roomIDs = Object.keys(talkCollection);
    roomIDs.forEach(roomID => _reconnectWsChat(roomID, token, chatState, chatDispatch, talkCollection));
  }
}

export const requestGetTalkInfo = (token, chatState, chatDispatch) => {
  const url = URLJoin(BASE_URL, "me/talk-info");

  authAxios(token)
    .get(url)
    .then(res => {
      console.log("xxxxxxxx");
      console.log(res.data);
      chatDispatch({ type: "SET_SEND_IN_COLLECTION", sendObjects: res.data["send_objects"], inObjects: res.data["in_objects"] });
      res.data["talking_room_ids"].forEach(talking_room_id => {
        if (!chatState.talkingRoomIDs.includes(talking_room_id)) {
          initConnectWsChat(talking_room_id, token, chatState, chatDispatch);
        }
      })
    })
    .catch(err => {
    });
}
