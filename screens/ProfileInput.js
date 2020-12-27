import React from "react";
import ProfileInputTemplate from "../components/templates/ProfileInputTemplate";
import authAxios from "../components/modules/axios";
import { exeIntroStep, URLJoin } from "../components/modules/support";
import { BASE_URL } from "../constants/env";


const ProfileInput = (props) => {
  return (
    <ProfileInputTemplate {...props} requestPatchProfile={requestPatchProfile} />
  );
}

export default ProfileInput;


export const requestPatchProfile = (token, data, profileDispatch, profileState, successSubmit, errorSubmit) => {
  const url = URLJoin(BASE_URL, "me/");

  authAxios(token)
    .patch(url, data)
    .then(res => {
      profileDispatch({type: "SET_ALL", profile: res.data});
      successSubmit && successSubmit();
      if (Object.keys(data).indexOf("intro_step") == -1) {
        // exeIntroStep(2, profileDispatch, profileState, requestPatchProfile, token);
      }
    })
    .catch(err => {
      console.log(err.response);
      errorSubmit && errorSubmit(err);
    });
}