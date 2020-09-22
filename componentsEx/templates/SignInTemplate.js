import React, { useState } from "react";
import { Dimensions, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Block, Button, Text, theme } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";

import { HeaderHeight } from "../../constantsEx/utils";


const { height, width } = Dimensions.get("window");

const SignInTemplate = (props) => {
  const { requestSignIn, navigation, active, toggleActive, getSubmitButtonParams, isLoading, setIsLoading, chatState, dispatches,
    BottomMessage, EmailInput, PasswordInput } = props;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const errorMessagesInit = {
    email: "",
    password: "",
    error: "", // common error message
  };
  const [errorMessages, setErrorMessages] = useState(errorMessagesInit);

  const submitButtonParams = getSubmitButtonParams(email && password);
  const submitSignIn = () => {
    requestSignIn(email, password, dispatches, chatState, setErrorMessages, errorMessagesInit, setIsLoading);
  }

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0.25, y: 1.1 }}
      locations={[0.2, 1]}
      colors={["white", "mistyrose"]}
      style={[styles.container, { flex: 1, paddingTop: theme.SIZES.BASE * 4 }]}>
      <Block flex middle>
        <KeyboardAvoidingView behavior="padding" enabled>
          <Block flex={0.1} style={{ alignItems: "center" }}>
            <Text size={26} bold color="#F69896">アカウントを作成</Text>
          </Block>
          <Block flex={0.7} center space="between">

            <Block center>
              <EmailInput active={active} setEmail={setEmail} toggleActive={toggleActive} errorMessages={errorMessages} />
              <PasswordInput active={active} setPassword={setPassword} toggleActive={toggleActive} errorMessages={errorMessages} />
            </Block>

            <Block flex top style={{ marginTop: 20 }}>
              {Array.isArray(errorMessages.error) &&
                errorMessages.error.map((message, index) => <BottomMessage style={{ marginBottom: 10, }} textcenter message={message} error key={index} />)
              }

              <Button
                round
                style={{ height: 48, shadowColor: submitButtonParams.buttonColor }}
                color={submitButtonParams.buttonColor}
                disabled={!submitButtonParams.canSubmit}
                onPress={submitSignIn}
                loading={isLoading}
              >
                <Text color={submitButtonParams.buttonTextColor} size={16} bold>完了</Text>
              </Button>

              <ToSignUpButton navigation={navigation} />
            </Block>
          </Block>
        </KeyboardAvoidingView>
      </Block>
    </LinearGradient>
  );
}

export default SignInTemplate;


const ToSignUpButton = (props) => {
  const { navigation } = props;
  return (
    <Button color="transparent" shadowless onPress={() => navigation.navigate("SignUp")}>
      <Text center color="#F69896" size={theme.SIZES.FONT * 0.75}>アカウントをお持ちではありませんか？サインアップ</Text>
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
});
