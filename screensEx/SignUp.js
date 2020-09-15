import React from "react";
import axios from "axios";

import { BASE_URL } from "../constantsEx/env";
import { URLJoin } from "../componentsEx/tools/support";
import SignInUp from "../componentsEx/templates/SignInUpTemplate";
import { requestSignIn } from "./SignIn";


const SignUp = (props) => {
  return (
    <SignInUp {...props} signup requestSignUp={requestSignUp} />
  );
}

export default SignUp;


const requestSignUp = (username, email, password, birthday, authDispatch, profileDispatch, notificationDispatch, setErrorMessages, errorMessagesInit, setIsLoading) => {
  setIsLoading(true);
  const url = URLJoin(BASE_URL, "signup/");
  console.log("リクエストサインアップ")
  axios
    .post(url, {
      username: username,
      email: email,
      password: password,
      birthday: `${birthday.getFullYear()}-${birthday.getMonth() + 1}-${birthday.getDate()}`, // YYYY-MM-DD
    })
    .then(res => {
      requestSignIn(email, password, authDispatch, profileDispatch, notificationDispatch, setErrorMessages, errorMessagesInit, setIsLoading);
    })
    .catch(err => {
      console.log(err.response);
      if (err.response.status === 400) {
        const newErrorMessages = Object.assign(errorMessagesInit, err.response.data);
        setErrorMessages(Object.assign({}, newErrorMessages));
      }
      setIsLoading(false);
    });
}
