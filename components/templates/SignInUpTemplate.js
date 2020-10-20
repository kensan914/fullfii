import React, { useState } from "react";
import { Dimensions, StyleSheet, Platform } from "react-native";
import { Block, Input, Text } from "galio-framework";
import * as WebBrowser from "expo-web-browser";

import { HeaderHeight } from "../../constants/utils";
import { useAuthDispatch } from "../contexts/AuthContext";
import { useProfileDispatch } from "../contexts/ProfileContext";
import { useNotificationDispatch } from "../contexts/NotificationContext";
import { useChatDispatch, useChatState } from "../contexts/ChatContext";
import { USER_POLICY_URL } from "../../constants/env";
import SignInTemplate from "./SignInTemplate";
import SignUpTemplate from "./SignUpTemplate";


const { height, width } = Dimensions.get("window");

const SignInUpTemplate = (props) => {
  const { navigation, signup, signin, requestSignUp, requestSignIn } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState({
    username: false,
    email: false,
    password: false,
    passwordAgain: false,
  });
  const toggleActive = (key, value) => {
    active[key] = value;
    const newActive = Object.assign({}, active);
    setActive(newActive);
  }
  const initActive = () => {
    setActive({ username: false, email: false, password: false, });
  }

  const chatState = useChatState();
  const dispatches = {
    authDispatch: useAuthDispatch(),
    profileDispatch: useProfileDispatch(),
    notificationDispatch: useNotificationDispatch(),
    chatDispatch: useChatDispatch(),
  }

  const getSubmitButtonParams = (evaluationFormula) => {
    const submitButtonParams = {};
    if (evaluationFormula) {
      submitButtonParams["buttonColor"] = "lightcoral";
      submitButtonParams["buttonTextColor"] = "white";
      submitButtonParams["canSubmit"] = true;
    } else {
      submitButtonParams["buttonColor"] = "gainsboro";
      submitButtonParams["buttonTextColor"] = "silver";
      submitButtonParams["canSubmit"] = false;
    }
    return submitButtonParams;
  }


  if (signup) {
    return (
      <SignUpTemplate requestSignUp={requestSignUp} navigation={navigation} active={active} toggleActive={toggleActive} getSubmitButtonParams={getSubmitButtonParams}
        isLoading={isLoading} setIsLoading={setIsLoading} chatState={chatState} dispatches={dispatches} handleOpenWithWebBrowser={handleOpenWithWebBrowser}
        BottomMessage={BottomMessage} EmailInput={EmailInput} PasswordInput={PasswordInput} initActive={initActive} />
    );
  }
  else if (signin) {
    return (
      <SignInTemplate requestSignIn={requestSignIn} navigation={navigation} active={active} toggleActive={toggleActive} getSubmitButtonParams={getSubmitButtonParams}
        isLoading={isLoading} setIsLoading={setIsLoading} chatState={chatState} dispatches={dispatches}
        BottomMessage={BottomMessage} EmailInput={EmailInput} PasswordInput={PasswordInput} />
    );
  }
}

export default SignInUpTemplate;


const handleOpenWithWebBrowser = () => {
  WebBrowser.openBrowserAsync(USER_POLICY_URL);
};

export const BottomMessage = (props) => {
  const { message, error, style, textcenter } = props;
  return (
    <Block style={[{ alignSelf: "flex-start", width: width * 0.9 }, style]}>
      <Text color={error ? "cornflowerblue" : "lightgray"} bold={error} style={{ alignSelf: textcenter ? "center" : "flex-start" }}>{message}</Text>
    </Block>
  );
}

export const EmailInput = (props) => {
  const { active, setEmail, toggleActive, errorMessages } = props;
  return (
    <>
      <Input
        bgColor="transparent"
        placeholderTextColor="darkgray"
        borderless
        color="lightcoral"
        type="email-address"
        placeholder="メールアドレス"
        autoCapitalize="none"
        style={[styles.input, active.email ? styles.inputActive : null]}
        onChangeText={text => setEmail(text)}
        onBlur={() => toggleActive && toggleActive("email", false)}
        onFocus={() => toggleActive && toggleActive("email", true)}
        maxLength={225}
      />
      {Array.isArray(errorMessages.email) &&
        errorMessages.email.map((message, index) => <BottomMessage message={message} error key={index} />)
      }
    </>
  );
}

export const PasswordInput = (props) => {
  const { activeCustom, setPassword, toggleActiveCustom, errorMessageCustom, placeholder } = props;
  return (
    <>
      <Input
        bgColor="transparent"
        placeholderTextColor="darkgray"
        borderless
        color="lightcoral"
        password
        viewPass
        placeholder={placeholder ? placeholder : "パスワード"}
        iconColor="#F69896"
        style={[styles.input, activeCustom ? styles.inputActive : null]}
        onChangeText={text => setPassword(text)}
        onBlur={() => toggleActiveCustom && toggleActiveCustom(false)}
        onFocus={() => toggleActiveCustom && toggleActiveCustom(true)}
        maxLength={30}
        textContentType={"oneTimeCode"}
      />
      {(activeCustom && !Array.isArray(errorMessageCustom)) && <BottomMessage message="8文字以上" />}
      {
        Array.isArray(errorMessageCustom) &&
        errorMessageCustom.map((message, index) => <BottomMessage message={message} error key={index} />)
      }
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
  },
  input: {
    width: width * 0.9,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#F69896",
  },
  inputActive: {
    borderBottomWidth: 2,
  },
  endConsultationScrollView: {
    marginTop: 10,
    backgroundColor: "white",
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
  endConsultationContainer: {
    width: width,
    backgroundColor: "white",
    padding: 22,
    paddingBottom: 40,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
