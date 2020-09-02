import React, { createContext, useReducer, useContext } from "react";
import { asyncSetItem, asyncRemoveItem } from "./support";


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
      asyncRemoveItem("token");
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
  const [state, dispatch] = useReducer(authReducer, {
    status: token ? "Authenticated" : "Unauthenticated",
    token: token ? token : undefined,
  });
  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};