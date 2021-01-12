import React from "react";
import { withNavigation } from "@react-navigation/compat";
import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback } from "react-native";
import { Block, Text, theme } from "galio-framework";
import Ionicons from "react-native-vector-icons/Ionicons";

import Icon from "../atoms/Icon";
import Hr from "../atoms/Hr";
import { LinearGradient } from "expo-linear-gradient";


const { width } = Dimensions.get("screen");

const Card = (props) => {
  const { navigation, item, horizontal, full, style, imageStyle, consultant } = props;
  const imageStyles = [styles.image, full ? styles.fullImage : styles.horizontalImage, imageStyle];
  const titleSize = 14;
  const contentSize = 12;
  const userColor = item.color

  return (
    <Block row={horizontal} card flex style={[styles.card, styles.shadow, style, {backgroundColor:userColor, shadowColor: userColor,
    }]}>
      {/* FULL-47: ユーザステータス表示の一時的停止 */}
      {/* <TouchableWithoutFeedback onPress={navigateProfile}>
        <Block style={[styles.statusContainer]}>
          <Block style={[styles.statusIcon, { backgroundColor: item.status.color }]} />
        </Block>
      </TouchableWithoutFeedback> */}
      {item.icon ? 
      <TouchableWithoutFeedback >
      <Block flex >
          <>
            <Block center style={{justifyContent: "center", flex: 1,}}>
              <Icon family="Feather" size={60} name="plus" color="#fff" />
            </Block>
          </>
        
      </Block>
    </TouchableWithoutFeedback> :
      <TouchableWithoutFeedback >
        <Block flex style={styles.description}>
            <>
            <Block style={{flex: 0.5}}>
              <Text p bold color="#fff"style={styles.title} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
              <Text size={contentSize}color="#fff" size={contentSize} style={styles.title} numberOfLines={1} ellipsizeMode="tail">トークルーム</Text>
              </Block>
              
              <Block style={{flex: 0.5, justifyContent: "flex-end",position: "relative"}}>
                <Text numberOfLines={1} ellipsizeMode="clip" size={contentSize} style={[styles.textPale, { lineHeight: contentSize + 2 }]} numberOfLines={2} ellipsizeMode="tail">{item.content}</Text>
              </Block>
            </>
        </Block>
      </TouchableWithoutFeedback> 
      }
    </Block>
  );
}

const ConsultantCard = (props) => {
  return (
    <Card consultant {...props} style={styles.consultantCard} />
  );
}

export default withNavigation(ConsultantCard);


const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    borderWidth: 0,
    minHeight: 114,
    position: "relative"
  },
  title: {
    paddingBottom: 6,
  },
  description: {
    padding: theme.SIZES.BASE / 2,
    justifyContent: "flex-start"
  },
  imageContainer: {
    elevation: 1,
  },
  image: {
    borderRadius: 3,
    marginHorizontal: theme.SIZES.BASE / 2,
    marginTop: -16,
    backgroundColor: "white",
  },
  horizontalImage: {
    height: 122,
    width: "auto",
  },
  fullImage: {
    height: 215,
    width: width - theme.SIZES.BASE * 3,
  },
  shadow: {
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowOpacity: 0.9,
    elevation: 2,
  },
  consultantCard: {
    width: width / 2 - theme.SIZES.BASE * 1.8,
    marginRight: "auto",
    marginLeft: "auto",
  },
  textPale: {
    color: "#fff"
  },
  statusContainer: {
    width: 16,
    height: 16,
    zIndex: 1,
    position: "absolute",
    top: -11,
    left: theme.SIZES.BASE / 1.4,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "white"
  },
  statusIcon: {
    top: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  messageCard: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: theme.COLORS.WHITE,
  },
});