import React, { useState } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Block } from "galio-framework";

import BubbleList from "../organisms/BubbleList";
import { useProfileState } from "../contexts/ProfileContext";
import SubmitButton from "../atoms/SubmitButton";
import { useAxios } from "../modules/axios";
import { alertModal, URLJoin, hasProperty } from "../modules/support";
import {
  ADMOB_BANNER_HEIGHT,
  ADMOB_BANNER_WIDTH,
  ADMOB_UNIT_ID_SELECT_WORRY,
  BASE_URL,
  isExpo,
} from "../../constants/env";

import { useAuthState } from "../contexts/AuthContext";
import { useChatDispatch, useChatState } from "../contexts/ChatContext";
import { useEffect } from "react";
import { withNavigation } from "@react-navigation/compat";
import { useRef } from "react";
import Admob from "../molecules/Admob";
import { useNavigation } from "@react-navigation/native";
import { WorrySelectNavigationProps } from "../types/Types";
import {
  GenreOfWorriesCollection,
  TalkTicketKey,
  WorriesResJson,
  WorriesResJsonIoTs,
} from "../types/Types.context";

const { width, height } = Dimensions.get("screen");

const WorrySelectTemplate: React.FC = () => {
  const navigation = useNavigation<WorrySelectNavigationProps>();
  const iPhoneXHeight = 812;
  const isHigherDevice = height >= iPhoneXHeight;

  const profileState = useProfileState();
  const genreOfWorries = profileState.profileParams
    ? (JSON.parse(
        JSON.stringify(profileState.profileParams.genreOfWorries)
      ) as GenreOfWorriesCollection)
    : {};

  const chatState = useChatState();
  const initWorriesCollection = useRef(
    (() => {
      const _initWorriesCollection: GenreOfWorriesCollection = {};
      Object.keys(chatState.talkTicketCollection).forEach((key) => {
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
    if (
      Object.keys(initWorriesCollection.current).length !==
      Object.keys(worriesCollection).length
    ) {
      setCanSubmit(true);
    } else {
      if (
        Object.keys(initWorriesCollection.current).some(
          (key) => !hasProperty(worriesCollection, key)
        )
      ) {
        setCanSubmit(true);
      } else {
        setCanSubmit(false);
      }
    }
  }, [worriesCollection]);

  const pressBubble = (key: TalkTicketKey) => {
    const _worriesCollection = { ...worriesCollection };
    if (hasProperty(_worriesCollection, key)) {
      delete _worriesCollection[key];
    } else {
      _worriesCollection[key] = genreOfWorries[key];
    }
    setWorriesCollection(_worriesCollection);
  };

  const authState = useAuthState();
  const chatDispatch = useChatDispatch();
  const { isLoading, request } = useAxios(
    URLJoin(BASE_URL, "me/worries/"),
    "post",
    WorriesResJsonIoTs,
    {
      thenCallback: (resData) => {
        const _resData = resData as WorriesResJson;
        const addedTalkTickets = _resData["addedTalkTickets"];
        const removedTalkTicketKeys = _resData["removedTalkTicketKeys"];
        // 追加
        addedTalkTickets.forEach((talkTicket) => {
          chatDispatch({ type: "OVERWRITE_TALK_TICKET", talkTicket });
        });
        // 削除
        chatDispatch({
          type: "REMOVE_TALK_TICKETS",
          talkTicketKeys: removedTalkTicketKeys,
        });
      },
      finallyCallback: () => {
        chatDispatch({ type: "TURN_OFF_DELAY" });
        navigation.navigate("Home");
      },
      didRequestCallback: () => {
        // この後のchatDispatchを遅延する(同時にマッチしていた場合はSTART_TALKが遅延される)
        chatDispatch({
          type: "TURN_ON_DELAY",
          excludeType: ["OVERWRITE_TALK_TICKET"],
        });
      },
      token: authState.token ? authState.token : "",
      limitRequest: 1,
    }
  );
  const submit = () => {
    alertModal({
      mainText: "悩みを変更します",
      subText:
        "トーク中の悩みを削除しようとしている場合は、自動でトークが終了します。",
      cancelButton: "キャンセル",
      okButton: "変更する",
      onPress: () => {
        request({
          data: {
            genre_of_worries: Object.values(worriesCollection),
          },
        });
      },
    });
  };

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
        {!isExpo && <Admob adUnitId={ADMOB_UNIT_ID_SELECT_WORRY} />}
      </Block>
    </Block>
  );
};

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
