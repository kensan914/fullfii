import React, { useEffect } from "react";
import { Block } from "galio-framework";

import { requestGetProfile, requestGetProfileParams } from "./Profile";
import { conectWsNotification } from "./Notification";
import { useAuthState, useAuthDispatch } from "../componentsEx/contexts/AuthContext";
import { useProfileDispatch } from "../componentsEx/contexts/ProfileContext";
import { useNotificationDispatch } from "../componentsEx/contexts/NotificationContext";
import { useChatDispatch } from "../componentsEx/contexts/ChatContext";

const Manager = (props) => {
  const { children } = props;
  const authState = useAuthState();
  const dispatches = {
    authDispatch: useAuthDispatch(),
    profileDispatch: useProfileDispatch(),
    notificationDispatch: useNotificationDispatch(),
    chatDispatch: useChatDispatch(),
  }

  useEffect(() => {
    startUpLogind(authState.token, dispatches);
  }, []);

  return (
    <Block flex>
      {children}
    </Block>
  );
}

export default Manager;


// ログイン済みでアプリを起動した時、またはsignin成功時に実行
export const startUpLogind = (token, dispatches) => {
  if (typeof token !== "undefined") {
    requestGetProfile(token, dispatches.profileDispatch);
    requestGetProfileParams(token, dispatches.profileDispatch);
    conectWsNotification(token, dispatches.notificationDispatch, dispatches.chatDispatch);
  }
}