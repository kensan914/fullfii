import React from "react";
import ProfileInputTemplate from "../components/templates/ProfileInputTemplate";
import requestAxios from "../components/modules/axios";
import { URLJoin } from "../components/modules/support";
import { BASE_URL } from "../constants/env";

const ProfileInput: React.FC = (props) => {
  return (
    <ProfileInputTemplate
      {...props}
      requestPatchProfile={requestPatchProfile}
    />
  );
};

export default ProfileInput;

export type RequestPatchProfile = (
  token: any,
  data: any,
  profileDispatch: any,
  successSubmit: any,
  errorSubmit: any
) => void;
export const requestPatchProfile: RequestPatchProfile = (
  token,
  data,
  profileDispatch,
  successSubmit,
  errorSubmit
) => {
  const url = URLJoin(BASE_URL, "me/");

  requestAxios(token)
    .patch(url, data)
    .then((res) => {
      profileDispatch({ type: "SET_ALL", profile: res.data });
      successSubmit && successSubmit();
    })
    .catch((err) => {
      console.log(err.response);
      errorSubmit && errorSubmit(err);
    });
};
