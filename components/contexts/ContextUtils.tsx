import { Dispatches, States } from "../types/Types.context";
import { useAuthDispatch, useAuthState } from "./AuthContext";
import { useChatDispatch, useChatState } from "./ChatContext";
import { useProfileDispatch, useProfileState } from "./ProfileContext";

const useAllContext = (): [States, Dispatches] => {
  const states: States = {
    authState: useAuthState(),
    profileState: useProfileState(),
    chatState: useChatState(),
  };
  const dispatches: Dispatches = {
    authDispatch: useAuthDispatch(),
    profileDispatch: useProfileDispatch(),
    chatDispatch: useChatDispatch(),
  };

  return [states, dispatches];
};

export default useAllContext;
