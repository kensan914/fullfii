import React from "react";
import axios from "axios";

import { BASE_URL } from "../constants/env";
import { URLJoin } from "../components/modules/support";
import { requestSignIn } from "./SignIn";
import SignInUpTemplate from "../components/templates/SignInUpTemplate";
import SignUpTemplate from "../components/templates/signup/SignUpTemplate";


const SignUp = (props) => {
  return (
    // <SignInUpTemplate {...props} signup requestSignUp={requestSignUp} />
    <SignUpTemplate />
  );
}

export default SignUp;


// const requestSignUp = (username, email, password, dispatches, states, setErrorMessages, errorMessagesInit, setIsLoading, goNextPage) => {
//   setIsLoading(true);
//   const url = URLJoin(BASE_URL, "signup/");

//   axios
//     .post(url, {
//       username: username,
//       email: email,
//       password: password,
//       // gender: gender,
//       // birthday: `${birthday.getFullYear()}-${birthday.getMonth() + 1}-${birthday.getDate()}`, // YYYY-MM-DD
//     })
//     .then(res => {
//       requestSignIn(email, password, dispatches, states, setErrorMessages, errorMessagesInit, setIsLoading, true, goNextPage);
//     })
//     .catch(err => {
//       console.log(err.response);
//       if (err.response.status === 400) {
//         const newErrorMessages = Object.assign(errorMessagesInit, err.response.data);
//         setErrorMessages(Object.assign({}, newErrorMessages));
//       }
//       setIsLoading(false);
//     });
// }
