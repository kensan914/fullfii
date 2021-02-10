import React from "react";
import { StyleSheet } from "react-native";
import { theme, Block } from "galio-framework";

const StatusIcon = () => {
  return (
    <Block style={[styles.statusContainer]}>
      <Block style={[styles.statusIcon, { backgroundColor: "#6dd39d" }]} />
    </Block>
  );
};

export default StatusIcon;

const styles = StyleSheet.create({
  statusContainer: {
    width: 12,
    height: 12,
    zIndex: 1,
    position: "absolute",
    top: -7,
    left: theme.SIZES.BASE / 1.4,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "white",
  },
  statusIcon: {
    top: 2,
    width: 8,
    height: 8,
    borderRadius: 6,
  },
});
