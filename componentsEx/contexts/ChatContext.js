import React, { createContext, useReducer, useContext } from "react";
import { asyncSetItem, asyncRemoveAll, isString, cvtKeyFromSnakeToCamel } from "../tools/support";
import { talks } from "../../constantsEx/talks";


const chatReducer = (prevState, action) => {
  let sendCollection;
  let inCollection;
  let talkCollection;
  let messages;
  let offlineMessages;
  switch (action.type) {
    case "APPEND_SENDCOLLECTION":
      /** 1つのsendObjを作成し、sendCollectionに追加
       * @param {Object} action [type, roomID, user, date(str or Date)] */

      sendCollection = Object.assign(prevState.sendCollection, {
        [action.roomID]: {
          roomID: action.roomID,
          user: cvtKeyFromSnakeToCamel(action.user),
          date: isString(action.date) ? new Date(action.date) : action.date,
        }
      });
      return {
        ...prevState,
        sendCollection: sendCollection,
      };

    case "APPEND_INCOLLECTION":
      /** 1つのinObjを作成し、inCollectionに追加
       * @param {Object} action [type, roomID, user, date(str or Date)] */

      inCollection = Object.assign(prevState.inCollection, {
        [action.roomID]: {
          roomID: action.roomID,
          user: cvtKeyFromSnakeToCamel(action.user),
          date: isString(action.date) ? new Date(action.date) : action.date,
        }
      });
      return {
        ...prevState,
        inCollection: inCollection,
      };

    case "START_TALK":
      /** トーク開始時に実行 1つのtalkObjを作成し、talkCollectionに追加 sendCollection・inCollectionからobjを削除
       * @param {Object} action [type, roomID, user, ws] */

      talkCollection = Object.assign(prevState.talkCollection, {
        [action.roomID]: {
          roomID: action.roomID,
          user: cvtKeyFromSnakeToCamel(action.user),
          messages: [{ id: 0, message: "最初のメッセージを送りましょう。", common: true, time: new Date(Date.now()) }],
          offlineMessages: [],
          ws: action.ws,
          unreadNum: 0,
        }
      });
      const _sendCollection = prevState.sendCollection;
      const _inCollection = prevState.inCollection;
      delete _sendCollection[action.roomID];
      delete _inCollection[action.roomID];

      return {
        ...prevState,
        sendCollection: _sendCollection,
        inCollection: _inCollection,
        talkCollection: talkCollection,
      };

    case "APPEND_MESSAGE":
      /** messageを作成し、追加 未読値をインクリメント
       * @param {Object} action [type, roomID, messageID, message, me, time(str or Date)] */

      const message = {
        id: action.messageID,
        message: action.message,
        me: action.me,
        // time: isString(action.time) ? new Date(new Date(action.time).toLocaleString({ timeZone: 'Asia/Tokyo' })) : action.time,
        time: isString(action.time) ? new Date(action.time) : action.time,
      };

      messages = prevState.talkCollection[action.roomID].messages.concat([message]);
      const prevUnreadNum = prevState.talkCollection[action.roomID].unreadNum;
      const incrementNum = action.me ? 0 : 1;

      talkCollection = prevState.talkCollection;
      talkCollection[action.roomID].messages = messages;
      talkCollection[action.roomID].unreadNum = prevUnreadNum + incrementNum;

      return {
        ...prevState,
        talkCollection: talkCollection,
        totalUnreadNum: prevState.totalUnreadNum + incrementNum,
      };

    case "APPEND_OFFLINE_MESSAGE":
      /** offlineMessageを作成し、追加
       * @param {Object} action [type, roomID, messageID, message] */

      const offlineMessage = {
        id: action.messageID,
        message: action.message,
        me: true,
      };
      offlineMessages = prevState.talkCollection[action.roomID].offlineMessages.concat([offlineMessage]);
      talkCollection = prevState.talkCollection;
      talkCollection[action.roomID].offlineMessages = offlineMessages;

      return {
        ...prevState,
        talkCollection: talkCollection,
      };

    case "DELETE_OFFLINE_MESSAGE":
      /** 受け取ったmessageIDに該当するofflineMessageを削除
       * @param {Object} action [type, roomID, messageID] */

      const prevOfflineMessages = prevState.talkCollection[action.roomID].offlineMessages;
      offlineMessages = prevOfflineMessages.filter(elm => elm.id !== action.messageID);
      talkCollection = prevState.talkCollection;
      talkCollection[action.roomID].offlineMessages = offlineMessages;

      return {
        ...prevState,
        talkCollection: talkCollection,
      };

    case "READ_BY_ROOM":
      /** チャットルームごとの既読処理 該当のチャットルームの全てのmessageを既読に チャットルームを開いたときに実行
       * @param {Object} action [type, roomID] */

      const unreadNum = prevState.talkCollection[action.roomID].unreadNum;
      const totalUnreadNum = prevState.totalUnreadNum - unreadNum;
      talkCollection = prevState.talkCollection;
      talkCollection[action.roomID].unreadNum = 0;

      return {
        ...prevState,
        talkCollection: talkCollection,
        totalUnreadNum: totalUnreadNum,
      };

    case "RESET":
      /** リセット wsの切断
       * @param {Object} action [type] */

      Object.values(prevState.talkCollection).forEach((talkObj) => {
        if (talkObj.ws) talkObj.ws.close();
      })
      // asyncRemoveItem("notifications");
      return {
        ...prevState,
        sendCollection: {},
        inCollection: {},
        talkCollection: {},
        totalUnreadNum: 0,
      };

    default:
      console.warn(`Not found "${action.type}" action.type.`);
      return;
  }
};

/**@example
 * sendCollection = {
 * <str: roomID>: {
 *  roomID: {str},
 *  user: {Obj},
 *  date: {Obj},
 * },} */
const initSendCollection = {};

/**@example
 * inCollection = {
 * <str: roomID>: {
 *  roomID: {str},
 *  user: {Obj},
 *  date: {Obj},
 * },} */
const initInCollection = {};

/**@example
 * talkCollection = {
 * <str: roomID>: {
 *  roomID: {str},
 *  user: {Obj},
 *  messages: {Array},
 *  offlineMessages: {Array},
 *  ws: {Obj},
 *  unreadNum: {Num},
 * },} */
const initTalkCollection = {};

const ChatStateContext = createContext({
  sendCollection: initSendCollection,
  inCollection: initInCollection,
  talkCollection: initTalkCollection,
  totalUnreadNum: 0,
});
const ChatDispatchContext = createContext(undefined);

export const useChatState = () => {
  const context = useContext(ChatStateContext);
  return context;
};
export const useChatDispatch = () => {
  const context = useContext(ChatDispatchContext);
  return context;
};

export const ChatProvider = ({ children, token }) => {
  const [chatState, chatDispatch] = useReducer(chatReducer, {
    sendCollection: initSendCollection,
    inCollection: initInCollection,
    talkCollection: initTalkCollection,
    totalUnreadNum: 0,
  });
  return (
    <ChatStateContext.Provider value={chatState}>
      <ChatDispatchContext.Provider value={chatDispatch}>
        {children}
      </ChatDispatchContext.Provider>
    </ChatStateContext.Provider>
  );
};