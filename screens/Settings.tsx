import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Block, theme, Text } from "galio-framework";
import * as WebBrowser from "expo-web-browser";

import Icon from "../components/atoms/Icon";
import Hr from "../components/atoms/Hr";
import {
  USER_POLICY_URL,
  VERSION,
  GOOGLE_FORM_URL,
  PRIVACY_POLICY_URL,
  ADMOB_UNIT_ID_SETTINGS,
  ADMOB_BANNER_HEIGHT,
  ADMOB_BANNER_WIDTH,
  isExpo,
} from "../constants/env";
import Admob from "../components/molecules/Admob";
import { OnPress } from "../components/types/Types";

const { width, height } = Dimensions.get("screen");

const Settings: React.FC = () => {
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
    <Block flex center>
      <ScrollView>
        <SettingsTitle title="Fullfiiについて" />
        <SettingsLabel title="バージョン" content={VERSION} />
        <SettingsCard title="利用規約" onPress={_handleOpenWithWebBrowser} />
        <SettingsCard
          title="プライバシーポリシー"
          onPress={_handleOpenWithWebBrowserPrivacyPolicy}
        />
        <SettingsCard
          title="お問い合わせ"
          onPress={_handleOpenWithWebBrowserContactUsForm}
        />
      </ScrollView>

      <Block style={styles.adMobBanner}>
        {!isExpo && <Admob adUnitId={ADMOB_UNIT_ID_SETTINGS} />}
      </Block>
    </Block>
  );
};

export default Settings;

const SettingsTitle: React.FC<{ title: string }> = (props) => {
  const { title } = props;
  return (
    <Block
      flex
      style={{ paddingHorizontal: 15, paddingVertical: 10, marginTop: 5 }}
    >
      <Text size={18} bold color="gray">
        {title}
      </Text>
    </Block>
  );
};

const SettingsCard: React.FC<{ title: string; onPress: OnPress }> = (props) => {
  const { title, onPress } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <Block flex row style={styles.settingsCard}>
        <Block flex={0.9}>
          <Text bold size={15} color="dimgray" style={{ marginHorizontal: 15 }}>
            {title}
          </Text>
        </Block>
        <Block
          flex={0.1}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Icon
            name="angle-right"
            family="font-awesome"
            color="gray"
            size={22}
          />
        </Block>
      </Block>
      <Hr h={1} color="whitesmoke" />
    </TouchableOpacity>
  );
};

const SettingsLabel: React.FC<{ title: string; content: string }> = (props) => {
  const { title, content } = props;
  return (
    <>
      <Block flex row space="between" style={styles.settingsCard}>
        <Block>
          <Text bold size={15} color="dimgray" style={{ marginHorizontal: 15 }}>
            {title}
          </Text>
        </Block>
        <Block style={{ alignItems: "center", justifyContent: "center" }}>
          <Text size={15} color="dimgray" style={{ marginHorizontal: 15 }}>
            {content}
          </Text>
        </Block>
      </Block>
      <Hr h={1} color="whitesmoke" />
    </>
  );
};

const styles = StyleSheet.create({
  settingsCard: {
    height: 60,
    width: width,
    backgroundColor: "white",
    alignItems: "center",
  },
  container: {
    paddingHorizontal: theme.SIZES.BASE,
    marginVertical: theme.SIZES.BASE,
  },
  submitButton: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "lightcoral",
  },
  adMobBanner: {
    width: ADMOB_BANNER_WIDTH,
    height: ADMOB_BANNER_HEIGHT,
    zIndex: 2,
    position: "absolute",
    bottom: 0,
  },
});
