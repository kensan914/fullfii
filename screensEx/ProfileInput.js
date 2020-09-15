import React from 'react';
import ProfileInputTemplate from '../componentsEx/templates/ProfileInputTemplate';
import authAxios from '../componentsEx/tools/authAxios';
import { URLJoin } from "../componentsEx/tools/support";
import { BASE_URL } from "../constantsEx/env";

const ProfileInput = (props) => {
  return (
    <ProfileInputTemplate {...props} requestPatchProfile={requestPatchProfile} />
  );
}

export default ProfileInput;


export const requestPatchProfile = (token, data, profileDispatch, successSubmit, errorSubmit) => {
  const url = URLJoin(BASE_URL, "me/");

  authAxios(token)
    .patch(url, data)
    .then(res => {
      profileDispatch({type: "SET_ALL", profile: res.data});
      successSubmit();
    })
    .catch(err => {
      console.log(err.response);
      errorSubmit(err);
    });
}