import React from "react";
import * as WebBrowser from "expo-web-browser";

import TalkTemplate from "../componentsEx/templates/TalkTemplate";
import { BASE_URL_WS, BASE_URL, REPORT_URL } from "../constantsEx/env";
import { URLJoin, asyncGetJson, initWs, closeWsSafely } from "../componentsEx/tools/support";
import { useChatState } from "../componentsEx/contexts/ChatContext";
import authAxios from "../componentsEx/tools/authAxios";


const Talk = (props) => {
  const chatState = useChatState();

  return (
    <TalkTemplate {...props} sendCollection={chatState.sendCollection} inCollection={chatState.inCollection} talkCollection={chatState.talkCollection}
      initConnectWsChat={initConnectWsChat} requestCancelTalk={requestCancelTalk} />
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
      if (err.response.data.type === "conflict_end") {
        alert("成立したトークが既に存在します。以前のトークが完全に終了していない可能性があります。");
      } else if (err.response.data.type === "conflict") {
        alert("成立したトークが既に存在します。");
      }
    });
}

/** 
 * response talk request. 
 * If you are a request user and you are starting a talk, init is true. */
const _connectWsChat = (roomID, token, chatState, chatDispatch, profileDispatch, init, callbackSuccess) => {
  const wsSettings = {
    url: URLJoin(BASE_URL_WS, "chat/", roomID),

    onopen: (e, ws) => {
      ws.send(JSON.stringify({ type: "auth", token: token, init: init }));
    },
    onmessage: (e, ws, isReconnect) => {
      const data = JSON.parse(e.data);
      switch (data.type) {
        case "auth":
          if (isReconnect) {
            chatDispatch({ type: "RECONNECT_TALK", ws: ws, roomID: roomID });
          } else {
            callbackSuccess(data, ws);
          }
          profileDispatch({ type: "SET_ALL", profile: data.profile });
          break;

        case "end_talk_alert":
          profileDispatch({ type: "SET_ALL", profile: data.profile });
          chatDispatch({ type: "APPEND_COMMON_MESSAGE", roomID: roomID, alert: true });
          break;

        case "end_talk_time_out":
          profileDispatch({ type: "SET_ALL", profile: data.profile });
          chatDispatch({ type: "END_TALK", roomID: roomID, timeOut: true });
          break;

        case "end_talk":
          profileDispatch({ type: "SET_ALL", profile: data.profile });
          chatDispatch({ type: "END_TALK", roomID: roomID });
          break;

        case "error":
          (data);
          if (data.message) alert(data.message);
          closeWsSafely(ws);
          break;

        default:
          break;
      }
      handleChatMessage(data, chatState, chatDispatch, token);
    },
    onclose: (e, ws) => {
    },
  };

  initWs(wsSettings);
}

export const initConnectWsChat = (roomID, token, chatState, chatDispatch, profileDispatch) => {
  _connectWsChat(roomID, token, chatState, chatDispatch, profileDispatch, true, (data, ws) => {
    chatDispatch({ type: "START_TALK", roomID: data.room_id, user: data.target_user, ws: ws });
  });
}

const restartWsChat = (roomID, token, chatState, chatDispatch, profileDispatch, talkCollection) => {
  _connectWsChat(roomID, token, chatState, chatDispatch, profileDispatch, false, (data, ws) => {
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
export const requestCancelTalk = (roomID, token, chatDispatch) => {
  const url = URLJoin(BASE_URL, "rooms/", roomID, "cancel/");

  authAxios(token)
    .post(url)
    .then(res => {
      chatDispatch({ type: "DELETE_SEND_OBJ", roomID: roomID });
    })
    .catch(err => {
      if (err.response.status === 409 && err.response.data.status === "conflict_room_has_started") {
        alert("既にトークは開始しています。")
      }
    });
}

/** 
 *  end talk request. */
export const requestEndTalk = (roomID, token, setIsOpenEndTalk, navigation, chatDispatch, profileDispatch, setIsShowSpinner, willSkipEvaluation = false) => {
  setIsShowSpinner(true);
  const url = URLJoin(BASE_URL, "rooms/", roomID, "end/");

  authAxios(token)
    .post(url)
    .then(async res => {
      if (res.data.profile) {
        profileDispatch({ type: "SET_ALL", profile: res.data.profile });
      }

      if (!willSkipEvaluation) {
        setIsOpenEndTalk(true);
        chatDispatch({ type: "END_TALK", roomID: roomID });
      } else {
        // report
        await WebBrowser.openBrowserAsync(REPORT_URL);
        navigation.navigate("Home");
        chatDispatch({ type: "CLOSE_TALK", roomID: roomID });
      }
    })
    .catch(err => {
      if (err.response.status === 404) {
        navigation.navigate("Home");
        chatDispatch({ type: "CLOSE_TALK", roomID: roomID });
      }
    })
    .finally(() => {
      setIsShowSpinner(false);
    });
}

/** 
 *  close talk request. */
export const requestCloseTalk = (roomID, token, navigation, chatDispatch, hasThunks = false) => {
  const url = URLJoin(BASE_URL, "rooms/", roomID, "close/");

  authAxios(token)
    .post(url, {
      has_thunks: hasThunks,
    })
    .then(res => {
      navigation.navigate("Home");
      chatDispatch({ type: "CLOSE_TALK", roomID: roomID });
    })
    .catch(err => {
      if (err.response.status === 404) {
        if (hasThunks) alert("ありがとうの送信に失敗しました。トークが終了してから時間がかかりすぎている可能性があります。");
        navigation.navigate("Home");
        chatDispatch({ type: "CLOSE_TALK", roomID: roomID });
      }
    });
}

const requestGetTalkInfo = (token, callbackSuccess) => {
  const url = URLJoin(BASE_URL, "me/talk-info");

  authAxios(token)
    .get(url)
    .then((res) => callbackSuccess(res))
    .catch(err => {
    });
}

/** 
 *  トークのstate, wsなど全て再開, 復元する. startupで実行 */
export const resumeTalk = (token, chatState, chatDispatch, profileDispatch) => {
  requestGetTalkInfo(token, async res => {
    const sendObjects = res.data["send_objects"];
    const inObjects = res.data["in_objects"];
    const talkingRoomIDs = res.data["talking_room_ids"];
    const endRoomIDs = res.data["end_room_ids"];
    const endTimeOutRoomIDs = res.data["end_time_out_room_ids"];
    chatDispatch({ type: "SET_SEND_IN_COLLECTION", sendObjects: sendObjects, inObjects: inObjects });

    let willConnectRoomIDs = [].concat(talkingRoomIDs);
    const talkCollection = await asyncGetJson("talkCollection");
    // resume talks that has already started
    if (talkCollection) {
      const roomIDs = Object.keys(talkCollection);
      roomIDs.forEach(roomID => {
        if (talkingRoomIDs.includes(roomID)) {
          willConnectRoomIDs = willConnectRoomIDs.filter(elm => elm !== roomID);
          restartWsChat(roomID, token, chatState, chatDispatch, profileDispatch, talkCollection);
        }
        else if (endRoomIDs.includes(roomID)) {
          chatDispatch({ type: "APPEND_END_TALK_OBJ", talkObj: talkCollection[roomID] });
        }
        else if (endTimeOutRoomIDs.includes(roomID)) {
          chatDispatch({ type: "APPEND_END_TALK_OBJ", talkObj: talkCollection[roomID], timeOut: true });
        }
      });
    }
    // init talks other than that
    willConnectRoomIDs.forEach(talkingRoomID => {
      initConnectWsChat(talkingRoomID, token, chatState, chatDispatch, profileDispatch);
    });
  })
}