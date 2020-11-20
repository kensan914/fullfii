import React from "react";
import { StyleSheet, Dimensions, ScrollView } from "react-native";
import { withNavigation } from "@react-navigation/compat";
import { Block, Button, Icon, Text, theme } from "galio-framework";

import { BASE_URL } from "../../constants/env";
import { useAuthState } from "../contexts/AuthContext";
import { useChatDispatch, useChatState } from "../contexts/ChatContext";
import { useProfileDispatch, useProfileState } from "../contexts/ProfileContext";
import { useAxios } from "../modules/axios";
import { alertModal, checkProfileIsBuried, checkSubscribePlan, showToast, URLJoin } from "../modules/support";
import WorryCard from "../molecules/WorryCard";
import { sendTalkRequest } from "../organisms/Profile";


const { width, height } = Dimensions.get("screen");


const WorryDetailTemplate = (props) => {
  const { worry } = props;
  const chatState = useChatState();
  const authState = useAuthState();
  const profileState = useProfileState();

  const chatDispatch = useChatDispatch();
  const profileDispatch = useProfileDispatch();

  const { isLoading, resData, request } = useAxios(URLJoin(BASE_URL, "worries/", worry.id), "delete", {
    thenCallback: res => {
      props.navigation.goBack();
      showToast({
        text1: "相談募集を削除しました",
        type: "success",
      });
    },
    errorCallback: err => {
      showToast({
        text1: "相談募集の削除に失敗しました",
        type: "error",
      });
    },
    token: authState.token,
  });

  return (
    <>
      <ScrollView bounces={false}>
        <WorryCard worry={worry} isDetail />
        <Block style={styles.emptyBottom} />
      </ScrollView>

      {worry.user.me ?
        <Button
          round
          color="lightcoral"
          opacity={0.9}
          style={styles.bottomButton}
          loading={isLoading}
          onPress={() => {
            alertModal({
              mainText: "相談募集を削除します。",
              subText: "本当によろしいですか？",
              cancelButton: "キャンセル",
              okButton: "削除する",
              onPress: () => {
                request();
              },
              cancelOnPress: () => { }, // 任意. キャンセルを押した際の付加処理
            });
          }}
        >
          <Text color="white" size={16}>
            <Icon name="trash" family="font-awesome" color="white" size={16} />{" "}相談募集を削除する
          </Text>
        </Button> :
        (!chatState.includedUserIDs.includes(worry.user.id) &&
          <Button
            round
            color="lightcoral"
            opacity={0.9}
            style={styles.bottomButton}
            onPress={() => {
              checkProfileIsBuried(profileState.profile, () => {
                checkSubscribePlan(profileState.profile, () => sendTalkRequest(worry.user, props.navigation, authState.token, chatDispatch, profileDispatch, profileState), "現在プランに加入しておりません。リクエストを送るにはノーマルプランに加入してください。");
              }, "リクエストを送信することができません。");
            }}
          >
            <Text color="white" size={16}>
              <Icon name="mail-forward" family="font-awesome" color="white" size={16} />{" "}リクエストを送る
            </Text>
          </Button>)
      }
    </>
  );
}

export default withNavigation(WorryDetailTemplate);


const styles = StyleSheet.create({
  bottomButton: {
    shadowColor: "lightcoral",
    position: "absolute",
    alignSelf: "center",
    bottom: theme.SIZES.BASE * 2,
  },
  emptyBottom: {
    width: width,
    height: 100,
  },
});
