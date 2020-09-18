import React, { useState } from "react";
import { Dimensions, StyleSheet, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { Block, Button, Input, Text, theme, Checkbox } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from 'expo-web-browser';

import { HeaderHeight } from "../../constantsEx/utils";
import BirthdayPicker from "../atoms/BirthdayPicker";
import { useAuthDispatch } from "../contexts/AuthContext";
import { useProfileDispatch } from "../contexts/ProfileContext";
import { useNotificationDispatch } from "../contexts/NotificationContext";
import { useChatDispatch } from "../contexts/ChatContext";
import { USER_POLICY_URL } from "../../constantsEx/env"

const { height, width } = Dimensions.get("window");

const SignInUp = (props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState();
  const [userpolicy, setUserpolicy] = useState();
  const [active, setActive] = useState({
    username: false,
    email: false,
    password: false,
    userpolicy: false
  });
  const errorMessagesInit = {
    username: "",
    email: "",
    password: "",
    birthday: "",
    error: "", // common error message
  };
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState(errorMessagesInit);
  const [isOpenBirthdayPicker, setIsOpenBirthdayPicker] = useState(false);
  const toggleIsOpenBirthdayPicker = (value) => {
    Keyboard.dismiss();
    setActive({ username: false, email: false, password: false, });
    setIsOpenBirthdayPicker(value);
  }

  const toggleActive = (name, value) => {
    active[name] = value;
    const newActive = Object.assign({}, active);
    setActive(newActive);
  }

  const dispatches = {
    authDispatch: useAuthDispatch(),
    profileDispatch: useProfileDispatch(),
    notificationDispatch: useNotificationDispatch(),
    chatDispatch: useChatDispatch(),
  }

  const { navigation, signup, signin, requestSignUp, requestSignIn } = props;
  let buttonColor;
  let buttonTextColor;
  let submit;
  let disabled = true;
  if ((signup && username && email && password && birthday && userpolicy) || (signin && email && password)) {
    buttonColor = "lightcoral";
    buttonTextColor = "white";
    if (signup) {
      submit = () => requestSignUp(username, email, password, birthday, dispatches, setErrorMessages, errorMessagesInit, setIsLoading);
    } else if (signin) {
      submit = () => requestSignIn(email, password, dispatches, setErrorMessages, errorMessagesInit, setIsLoading);
    }
    disabled = false;
  } else {
    buttonColor = "gainsboro";
    buttonTextColor = "silver";
  }

  _handleOpenWithWebBrowser = () => {
    WebBrowser.openBrowserAsync(USER_POLICY_URL);
  };

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
            <Text size={26} bold color="#F69896">{signup ? "アカウントを作成" : (signin && "ログイン")}</Text>
          </Block>
          <Block flex={0.7} center space="between">
            <Block center>
              {signup &&
                <>
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
                </>
              }

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
                onBlur={() => toggleActive("email", false)}
                onFocus={() => toggleActive("email", true)}
                maxLength={225}
              />
              {Array.isArray(errorMessages.email) &&
                errorMessages.email.map((message, index) => <BottomMessage message={message} error key={index} />)
              }

              <Input
                bgColor="transparent"
                placeholderTextColor="darkgray"
                borderless
                color="lightcoral"
                password
                viewPass
                placeholder="パスワード"
                iconColor="#F69896"
                style={[styles.input, active.password ? styles.inputActive : null]}
                onChangeText={text => setPassword(text)}
                onBlur={() => toggleActive("password", false)}
                onFocus={() => toggleActive("password", true)}
                maxLength={30}
                textContentType={'oneTimeCode'}
              />
              {(active.password && !Array.isArray(errorMessages.password)) && <BottomMessage message="8文字以上" />}
              {Array.isArray(errorMessages.password) &&
                errorMessages.password.map((message, index) => <BottomMessage message={message} error key={index} />)
              }

              {signup &&
                <>
                  <Block>
                    <Button shadowless color="transparent" style={{ position: "absolute" }} onPress={() => toggleIsOpenBirthdayPicker(true)} />
                    <Input
                      defaultValue={typeof birthday === "undefined" ? null : `${birthday.getFullYear()}年${birthday.getMonth() + 1}月${birthday.getDate()}日`}
                      bgColor="transparent"
                      placeholderTextColor="darkgray"
                      borderless
                      color="lightcoral"
                      placeholder="生年月日"
                      style={[styles.input, isOpenBirthdayPicker ? styles.inputActive : null]}
                      editable={false}
                      selectTextOnFocus={false}
                    />
                  </Block>
                  {Array.isArray(errorMessages.birthday) &&
                    errorMessages.birthday.map((message, index) => <BottomMessage message={message} error key={index} />)
                  }
                  <BirthdayPicker birthday={birthday} setBirthday={setBirthday} isOpen={isOpenBirthdayPicker} setIsOpen={toggleIsOpenBirthdayPicker} />
                </>
              }

            </Block>

            {signup &&
              <>
                <Block/>
                <Block style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Checkbox
                      color="#F69896"
                      style={{ marginVertical: 8, marginHorizontal: 8, }}
                      labelStyle={{ fontSize: 16 }}
                      initialValue={active.userpolicy}
                      onChange={(value) => {
                        value ? setUserpolicy(true) : setUserpolicy(false);
                      }}
                      />
                        <Text
                          style={{color: '#0066c0'}}
                          onPress={this._handleOpenWithWebBrowser}
                          >利用規約
                        </Text>
                        <Text
                          style={{color: '#F69896'}}
                          onPress={this._handleOpenWithWebBrowser}
                          >に同意する
                        </Text>
                </Block>
              </>
            }

            <Block flex top style={{ marginTop: 20 }}>
              {Array.isArray(errorMessages.error) &&
                errorMessages.error.map((message, index) => <BottomMessage style={{ marginBottom: 10, }} textcenter message={message} error key={index} />)
              }

              <Button
                round
                style={{ height: 48, shadowColor: buttonColor }}
                color={buttonColor}
                disabled={disabled}
                onPress={submit}
                loading={isLoading}
              >
                <Text color={buttonTextColor} size={16} bold>完了</Text>
              </Button>

              {signup &&
                <Button color="transparent" shadowless onPress={() => navigation.navigate("SignIn")}>
                  <Text center color="#F69896" size={theme.SIZES.FONT * 0.75}>すでにアカウントをお持ちですか？ サインイン</Text>
                </Button>
              }
              {signin &&
                <Button color="transparent" shadowless onPress={() => navigation.navigate("SignUp")}>
                  <Text center color="#F69896" size={theme.SIZES.FONT * 0.75}>アカウントをお持ちではありませんか？サインアップ</Text>
                </Button>
              }
            </Block>
          </Block>
        </KeyboardAvoidingView>
      </Block>
    </LinearGradient>
  );
}

export default SignInUp;

const BottomMessage = (props) => {
  const { message, error, style, textcenter } = props;
  return (
    <Block style={[{ alignSelf: "flex-start", width: width * 0.9 }, style]}>
      <Text color={error ? "cornflowerblue" : "lightgray"} bold={error} style={{ alignSelf: textcenter ? "center" : "flex-start" }}>{message}</Text>
    </Block>
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
