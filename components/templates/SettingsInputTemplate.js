import React, { useState } from "react";
import { StyleSheet, Dimensions, ScrollView } from "react-native";
import { Block, theme, Text, Input, Button } from "galio-framework";

import { useAuthDispatch, useAuthState } from "../contexts/AuthContext";
import { EmailInput, PasswordInput, BottomMessage } from "./SignInUpTemplate";
import { useProfileDispatch, useProfileState } from "../contexts/ProfileContext";
import SubmitButton from "../atoms/SubmitButton";


const { width, height } = Dimensions.get("screen");

const SettingsInputTemplate = (props) => {
  const { navigation, screen, requestPatchAuth } = props;

  // Input email
  const [email, setEmail] = useState("");
  const handleRequestPatchEmail = () => {
    if (profileState.profile.email !== email) {
      requestPatchAuth(authState.token, { email: email }, profileDispatch, authDispatch, errorMessagesInit, setErrorMessages, setIsLoading, navigation);
    } else {
      setErrorMessages(Object.assign(errorMessagesInit, { error: ["現在のメールアドレスと変化がありません。"] }))
    }
  }

  // Input password
  const [prevPassword, setPrevPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const handleRequestPatchPassword = () => {
    if (password === passwordAgain) {
      requestPatchAuth(authState.token, { password: password, prev_password: prevPassword }, profileDispatch, authDispatch, errorMessagesInit, setErrorMessages, setIsLoading, navigation);
    } else {
      setErrorMessages(Object.assign(errorMessagesInit, { error: ["新しいパスワードと再入力パスワードが一致しません。"] }))
    }
  }

  const errorMessagesInit = {
    email: [],
    password: [],
    error: [], // common error message
  };
  const [errorMessages, setErrorMessages] = useState(errorMessagesInit);

  const [isLoading, setIsLoading] = useState(false);
  const authState = useAuthState();
  const profileState = useProfileState();
  const profileDispatch = useProfileDispatch();
  const authDispatch = useAuthDispatch();

  if (screen === "InputEmail")
    return (
      <Block style={styles.container}>

        <Text color="gray" style={{ paddingHorizontal: 10, paddingVertical: 20 }}>{`メールアドレスを変更します。現在のメールアドレスは${profileState.profile.email}です。`}</Text>
        <EmailInput active={true} setEmail={setEmail} errorMessages={errorMessages} />

        {Array.isArray(errorMessages.error) &&
          errorMessages.error.map((message, index) => <BottomMessage message={message} error key={index} />)
        }
        <SubmitButton canSubmit={true} isLoading={isLoading} submit={() => handleRequestPatchEmail()} />
      </Block>
    );
  else if (screen === "InputPassword")
    return (
      <ScrollView>
        <Block style={styles.container}>

          <Text color="gray" style={{ paddingHorizontal: 10, paddingVertical: 20 }}>パスワードを変更します。</Text>

          <PasswordInput active={true} setPassword={setPrevPassword} errorMessages={{}} placeholder="現在のパスワード" />
          <PasswordInput active={true} setPassword={setPassword} errorMessages={{}} placeholder="新しいパスワード" />
          <PasswordInput active={true} setPassword={setPasswordAgain} errorMessages={{}} placeholder="再入力パスワード" />

          {Array.isArray(errorMessages.password) &&
            errorMessages.password.map((message, index) => <BottomMessage message={message} error key={index} />)
          }
          {Array.isArray(errorMessages.error) &&
            errorMessages.error.map((message, index) => <BottomMessage message={message} error key={index} />)
          }
          <SubmitButton canSubmit={true} isLoading={isLoading} submit={() => handleRequestPatchPassword()} />
        </Block>
      </ScrollView>
    );
  else return <></>;
}


export default SettingsInputTemplate;


const styles = StyleSheet.create({
  settingsCard: {
    height: 60,
    width: width,
    backgroundColor: "white",
    alignItems: "center"
  },
  container: {
    paddingHorizontal: theme.SIZES.BASE,
    marginVertical: theme.SIZES.BASE,
  },
  submitButton: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "lightcoral"
  }
});
