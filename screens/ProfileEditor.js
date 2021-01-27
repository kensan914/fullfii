import React from "react";
import { ConsultantProfileEditor } from "../components/organisms/Profile";
import authAxios from "../components/modules/axios";
import { URLJoin } from "../components/modules/support";
import { BASE_URL, ADMOB_UNIT_ID_EDIT_PROFILE, ADMOB_BANNER_WIDTH, ADMOB_BANNER_HEIGHT, isExpo } from "../constants/env";
import { StyleSheet } from "react-native";
import { Block } from "galio-framework";
import Admob from "../components/molecules/Admob";


const ProfileEditor = (props) => {
  const { navigation } = props;

  return (
    <Block flex style={styles.container}>
      <ConsultantProfileEditor
        navigation={navigation}
        requestPostProfileImage={requestPostProfileImage}
      />

      <Block style={styles.adMobBanner}>
        {!isExpo &&
          <Admob
            adSize={"banner"}
            adUnitID={ADMOB_UNIT_ID_EDIT_PROFILE}
          />
        }
      </Block>
    </Block>
  );
}

export default ProfileEditor;


const requestPostProfileImage = (token, image, profileDispatch, successSubmit, errorSubmit) => {
  const url = URLJoin(BASE_URL, "me/profile-image/");

  const formData = new FormData();
  formData.append("image", {
    name: "avatar.jpg",
    uri: Platform.OS === "android" ? image.uri : image.uri.replace("file://", ""),
    type: "image/jpg",
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


const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignItems: "center",
  },
  adMobBanner: {
    width: ADMOB_BANNER_WIDTH,
    height: ADMOB_BANNER_HEIGHT,
    zIndex: 2,
    position: "absolute",
    bottom: 0,
  },
});