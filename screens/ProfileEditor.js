import React from "react";
import { ProfileTabNavigator, ConsultantProfileEditor } from "../components/organisms/Profile";
import authAxios from "../components/modules/authAxios";
import { URLJoin } from "../components/modules/support";
import { BASE_URL } from "../constants/env";


const ProfileEditor = (props) => {
  const { navigation } = props;

  return (
    // <ProfileTabNavigator user={user} screen="ProfileEditor" navigation={navigation} />
    <ConsultantProfileEditor navigation={navigation} requestPostProfileImage={requestPostProfileImage} />
  );
}

export default ProfileEditor;


const requestPostProfileImage = (token, image, profileDispatch, successSubmit, errorSubmit) => {
  const url = URLJoin(BASE_URL, "me/profile-image/");

  const formData = new FormData();
  formData.append("image", {
    name: "avatar.jpg",
    uri: Platform.OS === "android" ? image.uri : image.uri.replace("file://", ""),
    type:"image/jpg",
  });

  authAxios(token)
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(res => {
      profileDispatch({ type: "SET_ALL", profile: res.data });
      successSubmit();
    })
    .catch(err => {
      console.log(err.response);
      errorSubmit(err);
    });
}