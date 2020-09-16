import React from "react";
import ChatTemplate from "../componentsEx/templates/ChatTemplate";
import { useAuthState } from "../componentsEx/contexts/AuthContext";
import { useChatState, useChatDispatch } from "../componentsEx/contexts/ChatContext";


const Chat = (props) => {
  const roomID = props.route.params.roomID;
  const talkObj = useChatState().talkCollection[roomID];
  const user = talkObj.user;
  const messages = talkObj.messages;
  const offlineMessages = talkObj.offlineMessages;
  const ws = talkObj.ws;

  const chatDispatch = useChatDispatch();
  const authState = useAuthState();

  const appendOfflineMessage = (messageID, message) => {
    chatDispatch({ type: "APPEND_OFFLINE_MESSAGE", roomID: roomID, messageID: messageID, message: message });
  }

  return (
    <ChatTemplate user={user} messages={messages.concat(offlineMessages)} ws={ws} appendOfflineMessage={appendOfflineMessage}
      sendWsMesssage={sendWsMesssage} token={authState.token} />
  );
}

export default Chat;


const sendWsMesssage = (ws, messageID, message, token) => {
  ws.send(JSON.stringify({ type: "chat_message", message_id: messageID, message: message, token: token }));
}