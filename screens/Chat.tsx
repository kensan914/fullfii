import React from "react";
import { useRoute } from "@react-navigation/native";

import ChatTemplate from "../components/templates/ChatTemplate";
import { useAuthState } from "../components/contexts/AuthContext";
import {
  useChatState,
  useChatDispatch,
} from "../components/contexts/ChatContext";
import {
  AppendOfflineMessage,
  ChatRouteProp,
  SendWsMessage,
} from "../components/types/Types";

const Chat: React.FC = () => {
  const route = useRoute<ChatRouteProp>();
  const talkTicketKey = route.params.talkTicketKey;
  const talkTicketCollection = useChatState().talkTicketCollection;
  const talkTicket = talkTicketCollection[talkTicketKey];

  const chatDispatch = useChatDispatch();
  const authState = useAuthState();

  if (talkTicket) {
    const user = talkTicket.room.user;
    const messages = talkTicket.room.messages;
    const offlineMessages = talkTicket.room.offlineMessages;
    const ws = talkTicket.room.ws;
    const isEnd = talkTicket.room.isEnd;

    const appendOfflineMessage: AppendOfflineMessage = (
      messageId,
      messageText
    ) => {
      chatDispatch({
        type: "APPEND_OFFLINE_MESSAGE",
        talkTicketKey,
        messageId,
        messageText,
      });
    };

    return (
      <ChatTemplate
        user={user}
        messages={messages.concat(offlineMessages)}
        ws={ws}
        appendOfflineMessage={appendOfflineMessage}
        sendWsMessage={sendWsMessage}
        token={authState.token}
        talkTicketKey={talkTicketKey}
        isEnd={isEnd}
      />
    );
  } else return <></>;
};

export default Chat;

const sendWsMessage: SendWsMessage = (ws, messageId, messageText, token) => {
  ws.send(
    JSON.stringify({
      type: "chat_message",
      message_id: messageId,
      message: messageText,
      token,
    })
  );
};
