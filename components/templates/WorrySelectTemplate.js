import React, { useState } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Block } from "galio-framework";

import BubbleList from "../organisms/BubbleList";
import { useProfileState } from "../contexts/ProfileContext";
import SubmitButton from "../atoms/SubmitButton";
import { useAxios } from "../modules/axios";
import { deepCvtKeyFromSnakeToCamel, URLJoin } from "../modules/support";
import { BASE_URL } from "../../constants/env";
import { useAuthState } from "../contexts/AuthContext";
import { useChatDispatch, useChatState } from "../contexts/ChatContext";
import { useEffect } from "react";
import { withNavigation } from "@react-navigation/compat";



const { width, height } = Dimensions.get("screen");


const WorrySelectTemplate = (props) => {
  const [worriesCollection, setWorriesCollection] = useState({});

  const iPhoneXHeight = 812;
  const isHigherDevice = height >= iPhoneXHeight;

  const profileState = useProfileState();
  const genreOfWorries =
    profileState.profileParams ?
      JSON.parse(JSON.stringify(profileState.profileParams.genreOfWorries)) :
      {};

  const chatState = useChatState();
  useEffect(() => {
    const initWorriesCollection = { ...worriesCollection };
    Object.keys(chatState.talkTicketCollection).forEach(key => {
      initWorriesCollection[key] = genreOfWorries[key];
    })
    setWorriesCollection(initWorriesCollection);
  }, []);

  const pressBubble = (key) => {
    const _worriesCollection = { ...worriesCollection };
    if (_worriesCollection.hasOwnProperty(key)) {
      delete _worriesCollection[key];
    } else {
      _worriesCollection[key] = genreOfWorries[key];
    }
    setWorriesCollection(_worriesCollection);
  };

  const authState = useAuthState();
  const chatDispatch = useChatDispatch();
  const { isLoading, request } = useAxios(URLJoin(BASE_URL, "me/worries/"), "post", {
    thenCallback: res => {
      const resData = deepCvtKeyFromSnakeToCamel(res.data);
      const addedTalkTickets = resData["addedTalkTickets"];
      const removedTalkTicketKeys = resData["removedTalkTicketKeys"];
      // 追加
      addedTalkTickets.forEach(talkTicket => {
        chatDispatch({ type: "OVERWRITE_TALK_TICKET", talkTicket });
      });
      // 削除
      chatDispatch({ type: "REMOVE_TALK_TICKETS", talkTicketKeys: removedTalkTicketKeys });
    },
    finallyCallback: () => {
      props.navigation.navigate("Home");
    },
    token: authState.token,
    limitRequest: 1,
  });
  const submit = () => {
    request({
      data: {
        genre_of_worries: Object.values(worriesCollection),
      }
    });
  }

  return (
    <Block flex center style={styles.container}>
      <Block flex={0.8}>
        <BubbleList
          items={Object.values(genreOfWorries)}
          limitLines={isHigherDevice ? 5 : 3}
          diameter={isHigherDevice ? height / 10 : undefined}
          margin={isHigherDevice ? 3.0 : undefined}
          activeKeys={Object.keys(worriesCollection)}
          pressBubble={pressBubble}
        />
      </Block>

      <Block flex={0.2}>
        <SubmitButton
          canSubmit={true}
          isLoading={isLoading}
          submit={submit}
        />
      </Block>
    </Block>
  );
}

export default withNavigation(WorrySelectTemplate);

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: "white",
  },
  list: {
    width: width,
  },
  item: {
    flex: 0.5,
  },
});
