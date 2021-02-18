import React, { useEffect, useState } from "react";
import { TextInput, StyleSheet, Dimensions } from "react-native";
import { Block, Input, Text, theme } from "galio-framework";
import { useNavigation } from "@react-navigation/native";

import SubmitButton from "../atoms/SubmitButton";
import {
  ErrorSubmitProfile,
  ProfileInputData,
  ProfileInputScreen,
  RequestPatchProfile,
  SuccessSubmitProfile,
  ProfileInputNavigationProps,
} from "../types/Types";
import { ProfileDispatch, TokenNullable } from "../types/Types.context";

const { width } = Dimensions.get("screen");

type InputBlockProps = {
  screen: ProfileInputScreen;
  prevValue: unknown;
  setCanSubmit: React.Dispatch<boolean>;
  value: unknown;
  setValue: React.Dispatch<unknown>;
};
export const InputBlock: React.FC<InputBlockProps> = (props) => {
  const { screen } = props;
  let maxLength;
  let value;
  let prevValue;

  switch (screen) {
    case "InputName":
      // case "InputPrivacyName":
      maxLength = 15;
      value = props.value;
      prevValue = props.prevValue;
      if (typeof value === "string" && typeof prevValue === "string")
        return (
          <TextInputBlock
            maxLength={maxLength}
            value={value}
            prevValue={prevValue}
            setCanSubmit={props.setCanSubmit}
            setValue={props.setValue}
          />
        );
      else return <></>;
    case "InputIntroduction":
      maxLength = 250;
      value = props.value;
      prevValue = props.prevValue;
      if (typeof value === "string" && typeof prevValue === "string")
        return (
          <TextInputBlock
            maxLength={maxLength}
            value={value}
            prevValue={prevValue}
            setCanSubmit={props.setCanSubmit}
            setValue={props.setValue}
          />
        );
      else return <></>;
    default:
      return <></>;
  }
};

type TextInputBlockProps = {
  maxLength: number;
  isTextarea?: boolean;
  prevValue: string;
  setCanSubmit: React.Dispatch<boolean>;
  value: string;
  setValue: React.Dispatch<string>;
};
const TextInputBlock: React.FC<TextInputBlockProps> = (props) => {
  const {
    maxLength,
    isTextarea,
    prevValue,
    setCanSubmit,
    value,
    setValue,
  } = props;

  const [length, setLength] = useState(prevValue.length);
  useEffect(() => {
    setLength(value.length);
    setCanSubmit(prevValue !== value);
  }, [value]);

  let input;
  if (isTextarea && typeof value === "string") {
    input = (
      <TextInput
        multiline
        numberOfLines={4}
        editable
        style={{
          height: 350,
          borderColor: "silver",
          borderWidth: 1,
          padding: 10,
          marginVertical: 10,
          borderRadius: 10,
          backgroundColor: "white",
        }}
        maxLength={maxLength}
        value={value}
        placeholder="（例）最近結婚して専業主婦になったのですが、夫の転勤で地方で新しく暮らすことになり、周りに悩みを話せる人がいないです...友達はみんな働いているので気楽に電話もできません。どなたか雑談程度で話せる方いないでしょうか？？"
        onChangeText={(text) => setValue(text)}
      />
    );
  } else {
    input = (
      <Input
        placeholder={""}
        rounded
        color="black"
        style={{ borderColor: "silver" }}
        placeholderTextColor="gray"
        maxLength={maxLength}
        value={value}
        onChangeText={(text: string) => setValue(text)}
      />
    );
  }

  return (
    <>
      <Block flex style={{ alignItems: "flex-end", marginRight: 10 }}>
        <Text color="gray">
          {length.toString()}/{maxLength}
        </Text>
      </Block>
      {input}
    </>
  );
};

type SubmitProfileButtonProps = {
  screen: ProfileInputScreen;
  value: unknown;
  canSubmit: boolean;
  token: TokenNullable;
  profileDispatch: ProfileDispatch;
  setValidationText: React.Dispatch<string>;
  requestPatchProfile: RequestPatchProfile;
};
export const SubmitProfileButton: React.FC<SubmitProfileButtonProps> = (
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
  } = props;
  const navigation = useNavigation<ProfileInputNavigationProps>();
  const [isLoading, setIsLoading] = useState(false);

  let data: ProfileInputData;
  switch (screen) {
    case "InputName":
      data = { name: value };
      break;
    case "InputIntroduction":
      data = { introduction: value };
      break;
    default:
      break;
  }

  const submit = () => {
    setIsLoading(true);
    token &&
      requestPatchProfile(
        token,
        data,
        profileDispatch,
        successSubmit,
        errorSubmit
      );
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
