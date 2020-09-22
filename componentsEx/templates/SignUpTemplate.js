import React, { useRef, useState } from "react";
import { Dimensions, StyleSheet, KeyboardAvoidingView, Platform, Keyboard, ScrollView } from "react-native";
import { Block, Button, Input, Text, theme, Checkbox, Icon } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";

import { HeaderHeight } from "../../constantsEx/utils";
import BirthdayPicker from "../atoms/BirthdayPicker";
import { TouchableWithoutFeedback } from "react-native";


const { height, width } = Dimensions.get("window");

const SignUpTemplate = (props) => {
  const { requestSignUp, navigation, active, toggleActive, getSubmitButtonParams, isLoading, setIsLoading, chatState, dispatches,
    handleOpenWithWebBrowser, BottomMessage, EmailInput, PasswordInput, initActive } = props;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState();
  const [isAgreedUserpolicy, setIsAgreedUserpolicy] = useState(false);

  const genderEnum = { "MALE": "male", "FEMALE": "female" };
  const [gender, setGender] = useState("");

  const [isOpenBirthdayPicker, setIsOpenBirthdayPicker] = useState(false);
  const toggleIsOpenBirthdayPicker = (value) => {
    Keyboard.dismiss();
    initActive();
    setIsOpenBirthdayPicker(value);
  }

  const errorMessagesInit = {
    username: "",
    email: "",
    password: "",
    birthday: "",
    error: "", // common error message
  };
  const [errorMessages, setErrorMessages] = useState(errorMessagesInit);

  const submitButtonParams = getSubmitButtonParams(username && email && password && birthday && isAgreedUserpolicy && gender);
  const submitSignUp = () => {
    requestSignUp(username, email, password, birthday, dispatches, chatState, setErrorMessages, errorMessagesInit, setIsLoading);
  }

  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = 1; // 
  const scrollView = useRef(null);

  const goNextPage = () => {
    scrollView.current.scrollTo({ y: 0, x: width * currentPage, animated: true });
    setCurrentPage(currentPage - 1);
  }

  const pushNext = () => {
    goNextPage();
  }

  const goPrevPage = () => {
    scrollView.current.scrollTo({ y: 0, x: width * currentPage, animated: true });
    setCurrentPage(currentPage + 1);
  }

  const pushBack = () => {
    goPrevPage();
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
              <PasswordInput active={active} setPassword={setPassword} toggleActive={toggleActive} errorMessages={errorMessages} />

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
            </Block>

            <Block style={{ marginVertical: 20, flexDirection: "row", width: width / 3, minWidth: "80%", justifyContent: "space-evenly", alignItems: "center" }}>
              <GenderRadioButton label="女性" genderKey="FEMALE" gender={gender} setGender={setGender} genderEnum={genderEnum} />
              <GenderRadioButton label="男性" genderKey="MALE" gender={gender} setGender={setGender} genderEnum={genderEnum} />
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
                disabled={!submitButtonParams.canSubmit}
                onPress={pushNext}
                loading={isLoading}
              >
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
          <Block style={{ alignItems: "flex-start" }}>
            <Icon family="font-awesome" name="chevron-left" size={15} color="silver" onPress={pushBack} />
          </Block>
          <Block flex={0.1} style={{ alignItems: "center" }}>
            <Text size={26} bold color="#F69896">プランの選択</Text>
          </Block>
          <Block flex={0.7} center space="between">

            <Block flex style={{ marginTop: 20 }}>
              {Array.isArray(errorMessages.error) &&
                errorMessages.error.map((message, index) => <BottomMessage style={{ marginBottom: 10, }} textcenter message={message} error key={index} />)
              }

              <Button
                style={{ height: 80, shadowColor: "lightcoral", borderRadius: 20 }}
                color="lightcoral"
                onPress={submitSignUp}
              >
                <Text color="white" size={20} bold>2週間無料お試し</Text>
              </Button>
              <Block style={{ padding: 10, paddingBottom: 20 }}>
                <Text color="silver" size={12} bold center>お試し期間終了後自動でノーマルに更新されます。</Text>
                <Text color="silver" size={12} bold center>キャンセルしない限り、プランは毎月自動更新されます。</Text>
              </Block>

              <Button
                style={{ height: 80, shadowColor: "lightcoral", borderRadius: 20 }}
                color="lightcoral"
                onPress={submitSignUp}
              >
                <Text color="white" size={20} bold>ノーマル</Text>
                <Text color="white" size={16} bold>￥500 / 月</Text>
              </Button>
              <Block style={{ padding: 10, paddingBottom: 20 }}>
                <Text color="silver" size={12} bold center>キャンセルしない限り、プランは毎月自動更新されます。</Text>
              </Block>
              <Button
                style={{ height: 80, shadowColor: "lightcoral", borderRadius: 20 }}
                color="lightcoral"
                onPress={submitSignUp}
              >
                <Text color="white" size={20} bold>1month</Text>
                <Text color="white" size={16} bold>￥700　一ヶ月のみ</Text>
              </Button>
              <Block style={{ padding: 10, paddingBottom: 20 }}>
                <Text color="silver" size={12} bold center>一ヶ月のみのプランです。</Text>
              </Block>

              <Block style={{ padding: 10 }}>
                <Text color="lightcoral" size={12} bold center>購入を復元する</Text>
              </Block>
              <Block style={{ padding: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Text color="#F69896" size={12} bold center onPress={handleOpenWithWebBrowser} >利用規約</Text>
                <Text color="silver" size={12} bold center >と</Text>
                <Text color="#F69896" size={12} bold center onPress={handleOpenWithWebBrowser}>プライバシーポリシー</Text>
              </Block>

              <ToSignInButton navigation={navigation} />
            </Block>
          </Block>
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

const GenderRadioButton = (props) => {
  const { label, genderKey, gender, setGender, genderEnum } = props;
  return (
    <TouchableWithoutFeedback onPress={() => setGender(genderEnum[genderKey])}>
      <Block row style={{ justifyContent: "center", alignItems: "center" }}>
        <Block style={{ height: 20, width: 20, borderRadius: 10, borderWidth: 1, borderColor: "lightgray", justifyContent: "center", alignItems: "center" }}>
          <Block style={{ height: 14, width: 14, borderRadius: 7, backgroundColor: gender === genderEnum[genderKey] ? "#F69896" : "white" }} />
        </Block>
        <Text color="gray" style={{ marginLeft: 5 }}>{label}</Text>
      </Block>
    </TouchableWithoutFeedback>
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
