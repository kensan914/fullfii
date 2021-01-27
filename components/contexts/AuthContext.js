import React, { createContext, useReducer, useContext } from "react";
import { asyncStoreItem, asyncRemoveAll, asyncRemoveItem, asyncStoreJson } from "../modules/support";


const authReducer = (prevState, action) => {
  let _status = prevState.status;
  let _signupBuffer = prevState.signupBuffer;

  switch (action.type) {
    case "TO_PROGRESS_SIGNUP":
      /** signupが進捗したときに実行. signup処理完了時, isFinishedをtrueにして実行
       * @param {Object} action [type, didProgressNum, isFinished] */

      if (action.isFinished) {
        asyncRemoveItem("signupBuffer");
        _status = AUTHENTICATED;
        asyncStoreItem("status", _status);

        return {
          ...prevState,
          status: _status,
        };
      } else {
        _signupBuffer.didProgressNum = action.didProgressNum;
        asyncStoreJson("signupBuffer", _signupBuffer);
        _status = AUTHENTICATING;
        asyncStoreItem("status", _status);

        return {
          ...prevState,
          status: _status,
          signupBuffer: _signupBuffer,
        };
      }

    case "SET_WORRIES_BUFFER":
      /** signup処理中に選択されたworriesバッファをset
       * @param {Object} action [type, worries] */

      _signupBuffer.worries = action.worries;
      asyncStoreJson("signupBuffer", _signupBuffer);

      return {
        ...prevState,
        signupBuffer: _signupBuffer,
      };

    case "COMPLETE_SIGNUP":
      /** signup時に実行. tokenが設定されていた場合、stateは変更しない
       * @param {Object} action [type, token, password] */

      if (prevState.token) return { ...prevState };
      asyncStoreItem("token", action.token);
      asyncStoreItem("password", action.password);
      // action.startUpLoggedin();

      return {
        ...prevState,
        token: action.token,
      };

    case "SET_TOKEN":
      /** set token. tokenが設定されていた場合、変更しない
       * @param {Object} action [type, token] */

      if (prevState.token) return { ...prevState };
      asyncStoreItem("token", action.token);

      return {
        ...prevState,
        token: action.token,
      };

    case "SET_IS_SHOW_SPINNER":
      /** set isShowSpinner.
        * @param {Object} action [type, value] */

      return {
        ...prevState,
        isShowSpinner: Boolean(action.value),
      };

    default:
      console.warn(`Not found "${action.type}" action.type.`);
      return;
  }
};

const initSignupBuffer = {
  didProgressNum: 0,
  worries: [],
};
Object.freeze(initSignupBuffer);

export const UNAUTHENTICATED = "Unauthenticated"; // signup処理前. AppIntro描画
export const AUTHENTICATING = "Authenticating"; // signup処理中. SignUp描画
export const AUTHENTICATED = "Authenticated"; // signup処理後. Home描画

const AuthStateContext = createContext({
  status: UNAUTHENTICATED,
  token: undefined,
  signupBuffer: { ...initSignupBuffer },
  isShowSpinner: false,
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

export const AuthProvider = ({ children, status, token, signupBuffer }) => {
  const [authState, authDispatch] = useReducer(authReducer, {
    status: status ? status : UNAUTHENTICATED,
    token: token ? token : undefined,
    signupBuffer: signupBuffer ? signupBuffer : { ...initSignupBuffer },
    isShowSpinner: false,
  });

  return (
    <AuthStateContext.Provider value={authState}>
      <AuthDispatchContext.Provider value={authDispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};