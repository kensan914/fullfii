import React from "react";

import ProfileTemplate from "../components/templates/ProfileTemplate";
import authAxios from "../components/modules/axios";
import { showToast, URLJoin } from "../components/modules/support";
import { BASE_URL } from "../constants/env";


const Profile = (props) => {
  return <ProfileTemplate {...props} requestGetProfile={requestGetProfile} />;
}

export default Profile;


export const requestGetProfile = (token, profileDispatch) => {
  const url = URLJoin(BASE_URL, "me/");

  authAxios(token)
    .get(url)
    .then(res => {
      profileDispatch({ type: "SET_ALL", profile: res.data });
    })
    .catch(err => {
      console.log(err.response);
    });
}

export const requestGetProfileParams = (token, profileDispatch) => {
  const url = URLJoin(BASE_URL, "profile-params/");

  authAxios(token)
    .get(url)
    .then(res => {
      profileDispatch({ type: "SET_PARAMS", profileParams: res.data });
    })
    .catch(err => {
      console.log(err.response);
    });
}

export const requestPatchBlock = (token, user, setIsShowSpinner) => {
  setIsShowSpinner(true);

  const url = URLJoin(BASE_URL, "users/", user.id, "block/");

  authAxios(token)
    .patch(url)
    .then(res => {
      showToast({
        text1: `${user.name}さんをブロックしました。`,
      });
    })
    .catch(err => {
      if (err.response.data.type === "have_already_blocked") {
        showToast({
          type: "error",
          text1: err.response.data.message,
        });
      }
      console.log(err.response);
    })
    .finally(() => {
      setIsShowSpinner(false);
    });
}