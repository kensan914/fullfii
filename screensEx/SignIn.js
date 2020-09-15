import React from "react";
import axios from "axios";

import { BASE_URL } from "../constantsEx/env";
import { URLJoin } from "../componentsEx/tools/support";
import SignInUp from "../componentsEx/templates/SignInUpTemplate";
import { requestGetProfile } from "./Profile";
import { conectWsNotification } from "./Notification";


const SignIn = (props) => {
  return (
    <SignInUp {...props} signin requestSignIn={requestSignIn} />
  );
}

export default SignIn;


export const requestSignIn = (email, password, authDispatch, profileDispatch, notificationDispatch, setErrorMessages, errorMessagesInit, setIsLoading) => {
  setIsLoading(true);
  const url = URLJoin(BASE_URL, "login/");
  console.log("リクエストサインイン");
  axios
    .post(url, {
      email: email,
      password: password,
    })
    .then(res => {
      initToSignIn(authDispatch, profileDispatch, notificationDispatch, res.data["token"])
    })
    .catch(err => {
      if (err.response.status === 400) {
        const newErrorMessages = Object.assign(errorMessagesInit, err.response.data);
        setErrorMessages(Object.assign({}, newErrorMessages));
      }
      setIsLoading(false);
    });
}

// state関連の初期化 signin成功時に実行
const initToSignIn = (authDispatch, profileDispatch, notificationDispatch, token) => {
  authDispatch({ type: "COMPLETE_LOGIN", token: token });
  requestGetProfile(token, profileDispatch);
  notificationDispatch({ type: "RESET" });
  conectWsNotification(token, notificationDispatch);
}