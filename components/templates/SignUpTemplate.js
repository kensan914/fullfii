import React, { useRef, useState } from "react";
import { Dimensions, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, ScrollView } from "react-native";
import { Block, Button, Input, Text, theme, Checkbox } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";

import { HeaderHeight } from "../../constants/utils";
import BirthdayPicker from "../atoms/BirthdayPicker";
import { TouchableWithoutFeedback } from "react-native";
import { useAuthState } from "../contexts/AuthContext";
import { startUpLogind } from "../../screens/Manager";
import { requestSubscription, getPurchases } from "../../screens/Plan";
import { PlanTemplateContent } from "./PlanTemplate";


const { height, width } = Dimensions.get("window");

const SignUpTemplate = (props) => {
  const { requestSignUp, navigation, active, toggleActive, getSubmitButtonParams, isLoading, setIsLoading, chatState, dispatches,
    handleOpenWithWebBrowser, BottomMessage, EmailInput, PasswordInput, initActive } = props;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  
  const [isAgreedUserpolicy, setIsAgreedUserpolicy] = useState(false);

  const errorMessagesInit = {
    username: "",
    email: "",
    password: "",
    passwordAgain: "",
    error: "", // common error message
  };
  const [errorMessages, setErrorMessages] = useState(errorMessagesInit);

  const submitButtonParams = getSubmitButtonParams(username && email && password && passwordAgain && isAgreedUserpolicy);
  const submitSignUp = () => {
    if (password === passwordAgain) {
      requestSignUp(username, email, password, dispatches, chatState, setErrorMessages, errorMessagesInit, setIsLoading, goNextPage);
    } else {
      setErrorMessages(Object.assign(errorMessagesInit, { passwordAgain: ["新しいパスワードと再入力パスワードが一致しません。"] }))
    }
  }

  const [currentPage, setCurrentPage] = useState(1);
  const scrollView = useRef(null);

  const goNextPage = () => {
    scrollView.current.scrollTo({ y: 0, x: width * currentPage, animated: true });
    setCurrentPage(currentPage - 1);
  }

  const authState = useAuthState();
  const handleSelectedPlan = () => {
    dispatches.authDispatch({ type: "COMPLETE_SIGNIN", token: authState.token, startUpLogind: () => startUpLogind(authState.token, dispatches, chatState) });
  }

  const FirstPage = () => {
    return (
      <Block flex middle style={styles.signupContainer}>
        <KeyboardAvoidingView behavior="padding" enabled>
          <Block flex={0.1} style={{ alignItems: "center" }}>
            <Text size={26} bold color="#F69896">アカウントを作成</Text>
          </Block>
          <Block flex={0.7} center space="between">
            <Block center>
              <Input
                bgColor="transparent"
                placeholderTextColor="darkgray"
                borderless
                color="lightcoral"
                placeholder="ユーザネーム"
                autoCapitalize="none"
                style={[styles.input, active.username ? styles.inputActive : null]}
                onChangeText={text => setUsername(text)}
                onBlur={() => toggleActive("username", false)}
                onFocus={() => toggleActive("username", true)}
                maxLength={15}
              />
              {(active.username && !Array.isArray(errorMessages.username)) && <BottomMessage message="あなたのニックネームを入力してください。" />}
              {Array.isArray(errorMessages.username) &&
                errorMessages.username.map((message, index) => <BottomMessage message={message} error key={index} />)
              }

              <EmailInput active={active} setEmail={setEmail} toggleActive={toggleActive} errorMessages={errorMessages} />
              <PasswordInput activeCustom={active.password} setPassword={setPassword} toggleActiveCustom={(val) => toggleActive("password", val)} errorMessageCustom={errorMessages.password} />
              <PasswordInput activeCustom={active.passwordAgain} setPassword={setPasswordAgain} toggleActiveCustom={(val) => toggleActive("passwordAgain", val)} errorMessageCustom={errorMessages.passwordAgain} placeholder="再入力パスワード" />
            </Block>

            <Block style={{ marginTop: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
              <Checkbox
                color="#F69896"
                style={{ marginVertical: 8, marginHorizontal: 8, }}
                labelStyle={{ color: "#F69896" }}
                label="利用規約に同意する"
                initialValue={isAgreedUserpolicy}
                onChange={(value) => setIsAgreedUserpolicy(value)}
              />
              <Text style={{ color: "lightcoral" }} onPress={handleOpenWithWebBrowser} >利用規約を読む</Text>
            </Block>

            <Block flex top style={{ marginTop: 20 }}>
              {Array.isArray(errorMessages.error) &&
                errorMessages.error.map((message, index) => <BottomMessage style={{ marginBottom: 10, }} textcenter message={message} error key={index} />)
              }

              <Button
                round
                style={{ height: 48, shadowColor: submitButtonParams.buttonColor }}
                color={submitButtonParams.buttonColor}
                disabled={!submitButtonParams.canSubmit || isLoading}
                onPress={submitSignUp}
                loading={isLoading}>

                <Text color={submitButtonParams.buttonTextColor} size={16} bold>次に進む</Text>
              </Button>

              <ToSignInButton navigation={navigation} />
            </Block>
          </Block>
        </KeyboardAvoidingView>
      </Block>
    );
  }

  const SecondPage = () => {
    return (
      <Block flex middle style={styles.signupContainer}>
        <KeyboardAvoidingView behavior="padding" enabled>
          <PlanTemplateContent requestSubscription={requestSubscription} getPurchases={getPurchases} handleSelectedPlan={handleSelectedPlan} />
        </KeyboardAvoidingView>
      </Block>
    );
  }

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0.25, y: 1.1 }}
      locations={[0.2, 1]}
      colors={["white", "mistyrose"]}
      style={[styles.container, { flex: 1, paddingTop: theme.SIZES.BASE * 4 }]}>
      <ScrollView ref={scrollView} style={styles.signupScrollView} horizontal scrollEnabled={false}>
        <Block flex row>
          {FirstPage()}
          {SecondPage()}
        </Block>
      </ScrollView>
    </LinearGradient>
  )
}

export default SignUpTemplate;


const ToSignInButton = (props) => {
  const { navigation } = props;
  return (
    <Button color="transparent" shadowless onPress={() => navigation.navigate("SignIn")}>
      <Text center color="#F69896" size={theme.SIZES.FONT * 0.75}>すでにアカウントをお持ちですか？ サインイン</Text>
    </Button>
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
  signupScrollView: {
    marginTop: 10,
    // backgroundColor: "white",
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
  signupContainer: {
    width: width,
    // backgroundColor: "white",
    padding: 22,
    paddingBottom: 40,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
