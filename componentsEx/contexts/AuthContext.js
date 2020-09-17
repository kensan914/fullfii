import React, { createContext, useReducer, useContext } from "react";
import { asyncStoreItem, asyncRemoveAll } from "../tools/support";


const authReducer = (prevState, action) => {
  switch (action.type) {
    case "START_SIGNIN":
      /** signin開始
       * @param {Object} action [type] */

      return {
        ...prevState,
        status: "Loading",
      };
    case "COMPLETE_SIGNIN":
      /** state関連の初期化 signin時に実行
       * @param {Object} action [type, token, startUpLogind] */

      asyncStoreItem("token", action.token);
      action.startUpLogind();
      return {
        ...prevState,
        status: "Authenticated",
        token: action.token,
      };
    case "COMPLETE_LOGOUT":
      /** state関連の削除処理 logout時に実行
       * @param {Object} action [type, notificationDispatch, chatDispatch] */

      asyncRemoveAll();
      action.notificationDispatch({ type: "RESET" });
      action.chatDispatch({ type: "RESET" });
      return {
        ...prevState,
        status: "Unauthenticated",
        token: undefined,
      };
    default:
      console.warn(`Not found "${action.type}" action.type.`);
      return;
  }
};

const AuthStateContext = createContext({
  status: "Unauthenticated",
  token: undefined,
});
const AuthDispatchContext = createContext(undefined);

export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  return context;
};
export const useAuthDispatch = () => {
  const context = useContext(AuthDispatchContext);
  return context;
};

export const AuthProvider = ({ children, token }) => {
  const [authState, authDispatch] = useReducer(authReducer, {
    status: token ? "Authenticated" : "Unauthenticated",
    token: token ? token : undefined,
  });

  return (
    <AuthStateContext.Provider value={authState}>
      <AuthDispatchContext.Provider value={authDispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};