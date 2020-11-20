import React, { useEffect } from "react";
import { Block } from "galio-framework";

import { requestGetProfile, requestGetProfileParams } from "./Profile";
import { connectWsNotification } from "./Notification";
import { useAuthState, useAuthDispatch } from "../components/contexts/AuthContext";
import { useProfileDispatch, useProfileState } from "../components/contexts/ProfileContext";
import { useNotificationDispatch, useNotificationState } from "../components/contexts/NotificationContext";
import { useChatDispatch, useChatState } from "../components/contexts/ChatContext";
import { resumeTalk } from "./Talk";
import { exeIntroStep } from "../components/modules/support";
import { requestPatchProfile } from "./ProfileInput";
import useAllContext from "../components/contexts/ContextUtils";


const Manager = (props) => {
  const { children } = props;
  // const dispatches = {
  //   authDispatch: useAuthDispatch(),
  //   profileDispatch: useProfileDispatch(),
  //   notificationDispatch: useNotificationDispatch(),
  //   chatDispatch: useChatDispatch(),
  // }
  // const states = {
  //   authState: useAuthState(),
  //   profileState: useProfileState(),
  //   notificationState: useNotificationState(),
  //   chatState: useChatState(),
  // }
  const [states, dispatches] = useAllContext();

  useEffect(() => {
    startUpLogind(states.authState.token, dispatches, states);
  }, []);

  return (
    <Block flex>
      {children}
    </Block>
  );
}

export default Manager;


// ログイン済みでアプリを起動した時、またはsignin成功時に実行
export const startUpLogind = (token, dispatches, states) => {
  if (typeof token !== "undefined") {
    requestGetProfile(token, dispatches.profileDispatch);
    requestGetProfileParams(token, dispatches.profileDispatch);
    connectWsNotification(token, states, dispatches);
    resumeTalk(token, states, dispatches);
    exeIntroStep(1, dispatches.profileDispatch, states.profileState, requestPatchProfile, token);
  }
}