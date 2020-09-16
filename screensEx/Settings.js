import React, { useState } from "react";
import { StyleSheet, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { Block, theme, Text, Input, Button } from "galio-framework";
import * as WebBrowser from "expo-web-browser";

import { Hr, Icon } from "../componentsEx";
import { useAuthDispatch } from "../componentsEx/contexts/AuthContext";
import { alertModal } from "../componentsEx/tools/support";
import { useNotificationDispatch } from "../componentsEx/contexts/NotificationContext";
import { useChatDispatch } from "../componentsEx/contexts/ChatContext";


const { width, height } = Dimensions.get("screen");

const Settings = (props) => {
  const { screen } = props.route.params;
  const { navigation } = props;
  const [value, setValue] = useState("");
  const authDispatch = useAuthDispatch();
  const notificationDispatch = useNotificationDispatch();
  const chatDispatch = useChatDispatch();

  _handleOpenWithWebBrowser = () => {
    WebBrowser.openBrowserAsync("https://www.fullfii.com/pages/privacy");
<<<<<<< HEAD
=======
  };

  _handleOpenWithWebBrowserContactUsForm = () => {
    WebBrowser.openBrowserAsync("https://docs.google.com/forms/d/e/1FAIpQLScaGHQYXpvYtPPSIKqVgPdSgM5QY_dzOQeTG6j8Jz16bJWV3A/viewform?usp=sf_link");
>>>>>>> 0122012d298012621185ab3107804672278e67fc
  };

  if (typeof screen === "undefined")
    return (
      <ScrollView>
        <SettingsTitle title="アカウント" />
        <SettingsCard title="メールアドレス" onPress={() => navigation.navigate("SettingsInput", { screen: "InputMailAdress" })} />
        <SettingsCard title="パスワード" onPress={() => navigation.navigate("SettingsInput", { screen: "InputPassword" })} />
        <SettingsButton title="ログアウト" color="crimson" onPress={() => {
          alertModal({
            mainText: "ログアウトします。",
            subText: "本当によろしいですか？",
            cancelButton: "キャンセル",
            okButton: "ログアウト",
            onPress: () => {
              authDispatch({ type: "COMPLETE_LOGOUT", notificationDispatch: notificationDispatch, chatDispatch: chatDispatch });
            },
          });
        }} />
        <SettingsButton title="アカウントを削除" color="silver" onPress={() => { }} />

        <SettingsTitle title="Fullfiiについて" />
        <SettingsLabel title="バージョン" content="1.0.0" />
        <SettingsCard title="利用規約" onPress={this._handleOpenWithWebBrowser} />
        <SettingsCard title="プライバシーポリシー" onPress={this._handleOpenWithWebBrowser} />
        <SettingsCard title="特定商取引法に基づく表示" onPress={this._handleOpenWithWebBrowser} />
        <SettingsCard title="お問い合わせ" onPress={this._handleOpenWithWebBrowserContactUsForm} />
      </ScrollView>
    );
  else if (screen === "InputMailAdress")
    return (
      <ScrollView>
        <Block style={styles.container}>
          <Input
            placeholder={""}
            rounded
            color="black"
            style={{ borderColor: "silver" }}
            placeholderTextColor="gray"
            maxLength={15}
            value={value}
            onChangeText={text => setValue(text)}
          />
          <Text color="red" style={{ paddingHorizontal: 10, paddingVertical: 3 }}>{""}</Text>
          <Button color="#F69896" size="small" round style={styles.submitButton}>決定</Button>
        </Block>
      </ScrollView>
    );
  else if (screen === "InputPassword")
    return (
      <ScrollView>
        <Block style={styles.container}>
          <Input
            placeholder={""}
            rounded
            color="black"
            style={{ borderColor: "silver" }}
            placeholderTextColor="gray"
            maxLength={100}
            value={value}
            onChangeText={text => setValue(text)}
          />
          <Text color="red" style={{ paddingHorizontal: 10, paddingVertical: 3 }}>{""}</Text>
          <Button color="#F69896" size="small" round style={styles.submitButton}>決定</Button>
        </Block>
      </ScrollView>
    );
}

const SettingsTitle = (props) => {
  const { title } = props;
  return (
    <Block flex style={{ paddingHorizontal: 15, paddingVertical: 10, marginTop: 5 }}>
      <Text size={18} bold color="gray" >{title}</Text>
    </Block>
  );
}

const SettingsCard = (props) => {
  const { title, onPress } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <Block flex row style={styles.settingsCard}>
        <Block flex={0.9} >
          <Text bold size={15} color="dimgray" style={{ marginHorizontal: 15 }}>{title}</Text>
        </Block>
        <Block flex={0.1} style={{ alignItems: "center", justifyContent: "center" }} >
          <Icon name="angle-right" family="font-awesome" color="gray" size={22} />
        </Block>
      </Block>
      <Hr h={1} color="whitesmoke" />
    </TouchableOpacity>
  );
}

const SettingsLabel = (props) => {
  const { title, content } = props;
  return (
    <>
      <Block flex row space="between" style={styles.settingsCard}>
        <Block>
          <Text bold size={15} color="dimgray" style={{ marginHorizontal: 15 }}>{title}</Text>
        </Block>
        <Block style={{ alignItems: "center", justifyContent: "center" }} >
          <Text size={15} color="dimgray" style={{ marginHorizontal: 15 }}>{content}</Text>
        </Block>
      </Block>
      <Hr h={1} color="whitesmoke" />
    </>
  );
}

const SettingsButton = (props) => {
  const { title, onPress, color } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <Block flex row style={[styles.settingsCard, { justifyContent: "center", height: 50, marginTop: 8 }]}>
        <Text bold size={15} color={color} style={{ marginHorizontal: 15 }}>{title}</Text>
      </Block>
      <Hr h={1} color="whitesmoke" />
    </TouchableOpacity>
  );
}

export default Settings;

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
