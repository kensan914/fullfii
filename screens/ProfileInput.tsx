import React from "react";
import ProfileInputTemplate from "../components/templates/ProfileInputTemplate";
import requestAxios from "../components/modules/axios";
import { URLJoin } from "../components/modules/support";
import { BASE_URL } from "../constants/env";
import { MeProfile, MeProfileIoTs } from "../components/types/Types.context";
import { RequestPatchProfile } from "../components/types/Types";

const ProfileInput: React.FC = () => {
  return <ProfileInputTemplate requestPatchProfile={requestPatchProfile} />;
};

export default ProfileInput;

export const requestPatchProfile: RequestPatchProfile = (
  token,
  data,
  profileDispatch,
  successSubmit,
  errorSubmit
) => {
  const url = URLJoin(BASE_URL, "me/");

  requestAxios(url, "patch", MeProfileIoTs, {
    data: data,
    thenCallback: (resData) => {
      profileDispatch({ type: "SET_ALL", profile: resData as MeProfile });
      successSubmit && successSubmit();
    },
    catchCallback: (err) => {
      err && errorSubmit(err);
    },
    token: token,
  });
};
