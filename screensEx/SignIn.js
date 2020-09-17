import React from "react";
import axios from "axios";

import { BASE_URL } from "../constantsEx/env";
import { URLJoin } from "../componentsEx/tools/support";
import SignInUp from "../componentsEx/templates/SignInUpTemplate";
import { startUpLogind } from "./Manager";


const SignIn = (props) => {
  return (
    <SignInUp {...props} signin requestSignIn={requestSignIn} />
  );
}

export default SignIn;


export const requestSignIn = (email, password, dispatches, chatState, setErrorMessages, errorMessagesInit, setIsLoading) => {
  setIsLoading(true);
  const url = URLJoin(BASE_URL, "login/");
  console.log("リクエストサインイン");
  axios
    .post(url, {
      email: email,
      password: password,
    })
    .then(res => {
      dispatches.authDispatch({ type: "COMPLETE_SIGNIN", token: res.data["token"], startUpLogind: () => startUpLogind(res.data["token"], dispatches, chatState) });
    })
    .catch(err => {
      if (err.response.status === 400) {
        const newErrorMessages = Object.assign(errorMessagesInit, err.response.data);
        setErrorMessages(Object.assign({}, newErrorMessages));
      }
    })
    .finally(() => {
      setIsLoading(false);
    });
}