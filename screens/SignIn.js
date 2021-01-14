import React from "react";
import axios from "axios";

import { BASE_URL } from "../constants/env";
import { URLJoin } from "../components/modules/support";
import { startUpLoggedin } from "./StartUpManager";
import SignInUpTemplate from "../components/templates/SignInUpTemplate";


const SignIn = (props) => {
  return (
    <SignInUpTemplate {...props} signin requestSignIn={requestSignIn} />
  );
}

export default SignIn;


export const requestSignIn = (email, password, dispatches, states, setErrorMessages, errorMessagesInit, setIsLoading, dontComplete = false, goNextPage = null) => {
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
        dispatches.authDispatch({ type: "COMPLETE_SIGNIN", token: res.data["token"], startUpLoggedin: () => startUpLoggedin(res.data["token"], states, dispatches) });
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