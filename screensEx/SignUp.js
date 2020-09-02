import React from "react";
import axios from "axios";

import { BASE_URL } from "../constantsEx/env";
import { URLJoin } from "../componentsEx/tools/support";
import SignInUp from "../componentsEx/templates/SignInUp";
import { requestSignIn } from "./SignIn";


const requestSignUp = (username, email, password, birthday, dispatch, setErrorMessages, errorMessagesInit, setIsLoading) => {
  setIsLoading(true);
  const url = URLJoin(BASE_URL, "api/signup/");
  axios
    .post(url, {
      username: username,
      email: email,
      password: password,
      birthday: `${birthday.getFullYear()}-${birthday.getMonth() + 1}-${birthday.getDate()}`, // YYYY-MM-DD
    })
    .then(res => {
      requestSignIn(email, password, dispatch, setErrorMessages, errorMessagesInit, setIsLoading);
    })
    .catch(err => {
      if (err.response.status === 400) {
        const newErrorMessages = Object.assign(errorMessagesInit, err.response.data);
        setErrorMessages(Object.assign({}, newErrorMessages));
      }
      setIsLoading(false);
    });
}


const SignUp = (props) => {
  return (
    <SignInUp {...props} signup requestSignUp={requestSignUp} />
  );
}

export default SignUp;

