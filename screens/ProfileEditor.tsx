import React from "react";

import requestAxios from "../components/modules/axios";
import { URLJoin } from "../components/modules/support";
import {
  BASE_URL,
  ADMOB_UNIT_ID_EDIT_PROFILE,
  ADMOB_BANNER_WIDTH,
  ADMOB_BANNER_HEIGHT,
  isExpo,
} from "../constants/env";
import { Platform, StyleSheet } from "react-native";
import { Block } from "galio-framework";
import Admob from "../components/molecules/Admob";
import { ProfileEditorTemplate } from "../components/templates/ProfileEditorTemplate";
import { RequestPostProfileImage } from "../components/types/Types";
import { MeProfile, MeProfileIoTs } from "../components/types/Types.context";

const ProfileEditor: React.FC = () => {
  return (
    <Block flex style={styles.container}>
      <ProfileEditorTemplate
        requestPostProfileImage={requestPostProfileImage}
      />

      <Block style={styles.adMobBanner}>
        {!isExpo && <Admob adUnitId={ADMOB_UNIT_ID_EDIT_PROFILE} />}
      </Block>
    </Block>
  );
};

export default ProfileEditor;

const requestPostProfileImage: RequestPostProfileImage = (
  token,
  image,
  profileDispatch,
  successSubmit,
  errorSubmit
) => {
  const url = URLJoin(BASE_URL, "me/profile-image/");

  const formData = new FormData();
  formData.append("image", {
    name: "avatar.jpg",
    uri:
      Platform.OS === "android" ? image.uri : image.uri.replace("file://", ""),
    type: "image/jpg",
  });

  requestAxios(url, "post", MeProfileIoTs, {
    token,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    thenCallback: (resData) => {
      profileDispatch({ type: "SET_ALL", profile: resData as MeProfile });
      successSubmit();
    },
    catchCallback: (err) => {
      errorSubmit(err);
    },
  });
};

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
