import React, { useState } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Block, theme } from "galio-framework";
import { useNavigation } from "@react-navigation/native";

import SubmitButton from "../atoms/SubmitButton";
import {
  ErrorSubmitProfile,
  ProfileInputData,
  ProfileInputScreen,
  RequestPatchProfile,
  SuccessSubmitProfile,
  ProfileInputNavigationProps,
  RequestPutGender,
  FormattedGenderKey,
} from "../types/Types";
import { ProfileDispatch, TokenNullable } from "../types/Types.context";

const { width } = Dimensions.get("screen");

type SubmitProfileButtonProps = {
  screen: ProfileInputScreen;
  value: unknown;
  canSubmit: boolean;
  token: TokenNullable;
  profileDispatch: ProfileDispatch;
  setValidationText: React.Dispatch<string>;
  requestPatchProfile: RequestPatchProfile;
  requestPutGender: RequestPutGender;
};
export const ProfileSubmitButton: React.FC<SubmitProfileButtonProps> = (
  props
) => {
  const {
    screen,
    value,
    canSubmit,
    token,
    profileDispatch,
    setValidationText,
    requestPatchProfile,
    requestPutGender,
  } = props;
  const navigation = useNavigation<ProfileInputNavigationProps>();
  const [isLoading, setIsLoading] = useState(false);

  const submit = () => {
    setIsLoading(true);

    if (screen === "InputGender") {
      token &&
        requestPutGender(
          token,
          value as FormattedGenderKey,
          profileDispatch,
          successSubmit,
          errorSubmit
        );
    } else {
      let data: ProfileInputData = {};
      if (screen === "InputName") {
        data = { name: value };
      } else if (screen === "InputIntroduction") {
        data = { introduction: value };
      }

      token &&
        requestPatchProfile(
          token,
          data,
          profileDispatch,
          successSubmit,
          errorSubmit
        );
    }
  };

  const successSubmit: SuccessSubmitProfile = () => {
    setIsLoading(false);
    navigation.goBack();
  };

  const errorSubmit: ErrorSubmitProfile = (err) => {
    setValidationText(err.response && err.response.data.name);
    setIsLoading(false);
  };

  return (
    <Block style={styles.submitButtonWrapper}>
      <SubmitButton
        style={styles.submitButton}
        canSubmit={canSubmit}
        isLoading={isLoading}
        submit={submit}
      />
    </Block>
  );
};

const styles = StyleSheet.create({
  submitButtonWrapper: {
    position: "absolute",
    alignSelf: "center",
    bottom: theme.SIZES.BASE * 2,
  },
  submitButton: {
    width: width - 30,
  },
});
