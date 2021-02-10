import React from "react";
import ChatTemplate from "../components/templates/ChatTemplate";
import { useAuthState } from "../components/contexts/AuthContext";
import {
  useChatState,
  useChatDispatch,
} from "../components/contexts/ChatContext";

const Chat = (props) => {
  const talkTicketKey = props.route.params.talkTicketKey;
  const talkTicket = useChatState().talkTicketCollection[talkTicketKey];

  const chatDispatch = useChatDispatch();
  const authState = useAuthState();

  if (talkTicket) {
    const user = talkTicket.room.user;
    const messages = talkTicket.room.messages;
    const offlineMessages = talkTicket.room.offlineMessages;
    const ws = talkTicket.room.ws;
    const isEnd = talkTicket.room.isEnd;

    const appendOfflineMessage = (messageID, message) => {
      chatDispatch({
        type: "APPEND_OFFLINE_MESSAGE",
        talkTicketKey,
        messageID,
        message,
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

const sendWsMessage = (ws, messageID, message, token) => {
  ws.send(
    JSON.stringify({
      type: "chat_message",
      message_id: messageID,
      message,
      token,
    })
  );
};
