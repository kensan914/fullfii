import React, { useState, useEffect } from "react";
import ChatTemplate from "../componentsEx/templates/ChatTemplate";
import { URLJoin } from "../componentsEx/tools/support";
import { BASE_URL_WS } from "../constantsEx/env";
import { useAuthState } from "../componentsEx/tools/authContext";


const Chat = (props) => {
  const [messages, setMessages] = useState(
    [
      {
        id: 0,
        message: "最初のメッセージを送りましょう。",
        common: true,
      }
    ]
  );
  const [offlineMessages, setOfflineMessages] = useState([]);
  const [ws, setWs] = useState();
  const [receivedMsgData, setReceivedMsgData] = useState();
  const authState = useAuthState();

  useEffect(() => {
    connectWsChat(setWs, setReceivedMsgData, "test/", authState.token);
  }, []);

  useEffect(() => {
    if (receivedMsgData) mergeReceivedMsgData(receivedMsgData, messages, pushMessage, offlineMessages, setOfflineMessages);

    //
    if (receivedMsgData) console.log(receivedMsgData);
  }, [receivedMsgData]);


  const pushMessage = (messageData) => {
    const date = new Date(messageData.time);
    const newMessages = messages.concat([{
      id: messageData.id,
      message: messageData.message,
      me: messageData.me,
      time: date.toLocaleString("ja", { hour: "2-digit", minute: "numeric" }),
    }]);

    setMessages(newMessages);
  }

  const pushOfflineMessage = (id, message) => {
    const newOfflineMessages = offlineMessages.concat([{
      id: id,
      message: message,
      me: true,
    }]);

    setOfflineMessages(newOfflineMessages);
  }

  return (
    <ChatTemplate {...props} messages={messages.concat(offlineMessages)} ws={ws} pushOfflineMessage={pushOfflineMessage}
      sendWsMesssage={sendWsMesssage} token={authState.token} />
  );
}

export default Chat;


const connectWsChat = (setWs, setReceivedMsgData, roomID, token) => {
  const url = URLJoin(BASE_URL_WS, "chat/", roomID);

  let ws = new WebSocket(url);
  ws.onopen = (e) => {
    alert("websocket接続が完了しました(chat)");
    ws.send(JSON.stringify({ type: "auth", token: token }));
  };
  ws.onmessage = (e) => {
    const receivedMsgData = JSON.parse(e.data);
    if (receivedMsgData.type === "auth") {
      console.log("websocket認証OK(chat)");
      console.log(receivedMsgData);
    }
    if (receivedMsgData.type === "chat_message") setReceivedMsgData(receivedMsgData);
  };
  ws.onclose = (e) => {
    alert("切断されました(chat)");
    if (e.wasClean) {
    } else {
      // e.g. サーバのプロセスが停止、あるいはネットワークダウン
      // この場合、event.code は通常 1006 になります
    }
  };

  setWs(ws);
}

const sendWsMesssage = (ws, id, message, token) => {
  ws.send(JSON.stringify({ id: id, message: message, token: token }));
}

const mergeReceivedMsgData = (receivedMsgData, messages, pushMessage, offlineMessages, setOfflineMessages) => {
  if (receivedMsgData.me) {
    // pushMessage → offlineMessagesの該当messageを削除
    const offlineMsgIDs = offlineMessages.map((offlineMessage) => offlineMessage.id)
    if (offlineMsgIDs.indexOf(receivedMsgData.id) >= 0) {
      pushMessage(receivedMsgData);
      const newOfflineMessages = offlineMessages.filter(elm => elm.id !== receivedMsgData.id);
      setOfflineMessages(newOfflineMessages);
    } else {

    }
  } else {
    pushMessage(receivedMsgData);
  }
}