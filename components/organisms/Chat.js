import React, { useRef, useState } from "react";
import { StyleSheet, Dimensions, ScrollView } from "react-native";
import { Block, Text, theme, Button, Icon } from "galio-framework";
import Modal from "react-native-modal";
import LottieView from "lottie-react-native";

import { URLJoin } from "../modules/support";
import { TouchableOpacity } from "react-native";
import ChatModal from "../molecules/ChatModal";
import { useAxios } from "../modules/axios";
import { ADMOB_UNIT_ID_AFTER_THX, BASE_URL, isExpo } from "../../constants/env";
import { AdMobInterstitial } from "react-native-admob";
import { useAuthDispatch } from "../contexts/AuthContext";
import { logEvent } from "../modules/firebase/logEvent";
import { useProfileState } from "../contexts/ProfileContext";

const { width, height } = Dimensions.get("screen");

export const CommonMessage = (props) => {
  const { message } = props;
  return (
    <Block style={styles.commonMessage}>
      <Text
        style={{ alignSelf: "center", lineHeight: 18 }}
        bold
        size={14}
        color="#F69896"
      >
        {message.replace("\\n", "\n")}
      </Text>
    </Block>
  );
};

export const TalkMenuButton = (props) => {
  const { talkTicketKey } = props;
  const [isOpen, setIsOpen] = useState(false);
  const profileState = useProfileState();

  return (
    <>
      <TouchableOpacity
        style={[styles.TalkMenuButton]}
        onPress={() => {
          setIsOpen(true);
          logEvent("shuffle_option_button", {}, profileState);
        }}
      >
        <Icon family="MaterialIcons" size={25} name="loop" color="gray" />
        <ChatModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          talkTicketKey={talkTicketKey}
          EndTalkScreen={EndTalkScreen}
        />
      </TouchableOpacity>
    </>
  );
};

export const EndTalkScreen = (props) => {
  const { isOpen, roomId, token, closeChatModal } = props;
  const scrollView = useRef(null);
  const authDispatch = useAuthDispatch();
  const profileState = useProfileState();

  const { request } = useAxios(
    URLJoin(BASE_URL, "rooms/", roomId, "close/"),
    "post",
    {
      data: {
        has_thunks: true,
      },
      thenCallback: (res) => {
        closeChatModal();
        authDispatch({ type: "SET_IS_SHOW_SPINNER", value: true });

        if (!isExpo) {
          AdMobInterstitial.setAdUnitID(ADMOB_UNIT_ID_AFTER_THX);
          AdMobInterstitial.setTestDevices([AdMobInterstitial.simulatorId]);
          AdMobInterstitial.requestAd()
            .then(() => {
              AdMobInterstitial.showAd();
            })
            .catch((e) => {
              console.error(e);
            })
            .finally(() => {
              authDispatch({ type: "SET_IS_SHOW_SPINNER", value: false });
            });
        } else {
          authDispatch({ type: "SET_IS_SHOW_SPINNER", value: false });
        }
      },
      catchCallback: (err) => {
        if (err.response.status === 404) {
          alert("ありがとうの送信に失敗しました。");
          closeChatModal();
          authDispatch({ type: "SET_IS_SHOW_SPINNER", value: false });
        }
      },
      token: token,
      limitRequest: 1,
    }
  );

  const renderFirstPage = () => {
    const animation = useRef(null);
    let pushed = false;
    const pushThunks = () => {
      if (!pushed) {
        logEvent("thx_button", {}, profileState);
        pushed = true;
        animation.current.play();
        setTimeout(() => {
          request();
        }, 800);
      }
    };
    const pushSkip = () => {
      logEvent("skip_thx_button", {}, profileState);
      request({
        data: {
          has_thunks: false,
        },
      });
    };

    return (
      <Block style={styles.endTalkContainer}>
        <Block style={styles.endTalkHeader}>
          <Text bold size={26} color="gray">
            トークを終了しました
          </Text>
        </Block>
        <Block style={styles.endTalkContents}>
          <Block
            style={{
              position: "relative",
              width: width,
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{ width: "55%", position: "absolute", top: 0 }}
              size={20}
              color="gray"
            >
              ハートをタップして、話をしてくれた方にありがとうを伝えましょう
            </Text>
            <LottieView
              ref={animation}
              style={{
                position: "absolute",
                backgroundColor: "transparent",
              }}
              loop={false}
              source={require("../../assets/animations/1087-heart.json")}
            />
            <Button
              round
              shadowless
              color="transparent"
              style={{ position: "absolute", width: 100, height: 100 }}
              onPress={pushThunks}
            ></Button>
          </Block>
        </Block>
        <Block style={styles.endTalkFooter}>
          <Button
            size="small"
            round
            shadowless
            color="lightgray"
            onPress={pushSkip}
          >
            <Text bold color="white" size={18}>
              スキップ
            </Text>
          </Button>
        </Block>
      </Block>
    );
  };

  return (
    <Modal backdropOpacity={0.3} isVisible={isOpen} style={styles.endTalkModal}>
      <ScrollView
        ref={scrollView}
        style={styles.endTalkScrollView}
        horizontal
        scrollEnabled={false}
      >
        <Block flex row>
          {renderFirstPage()}
        </Block>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  commonMessage: {
    backgroundColor: "lavenderblush",
    width: "80%",
    alignSelf: "center",
    padding: theme.SIZES.BASE / 2,
    borderRadius: theme.SIZES.BASE,
    marginVertical: theme.SIZES.BASE / 2,
  },
  endTalkModal: {
    margin: 0,
    position: "relative",
  },
  endTalkScrollView: {
    marginTop: 50,
    backgroundColor: "white",
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
  endTalkContainer: {
    width: width,
    backgroundColor: "white",
    padding: 22,
    paddingBottom: 40,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  endTalkHeader: {
    flex: 0.15,
    justifyContent: "flex-end",
  },
  endTalkContents: {
    flex: 0.7,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  endTalkFooter: {
    flex: 0.15,
    justifyContent: "flex-start",
  },
  TalkMenuButton: {
    padding: 12,
    position: "relative",
  },
});
