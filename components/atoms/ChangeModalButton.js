import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Button } from "galio-framework";
import materialTheme from "../../constants/Theme";
import { withNavigation } from "@react-navigation/compat";

const { width, height } = Dimensions.get("screen");

const ChangeButton = (props) => {
  const { icon, iconFamily, color } = props;

  return (
    <Button
      onlyIcon
      icon={icon}
      iconFamily={iconFamily}
      iconSize={40}
      color={color ? materialTheme.COLORS.FULLFII : "#b0b0b0"}
      iconColor="white"
      style={styles.ChangeButton}
      shadowColor={color ? materialTheme.COLORS.FULLFII : "#b0b0b0"}
      onPress={() => {
        props.navigation.navigate("ChatModal");
      }}
    />
  );
}

export default withNavigation(ChangeButton);

const styles = StyleSheet.create({
  ChangeButton: {
    width: width / 6,
    height: width / 6,
    //right: 10,
    //bottom: 10,
    //paddingRight: 3,   // for edit icon
    //paddingBottom: 1,  // for edit icon
  },
});