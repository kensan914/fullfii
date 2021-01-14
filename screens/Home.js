import { withNavigation } from "@react-navigation/compat";
import React from "react";
import { useChatState } from "../components/contexts/ChatContext";
import HomeTemplate from "../components/templates/HomeTemplate";
import { CARD_COLORS } from "../constants/Theme";


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
    <HomeTemplate items={items} />
  );
}

export default withNavigation(Home);
