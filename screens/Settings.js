import React from "react";
import { StyleSheet, Dimensions, ScrollView, TouchableOpacity, Switch } from "react-native";
import { Block, theme, Text } from "galio-framework";
import * as WebBrowser from "expo-web-browser";

import Icon from "../components/atoms/Icon";
import Hr from "../components/atoms/Hr";
import { URLJoin } from "../components/modules/support";
import { BASE_URL, USER_POLICY_URL, VERSION, GOOGLE_FORM_URL, PRIVACY_POLICY_URL } from "../constants/env";
import authAxios from "../components/modules/axios";


const { width, height } = Dimensions.get("screen");

const Settings = (props) => {
  const _handleOpenWithWebBrowser = () => {
    WebBrowser.openBrowserAsync(USER_POLICY_URL);
  };

  const _handleOpenWithWebBrowserPrivacyPolicy = () => {
    WebBrowser.openBrowserAsync(PRIVACY_POLICY_URL);
  };

  const _handleOpenWithWebBrowserContactUsForm = () => {
    WebBrowser.openBrowserAsync(GOOGLE_FORM_URL);
  };

  return (
    <ScrollView>
      <SettingsTitle title="Fullfiiについて" />
      <SettingsLabel title="バージョン" content={VERSION} />
      <SettingsCard title="利用規約" onPress={_handleOpenWithWebBrowser} />
      <SettingsCard title="プライバシーポリシー" onPress={_handleOpenWithWebBrowserPrivacyPolicy} />
      {/* <SettingsCard title="特定商取引法に基づく表示" onPress={_handleOpenWithWebBrowser} /> */}
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

const SettingsSwitch = (props) => {
  const { title, onChange, value } = props;
  return (
    <>
      <Block flex row space="between" style={styles.settingsCard}>
        <Block>
          <Text bold size={15} color="dimgray" style={{ marginHorizontal: 15 }}>{title}</Text>
        </Block>
        <Block style={{ alignItems: "center", justifyContent: "center" }} >
          <Switch
            trackColor={{ false: "dimgray", true: "#F69896" }}
            ios_backgroundColor={"gray"}
            // initialValue={value}
            value={value}
            style={{ marginVertical: 8, marginHorizontal: 15, }}
            onValueChange={onChange}
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


const requestDeleteAccount = (token, notificationDispatch, chatDispatch, authDispatch, profileDispatch) => {
  const url = URLJoin(BASE_URL, "me/");

  authAxios(token)
    .delete(url)
    .then(res => {
      authDispatch({ type: "COMPLETE_LOGOUT", notificationDispatch: notificationDispatch, chatDispatch: chatDispatch, profileDispatch: profileDispatch });
    })
    .catch(err => {
      console.log(err);
    });
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
