import React from "react";
import axios from "axios";

import { BASE_URL } from "../constantsEx/env";
import { URLJoin } from "../componentsEx/tools/support";
import SignInUp from "../componentsEx/templates/SignInUp";


export const requestSignIn = (email, password, dispatch, setErrorMessages, errorMessagesInit, setIsLoading) => {
  setIsLoading(true);
  const url = URLJoin(BASE_URL, "api/login/");
  axios
    .post(url, {
      email: email,
      password: password,
    })
    .then(res => {
      dispatch({ type: "COMPLETE_LOGIN", token: res.data["token"] });
    })
    .catch(err => {
      if (err.response.status === 400) {
        const newErrorMessages = Object.assign(errorMessagesInit, err.response.data);
        setErrorMessages(Object.assign({}, newErrorMessages));
      }
      setIsLoading(false);
    });
}


const SignIn = (props) => {
  return (
    <SignInUp {...props} signin requestSignIn={requestSignIn} />
  );
}

export default SignIn;
