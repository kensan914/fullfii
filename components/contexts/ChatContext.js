import React, { createContext, useReducer, useContext } from "react";
import { isString, cvtKeyFromSnakeToCamel, asyncStoreTalkCollection, asyncRemoveItem, geneArrPushedWithoutDup, closeWsSafely, asyncStoreJson, asyncStoreTalkTicketCollection, isObject } from "../modules/support";


const chatReducer = (prevState, action) => {
  let _messages;
  let _offlineMessages;
  let _talkTicketCollection;
  let _talkTicket;
  switch (action.type) {
    case "UPDATE_TALK_TICKETS":
      /** update talkTickets to talkTicketCollection.(worry.keyをkeyに持つObjectに変換)
       * action.talkTicketsをtalkTicketCollectionにマージ. すでに存在する同一keyのtalkTicketがtalkingだった時、更新しない.
       * @param {Object} action [type, talkTickets] */

      _talkTicketCollection = prevState.talkTicketCollection;
      action.talkTickets.forEach(talkTicket => {
        if (talkTicket.room === null) {
          talkTicket.room = { ...initRoomBase, ...initRoomAdd };
        } else {
          talkTicket.room = { ...talkTicket.room, ...initRoomAdd };
        }

        if (
          _talkTicketCollection[talkTicket.worry.key] &&
          _talkTicketCollection[talkTicket.worry.key].status.key === "talking"
        ) { } else {
          if (talkTicket.status.key === "waiting") {
            talkTicket.room.messages = [geneCommonMessage("waiting")];
          } else if (talkTicket.status.key === "stopping") {
            talkTicket.room.messages = [geneCommonMessage("stopping")];
          }
          _talkTicketCollection[talkTicket.worry.key] = talkTicket;
        }
      });
      asyncStoreTalkTicketCollection(_talkTicketCollection);

      return {
        ...prevState,
        talkTicketCollection: _talkTicketCollection,
      };

    case "START_TALK":
      /** トーク開始時(init)に実行. initMessage追加 & set ws.
       * @param {Object} action [type, talkTicketKey, ws] */

      _talkTicketCollection = prevState.talkTicketCollection;
      _talkTicket = _talkTicketCollection[action.talkTicketKey];
      if (/* 空objectはtrueを返すため */
        isObject(_talkTicket.room.ws) && Object.keys(_talkTicket.room.ws).length
      ) {
        // WSの重複を防ぐ
        closeWsSafely(action.ws);
        return { ...prevState };
      } else {
        _talkTicket.room.ws = action.ws;

        // initMessage付与。
        _talkTicket.room.messages = [
          _talkTicket.isSpeaker ?
            geneCommonMessage("initSpeak", _talkTicket.room.user.name) :
            geneCommonMessage("initListen", _talkTicket.room.user.name)
        ];

        _talkTicketCollection[action.talkTicketKey] = _talkTicket;
        asyncStoreTalkTicketCollection(_talkTicketCollection);
        return {
          ...prevState,
          talkTicketCollection: _talkTicketCollection,
        };
      }

    case "RESTART_TALK":
      /** トーク再接続時に実行. messagesのtimeのインスタンス化 & offlineMessages = [] & set ws.
       * @param {Object} action [type, talkTicketKey, ws] */

      _talkTicketCollection = prevState.talkTicketCollection;
      _talkTicket = _talkTicketCollection[action.talkTicketKey];
      if (/* 空objectはtrueを返すため */
        isObject(_talkTicket.room.ws) && Object.keys(_talkTicket.room.ws).length
      ) {
        // WSの重複を防ぐ
        closeWsSafely(action.ws);
        return { ...prevState };
      } else {
        _talkTicket.room.ws = action.ws;
        _talkTicket.room.messages.forEach((message, index) => {
          _talkTicket.room.messages[index].time = new Date(message.time)
        });
        _talkTicket.room.offlineMessages = [];

        _talkTicketCollection[action.talkTicketKey] = _talkTicket;
        asyncStoreTalkTicketCollection(_talkTicketCollection);
        return {
          ...prevState,
          talkTicketCollection: _talkTicketCollection,
        };
      }

    case "RESTART_TALK_ONLY_MESSAGE":
      /** トーク再接続時に実行(相手が退出済みのみ). messagesのtimeのインスタンス化 & offlineMessages = [].
      * @param {Object} action [type, talkTicketKey] */

      _talkTicketCollection = prevState.talkTicketCollection;
      _talkTicket = _talkTicketCollection[action.talkTicketKey];
      _talkTicket.room.messages.forEach((message, index) => {
        _talkTicket.room.messages[index].time = new Date(message.time)
      });
      _talkTicket.room.offlineMessages = [];

      _talkTicketCollection[action.talkTicketKey] = _talkTicket;
      asyncStoreTalkTicketCollection(_talkTicketCollection);
      return {
        ...prevState,
        talkTicketCollection: _talkTicketCollection,
      };


    case "RECONNECT_TALK":
      /** wsをset. wsが切断され再接続された際に実行
       * @param {Object} action [type, ws, talkTicketKey] */

      _talkTicketCollection = prevState.talkTicketCollection;
      _talkTicketCollection[action.talkTicketKey].room.ws = action.ws;

      asyncStoreTalkTicketCollection(_talkTicketCollection);
      return {
        ...prevState,
        talkTicketCollection: _talkTicketCollection,
      };

    case "APPEND_MESSAGE":
      /** messageを作成し, 追加. 未読値をインクリメント ストア通知
       * @param {Object} action [type, talkTicketKey, messageID, message, isMe, time(str or Date), token] */

      const message = {
        id: action.messageID,
        message: action.message,
        isMe: action.isMe,
        time: isString(action.time) ? new Date(action.time) : action.time,
      };

      _talkTicketCollection = prevState.talkTicketCollection;
      _talkTicket = _talkTicketCollection[action.talkTicketKey];

      _messages = _talkTicket.room.messages.concat([message]);
      const prevUnreadNum_AM = _talkTicket.room.unreadNum;
      const incrementNum_AM = action.isMe ? 0 : 1;

      _talkTicketCollection[action.talkTicketKey].room.messages = _messages;
      _talkTicketCollection[action.talkTicketKey].room.unreadNum = prevUnreadNum_AM + incrementNum_AM;

      // store message data. and report that it was stored safely to the server.
      asyncStoreTalkTicketCollection(_talkTicketCollection);
      _talkTicket.room.ws.send(JSON.stringify({ type: "store", message_id: action.messageID, token: action.token }))

      return {
        ...prevState,
        talkTicketCollection: _talkTicketCollection,
        totalUnreadNum: prevState.totalUnreadNum + incrementNum_AM,
      };

    case "DELETE_OFFLINE_MESSAGE":
      /** 受け取ったmessageIDに該当するofflineMessageを削除
       * @param {Object} action [type, talkTicketKey, messageID] */

      _talkTicketCollection = prevState.talkTicketCollection;
      _talkTicket = _talkTicketCollection[action.talkTicketKey];

      const prevOfflineMessages = _talkTicket.room.offlineMessages;
      _offlineMessages = prevOfflineMessages.filter(elm => elm.id !== action.messageID);
      _talkTicketCollection[action.talkTicketKey].room.offlineMessages = _offlineMessages;

      asyncStoreTalkTicketCollection(_talkTicketCollection);
      return {
        ...prevState,
        talkTicketCollection: _talkTicketCollection,
      };

    case "MERGE_MESSAGES":
      /** 受け取ったmessagesを統合 未読値をインクリメント ストア通知 (messagesの中身は全てスネークケース)
       * @param {Object} action [type, talkTicketKey, messages, token] */

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

      _talkTicketCollection = prevState.talkTicketCollection;
      _talkTicket = _talkTicketCollection[action.talkTicketKey];

      _messages = _talkTicket.room.messages.concat(messages);
      const prevUnreadNum_MM = _talkTicket.room.unreadNum;
      _talkTicketCollection[action.talkTicketKey].room.messages = _messages;
      _talkTicketCollection[action.talkTicketKey].room.unreadNum = prevUnreadNum_MM + incrementNum_MM;


      // store message data. and report that it was stored safely to the server.
      asyncStoreTalkTicketCollection(_talkTicketCollection);
      _talkTicket.room.ws.send(JSON.stringify({ type: "store_by_room", token: action.token }))

      return {
        ...prevState,
        talkTicketCollection: _talkTicketCollection,
        totalUnreadNum: prevState.totalUnreadNum + incrementNum_MM,
      };

    case "APPEND_COMMON_MESSAGE":
      /** common message を追加
       * @param {Object} action [type, talkTicketKey, alert] */

      if (action.alert) {
        _talkTicketCollection = prevState.talkTicketCollection;
        _talkTicket = _talkTicketCollection[action.talkTicketKey];

        _messages = _talkTicket.room.messages.concat([geneCommonMessage("alert")]);
        _talkTicketCollection[action.talkTicketKey].room.messages = _messages;

        asyncStoreTalkTicketCollection(_talkTicketCollection);
        return {
          ...prevState,
          talkTicketCollection: _talkTicketCollection,
        };
      } else return { ...prevState };

    case "END_TALK":
      /** end talk. messages, offlineMessagesの削除, unreadNum, totalUnreadNumの変更., ws.close()
       * @param {Object} action [type, talkTicketKey, (timeOut)] */

      _talkTicketCollection = prevState.talkTicketCollection;
      _talkTicket = _talkTicketCollection[action.talkTicketKey];

      _talkTicket.room.messages = [..._talkTicket.room.messages, ...[geneCommonMessage("end", _talkTicket.room.user.name, Boolean(action.timeOut))]];
      _talkTicket.room.offlineMessages = [];
      _talkTicket.room.isEnd = true;
      closeWsSafely(_talkTicket.room.ws);

      _talkTicketCollection[action.talkTicketKey] = _talkTicket;
      asyncStoreTalkTicketCollection(_talkTicketCollection);
      return {
        ...prevState,
        talkTicketCollection: _talkTicketCollection,
      };

    case "APPEND_OFFLINE_MESSAGE":
      /** offlineMessageを作成し、追加
       * @param {Object} action [type, talkTicketKey, messageID, message] */

      const offlineMessage = {
        id: action.messageID,
        message: action.message,
        isMe: true,
      };

      _talkTicketCollection = prevState.talkTicketCollection;
      _talkTicket = _talkTicketCollection[action.talkTicketKey];

      _offlineMessages = _talkTicket.room.offlineMessages.concat([offlineMessage]);
      _talkTicketCollection[action.talkTicketKey].room.offlineMessages = _offlineMessages;

      asyncStoreTalkTicketCollection(_talkTicketCollection);
      return {
        ...prevState,
        talkTicketCollection: _talkTicketCollection,
      };

    case "READ_BY_ROOM":
      /** チャットルームごとの既読処理 該当のチャットルームの全てのmessageを既読に チャットルームを開いたときに実行
       * @param {Object} action [type, talkTicketKey] */

      _talkTicketCollection = prevState.talkTicketCollection;
      _talkTicket = _talkTicketCollection[action.talkTicketKey];

      const unreadNum = _talkTicket.room.unreadNum;
      const totalUnreadNum = prevState.totalUnreadNum - unreadNum;
      _talkTicketCollection[action.talkTicketKey].room.unreadNum = 0;

      asyncStoreTalkTicketCollection(_talkTicketCollection);
      return {
        ...prevState,
        talkTicketCollection: _talkTicketCollection,
        totalUnreadNum: totalUnreadNum,
      };

    case "OVERWRITE_TALK_TICKET":
      /** 強制的にtalkTicketを上書き. 既存のtalkTicketが削除されるので、トークが完全に終了している場合のみに使用。
      * @param {Object} action [type, talkTicket] */

      _talkTicketCollection = prevState.talkTicketCollection;
      _talkTicket = action.talkTicket;
      if (_talkTicket.room === null) {
        _talkTicket.room = { ...initRoomBase, ...initRoomAdd };
      } else {
        _talkTicket.room = { ..._talkTicket.room, ...initRoomAdd };
      }
      if (_talkTicket.status.key === "waiting") {
        _talkTicket.room.messages = [geneCommonMessage("waiting")];
      } else if (_talkTicket.status.key === "stopping") {
        _talkTicket.room.messages = [geneCommonMessage("stopping")];
      }
      _talkTicketCollection[_talkTicket.worry.key] = _talkTicket;

      asyncStoreTalkTicketCollection(_talkTicketCollection);

      return {
        ...prevState,
        talkTicketCollection: _talkTicketCollection,
      };

    case "REMOVE_TALK_TICKETS":
      /** talkTicketsを削除
      * @param {Object} action [type, talkTicketKeys] */

      _talkTicketCollection = prevState.talkTicketCollection;

      action.talkTicketKeys.forEach(talkTicketKey => {
        _talkTicket = _talkTicketCollection[talkTicketKey];
        if (isObject(_talkTicket.room?.ws) && Object.keys(_talkTicket.room?.ws).length) { // null || {} の場合があり得る
          closeWsSafely(_talkTicket.room.ws);
        }
        delete _talkTicketCollection[talkTicketKey];
      });

      asyncStoreTalkTicketCollection(_talkTicketCollection);
      return {
        ...prevState,
        talkTicketCollection: _talkTicketCollection,
      };


    default:
      console.warn(`Not found "${action.type}" action.type.`);
      return;
  }
};

const initRoomBase = Object.freeze({
  id: "",
  user: {},
  startedAt: "",
  endedAt: "",
  isAlert: false,
  isTimeOut: false,
});

const initRoomAdd = Object.freeze({
  messages: [],
  offlineMessages: [],
  unreadNum: 0,
  ws: {},
  isEnd: false,
});

const geneCommonMessage = (type, user_name = "", timeOut = false) => {
  const message = {
    common: true,
    time: new Date(Date.now()),
  };
  switch (type) {
    case "initSpeak":
      message["id"] = 0;
      message["message"] = `トークが開始されました。${user_name}さんに話を聞いてもらいましょう。`;
      break;
    case "initListen":
      message["id"] = 0;
      message["message"] = `トークが開始されました。${user_name}さんのお話を聞いてあげましょう。`;
      break;
    case "alert":
      message["id"] = 2;
      message["message"] = "残り5分で自動退室となります。";
      break;
    case "end":
      message["id"] = -1;
      if (timeOut) {
        message["message"] = "トークが開始されてから2週間が経過したため、自動退室されました。右上のボタンからトークを終了してください。";
      } else {
        message["message"] = `${user_name}さんが退室しました。右上のボタンからトークを終了してください。`;
      }
      break;

    case "waiting":
      message["id"] = 0;
      message["message"] = "話し相手を探し中...。";
      break;
    case "stopping":
      message["id"] = 0;
      message["message"] = "ただいま話し相手の検索を停止しています。";
      break;
  }
  return message;
}

const ChatStateContext = createContext({
  totalUnreadNum: 0,
  talkTicketCollection: {},
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

export const ChatProvider = ({ children, talkTicketCollection }) => {
  const [chatState, chatDispatch] = useReducer(chatReducer, {
    totalUnreadNum: 0,
    talkTicketCollection: talkTicketCollection ? talkTicketCollection : {},
  });
  return (
    <ChatStateContext.Provider value={chatState}>
      <ChatDispatchContext.Provider value={chatDispatch}>
        {children}
      </ChatDispatchContext.Provider>
    </ChatStateContext.Provider>
  );
};