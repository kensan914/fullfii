import React from "react";
import { Block } from "galio-framework";
import Icon from "./Icon";
import { Image, StyleSheet } from "react-native";

const Avatar = (props) => {
  const { size, border, style, image } = props;
  const avatarStyle = {
    height: size,
    width: size,
    borderRadius: size / 2,
  };

  if (!image) {
    return (
      <Block style={[avatarStyle, style, { alignSelf: "center", justifyContent: "center", backgroundColor: "darkgray" }]} >
        <Icon family="font-awesome" size={size} name="user-circle-o" color="whitesmoke" />
      </Block>
    );
  } else if (border) {
    const additionalSize = 10;
    return (
      <Block style={[styles.avatarContainer, {
        height: size + additionalSize,
        width: size + additionalSize,
        borderRadius: (size + additionalSize) / 2,
      }]}>
        <Image source={{ uri: image }} style={[avatarStyle, style]} />
      </Block>
    );
  } else {
    return (
      <Image source={{ uri: image }} style={[avatarStyle, style]} />
    );
  }
}

export default Avatar;

const styles = StyleSheet.create({
  avatarContainer: {
    backgroundColor: "white",
    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});