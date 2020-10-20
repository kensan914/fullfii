import React, { createContext, useReducer, useContext } from "react";
import { isString, cvtKeyFromSnakeToCamel, asyncStoreTalkCollection, asyncRemoveItem, geneArrPushedWithoutDup, closeWsSafely } from "../modules/support";


const chatReducer = (prevState, action) => {
  let _sendCollection;
  let _inCollection;
  let _talkCollection;
  let _messages;
  let _offlineMessages;
  let _includedUserIDs;
  let _talkingRoomIDs;
  let _talkObj;
  switch (action.type) {
    case "APPEND_SENDCOLLECTION":
      /** 1つのsendObjを作成し、sendCollectionに追加
       * @param {Object} action [type, roomID, user, date(str or Date)] */

      _sendCollection = Object.assign(prevState.sendCollection, {
        [action.roomID]: {
          roomID: action.roomID,
          user: cvtKeyFromSnakeToCamel(action.user),
          date: isString(action.date) ? new Date(action.date) : action.date,
        }
      });
      return {
        ...prevState,
        sendCollection: _sendCollection,
        includedUserIDs: geneArrPushedWithoutDup(prevState.includedUserIDs, action.user.id),
      };

    case "APPEND_INCOLLECTION":
      /** 1つのinObjを作成し、inCollectionに追加
       * @param {Object} action [type, roomID, user, date(str or Date)] */

      _inCollection = Object.assign(prevState.inCollection, {
        [action.roomID]: {
          roomID: action.roomID,
          user: cvtKeyFromSnakeToCamel(action.user),
          date: isString(action.date) ? new Date(action.date) : action.date,
        }
      });
      return {
        ...prevState,
        inCollection: _inCollection,
        includedUserIDs: geneArrPushedWithoutDup(prevState.includedUserIDs, action.user.id),
      };

    case "SET_SEND_IN_COLLECTION":
      /** アプリ起動時に取得したsendObjects, inObjectsからsendCollection, inCollectionを作成.
       * @param {Object} action [type, sendObjects, inObjects] */

      _includedUserIDs = [].concat(prevState.includedUserIDs);
      const generateSendInCollection = sendInObjects => {
        const sendInCollection = {};
        sendInObjects.forEach(sendInObj => {
          sendInObj = cvtKeyFromSnakeToCamel(sendInObj);
          sendInObj.user = cvtKeyFromSnakeToCamel(sendInObj.user);
          _includedUserIDs = geneArrPushedWithoutDup(_includedUserIDs, sendInObj.user.id)
          sendInObj.date = new Date(sendInObj.date);
          sendInCollection[sendInObj.roomID] = sendInObj;
        });
        return sendInCollection;
      }
      _sendCollection = generateSendInCollection(action.sendObjects);
      _inCollection = generateSendInCollection(action.inObjects);

      return {
        ...prevState,
        sendCollection: _sendCollection,
        inCollection: _inCollection,
        includedUserIDs: _includedUserIDs,
      };

    case "START_TALK":
      /** トーク開始時(init)に実行 1つのtalkObjを作成し、talkCollectionに追加 sendCollection・inCollectionからobjを削除
       * @param {Object} action [type, roomID, user, ws] */

      if (!prevState.talkingRoomIDs.includes(action.roomID)) {
        _talkCollection = Object.assign(prevState.talkCollection, {
          [action.roomID]: {
            roomID: action.roomID,
            user: cvtKeyFromSnakeToCamel(action.user),
            messages: [geneCommonMessage("init")],
            offlineMessages: [],
            ws: action.ws,
            unreadNum: 0,
            isEnd: false,
          }
        });
        _sendCollection = prevState.sendCollection;
        _inCollection = prevState.inCollection;
        delete _sendCollection[action.roomID];
        delete _inCollection[action.roomID];

        asyncStoreTalkCollection(_talkCollection);
        return {
          ...prevState,
          sendCollection: _sendCollection,
          inCollection: _inCollection,
          talkCollection: _talkCollection,
          includedUserIDs: geneArrPushedWithoutDup(prevState.includedUserIDs, action.user.id),
          talkingRoomIDs: geneArrPushedWithoutDup(prevState.talkingRoomIDs, action.roomID),
        };
      } else {
        // WSの重複を防ぐ
        closeWsSafely(action.ws);
        return { ...prevState };
      }

    case "RECONNECT_TALK":
      /** wsをset. wsが切断され再接続された際に実行
       * @param {Object} action [type, ws, roomID] */

      _talkCollection = Object.assign(prevState.talkCollection, {});
      _talkCollection[action.roomID].ws = action.ws;

      asyncStoreTalkCollection(_talkCollection);
      return {
        ...prevState,
        talkCollection: _talkCollection,
      };

    case "RESTART_TALK":
      /** トーク開始時に実行 受け取ったtalkObjを修正し、talkCollectionに追加
       * @param {Object} action [type, roomID, user, ws, talkCollection] */

      if (!prevState.talkingRoomIDs.includes(action.roomID)) {
        _talkObj = action.talkCollection[action.roomID];
        _talkObj.user = cvtKeyFromSnakeToCamel(action.user);
        _talkObj.ws = action.ws;
        _talkObj.messages.forEach((message, index) => _talkObj.messages[index].time = new Date(message.time));
        _talkObj.offlineMessages = [];

        _talkCollection = Object.assign(prevState.talkCollection, { [action.roomID]: _talkObj });

        asyncStoreTalkCollection(_talkCollection);
        return {
          ...prevState,
          talkCollection: _talkCollection,
          includedUserIDs: geneArrPushedWithoutDup(prevState.includedUserIDs, action.user.id),
          talkingRoomIDs: geneArrPushedWithoutDup(prevState.talkingRoomIDs, action.roomID),
        };
      } else {
        // WSの重複を防ぐ
        closeWsSafely(action.ws);
        return { ...prevState };
      }

    case "APPEND_MESSAGE":
      /** messageを作成し, 追加. 未読値をインクリメント ストア通知
       * @param {Object} action [type, roomID, messageID, message, isMe, time(str or Date), token] */

      const message = {
        id: action.messageID,
        message: action.message,
        isMe: action.isMe,
        time: isString(action.time) ? new Date(action.time) : action.time,
      };

      _messages = prevState.talkCollection[action.roomID].messages.concat([message]);
      const prevUnreadNum_AM = prevState.talkCollection[action.roomID].unreadNum;
      const incrementNum_AM = action.isMe ? 0 : 1;

      _talkCollection = prevState.talkCollection;
      _talkCollection[action.roomID].messages = _messages;
      _talkCollection[action.roomID].unreadNum = prevUnreadNum_AM + incrementNum_AM;

      // store message data. and report that it was stored safely to the server.
      asyncStoreTalkCollection(_talkCollection);
      prevState.talkCollection[action.roomID].ws.send(JSON.stringify({ type: "store", message_id: action.messageID, token: action.token }))

      return {
        ...prevState,
        talkCollection: _talkCollection,
        totalUnreadNum: prevState.totalUnreadNum + incrementNum_AM,
      };

    case "MERGE_MESSAGES":
      /** 受け取ったmessagesを統合 未読値をインクリメント ストア通知 (messagesの中身は全てスネークケース)
       * @param {Object} action [type, roomID, messages, token] */

      let incrementNum_MM = 0;
      const messages = action.messages.map((elm) => {
        if (!elm.is_me) incrementNum_MM += 1;
        return {
          id: elm.message_id,
          message: elm.message,
          isMe: elm.is_me,
          time: isString(elm.time) ? new Date(elm.time) : elm.time,
        }
      });
      _messages = prevState.talkCollection[action.roomID].messages.concat(messages);

      const prevUnreadNum_MM = prevState.talkCollection[action.roomID].unreadNum;
      _talkCollection = prevState.talkCollection;
      _talkCollection[action.roomID].messages = _messages;
      _talkCollection[action.roomID].unreadNum = prevUnreadNum_MM + incrementNum_MM;

      // store message data. and report that it was stored safely to the server.
      asyncStoreTalkCollection(_talkCollection);
      prevState.talkCollection[action.roomID].ws.send(JSON.stringify({ type: "store_by_room", token: action.token }))

      return {
        ...prevState,
        talkCollection: _talkCollection,
        totalUnreadNum: prevState.totalUnreadNum + incrementNum_MM,
      };

    case "APPEND_OFFLINE_MESSAGE":
      /** offlineMessageを作成し、追加
       * @param {Object} action [type, roomID, messageID, message] */

      const offlineMessage = {
        id: action.messageID,
        message: action.message,
        isMe: true,
      };
      _offlineMessages = prevState.talkCollection[action.roomID].offlineMessages.concat([offlineMessage]);
      _talkCollection = prevState.talkCollection;
      _talkCollection[action.roomID].offlineMessages = _offlineMessages;

      return {
        ...prevState,
        talkCollection: _talkCollection,
      };

    case "DELETE_OFFLINE_MESSAGE":
      /** 受け取ったmessageIDに該当するofflineMessageを削除
       * @param {Object} action [type, roomID, messageID] */

      const prevOfflineMessages = prevState.talkCollection[action.roomID].offlineMessages;
      _offlineMessages = prevOfflineMessages.filter(elm => elm.id !== action.messageID);
      _talkCollection = prevState.talkCollection;
      _talkCollection[action.roomID].offlineMessages = _offlineMessages;

      return {
        ...prevState,
        talkCollection: _talkCollection,
      };

    case "READ_BY_ROOM":
      /** チャットルームごとの既読処理 該当のチャットルームの全てのmessageを既読に チャットルームを開いたときに実行
       * @param {Object} action [type, roomID] */

      const unreadNum = prevState.talkCollection[action.roomID].unreadNum;
      const totalUnreadNum = prevState.totalUnreadNum - unreadNum;
      _talkCollection = prevState.talkCollection;
      _talkCollection[action.roomID].unreadNum = 0;

      asyncStoreTalkCollection(_talkCollection);
      return {
        ...prevState,
        talkCollection: _talkCollection,
        totalUnreadNum: totalUnreadNum,
      };

    case "DELETE_SEND_OBJ":
      /** sendObjをひとつ削除
       * @param {Object} action [type, roomID] */

      _sendCollection = prevState.sendCollection;
      _includedUserIDs = prevState.includedUserIDs.filter((userID) => {
        if (_sendCollection[action.roomID]) return userID !== _sendCollection[action.roomID].user.id;
      });
      delete _sendCollection[action.roomID];
      return {
        ...prevState,
        sendCollection: _sendCollection,
        includedUserIDs: _includedUserIDs,
      };

    case "DELETE_IN_OBJ":
      /** inObjをひとつ削除
       * @param {Object} action [type, roomID] */

      _inCollection = prevState.inCollection;
      _includedUserIDs = prevState.includedUserIDs.filter((userID) => {
        if (_inCollection[action.roomID]) return userID !== _inCollection[action.roomID].user.id;
      });
      delete _inCollection[action.roomID];
      return {
        ...prevState,
        inCollection: _inCollection,
        includedUserIDs: _includedUserIDs,
      };

    case "APPEND_COMMON_MESSAGE":
      /** common message を追加
       * @param {Object} action [type, roomID, alert] */

      if (action.alert) {
        _messages = prevState.talkCollection[action.roomID].messages.concat([geneCommonMessage("alert")]);
        _talkCollection = prevState.talkCollection;
        _talkCollection[action.roomID].messages = _messages;
        asyncStoreTalkCollection(_talkCollection);
        return {
          ...prevState,
          talkCollection: _talkCollection,
        };
      } else return { ...prevState };


    case "END_TALK":
      /** トークの終了. messages, offlineMessagesの削除, unreadNum, totalUnreadNumの変更., ws.close()
       * @param {Object} action [type, roomID, (timeOut)] */

      _talkCollection = prevState.talkCollection;
      _talkCollection[action.roomID].messages = [geneCommonMessage("end", _talkCollection[action.roomID].user.name, Boolean(action.timeOut))];
      _talkCollection[action.roomID].offlineMessages = [];
      const unreadNumDifference = _talkCollection[action.roomID].unreadNum;
      _talkCollection[action.roomID].unreadNum = 0;
      _talkCollection[action.roomID].isEnd = true;
      closeWsSafely(_talkCollection[action.roomID].ws);

      asyncStoreTalkCollection(_talkCollection);
      return {
        ...prevState,
        talkCollection: _talkCollection,
        totalUnreadNum: prevState.totalUnreadNum - unreadNumDifference,
      };

    case "CLOSE_TALK":
      /** トークのクローズ. talkObjの削除. 
       * @param {Object} action [type, roomID] */

      _talkCollection = prevState.talkCollection;
      _includedUserIDs = prevState.includedUserIDs.filter(userID => userID !== _talkCollection[action.roomID].user.id);
      _talkingRoomIDs = prevState.talkingRoomIDs.filter(roomID => roomID !== action.roomID);

      delete _talkCollection[action.roomID];
      asyncStoreTalkCollection(_talkCollection);
      return {
        ...prevState,
        talkCollection: _talkCollection,
        includedUserIDs: _includedUserIDs,
        talkingRoomIDs: _talkingRoomIDs,
      };

    case "APPEND_END_TALK_OBJ":
      /** startup時に実行. 受け取ったtalkObjをend修正し、追加。既にend修正されたtalkObjも対応可。
       * @param {Object} action [type, talkObj, (timeOut)] */

      _talkObj = Object.assign({}, action.talkObj);
      if (!_talkObj.isEnd) {
        _talkObj.messages = [geneCommonMessage("end", _talkObj.user.name, Boolean(action.timeOut))];
        _talkObj.offlineMessages = [];
        _talkObj.unreadNum = 0;
        _talkObj.isEnd = true;
      } else {
        _talkObj.messages[0].time = new Date(_talkObj.messages[0].time);
      }
      _talkCollection = Object.assign(prevState.talkCollection, { [_talkObj.roomID]: _talkObj });

      return {
        ...prevState,
        talkCollection: _talkCollection,
      };

    case "RESET":
      /** リセット wsの切断
       * @param {Object} action [type] */

      Object.values(prevState.talkCollection).forEach((talkObj) => {
        closeWsSafely(talkObj.ws);
      })
      asyncRemoveItem("sendCollection");
      asyncRemoveItem("inCollection");
      asyncRemoveItem("talkCollection");
      return {
        ...prevState,
        sendCollection: {},
        inCollection: {},
        talkCollection: {},
        totalUnreadNum: 0,
        includedUserIDs: [],
        talkingRoomIDs: [],
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
 *  isEnd: {boolean},
 * },} */
const initTalkCollection = {};

const geneCommonMessage = (type, user_name = "", timeOut = false) => {
  const message = {
    common: true,
    time: new Date(Date.now()),
  };
  switch (type) {
    case "init":
      message["id"] = 0;
      message["message"] = "最初のメッセージを送りましょう。";
      break;
    case "alert":
      message["id"] = 2;
      message["message"] = "残り5分で自動退室となります。";
      break;
    case "end":
      message["id"] = -1;
      if (timeOut) {
        message["message"] = "トークが開始されてから24時間が経過したため、自動退室されました。右上のメニューボタンからトークを終了してください。";
      } else {
        message["message"] = `${user_name}さんが退室しました。右上のメニューボタンからトークを終了してください。`;
      }
      break;
  }
  return message;
}

const ChatStateContext = createContext({
  sendCollection: initSendCollection,
  inCollection: initInCollection,
  talkCollection: initTalkCollection,
  totalUnreadNum: 0,
  includedUserIDs: [],
  talkingRoomIDs: [],
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
    includedUserIDs: [],
    talkingRoomIDs: [],
  });
  return (
    <ChatStateContext.Provider value={chatState}>
      <ChatDispatchContext.Provider value={chatDispatch}>
        {children}
      </ChatDispatchContext.Provider>
    </ChatStateContext.Provider>
  );
};