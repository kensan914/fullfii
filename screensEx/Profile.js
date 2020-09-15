import React from "react";

import ProfileTemplate from "../componentsEx/templates/ProfileTemplate";
import authAxios from "../componentsEx/tools/authAxios";
import { URLJoin } from "../componentsEx/tools/support";
import { BASE_URL } from "../constantsEx/env";


const Profile = (props) => {
  return <ProfileTemplate {...props} requestGetProfile={requestGetProfile} />;
}

export default Profile;


export const requestGetProfile = (token, profileDispatch) => {
  const url = URLJoin(BASE_URL, "me/");

  authAxios(token)
    .get(url)
    .then(res => {
      profileDispatch({type: "SET_ALL", profile: res.data});
    })
    .catch(err => {
      console.log(err.response);
    });
}