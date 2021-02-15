import React from "react";
import { StyleSheet } from "react-native";
import { Block } from "galio-framework";
import { useNavigation } from "@react-navigation/native";

import { useChatState } from "../components/contexts/ChatContext";
import HomeTemplate from "../components/templates/HomeTemplate";
import { CARD_COLORS } from "../constants/Theme";
import {
  ADMOB_BANNER_HEIGHT,
  ADMOB_BANNER_WIDTH,
  ADMOB_UNIT_ID_HOME,
  isExpo,
} from "../constants/env";
import Admob from "../components/molecules/Admob";
import {
  HomeFirstItem,
  HomeItems,
  HomeNavigationProp,
  HomeRooms,
} from "../components/types/Types";

const Home: React.FC = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const chatState = useChatState();
  const talkTickets = Object.values(chatState.talkTicketCollection);

  const rooms: HomeRooms = talkTickets.map((talkTicket) => {
    const choiceColor = () => {
      if (!CARD_COLORS[talkTicket.worry.key]) {
        const talkTicketKey = talkTicket.worry.key;
        if (isNaN(Number(talkTicketKey)))
          return CARD_COLORS[Number(talkTicketKey) % 10];
        else {
          Object.values(CARD_COLORS)[0];
        }
      }
      return CARD_COLORS[talkTicket.worry.key];
    };

    return {
      title: talkTicket.worry.label,
      color: choiceColor(),
      content:
        talkTicket.room.messages[talkTicket.room.messages.length - 1]?.message,
      onPress: () => {
        navigation.navigate("Chat", {
          talkTicketKey: talkTicket.worry.key,
        });
      },
      countNum: talkTicket.room.unreadNum,
    };
  });

  const firstItem: HomeFirstItem = {
    icon: "plus",
    iconFamily: "Feather",
    iconColor: "white",
    color: "gainsboro",
    borderLess: true,
    onPress: () => {
      navigation.navigate("WorrySelect");
    },
  };

  const items: HomeItems = [firstItem, ...rooms];

  return (
    <Block flex style={styles.container}>
      <HomeTemplate items={items} />

      <Block style={styles.adMobBanner}>
        {!isExpo && <Admob adUnitId={ADMOB_UNIT_ID_HOME} />}
      </Block>
    </Block>
  );
};

export default Home;

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
