import React, { useState } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Block } from "galio-framework";

import BubbleList from "../organisms/BubbleList";
import { useProfileState } from "../contexts/ProfileContext";
import SubmitButton from "../atoms/SubmitButton";
import { useAxios } from "../modules/axios";
import { alertModal, deepCvtKeyFromSnakeToCamel, URLJoin } from "../modules/support";
import { ADMOB_BANNER_HEIGHT, ADMOB_BANNER_WIDTH, ADMOB_UNIT_ID_SELECT_WORRY, BASE_URL, isExpo } from "../../constants/env";
import { useAuthState } from "../contexts/AuthContext";
import { useChatDispatch, useChatState } from "../contexts/ChatContext";
import { useEffect } from "react";
import { withNavigation } from "@react-navigation/compat";
import { useRef } from "react";
import Admob from "../molecules/Admob";


const { width, height } = Dimensions.get("screen");


const WorrySelectTemplate = (props) => {
  const iPhoneXHeight = 812;
  const isHigherDevice = height >= iPhoneXHeight;

  const profileState = useProfileState();
  const genreOfWorries =
    profileState.profileParams ?
      JSON.parse(JSON.stringify(profileState.profileParams.genreOfWorries)) :
      {};

  const chatState = useChatState();
  const initWorriesCollection = useRef(
    (() => {
      const _initWorriesCollection = {};
      Object.keys(chatState.talkTicketCollection).forEach(key => {
        _initWorriesCollection[key] = genreOfWorries[key];
      });
      return _initWorriesCollection;
    })()
  );
  const [worriesCollection, setWorriesCollection] = useState(
    JSON.parse(JSON.stringify(initWorriesCollection.current))
  );

  const [canSubmit, setCanSubmit] = useState(false);
  useEffect(() => {
    if (Object.keys(initWorriesCollection.current).length !== Object.keys(worriesCollection).length) {
      setCanSubmit(true);
    } else {
      if (
        Object.keys(initWorriesCollection.current).some(key => (
          !worriesCollection.hasOwnProperty(key)
        ))
      ) {
        setCanSubmit(true);
      } else {
        setCanSubmit(false);
      }
    }
  }, [worriesCollection]);

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
    alertModal({
      mainText: "悩みを変更します",
      subText: "トーク中の悩みを削除しようとしている場合は、自動でトークが終了します。",
      cancelButton: "キャンセル",
      okButton: "変更する",
      onPress: () => {
        request({
          data: {
            genre_of_worries: Object.values(worriesCollection),
          }
        });
      },
      cancelOnPress: () => { },
    });
  }

  return (
    <Block flex center style={styles.container}>
      <Block flex={0.8}>
        <BubbleList
          items={Object.values(genreOfWorries)}
          limitLines={isHigherDevice ? 3 /* before: 5 */ : 3} // 悩み7個で5行だと配置が不自然になるため
          diameter={isHigherDevice ? height / 10 : undefined}
          margin={isHigherDevice ? 3.0 : undefined}
          activeKeys={Object.keys(worriesCollection)}
          pressBubble={pressBubble}
        />
      </Block>

      <Block center flex={0.2} style={{ justifyContent: "center" }}>
        <SubmitButton
          canSubmit={canSubmit}
          isLoading={isLoading}
          submit={submit}
        />
      </Block>

      <Block style={styles.adMobBanner}>
        {!isExpo &&
          <Admob
            adSize={"banner"}
            adUnitID={ADMOB_UNIT_ID_SELECT_WORRY}
          />
        }
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
  adMobBanner: {
    width: ADMOB_BANNER_WIDTH,
    height: ADMOB_BANNER_HEIGHT,
    zIndex: 2,
  },
});
