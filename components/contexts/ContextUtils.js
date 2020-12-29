import { useAuthDispatch, useAuthState } from "./AuthContext"
import { useChatDispatch, useChatState } from "./ChatContext"
import { useNotificationDispatch, useNotificationState } from "./NotificationContext"
import { useProductDispatch, useProductState } from "./ProductContext"
import { useProfileDispatch, useProfileState } from "./ProfileContext"


const useAllContext = () => {
  const dispatches = {
    authDispatch: useAuthDispatch(),
    profileDispatch: useProfileDispatch(),
    notificationDispatch: useNotificationDispatch(),
    chatDispatch: useChatDispatch(),
    productDispatch: useProductDispatch(),
  }
  const states = {
    authState: useAuthState(),
    profileState: useProfileState(),
    notificationState: useNotificationState(),
    chatState: useChatState(),
    productState: useProductState(),
  }

  return [states, dispatches];
}

export default useAllContext;
