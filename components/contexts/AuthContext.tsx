import React, { createContext, useReducer, useContext } from "react";
import {
  asyncStoreItem,
  asyncRemoveItem,
  asyncStoreJson,
} from "../modules/support";
import {
  AuthenticatedType,
  AuthenticatingType,
  AuthState,
  UnauthenticatedType,
  SignupBuffer,
  AuthActionType,
  AuthDispatch,
  TokenNullable,
  AuthStatusNullable,
} from "../types/Types.context";

const authReducer = (prevState: AuthState, action: AuthActionType) => {
  let _status = prevState.status;
  const _signupBuffer = prevState.signupBuffer;

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
      console.warn(`Not found this action.type`);
      return { ...prevState };
  }
};

const initSignupBuffer: SignupBuffer = Object.freeze({
  didProgressNum: 0,
  worries: [],
});

export const UNAUTHENTICATED: UnauthenticatedType = "Unauthenticated"; // signup処理前. AppIntro描画
export const AUTHENTICATING: AuthenticatingType = "Authenticating"; // signup処理中. SignUp描画
export const AUTHENTICATED: AuthenticatedType = "Authenticated"; // signup処理後. Home描画

const authStateContext = createContext<AuthState>({
  status: UNAUTHENTICATED,
  token: null,
  signupBuffer: { ...initSignupBuffer },
  isShowSpinner: false,
});
const authDispatchContext = createContext<AuthDispatch>(() => {
  return void 0;
});

export const useAuthState = (): AuthState => {
  const context = useContext(authStateContext);
  return context;
};
export const useAuthDispatch = (): AuthDispatch => {
  const context = useContext(authDispatchContext);
  return context;
};

type Props = {
  status: AuthStatusNullable;
  token: TokenNullable;
  signupBuffer: SignupBuffer | null;
};
export const AuthProvider: React.FC<Props> = ({
  children,
  status,
  token,
  signupBuffer,
}) => {
  const initAuthState: AuthState = {
    status: status ? status : UNAUTHENTICATED,
    token: token ? token : null,
    signupBuffer: signupBuffer ? signupBuffer : { ...initSignupBuffer },
    isShowSpinner: false,
  };
  const [authState, authDispatch] = useReducer(authReducer, initAuthState);

  return (
    <authStateContext.Provider value={authState}>
      <authDispatchContext.Provider value={authDispatch}>
        {children}
      </authDispatchContext.Provider>
    </authStateContext.Provider>
  );
};
