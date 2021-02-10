import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Button } from "galio-framework";
import { COLORS } from "../../constants/Theme";

const { width, height } = Dimensions.get("screen");

const ModalButton = (props) => {
  const { icon, iconFamily, colorLess, onPress } = props;

  return (
    <Button
      onlyIcon
      icon={icon}
      iconFamily={iconFamily}
      iconSize={40}
      color={colorLess ? "#b0b0b0" : COLORS.PINK}
      shadowColor={colorLess ? "#717171" : COLORS.PINK}
      iconColor="white"
      style={styles.modalButton}
      onPress={onPress}
    />
  );
};

export default ModalButton;

const styles = StyleSheet.create({
  modalButton: {
    width: width / 5.5,
    height: width / 5.5,
  },
});
