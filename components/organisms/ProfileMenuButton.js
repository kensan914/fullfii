import React, { useState } from "react";
import { StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";

import Icon from "../../components/atoms/Icon";
import { useAuthState } from "../contexts/AuthContext";
import { alertModal, showToast, URLJoin } from "../modules/support";
import { TouchableOpacity } from "react-native";
import { MenuModal } from "../molecules/Menu";
import Spinner from "react-native-loading-spinner-overlay";
import { BASE_URL, REPORT_URL } from "../../constants/env";
import requestAxios from "../modules/axios";

export const ProfileMenuButton = (props) => {
  const { user } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isShowSpinner, setIsShowSpinner] = useState(false);
  const [canPressBackdrop, setCanPressBackdrop] = useState(true);
  const authState = useAuthState();

  return (
    <>
      <TouchableOpacity
        style={[styles.ProfileMenuButton, {}]}
        onPress={() => setIsOpen(true)}
      >
        <Icon family="font-awesome" size={20} name="ban" color="white" />
        <MenuModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          items={[
            {
              title: "ブロックする",
              onPress: () =>
                handleBlockUser(
                  user,
                  setCanPressBackdrop,
                  authState.token,
                  setIsShowSpinner
                ),
            },
            {
              title: "通報する",
              onPress: () => handleReportUser(user, setCanPressBackdrop),
            },
          ]}
          spinnerOverlay={
            <Spinner visible={isShowSpinner} overlayColor="rgba(0,0,0,0)" />
          }
          canPressBackdrop={canPressBackdrop}
        />
      </TouchableOpacity>
    </>
  );
};

const handleBlockUser = (
  user,
  setCanPressBackdrop,
  token,
  setIsShowSpinner
) => {
  setCanPressBackdrop(false);
  alertModal({
    mainText: `${user.name}さんをブロックしますか？`,
    subText: `あなたの端末と${user.name}さんの端末からお互いの情報が表示されなくなります。また、相手にこのブロックは通知されません。`,
    cancelButton: "キャンセル",
    okButton: "ブロックする",
    onPress: () => {
      setCanPressBackdrop(true);
      requestPatchBlock(token, user, setIsShowSpinner);
    },
    cancelOnPress: () => {
      setCanPressBackdrop(true);
    },
  });
};

const handleReportUser = (user, setCanPressBackdrop) => {
  setCanPressBackdrop(false);
  alertModal({
    mainText: `${user.name}さんを通報しますか？`,
    subText: "",
    cancelButton: "キャンセル",
    okButton: "通報する",
    onPress: () => {
      setCanPressBackdrop(true);
      WebBrowser.openBrowserAsync(REPORT_URL);
    },
    cancelOnPress: () => {
      setCanPressBackdrop(true);
    },
  });
};

const styles = StyleSheet.create({
  ProfileMenuButton: {
    padding: 12,
    position: "relative",
  },
});

const requestPatchBlock = (token, user, setIsShowSpinner) => {
  setIsShowSpinner(true);

  const url = URLJoin(BASE_URL, "users/", user.id, "block/");

  requestAxios(token)
    .patch(url)
    .then((res) => {
      showToast({
        text1: `${user.name}さんをブロックしました。`,
      });
    })
    .catch((err) => {
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
};
