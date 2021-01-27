import React from "react";
import { StyleSheet } from "react-native";
import { withNavigation } from "@react-navigation/compat";
import { Block } from "galio-framework";

import { useChatState } from "../components/contexts/ChatContext";
import HomeTemplate from "../components/templates/HomeTemplate";
import { CARD_COLORS } from "../constants/Theme";
import { ADMOB_BANNER_HEIGHT, ADMOB_BANNER_WIDTH, ADMOB_UNIT_ID_HOME, isExpo } from "../constants/env";
import Admob from "../components/molecules/Admob";


const Home = (props) => {
  const chatState = useChatState();
  const talkTickets = Object.values(chatState.talkTicketCollection);

  const rooms = talkTickets.map(talkTicket => {
    const choiceColor = () => {
      if (!CARD_COLORS[talkTicket.worry.key]) {
        return CARD_COLORS[talkTicket.worry.key % 10];
      }
      return CARD_COLORS[talkTicket.worry.key];
    }

    return {
      title: talkTicket.worry.label,
      color: choiceColor(),
      content: talkTicket.room.messages[talkTicket.room.messages.length - 1]?.message,
      onPress: () => {
        props.navigation.navigate("Chat", { talkTicketKey: talkTicket.worry.key });
      },
      countNum: talkTicket.room.unreadNum,
    };
  });

  const firstItem = {
    icon: "plus",
    iconFamily: "Feather",
    iconColor: "white",
    color: "gainsboro",
    borderLess: true,
    onPress: () => {
      props.navigation.navigate("WorrySelect");
    }
  };

  const items = [firstItem, ...rooms];

  return (
    <Block flex style={styles.container}>
      <HomeTemplate items={items} />

      <Block style={styles.adMobBanner}>
        {!isExpo &&
          <Admob
            adSize={"banner"}
            adUnitID={ADMOB_UNIT_ID_HOME}
          />
        }
      </Block>
    </Block>
  );
}

export default withNavigation(Home);


const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignItems: "center",
  },
  adMobBanner: {
    width: ADMOB_BANNER_WIDTH,
    height: ADMOB_BANNER_HEIGHT,
    zIndex: 2,
    position: "absolute",
    bottom: 0,
  },
});
