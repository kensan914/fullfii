import React from "react";

import SettingsInputTemplate from "../componentsEx/templates/SettingsInputTemplate";
import authAxios from "../componentsEx/tools/authAxios";
import { BASE_URL } from "../constantsEx/env";
import { URLJoin } from "../componentsEx/tools/support";
import { useAuthDispatch } from "../componentsEx/contexts/AuthContext";


const SettingsInput = (props) => {
  const { screen } = props.route.params;

  return (
    <SettingsInputTemplate navigation={props.navigation} screen={screen} requestPatchAuth={requestPatchAuth} />
  );
}


export default SettingsInput;


const requestPatchAuth = (token, data, profileDispatch, authDispatch, errorMessagesInit, setErrorMessages, setIsLoading, navigation) => {
  setIsLoading(true);
  let url;
  if (Object.keys(data).includes('email')) {
    url = URLJoin(BASE_URL, "me/email/");
  } else {
    url = URLJoin(BASE_URL, "me/password/");
  }

  authAxios(token)
    .patch(url, data)
    .then(res => {
      profileDispatch({ type: "SET_ALL", profile: res.data.profile });
      authDispatch({ type: "SET_TOKEN", token: res.data.token });
      navigation.goBack();
    })
    .catch(err => {
      console.log(err.response);
      if (err.response.status === 400) {
        const newErrorMessages = Object.assign(errorMessagesInit, err.response.data);
        setErrorMessages(Object.assign({}, newErrorMessages));
      }
    })
    .finally(() => {
      setIsLoading(false);
    });
}
