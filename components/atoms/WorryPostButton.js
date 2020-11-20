import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Button } from "galio-framework";
import materialTheme from "../../constants/Theme";
import { withNavigation } from "@react-navigation/compat";
import { checkSubscribePlan } from "../modules/support";
import { useProfileState } from "../contexts/ProfileContext";


const { width, height } = Dimensions.get("screen");

const WorryPostButton = (props) => {
  const profileState = useProfileState();

  return (
    <Button
      onlyIcon
      icon="edit"
      iconFamily="antdesign"
      iconSize={30}
      color={materialTheme.COLORS.FULLFII}
      iconColor="white"
      style={styles.worryPostButton}
      shadowless
      onPress={() => {
        checkSubscribePlan(profileState.profile, () => props.navigation.navigate("WorryPost"), "現在プランに加入しておりません。相談募集を投稿するにはノーマルプランに加入してください。");
      }}
    />
  );
}

export default withNavigation(WorryPostButton);


const styles = StyleSheet.create({
  worryPostButton: {
    width: width / 7,
    height: width / 7,
    position: "absolute",
    right: 10,
    bottom: 10,
    paddingRight: 3,   // for edit icon
    paddingBottom: 1,  // for edit icon
  },
});