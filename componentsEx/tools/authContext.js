import React, { createContext, useReducer, useContext } from "react";
import { asyncSetItem, asyncRemoveAll } from "./support";


const authReducer = (prevState, action) => {
  switch (action.type) {
    case "START_LOGIN":
      return {
        ...prevState,
        status: "Loading",
      };
    case "COMPLETE_LOGIN":
      asyncSetItem("token", action.token);
      return {
        ...prevState,
        status: "Authenticated",
        token: action.token,
      };
    case "COMPLETE_LOGOUT":
      asyncRemoveAll();
      return {
        ...prevState,
        status: "Unauthenticated",
        token: undefined,
      };
    default:
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