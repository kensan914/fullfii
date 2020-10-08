import React, { useState } from "react";
import { StyleSheet, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { Block, theme, Text, Input, Button, Checkbox } from "galio-framework";
import * as WebBrowser from "expo-web-browser";

import { Hr, Icon } from "../componentsEx";
import { useAuthDispatch } from "../componentsEx/contexts/AuthContext";
import { alertModal } from "../componentsEx/tools/support";
import { useNotificationDispatch } from "../componentsEx/contexts/NotificationContext";
import { useChatDispatch } from "../componentsEx/contexts/ChatContext";
import { USER_POLICY_URL } from "../constantsEx/env"
import { GOOGLE_FORM_URL } from "../constantsEx/env"


const { width, height } = Dimensions.get("screen");

const Settings = (props) => {
  const { screen } = props.route.params;
  const { navigation } = props;
  const authDispatch = useAuthDispatch();
  const notificationDispatch = useNotificationDispatch();
  const chatDispatch = useChatDispatch();

  const _handleOpenWithWebBrowser = () => {
    WebBrowser.openBrowserAsync(USER_POLICY_URL);
  };

  const _handleOpenWithWebBrowserContactUsForm = () => {
    WebBrowser.openBrowserAsync(GOOGLE_FORM_URL);
  };

  if (typeof screen === "undefined")
    return (
      <ScrollView>
        <SettingsTitle title="アカウント" />
        <SettingsCheckBox title="異性との相談を許可" />
        <SettingsExplain explain="異性との相談を許可している他ユーザーも一覧に表示され相談ができるようになります。" />
        <SettingsCard title="メールアドレス" onPress={() => navigation.navigate("SettingsInput", { screen: "InputEmail" })} />
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
        <SettingsCard title="利用規約" onPress={_handleOpenWithWebBrowser} />
        <SettingsCard title="プライバシーポリシー" onPress={_handleOpenWithWebBrowser} />
        <SettingsCard title="特定商取引法に基づく表示" onPress={_handleOpenWithWebBrowser} />
        <SettingsCard title="お問い合わせ" onPress={_handleOpenWithWebBrowserContactUsForm} />
      </ScrollView>
    );
}


export default Settings;


const SettingsTitle = (props) => {
  const { title } = props;
  return (
    <Block flex style={{ paddingHorizontal: 15, paddingVertical: 10, marginTop: 5 }}>
      <Text size={18} bold color="gray" >{title}</Text>
    </Block>
  );
}

const SettingsExplain = (props) => {
  const { explain } = props;
  return (
    <Block flex style={{ paddingHorizontal: 15, paddingTop: 5, paddingBottom: 25, marginTop: 5 }}>
      <Text size={12} bold color="gray" >{explain}</Text>
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

const SettingsCheckBox = (props) => {
  const { title } = props;
  return (
    <>
      <Block flex row space="between" style={styles.settingsCard}>
        <Block>
          <Text bold size={15} color="dimgray" style={{ marginHorizontal: 15 }}>{title}</Text>
        </Block>
        <Block style={{ alignItems: "center", justifyContent: "center" }} >
          <Checkbox
            color="#F69896"
            style={{ marginVertical: 8, marginHorizontal: 15, }}
            labelStyle={{ color: "#F69896" }}
            label=""
            onChange={(value) => {

            }}
          />
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
