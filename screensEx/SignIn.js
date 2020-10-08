import React from "react";
import axios from "axios";

import { BASE_URL } from "../constantsEx/env";
import { URLJoin } from "../componentsEx/tools/support";
import { startUpLogind } from "./Manager";
import SignInUpTemplate from "../componentsEx/templates/SignInUpTemplate";


const SignIn = (props) => {
  return (
    <SignInUpTemplate {...props} signin requestSignIn={requestSignIn} />
  );
}

export default SignIn;


export const requestSignIn = (email, password, dispatches, chatState, setErrorMessages, errorMessagesInit, setIsLoading, dontComplete = false, goNextPage = null) => {
  setIsLoading(true);
  const url = URLJoin(BASE_URL, "login/");
  axios
    .post(url, {
      email: email,
      password: password,
    })
    .then(res => {
      // signup → signin. まだ完全にsigninを完了しない
      if (dontComplete) {
        goNextPage && goNextPage();
        dispatches.authDispatch({ type: "WHILE_SIGNIN", token: res.data["token"] });
      }
      // 単独signin
      else {
        dispatches.authDispatch({ type: "COMPLETE_SIGNIN", token: res.data["token"], startUpLogind: () => startUpLogind(res.data["token"], dispatches, chatState) });
      }
    })
    .catch(err => {
      if (err.response.status === 400) {
        const newErrorMessages = Object.assign(errorMessagesInit, err.response.data);
        setErrorMessages(Object.assign({}, newErrorMessages));
      }
      setIsLoading(false);
    });
}