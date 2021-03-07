import React from "react";
import ProfileInputTemplate from "../components/templates/ProfileInputTemplate";
import requestAxios from "../components/modules/axios";
import { URLJoin } from "../components/modules/support";
import { BASE_URL } from "../constants/env";
import { MeProfile, MeProfileIoTs } from "../components/types/Types.context";
import {
  PutGenderResData,
  PutGenderResDataIoTs,
  RequestPatchProfile,
  RequestPutGender,
} from "../components/types/Types";

const ProfileInput: React.FC = () => {
  return (
    <ProfileInputTemplate
      requestPatchProfile={requestPatchProfile}
      requestPutGender={requestPutGender}
    />
  );
};

export default ProfileInput;

export const requestPatchProfile: RequestPatchProfile = (
  token,
  data,
  profileDispatch,
  successSubmit,
  errorSubmit,
  finallySubmit
) => {
  const url = URLJoin(BASE_URL, "me/");

  requestAxios(url, "patch", MeProfileIoTs, {
    data: data,
    thenCallback: (resData) => {
      profileDispatch({ type: "SET_ALL", profile: resData as MeProfile });
      successSubmit && successSubmit();
    },
    catchCallback: (err) => {
      err && errorSubmit && errorSubmit(err);
    },
    finallyCallback: finallySubmit,
    token: token,
  });
};

const requestPutGender: RequestPutGender = (
  token,
  putGenderKey,
  profileDispatch,
  successSubmit,
  errorSubmit
) => {
  const url = URLJoin(BASE_URL, "me/gender/");

  requestAxios(url, "put", PutGenderResDataIoTs, {
    data: { key: putGenderKey },
    thenCallback: (resData) => {
      const _resData = resData as PutGenderResData;
      profileDispatch({ type: "SET_ALL", profile: _resData.me });
      successSubmit && successSubmit();
    },
    catchCallback: (err) => {
      err && errorSubmit && errorSubmit(err);
    },
    token: token,
  });
};
