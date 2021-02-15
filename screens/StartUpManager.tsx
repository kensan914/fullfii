import React, { useEffect } from "react";
import { Block } from "galio-framework";

import useAllContext from "../components/contexts/ContextUtils";
import { BASE_URL, BASE_URL_WS } from "../constants/env";
import {
  initWs,
  URLJoin,
  asyncGetJson,
  closeWsSafely,
} from "../components/modules/support";
import requestAxios from "../components/modules/axios";
import {
  Dispatches,
  MeProfile,
  ProfileDispatch,
  MeProfileIoTs,
  States,
  TalkInfoJson,
  TalkInfoJsonIoTs,
  TalkTicketCollectionJson,
  TalkTicketCollectionJsonIoTs,
  ChatState,
  ChatDispatch,
  TalkTicketKey,
} from "../components/types/Types.context";
import {
  WsResChat,
  WsResChatIoTs,
  WsSettings,
  WsResNotificationIoTs,
  WsResNotification,
} from "../components/types/Types";
import { Alert } from "react-native";

const StartUpManager: React.FC = (props) => {
  const { children } = props;
  const [states, dispatches] = useAllContext();

  useEffect(() => {
    states.authState.token &&
      startUpLoggedin(states.authState.token, states, dispatches);
  }, []);

  return <Block flex>{children}</Block>;
};

export default StartUpManager;

/**
 * ログイン済みでアプリを起動した時、またはsignup成功時に実行 */
export const startUpLoggedin = (
  token: string,
  states: States,
  dispatches: Dispatches
): void => {
  if (typeof token !== "undefined") {
    requestGetProfile(token, dispatches.profileDispatch);
    connectWsNotification(token, states, dispatches);
    updateTalk(token, states, dispatches);
  }
};

const requestGetProfile = (
  token: string,
  profileDispatch: ProfileDispatch
): void => {
  requestAxios(URLJoin(BASE_URL, "me/"), "get", MeProfileIoTs, {
    token: token,
    thenCallback: (resData) => {
      profileDispatch({ type: "SET_ALL", profile: resData as MeProfile });
    },
  });
};

/**
 * me/talk-info/をgetし、最新のtalk_tickets情報を更新。wsのconnect。
 * @param token
 * @param states
 * @param dispatches
 */
const updateTalk = (token: string, states: States, dispatches: Dispatches) => {
  requestAxios(URLJoin(BASE_URL, "me/talk-info/"), "get", TalkInfoJsonIoTs, {
    token: token,
    thenCallback: async (resData) => {
      const _resData = resData as TalkInfoJson;
      const talkTickets = _resData["talkTickets"];

      // connect wsChat
      const prevTalkTicketCollection = await asyncGetJson(
        "talkTicketCollection",
        TalkTicketCollectionJsonIoTs
      );
      if (prevTalkTicketCollection) {
        // 毎起動時
        const _prevTalkTicketCollection = prevTalkTicketCollection as TalkTicketCollectionJson;
        talkTickets
          .filter((talkTicket) => talkTicket.status.key === "talking")
          .forEach((talkTicket) => {
            if (
              _prevTalkTicketCollection[talkTicket.worry.key].status.key ===
              "talking"
            ) {
              // 既にトークは開始されているが、wsは接続されていない
              if (
                !states.chatState.talkTicketCollection[talkTicket.worry.key]
                  .room.ws
              )
                if (talkTicket.room)
                  reconnectWsChat(
                    talkTicket.room.id,
                    token,
                    states,
                    dispatches,
                    talkTicket.worry.key
                  );
            } else {
              // トークが開始されていない
              if (talkTicket.room) {
                dispatches.chatDispatch({
                  type: "UPDATE_TALK_TICKETS",
                  talkTickets: [talkTicket],
                });
                initConnectWsChat(
                  talkTicket.room.id,
                  token,
                  states,
                  dispatches,
                  talkTicket.worry.key
                );
              }
            }
          });

        talkTickets
          .filter((talkTicket) => talkTicket.status.key !== "talking")
          .forEach((talkTicket) => {
            if (
              _prevTalkTicketCollection[talkTicket.worry.key].status.key ===
              "talking"
            ) {
              // 既にトークは開始されているが、バックでは終了している
              dispatches.chatDispatch({
                type: "OVERWRITE_TALK_TICKET",
                talkTicket: talkTicket,
              });
            }
          });

        Object.keys(_prevTalkTicketCollection).forEach((key) => {
          if (!talkTickets.some((talkTicket) => talkTicket.worry.key === key)) {
            dispatches.chatDispatch({
              type: "REMOVE_TALK_TICKETS",
              talkTicketKeys: [key],
            });
          }
        });
      } else {
        // signup直後一回のみ
        dispatches.chatDispatch({
          type: "UPDATE_TALK_TICKETS",
          talkTickets: talkTickets,
        });
        talkTickets
          .filter((talkTicket) => talkTicket.status.key === "talking")
          .forEach((talkTicket) => {
            if (talkTicket.room) {
              initConnectWsChat(
                talkTicket.room.id,
                token,
                states,
                dispatches,
                talkTicket.worry.key
              );
            }
          });
      }
    },
  });
};

const handleChatMessage = (
  data: WsResChat,
  chatState: ChatState,
  chatDispatch: ChatDispatch,
  token: string,
  talkTicketKey: TalkTicketKey
) => {
  if (data.type === "chat_message") {
    const { messageId, message, isMe, time } = data.message;

    // (謎)chatStateが更新されない←原因は救命できていない。talkTicketCollectionはObjectでアドレスは一定しているので成り立っている。
    const talkTicket = chatState.talkTicketCollection[talkTicketKey];
    const offlineMessages = talkTicket.room.offlineMessages;

    if (isMe) {
      // appendMessage → offlineMessagesの該当messageを削除
      const offlineMsgIDs = offlineMessages.map(
        (offlineMessage) => offlineMessage.messageId
      );
      if (offlineMsgIDs.indexOf(messageId) >= 0) {
        chatDispatch({
          type: "APPEND_MESSAGE",
          talkTicketKey,
          messageId: messageId,
          message,
          isMe,
          time,
          token,
        });
        chatDispatch({
          type: "DELETE_OFFLINE_MESSAGE",
          talkTicketKey,
          messageId: messageId,
        });
      } else {
        chatDispatch({
          type: "APPEND_MESSAGE",
          talkTicketKey,
          messageId: messageId,
          message,
          isMe,
          time,
          token,
        });
      }
    }
  }
  // TODO: ネストの深さ変更・要確認
  else if (data.type === "multi_chat_messages") {
    const messages = data.messages;
    chatDispatch({ type: "MERGE_MESSAGES", talkTicketKey, messages, token });
  }
};

type WsProps = {
  roomId: string;
  token: string;
  states: States;
  dispatches: Dispatches;
  init: boolean;
  callbackSuccess: (data: WsResChat, ws: WebSocket) => void;
  talkTicketKey: string;
};
/**
 * response talk request.
 * If you are a request user and you are starting a talk, init is true. */
const _connectWsChat = (wsProps: WsProps) => {
  const {
    roomId,
    token,
    states,
    dispatches,
    init,
    callbackSuccess,
    talkTicketKey,
  } = wsProps;

  const wsSettings: WsSettings = {
    url: URLJoin(BASE_URL_WS, "chat/", roomId),
    typeIoTsOfResData: WsResChatIoTs,
    onopen: (ws: WebSocket) => {
      ws.send(JSON.stringify({ type: "auth", token: token, init: init }));
    },
    onmessage: (eData, e, ws, isReconnect) => {
      const data = eData as WsResChat;
      switch (data.type) {
        case "auth":
          if (isReconnect) {
            dispatches.chatDispatch({
              type: "RECONNECT_TALK",
              ws,
              talkTicketKey,
            });
          } else {
            callbackSuccess(data, ws);
          }
          dispatches.profileDispatch({
            type: "SET_ALL",
            profile: data.profile,
          });
          break;

        case "end_talk_alert":
          dispatches.profileDispatch({
            type: "SET_ALL",
            profile: data.profile,
          });
          dispatches.chatDispatch({
            type: "APPEND_COMMON_MESSAGE",
            talkTicketKey,
            alert: true,
          });
          break;

        case "end_talk_time_out":
          dispatches.profileDispatch({
            type: "SET_ALL",
            profile: data.profile,
          });
          dispatches.chatDispatch({
            type: "END_TALK",
            talkTicketKey,
            timeOut: true,
          });
          break;

        case "end_talk":
          dispatches.profileDispatch({
            type: "SET_ALL",
            profile: data.profile,
          });
          dispatches.chatDispatch({ type: "END_TALK", talkTicketKey });
          break;

        case "error":
          data;
          if (data.message) Alert.alert(data.message);
          closeWsSafely(ws);
          break;

        default:
          break;
      }
      handleChatMessage(
        data,
        states.chatState,
        dispatches.chatDispatch,
        token,
        talkTicketKey
      );
    },
    onclose: () => {
      return void 0;
    },
  };

  initWs(wsSettings);
};

const initConnectWsChat = (
  roomId: string,
  token: string,
  states: States,
  dispatches: Dispatches,
  talkTicketKey: TalkTicketKey
) => {
  _connectWsChat({
    roomId,
    token,
    states,
    dispatches,
    init: true,
    callbackSuccess: (data, ws) => {
      dispatches.chatDispatch({ type: "START_TALK", talkTicketKey, ws });
    },
    talkTicketKey,
  });
};

const reconnectWsChat = (
  roomId: string,
  token: string,
  states: States,
  dispatches: Dispatches,
  talkTicketKey: TalkTicketKey
) => {
  if (roomId) {
    _connectWsChat({
      roomId: roomId,
      token,
      states,
      dispatches,
      init: false,
      callbackSuccess: (data, ws) => {
        dispatches.chatDispatch({ type: "RESTART_TALK", talkTicketKey, ws });
      },
      talkTicketKey,
    });
  } else {
    // 相手が退出していた場合, talking statusだがroomがnullなため
    dispatches.chatDispatch({
      type: "RESTART_TALK_ONLY_MESSAGE",
      talkTicketKey,
    });
  }
};

const connectWsNotification = (
  token: string,
  states: States,
  dispatches: Dispatches
) => {
  const wsSettings: WsSettings = {
    url: URLJoin(BASE_URL_WS, "notification/"),
    typeIoTsOfResData: WsResNotificationIoTs,
    onopen: (ws) => {
      ws.send(JSON.stringify({ type: "auth", token: token }));
    },
    onmessage: (eData) => {
      const data = eData as WsResNotification;
      if (data.type === "auth") {
        dispatches.profileDispatch({ type: "SET_ALL", profile: data.profile });
      } else if (data.type === "notice_talk") {
        if (data.status === "start") {
          updateTalk(token, states, dispatches);
        } else if (data.status === "end") {
          // end 多分使わない？
        }
      }
    },
    onclose: () => {
      return void 0;
    },
  };

  initWs(wsSettings);
};
