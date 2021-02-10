import React, { useEffect } from "react";
import { Block } from "galio-framework";

import useAllContext from "../components/contexts/ContextUtils";
import { BASE_URL, BASE_URL_WS } from "../constants/env";
import {
  deepCvtKeyFromSnakeToCamel,
  initWs,
  URLJoin,
  asyncGetJson,
} from "../components/modules/support";
import authAxios from "../components/modules/axios";

const StartUpManager = (props) => {
  const { children } = props;
  const [states, dispatches] = useAllContext();

  useEffect(() => {
    startUpLoggedin(states.authState.token, states, dispatches);
  }, []);

  return <Block flex>{children}</Block>;
};

export default StartUpManager;

/**
 * ログイン済みでアプリを起動した時、またはsignup成功時に実行 */
export const startUpLoggedin = (token, states, dispatches) => {
  if (typeof token !== "undefined") {
    requestGetProfile(token, dispatches.profileDispatch);
    // requestGetProfileParams(token, dispatches.profileDispatch);
    connectWsNotification(token, states, dispatches);
    updateTalk(token, states, dispatches);
  }
};

const requestGetProfile = (token, profileDispatch) => {
  authAxios(token)
    .get(URLJoin(BASE_URL, "me/"))
    .then((res) => {
      profileDispatch({ type: "SET_ALL", profile: res.data });
    })
    .catch((err) => {
      console.error(err.response);
    });
};

/**
 * me/talk-info/をgetし、最新のtalk_tickets情報を更新。wsのconnect。
 * @param {*} token
 * @param {*} states
 * @param {*} dispatches
 */
const updateTalk = (token, states, dispatches) => {
  authAxios(token)
    .get(URLJoin(BASE_URL, "me/talk-info/"))
    .then(async (res) => {
      const resData = deepCvtKeyFromSnakeToCamel(res.data);
      const talkTickets = resData["talkTickets"];

      // connect wsChat
      const prevTalkTicketCollection = await asyncGetJson(
        "talkTicketCollection"
      );
      if (prevTalkTicketCollection) {
        // 毎起動時
        talkTickets
          .filter((talkTicket) => talkTicket.status.key === "talking")
          .forEach((talkTicket) => {
            if (
              prevTalkTicketCollection[talkTicket.worry.key]?.status?.key ===
              "talking"
            ) {
              // 既にトークは開始されているが、wsは接続されていない
              if (
                !states.chatState.talkTicketCollection[talkTicket.worry.key]
                  .room.ws
              )
                reconnectWsChat(
                  talkTicket.room?.id,
                  token,
                  states,
                  dispatches,
                  talkTicket.worry.key
                );
            } else {
              // トークが開始されていない
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
          });

        talkTickets
          .filter((talkTicket) => talkTicket.status.key !== "talking")
          .forEach((talkTicket) => {
            if (
              prevTalkTicketCollection[talkTicket.worry.key].status.key ===
              "talking"
            ) {
              // 既にトークは開始されているが、バックでは終了している
              dispatches.chatDispatch({
                type: "OVERWRITE_TALK_TICKET",
                talkTicket: talkTicket,
              });
            }
          });

        Object.keys(prevTalkTicketCollection).forEach((key) => {
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
            initConnectWsChat(
              talkTicket.room.id,
              token,
              states,
              dispatches,
              talkTicket.worry.key
            );
          });
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

const handleChatMessage = (
  data,
  chatState,
  chatDispatch,
  token,
  talkTicketKey
) => {
  if (data.type === "chat_message") {
    // const roomID = data.room_id;
    const messageID = data.message.message_id;
    const message = data.message.message;
    const isMe = data.message.is_me;
    const time = data.message.time;

    // (謎)chatStateが更新されない←原因は救命できていない。talkTicketCollectionはObjectでアドレスは一定しているので成り立っている。
    const talkTicket = chatState.talkTicketCollection[talkTicketKey];
    const offlineMessages = talkTicket.room.offlineMessages;

    if (isMe) {
      // appendMessage → offlineMessagesの該当messageを削除
      const offlineMsgIDs = offlineMessages.map(
        (offlineMessage) => offlineMessage.id
      );
      if (offlineMsgIDs.indexOf(messageID) >= 0) {
        chatDispatch({
          type: "APPEND_MESSAGE",
          talkTicketKey,
          messageID,
          message,
          isMe,
          time,
          token,
        });
        chatDispatch({
          type: "DELETE_OFFLINE_MESSAGE",
          talkTicketKey,
          messageID,
        });
      } else {
      }
    } else {
      chatDispatch({
        type: "APPEND_MESSAGE",
        talkTicketKey,
        messageID,
        message,
        isMe,
        time,
        token,
      });
    }
  } else if (data.type === "multi_chat_messages") {
    // const roomID = data.room_id;
    const messages = data.messages;
    chatDispatch({ type: "MERGE_MESSAGES", talkTicketKey, messages, token });
  }
};

/**
 * response talk request.
 * If you are a request user and you are starting a talk, init is true. */
const _connectWsChat = (wsProps) => {
  const {
    roomID,
    token,
    states,
    dispatches,
    init,
    callbackSuccess,
    talkTicketKey,
  } = wsProps;

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
          if (data.message) alert(data.message);
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
    onclose: (e, ws) => {},
  };

  initWs(wsSettings, dispatches);
};

const initConnectWsChat = (
  roomID,
  token,
  states,
  dispatches,
  talkTicketKey
) => {
  _connectWsChat({
    roomID,
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

const reconnectWsChat = (roomID, token, states, dispatches, talkTicketKey) => {
  if (roomID) {
    _connectWsChat({
      roomID,
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

const connectWsNotification = (token, states, dispatches) => {
  const wsSettings = {
    url: URLJoin(BASE_URL_WS, "notification/"),

    onopen: (e, ws) => {
      ws.send(JSON.stringify({ type: "auth", token: token }));
    },
    onmessage: (e, ws, isReconnect) => {
      const data = JSON.parse(e.data);

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
    onclose: (e, ws) => {},

    registerWs: (ws) => {
      dispatches.notificationDispatch({ type: "SET_WS", ws: ws });
    },
  };

  initWs(wsSettings, dispatches);
};
