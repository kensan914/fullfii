import React, { useState, useEffect } from "react";
import { withNavigation } from "@react-navigation/compat";
import { TouchableOpacity, StyleSheet, Platform, Dimensions } from "react-native";
import { Block, NavBar, theme } from "galio-framework";

import Icon from "../atoms/Icon";
import materialTheme from "../../constants/Theme";
import { TalkMenuButton } from "./Chat";
import Avatar from "../atoms/Avatar";
import { useChatDispatch } from "../contexts/ChatContext";
import { useNotificationDispatch } from "../contexts/NotificationContext";
import { useAuthState } from "../contexts/AuthContext";


const { height, width } = Dimensions.get("window");
const iPhoneX = () => Platform.OS === "ios" && (height === 812 || width === 812 || height === 896 || width === 896);

const ProPlanButton = ({ isWhite, style, navigation }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate("Plan")}>
    <Icon
      family="font-awesome"
      size={16}
      name="id-card-o"
      color={theme.COLORS[isWhite ? "WHITE" : "ICON"]}
    />
    {/* <Block middle style={styles.notify} /> */}
  </TouchableOpacity>
);

const Header = (props) => {
  const { back, title, name, white, transparent, navigation, scene, profile, talkObj } = props;
  const authState = useAuthState();
  const notificationDispatch = useNotificationDispatch();
  const chatDispatch = useChatDispatch();

  const renderRight = () => {
    if (scene.route.name === "Chat" && talkObj) return (
      <TalkMenuButton key="TalkMenuButton" navigation={navigation} talkObj={talkObj} />
    );
    switch (name) {
      case "Home":
      case "Talk":
      case "Notification":
      case "Profile":
        return (
          // <ChatButton key="chat-search" navigation={navigation} isWhite={white} />,
          <ProPlanButton key="Plan" navigation={navigation} isWhite={white} />
        );
      default:
        break;
    }
  }

  const renderLeft = () => {
    return (
      <TouchableOpacity onPress={handleLeftPress}>
        <Avatar size={34} image={profile.image} />
      </TouchableOpacity >
    );
  }

  const handleLeftPress = () => {
    if (back)
      navigation.goBack();
    else
      navigation.openDrawer();
  }

  const [currentScreenName, setCurrentScreenName] = useState(name);
  if (currentScreenName !== name) setCurrentScreenName(name);
  // 画面遷移するたびに呼ばれる
  useEffect(() => {
    if (currentScreenName === "Chat") {
      chatDispatch({ type: "READ_BY_ROOM", roomID: scene.route.params.roomID });
    } else if (currentScreenName === "Notification") {
      notificationDispatch({ type: "PUT_READ", token: authState.token });
    }
  }, [currentScreenName]);

  const convertNameToTitle = (name) => {
    switch (name) {
      case "Home":
        return "ホーム";
      case "Talk":
        return "トーク";
      case "Notification":
        return "通知";
      case "Profile":
        return "";
      case "ProfileEditor":
        return "プロフィール編集";
      case "InputName":
        return "ユーザネーム";
      case "InputIntroduction":
        return "自己紹介";
      case "InputFeature":
        return "特徴";
      case "InputGenreOfWorries":
        return "話したい悩みのジャンル";
      case "InputScaleOfWorries":
        return "話せる悩みの大きさ";
      case "InputWorriesToSympathize":
        return "共感できる悩み";
      case "InputPrivacyName":
        return "プライバシーネーム";
      case "InputEmail":
        return "メールアドレス";
      case "InputPassword":
        return "パスワード";
      case "Chat":
        return title;
      case "Plan":
        return "プラン";
      case "Settings":
      case "SettingsInput":
        return "設定";
      default:
        return name;
    }
  }

  const noShadow = ["Home", "Profile"].includes(name);
  const headerStyles = [
    !noShadow ? styles.shadow : null,
    transparent ? { backgroundColor: "rgba(0,0,0,0)" } : null,
  ];

  return (
    <Block style={headerStyles}>
      <NavBar
        back={back}
        style={styles.navbar}
        transparent={transparent}
        title={convertNameToTitle(name)}
        titleStyle={[
          styles.title,
          { color: theme.COLORS[white ? "WHITE" : "ICON"], },
        ]}
        right={renderRight()}
        rightStyle={{ alignItems: "flex-end" }}
        left={renderLeft()}
        leftStyle={{ paddingTop: 3, flex: 0.3 }}
        leftIconColor={white ? theme.COLORS.WHITE : theme.COLORS.ICON}
        onLeftPress={handleLeftPress}
      />
    </Block>
  );
}

export default withNavigation(Header);

const styles = StyleSheet.create({
  button: {
    padding: 12,
    position: "relative",
  },
  title: {
    width: "100%",
    fontSize: 16,
    fontWeight: "bold",
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: iPhoneX ? theme.SIZES.BASE * 4 : theme.SIZES.BASE,
    zIndex: 5,
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  notify: {
    backgroundColor: materialTheme.COLORS.LABEL,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: "absolute",
    top: 8,
    right: 8,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },
});