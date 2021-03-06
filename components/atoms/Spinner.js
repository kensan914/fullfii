import React from "react";
import { Block } from "galio-framework";
import { ActivityIndicator, Dimensions } from "react-native";

const { width, height } = Dimensions.get("screen");

/**
 * custom spinner
 * @param {*} props
 */
const Spinner = (props) => {
  return (
    <Block
      style={{
        width: width,
        height: height,
        position: "absolute",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator color="white" size="large" />
    </Block>
  );
};

export default Spinner;
