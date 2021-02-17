import React, { createContext, useReducer, useContext } from "react";
import {
  isString,
  closeWsSafely,
  asyncStoreTalkTicketCollection,
  isObject,
  isTalkTicket,
  isRoom,
} from "../modules/support";
import {
  ChatState,
  ChatDispatch,
  RoomAdd,
  TalkTicketCollection,
  ChatActionType,
  TalkTicket,
  CommonMessage,
  Message,
  OfflineMessage,
  RoomJson,
  AllMessages,
} from "../types/Types.context";
import { initProfile } from "./ProfileContext";

const chatReducer = (
  prevState: ChatState,
  action: ChatActionType
): ChatState => {
  let _messages: AllMessages;
  let _offlineMessages: OfflineMessage[];
  let _talkTicketCollection: TalkTicketCollection;
  let _talkTicket: TalkTicket;
  switch (action.type) {
    case "UPDATE_TALK_TICKETS": {
      /** update talkTickets to talkTicketCollection.(worry.keyをkeyに持つObjectに変換)
       * action.talkTicketsをtalkTicketCollectionにマージ. すでに存在する同一keyのtalkTicketがtalkingだった時、更新しない.
       * @param {Object} action [type, talkTickets] */
      _talkTicketCollection = prevState.talkTicketCollection;
      console.error("cddd");
      action.talkTickets.forEach((talkTicketJson) => {
        if (talkTicketJson.room === null) {
          talkTicketJson.room = { ...initRoomBase, ...initRoomAdd };
        } else {
          talkTicketJson.room = { ...talkTicketJson.room, ...initRoomAdd };
        }

        if (talkTicketJson.room && !isRoom(talkTicketJson.room)) {
          return { ...prevState };
        }
        if (!isTalkTicket(talkTicketJson)) {
          return { ...prevState };
        }

        if (
          !(
            _talkTicketCollection[talkTicketJson.worry.key] &&
            _talkTicketCollection[talkTicketJson.worry.key].status.key ===
              "talking"
          )
        ) {
          if (talkTicketJson.status.key === "waiting" && talkTicketJson.room) {
            talkTicketJson.room.messages = [geneCommonMessage("waiting")];
          } else if (talkTicketJson.status.key === "stopping") {
            talkTicketJson.room.messages = [geneCommonMessage("stopping")];
          }
          _talkTicketCollection[talkTicketJson.worry.key] = talkTicketJson;
        }
      });
      asyncStoreTalkTicketCollection(_talkTicketCollection);

      return {
        ...prevState,
        talkTicketCollection: _talkTicketCollection,
      };
    }

    case "START_TALK": {
      /** トーク開始時(init)に実行. initMessage追加 & set ws.
       * @param {Object} action [type, talkTicketKey, ws] */

      _talkTicketCollection = prevState.talkTicketCollection;
      _talkTicket = _talkTicketCollection[action.talkTicketKey];
      if (
        /* 空objectはtrueを返すため */
        _talkTicket.room.ws !== null &&
        Object.keys(_talkTicket.room.ws).length
      ) {
        // WSの重複を防ぐ
        closeWsSafely(action.ws);
        return { ...prevState };
      } else {
        _talkTicket.room.ws = action.ws;

        // initMessage付与。
        _talkTicket.room.messages = [
          _talkTicket.isSpeaker
            ? geneCommonMessage("initSpeak", _talkTicket.room.user.name)
            : geneCommonMessage("initListen", _talkTicket.room.user.name),
        ];

        _talkTicketCollection[action.talkTicketKey] = _talkTicket;
        asyncStoreTalkTicketCollection(_talkTicketCollection);
        return {
          ...prevState,
          talkTicketCollection: _talkTicketCollection,
        };
      }
    }

    case "RESTART_TALK": {
      /** トーク再接続時に実行. messagesのtimeのインスタンス化 & offlineMessages = [] & set ws.
       * @param {Object} action [type, talkTicketKey, ws] */

      _talkTicketCollection = prevState.talkTicketCollection;
      _talkTicket = _talkTicketCollection[action.talkTicketKey];
      if (
        /* 空objectはtrueを返すため */
        _talkTicket.room.ws !== null &&
        Object.keys(_talkTicket.room.ws).length
      ) {
        // WSの重複を防ぐ
        closeWsSafely(action.ws);
        return { ...prevState };
      } else {
        _talkTicket.room.ws = action.ws;
        _talkTicket.room.messages.forEach((message, index) => {
          const targetMessage = _talkTicket.room.messages[index];
          if ("time" in targetMessage && "time" in message)
            targetMessage.time = new Date(message.time);
        });
        _talkTicket.room.offlineMessages = [];

        _talkTicketCollection[action.talkTicketKey] = _talkTicket;
        asyncStoreTalkTicketCollection(_talkTicketCollection);
        return {
          ...prevState,
          talkTicketCollection: _talkTicketCollection,
        };
      }
    }

    case "RESTART_TALK_ONLY_MESSAGE": {
      /** トーク再接続時に実行(相手が退出済みのみ). messagesのtimeのインスタンス化 & offlineMessages = [].
       * @param {Object} action [type, talkTicketKey] */

      _talkTicketCollection = prevState.talkTicketCollection;
      _talkTicket = _talkTicketCollection[action.talkTicketKey];
      _talkTicket.room.messages.forEach((message, index) => {
        const targetMessageOnlyMessage = _talkTicket.room.messages[index];
        if ("time" in targetMessageOnlyMessage && "time" in message)
          targetMessageOnlyMessage.time = new Date(message.time);
      });
      _talkTicket.room.offlineMessages = [];

      _talkTicketCollection[action.talkTicketKey] = _talkTicket;
      asyncStoreTalkTicketCollection(_talkTicketCollection);
      return {
        ...prevState,
        talkTicketCollection: _talkTicketCollection,
      };
    }

    case "RECONNECT_TALK": {
      /** wsをset. wsが切断され再接続された際に実行
       * @param {Object} action [type, ws, talkTicketKey] */

      _talkTicketCollection = prevState.talkTicketCollection;
      _talkTicketCollection[action.talkTicketKey].room.ws = action.ws;

      asyncStoreTalkTicketCollection(_talkTicketCollection);
      return {
        ...prevState,
        talkTicketCollection: _talkTicketCollection,
      };
    }

    case "APPEND_MESSAGE": {
      /** messageを作成し, 追加. 未読値をインクリメント ストア通知
       * @param {Object} action [type, talkTicketKey, messageId, message, isMe, time(str or Date), token] */

      const message: Message = {
        messageId: action.messageId,
        message: action.message,
        isMe: action.isMe,
        time:
          typeof action.time === "string" ? new Date(action.time) : action.time,
      };

      _talkTicketCollection = prevState.talkTicketCollection;
      _talkTicket = _talkTicketCollection[action.talkTicketKey];

      _messages = _talkTicket.room.messages.concat([message]);
      const prevUnreadNum_AM = _talkTicket.room.unreadNum;
      const incrementNum_AM = action.isMe ? 0 : 1;

      _talkTicketCollection[action.talkTicketKey].room.messages = _messages;
      _talkTicketCollection[action.talkTicketKey].room.unreadNum =
        prevUnreadNum_AM + incrementNum_AM;

      // store message data. and report that it was stored safely to the server.
      asyncStoreTalkTicketCollection(_talkTicketCollection);
      _talkTicket.room.ws &&
        _talkTicket.room.ws.send(
          JSON.stringify({
            type: "store",
            messageId: action.messageId,
            token: action.token,
          })
        );

      return {
        ...prevState,
        talkTicketCollection: _talkTicketCollection,
        totalUnreadNum: prevState.totalUnreadNum + incrementNum_AM,
      };
    }

    case "DELETE_OFFLINE_MESSAGE": {
      /** 受け取ったmessageIdに該当するofflineMessageを削除
       * @param {Object} action [type, talkTicketKey, messageId] */

      _talkTicketCollection = prevState.talkTicketCollection;
      _talkTicket = _talkTicketCollection[action.talkTicketKey];

      const prevOfflineMessages = _talkTicket.room.offlineMessages;
      _offlineMessages = prevOfflineMessages.filter(
        (elm) => elm.messageId !== action.messageId
      );
      _talkTicketCollection[
        action.talkTicketKey
      ].room.offlineMessages = _offlineMessages;

      asyncStoreTalkTicketCollection(_talkTicketCollection);
      return {
        ...prevState,
        talkTicketCollection: _talkTicketCollection,
      };
    }

    case "MERGE_MESSAGES": {
      /** 受け取ったmessagesを統合 未読値をインクリメント ストア通知 (messagesの中身は全てスネークケース)
       * @param {Object} action [type, talkTicketKey, messages, token] */

      let incrementNum_MM = 0;
      const messages = action.messages.map((elm) => {
        if (!elm.isMe) incrementNum_MM += 1;
        return {
          messageId: elm.messageId,
          message: elm.message,
          isMe: elm.isMe,
          time: isString(elm.time) ? new Date(elm.time) : elm.time,
        };
      });

      _talkTicketCollection = prevState.talkTicketCollection;
      _talkTicket = _talkTicketCollection[action.talkTicketKey];

      _messages = _talkTicket.room.messages.concat(messages);
      const prevUnreadNum_MM = _talkTicket.room.unreadNum;
      _talkTicketCollection[action.talkTicketKey].room.messages = _messages;
      _talkTicketCollection[action.talkTicketKey].room.unreadNum =
        prevUnreadNum_MM + incrementNum_MM;

      // store message data. and report that it was stored safely to the server.
      asyncStoreTalkTicketCollection(_talkTicketCollection);
      _talkTicket.room.ws &&
        _talkTicket.room.ws.send(
          JSON.stringify({ type: "store_by_room", token: action.token })
        );

      return {
        ...prevState,
        talkTicketCollection: _talkTicketCollection,
        totalUnreadNum: prevState.totalUnreadNum + incrementNum_MM,
      };
    }

    case "APPEND_COMMON_MESSAGE": {
      /** common message を追加
       * @param {Object} action [type, talkTicketKey, alert] */

      if (action.alert) {
        _talkTicketCollection = prevState.talkTicketCollection;
        _talkTicket = _talkTicketCollection[action.talkTicketKey];

        _messages = _talkTicket.room.messages.concat([
          geneCommonMessage("alert"),
        ]);
        _talkTicketCollection[action.talkTicketKey].room.messages = _messages;

        asyncStoreTalkTicketCollection(_talkTicketCollection);
        return {
          ...prevState,
          talkTicketCollection: _talkTicketCollection,
        };
      } else return { ...prevState };
    }

    case "END_TALK": {
      /** end talk. messages, offlineMessagesの削除, unreadNum, totalUnreadNumの変更., ws.close()
       * @param {Object} action [type, talkTicketKey, (timeOut)] */

      _talkTicketCollection = prevState.talkTicketCollection;
      _talkTicket = _talkTicketCollection[action.talkTicketKey];

      _talkTicket.room.messages = [
        ..._talkTicket.room.messages,
        ...[
          geneCommonMessage(
            "end",
            _talkTicket.room.user.name,
            Boolean(action.timeOut)
          ),
        ],
      ];
      _talkTicket.room.offlineMessages = [];
      _talkTicket.room.isEnd = true;
      _talkTicket.room.ws && closeWsSafely(_talkTicket.room.ws);

      _talkTicketCollection[action.talkTicketKey] = _talkTicket;
      asyncStoreTalkTicketCollection(_talkTicketCollection);
      return {
        ...prevState,
        talkTicketCollection: _talkTicketCollection,
      };
    }

    case "APPEND_OFFLINE_MESSAGE": {
      /** offlineMessageを作成し、追加
       * @param {Object} action [type, talkTicketKey, messageId, messageText] */

      const offlineMessage: OfflineMessage = {
        messageId: action.messageId,
        message: action.messageText,
        isMe: true,
      };

      _talkTicketCollection = prevState.talkTicketCollection;
      _talkTicket = _talkTicketCollection[action.talkTicketKey];

      _offlineMessages = _talkTicket.room.offlineMessages.concat([
        offlineMessage,
      ]);
      _talkTicketCollection[
        action.talkTicketKey
      ].room.offlineMessages = _offlineMessages;

      asyncStoreTalkTicketCollection(_talkTicketCollection);
      return {
        ...prevState,
        talkTicketCollection: _talkTicketCollection,
      };
    }

    case "READ_BY_ROOM": {
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
    }

    case "OVERWRITE_TALK_TICKET": {
      /** 強制的にtalkTicketを上書き. 既存のtalkTicketが削除されるので、トークが完全に終了している場合のみに使用。
       * @param {Object} action [type, talkTicket] */

      _talkTicketCollection = prevState.talkTicketCollection;
      const talkTicketJson = action.talkTicket;
      if (talkTicketJson.room === null) {
        talkTicketJson.room = { ...initRoomBase, ...initRoomAdd };
      } else {
        talkTicketJson.room = { ...talkTicketJson.room, ...initRoomAdd };
      }

      if (talkTicketJson.room && !isRoom(talkTicketJson.room)) {
        return { ...prevState };
      }
      if (!isTalkTicket(talkTicketJson)) {
        return { ...prevState };
      }

      if (talkTicketJson.status.key === "waiting") {
        talkTicketJson.room.messages = [geneCommonMessage("waiting")];
      } else if (talkTicketJson.status.key === "stopping") {
        talkTicketJson.room.messages = [geneCommonMessage("stopping")];
      }
      _talkTicketCollection[talkTicketJson.worry.key] = talkTicketJson;

      asyncStoreTalkTicketCollection(_talkTicketCollection);

      return {
        ...prevState,
        talkTicketCollection: _talkTicketCollection,
      };
    }

    case "REMOVE_TALK_TICKETS": {
      /** talkTicketsを削除
       * @param {Object} action [type, talkTicketKeys] */

      _talkTicketCollection = prevState.talkTicketCollection;

      action.talkTicketKeys.forEach((talkTicketKey) => {
        _talkTicket = _talkTicketCollection[talkTicketKey];
        if (
          isObject(_talkTicket.room?.ws) &&
          Object.keys(_talkTicket.room?.ws).length
        ) {
          // null || {} の場合があり得る
          closeWsSafely(_talkTicket.room.ws);
        }
        delete _talkTicketCollection[talkTicketKey];
      });

      asyncStoreTalkTicketCollection(_talkTicketCollection);
      return {
        ...prevState,
        talkTicketCollection: _talkTicketCollection,
      };
    }

    default:
      console.warn(`Not found thi action.type.`);
      return { ...prevState };
  }
};

const initRoomBase: RoomJson = Object.freeze({
  id: "",
  user: initProfile,
  startedAt: "",
  endedAt: "",
  isAlert: false,
  isTimeOut: false,
});

const initRoomAdd: RoomAdd = Object.freeze({
  messages: [],
  offlineMessages: [],
  unreadNum: 0,
  ws: null,
  isEnd: false,
});

const geneCommonMessage = (type: string, userName = "", timeOut = false) => {
  const message: CommonMessage = {
    messageId: "0",
    message: "",
    time: new Date(Date.now()),
    common: true,
  };
  switch (type) {
    case "initSpeak": {
      message["messageId"] = "0";
      message[
        "message"
      ] = `話し相手が見つかりました！${userName}さんに話を聞いてもらいましょう。`;
      break;
    }
    case "initListen": {
      message["messageId"] = "0";
      message[
        "message"
      ] = `話し相手が見つかりました！${userName}さんのお話を聞いてあげましょう。`;
      break;
    }
    case "alert": {
      message["messageId"] = "2";
      message["message"] = "残り5分で自動退室となります。";
      break;
    }
    case "end": {
      message["messageId"] = "-1";
      if (timeOut) {
        message["message"] =
          "トークが開始されてから2週間が経過したため、自動退室されました。右上のボタンからトークを更新または終了してください。";
      } else {
        message[
          "message"
        ] = `${userName}さんが退室しました。右上のボタンからトークを更新または終了してください。`;
      }
      break;
    }
    case "waiting": {
      const now = new Date();
      const hour = now.getHours();
      const min = (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();
      message["messageId"] = "0";
      message["message"] = `話し相手を探し中...。（最終更新：${hour}:${min}）`;
      break;
    }
    case "stopping": {
      message["messageId"] = "0";
      message["message"] = "ただいま話し相手の検索を停止しています。";
      break;
    }
  }
  return message;
};

const ChatStateContext = createContext<ChatState>({
  totalUnreadNum: 0,
  talkTicketCollection: {},
});
const ChatDispatchContext = createContext<ChatDispatch>(() => {
  return void 0;
});

export const useChatState = (): ChatState => {
  const context = useContext(ChatStateContext);
  return context;
};
export const useChatDispatch = (): ChatDispatch => {
  const context = useContext(ChatDispatchContext);
  return context;
};

type Props = {
  talkTicketCollection: TalkTicketCollection;
};
export const ChatProvider: React.FC<Props> = ({
  children,
  talkTicketCollection,
}) => {
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
