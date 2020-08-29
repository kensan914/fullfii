import React, { useState, createContext } from "react";
import { withNavigation } from "@react-navigation/compat";
import { TouchableOpacity, StyleSheet, Platform, Dimensions, Keyboard, Image } from "react-native";
import { Button, Block, NavBar, Input, Text, theme, Toast } from "galio-framework";

import Icon from "../atoms/Icon";
import materialTheme from "../../constants/Theme";
import { MenuModal } from "../molecules/Menu";
import { EndConsultation, EndConsultationScreen } from "./Chat";
import { useSafeArea } from "react-native-safe-area-context";

const { height, width } = Dimensions.get("window");
const iPhoneX = () => Platform.OS === "ios" && (height === 812 || width === 812 || height === 896 || width === 896);

// const ChatButton = ({ isWhite, style, navigation }) => (
//   <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate("Chat")}>
//     <Icon
//       family="GalioExtra"
//       size={16}
//       name="chat-33"
//       color={theme.COLORS[isWhite ? "WHITE" : "ICON"]}
//     />
//     <Block middle style={styles.notify} />
//   </TouchableOpacity>
// );

const BasketButton = ({ isWhite, style, navigation }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate("Cart")}>
    <Icon
      family="GalioExtra"
      size={16}
      name="basket-simple"
      color={theme.COLORS[isWhite ? "WHITE" : "ICON"]}
    />
    <Block middle style={styles.notify} />
  </TouchableOpacity>
);

const MenuButton = ({ navigation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEndConsultation, setIsOpenEndConsultation] = useState(false);

  return (
    <TouchableOpacity style={[styles.button, {}]} onPress={() => setIsOpen(true)}>
      <Icon family="font-awesome" size={20} name="ellipsis-h" color="gray" />
      <MenuModal isOpen={isOpen} setIsOpen={setIsOpen} items={[
        { title: "相談を終了する", onPress: () => EndConsultation(navigation, isOpenEndConsultation, setIsOpenEndConsultation) },
        { title: "通報する", onPress: () => { } },
      ]} otherModal={<EndConsultationScreen navigation={navigation} isOpen={isOpenEndConsultation} setIsOpen={setIsOpenEndConsultation} />} />
    </TouchableOpacity >
  );
};

export const HeaderContext = createContext();

const Header = (props) => {
  const { back, title, white, transparent, navigation, scene, profile } = props;

  const renderRight = () => {
    if (scene.route.name === "Chat") return (
      <MenuButton key="basket-search" navigation={navigation} />
    );
    switch (title) {
      case "Home":
      case "Notification":
      case "":
        return (
          // <ChatButton key="chat-search" navigation={navigation} isWhite={white} />,
          <BasketButton key="basket-search" navigation={navigation} isWhite={white} />
        );
      default:
        break;
    }
  }

  const renderLeft = () => {
    switch (scene.route.name) {
      case "Chat":
        return (
          <TouchableOpacity style={{ marginBottom: 5, height: 50, width: 40, justifyContent: "center", alignItems: "center" }}
            onPress={() => EndConsultation(navigation, isOpenEndConsultation, setIsOpenEndConsultation)}>
            <Icon family="font-awesome" size={16} name="close" color="gray" />
          </TouchableOpacity>
        );
      default:
        return (
          <TouchableOpacity onPress={handleLeftPress}>
            <Image source={{ uri: profile.image }} style={styles.avatar} />
          </TouchableOpacity >
        );
    }
  }

  const handleLeftPress = () => {
    if (back)
      navigation.goBack();
    else
      navigation.openDrawer();
  }

  const [isOpenEndConsultation, setIsOpenEndConsultation] = useState(false);
  const renderOthers = () => {
    if (scene.route.name === "Chat") {
      return (
        <EndConsultationScreen navigation={navigation} isOpen={isOpenEndConsultation} setIsOpen={setIsOpenEndConsultation} />
      );
    }
  }

  const convertTitle = (prevTitle) => {
    switch (prevTitle) {
      case "Home":
        return "ホーム";
      case "Notification":
        return "通知";
      case "ProfileEditor":
        return "プロフィール編集";
      case "InputName":
        return "名前";
      case "InputIntroduction":
        return "自己紹介";
      case "InputFeature":
        return "特徴";
      case "InputGenreOfWorries":
        return "対応できる悩みのジャンル";
      case "InputScaleOfWorries":
        return "対応できる悩みの大きさ";
      case "InputWorriesToSympathize":
        return "共感できる悩み";
      case "InputPrivacyName":
        return "プライバシーネーム";
      default:
        return prevTitle;
    }
  }

  const noShadow = ["Home", "Profile", "ProfileEditor"].includes(title);
  const headerStyles = [
    !noShadow ? styles.shadow : null,
    transparent ? { backgroundColor: "rgba(0,0,0,0)" } : null,
  ];

  return (
    <HeaderContext.Provider value={{}}>
      <Block style={headerStyles}>
        <NavBar
          back={back}
          style={styles.navbar}
          transparent={transparent}
          title={convertTitle(title)}
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
        {renderOthers()}
      </Block>
    </HeaderContext.Provider>
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
  avatar: {
    height: 34,
    width: 34,
    borderRadius: 17,
  },
});