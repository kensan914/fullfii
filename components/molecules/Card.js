import React from "react";
import { StyleSheet, Dimensions, TouchableWithoutFeedback } from "react-native";
import { Block, Text, theme } from "galio-framework";
import Icon from "../atoms/Icon";
import { COLORS } from "../../constants/Theme";


const { width } = Dimensions.get("screen");


/**
 *
 * @param {*} props
 * item = {title, color, content, borderColor, borderLess}
 * icon-base item = {icon, iconFamily, iconColor}
 */
const Card = (props) => {
  const { item, style, onPress, countNum } = props;
  const titleSize = 17;
  const contentSize = 12;
  const backgroundColor = item.color ? item.color : COLORS.PINK;

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
    >
      <Block
        card
        flex
        style={[styles.card, style,
        {
          backgroundColor: backgroundColor,
          shadowColor: backgroundColor,
        },
        item.borderColor && {
          borderWidth: 2,
          borderColor: item.borderColor,
        },
        item.borderLess ? {} : styles.shadow,
        ]}
      >
        {item.icon ?
          <Block flex style={styles.content}>
            <Block center flex justifyContent="center">
              <Icon
                family={item.iconFamily ? item.iconFamily : "fontawesome"}
                size={60}
                name={item.icon}
                color={item.iconColor ? item.iconColor : "white"}
              />
            </Block>
          </Block> :
          <Block flex style={styles.content}>
            <Block row style={[styles.titleContainer, { height: titleSize + 5 }]}>
              <Text
                bold
                color="white"
                size={titleSize}
                style={styles.title}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.title}
              </Text>

              
            </Block>

            <Block style={styles.messageContainer}>
              <Text
                numberOfLines={1}
                ellipsizeMode="clip"
                size={contentSize}
                style={[styles.textPale, { lineHeight: contentSize + 2 }]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.content}
              </Text>
            </Block>
          </Block>
        }
      </Block>
    </TouchableWithoutFeedback>
  );
}

export default Card;


const styles = StyleSheet.create({
  card: {
    marginVertical: 7,
    borderWidth: 0,
    minHeight: 114,
    position: "relative",
    width: width / 2 - theme.SIZES.BASE * 1.8,
    marginRight: "auto",
    marginLeft: "auto",
  },
  content: {
    padding: theme.SIZES.BASE / 2,
    justifyContent: "space-between",
  },
  shadow: {
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowOpacity: 0.9,
    elevation: 2,
  },
  textPale: {
    color: "white",
  },
  messageContainer: {
    justifyContent: "flex-end",
    position: "relative",
  },
  titleContainer: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
  },
  counter: {
    backgroundColor: COLORS.ALERT,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
});