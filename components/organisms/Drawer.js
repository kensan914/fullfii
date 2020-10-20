import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Block, Text, theme } from "galio-framework";

import Icon from "../atoms/Icon";
import materialTheme from "../../constants/Theme";
import { convertTitle } from "../../constants/converters";


export default class DrawerItem extends React.Component {
  renderIcon = () => {
    const { item, focused } = this.props;

    switch (item) {
      case "Profile":
        return (
          <Icon
            size={15}
            name="circle-10"
            family="GalioExtra"
            color={materialTheme.COLORS.MUTED}
          />
        );
      case "Settings":
        return (
          <Icon
            size={15}
            name="gears"
            family="font-awesome"
            color={materialTheme.COLORS.MUTED}
          />
        );
      default:
        return null;
    }
  };

  render() {
    const { item, focused, navigation, profile } = this.props;
    return (
      <TouchableOpacity
        style={{ height: 55 }}
        onPress={() => navigation.navigate(item, { item: profile })}
      >
        <Block
          flex
          row
          style={[
            styles.defaultStyle,
          ]}
        >
          <Block middle flex={0.1} style={{ marginRight: 28 }}>
            {this.renderIcon()}
          </Block>
          <Block flex={0.9}>
            <Text size={15} color={"black"}>
              {convertTitle(item)}
            </Text>
          </Block>
        </Block>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 6
  },
  activeStyle: {
    backgroundColor: materialTheme.COLORS.ACTIVE,
    borderRadius: 4
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.2
  }
});
