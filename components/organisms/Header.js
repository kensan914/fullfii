import React, { useState, useEffect } from "react";
import { withNavigation } from "@react-navigation/compat";
import { TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Block, NavBar, theme } from "galio-framework";

import Icon from "../atoms/Icon";
import materialTheme from "../../constants/Theme";
import { TalkMenuButton } from "./Chat";
import Avatar from "../atoms/Avatar";
import { useChatDispatch } from "../contexts/ChatContext";
import { useNotificationDispatch } from "../contexts/NotificationContext";
import { useAuthState } from "../contexts/AuthContext";
import { ProfileMenuButton } from "./ProfileMenuButton";
import { checkiPhoneX } from "../modules/support";
import { useProfileState } from "../contexts/ProfileContext";
import ProfileModal from "../molecules/ProfileModal";
import { logEvent } from "../modules/firebase/logEvent";

const { height, width } = Dimensions.get("window");

const SettingsButton = ({ isWhite, style, navigation }) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={() => navigation.navigate("Settings")}
  >
    <Icon
      family="font-awesome"
      size={22}
      name="gear"
      color={isWhite ? "white" : "dimgray"}
    />
    {/* <Block middle style={styles.notify} /> */}
  </TouchableOpacity>
);

const Header = (props) => {
  const {
    back,
    title,
    name,
    white,
    transparent,
    navigation,
    scene,
    profile,
    talkTicketKey,
  } = props;
  const authState = useAuthState();
  const profileState = useProfileState();
  const notificationDispatch = useNotificationDispatch();
  const chatDispatch = useChatDispatch();

  const renderRight = () => {
    const routeName = scene.route.name;
    if (routeName === "Chat" && talkTicketKey)
      return (
        <TalkMenuButton
          key="TalkMenuButton"
          navigation={navigation}
          talkTicketKey={talkTicketKey}
        />
      );
    switch (name) {
      case "Profile":
        if (scene.route.params && scene.route.params.item) {
          if (!scene.route.params.item.me)
            return (
              <ProfileMenuButton
                key="ProfileMenuButton"
                navigation={navigation}
                user={scene.route.params.item}
              />
            );
        }
        break;
      case "Home":
      case "WorryList":
      case "Talk":
      case "Notification":
        return (
          <SettingsButton
            key="Settings"
            navigation={navigation}
            isWhite={white}
          />
        );
      default:
        break;
    }
  };

  const renderLeft = (setIsOpenProfile) => {
    if (back) {
      return (
        <TouchableOpacity
          onPress={() => handleLeftPress(setIsOpenProfile)}
          style={styles.backIconContainer}
        >
          <Icon
            family="font-awesome"
            size={30}
            name="angle-left"
            color={transparent ? "white" : "dimgray"}
          />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => handleLeftPress(setIsOpenProfile)}>
          <Avatar size={34} image={profile.image} />
        </TouchableOpacity>
      );
    }
  };

  const handleLeftPress = (setIsOpenProfile) => {
    if (back) navigation.goBack();
    // navigation.navigate("Profile", { item: profileState.profile });
    else setIsOpenProfile(true);
  };

  const [currentScreenName, setCurrentScreenName] = useState(name);
  if (currentScreenName !== name) setCurrentScreenName(name);
  // 画面遷移するたびに呼ばれる
  useEffect(() => {
    if (currentScreenName === "Chat") {
      chatDispatch({
        type: "READ_BY_ROOM",
        talkTicketKey: scene.route.params.talkTicketKey,
      });
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
      case "InputGender":
        return "性別";
      case "InputIntroduction":
        return "今悩んでいること";
      case "InputFeature":
        return "特徴";
      case "InputGenreOfWorries":
        return "話したい悩みのジャンル";
      case "InputScaleOfWorries":
        return "話せる悩みの大きさ";
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
      case "WorryList":
        return "つぶやき";
      case "Worry":
        return "つぶやき";
      case "WorryPost":
        return "つぶやく";
      case "WorrySelect":
        return "悩み選択";
      default:
        return name;
    }
  };

  const hasShadow = !["Home", "Profile", "Worry"].includes(name);
  const hasBorder = ["Home", "Worry"].includes(name);
  const headerStyles = [
    hasShadow ? styles.shadow : null,
    transparent ? { backgroundColor: "rgba(0,0,0,0)" } : null,
    hasBorder ? { borderBottomColor: "silver", borderBottomWidth: 0.5 } : null,
  ];
  const [isOpenProfile, setIsOpenProfile] = useState(false);

  return (
    <Block style={headerStyles}>
      <NavBar
        style={styles.navbar}
        transparent={transparent}
        title={convertNameToTitle(name)}
        titleStyle={[
          styles.title,
          { color: theme.COLORS[white ? "WHITE" : "ICON"] },
        ]}
        right={renderRight()}
        rightStyle={{ alignItems: "flex-end" }}
        left={renderLeft(setIsOpenProfile)}
        leftStyle={styles.leftStyle}
        leftIconColor={white ? theme.COLORS.WHITE : theme.COLORS.ICON}
        onLeftPress={() => handleLeftPress(setIsOpenProfile)}
      />
      <ProfileModal
        isOpen={isOpenProfile}
        setIsOpen={setIsOpenProfile}
        profile={profileState.profile}
      />
    </Block>
  );
};

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
    paddingTop: checkiPhoneX(Dimensions)
      ? theme.SIZES.BASE * 4
      : theme.SIZES.BASE,
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
  leftStyle: {
    flex: 0.3,
  },
  backIconContainer: {
    height: "100%",
    justifyContent: "center",
  },
});
