import React, { useEffect } from "react";
import { Block } from "galio-framework";

import { requestGetProfile, requestGetProfileParams } from "./Profile";
import { connectWsNotification } from "./Notification";
import { useAuthState, useAuthDispatch } from "../components/contexts/AuthContext";
import { useProfileDispatch } from "../components/contexts/ProfileContext";
import { useNotificationDispatch } from "../components/contexts/NotificationContext";
import { useChatDispatch, useChatState } from "../components/contexts/ChatContext";
import { resumeTalk } from "./Talk";


const Manager = (props) => {
  const { children } = props;
  const authState = useAuthState();
  const chatState = useChatState();
  const dispatches = {
    authDispatch: useAuthDispatch(),
    profileDispatch: useProfileDispatch(),
    notificationDispatch: useNotificationDispatch(),
    chatDispatch: useChatDispatch(),
  }

  useEffect(() => {
    startUpLogind(authState.token, dispatches, chatState);
  }, []);

  return (
    <Block flex>
      {children}
    </Block>
  );
}

export default Manager;


// ログイン済みでアプリを起動した時、またはsignin成功時に実行
export const startUpLogind = (token, dispatches, chatState) => {
  if (typeof token !== "undefined") {
    requestGetProfile(token, dispatches.profileDispatch);
    requestGetProfileParams(token, dispatches.profileDispatch);
    connectWsNotification(token, dispatches.notificationDispatch, dispatches.profileDispatch, chatState, dispatches.chatDispatch);
    resumeTalk(token, chatState, dispatches.chatDispatch, dispatches.profileDispatch);
    // reconnectWsChat(token, chatState, dispatches.chatDispatch);
    // requestGetTalkInfo(token, chatState, dispatches.chatDispatch);
  }
}