import React from "react";
import { StyleSheet, Dimensions, ScrollView } from "react-native";
import { withNavigation } from "@react-navigation/compat";
import { Block, Button, Icon, Text, theme } from "galio-framework";

import { BASE_URL } from "../../constants/env";
import { useAuthState } from "../contexts/AuthContext";
import { useAxios } from "../modules/axios";
import { alertModal, showToast, URLJoin } from "../modules/support";
import WorryCard from "../molecules/WorryCard";


const { width, height } = Dimensions.get("screen");


const WorryDetailTemplate = (props) => {
  const { worry } = props;
  const authState = useAuthState();

  const { isLoading, resData, request } = useAxios(URLJoin(BASE_URL, "worries/", worry.id), "delete", {
    thenCallback: res => {
      props.navigation.goBack();
      showToast({
        text1: "つぶやきを削除しました",
        type: "success",
      });
    },
    errorCallback: err => {
      showToast({
        text1: "つぶやきの削除に失敗しました",
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

      {worry.user.me &&
        <Button
          round
          color="lightcoral"
          opacity={0.9}
          style={styles.bottomButton}
          loading={isLoading}
          onPress={() => {
            alertModal({
              mainText: "つぶやきを削除します。",
              subText: "本当によろしいですか？",
              cancelButton: "キャンセル",
              okButton: "削除する",
              onPress: () => {
                request();
              },
              cancelOnPress: () => { },
            });
          }}
        >
          <Text color="white" size={16}>
            <Icon name="trash" family="font-awesome" color="white" size={16} />{" "}つぶやきを削除する
          </Text>
        </Button>
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
