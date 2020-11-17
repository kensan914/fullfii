import React, { useRef, useState } from "react";
import { StyleSheet, Dimensions, ScrollView } from "react-native";
import { Block, Text, theme, Button, Icon } from "galio-framework";
import Modal from "react-native-modal";
import LottieView from "lottie-react-native";
import Spinner from "react-native-loading-spinner-overlay";

import { alertModal } from "../modules/support";
import { MenuModal } from "../molecules/Menu";
import { TouchableOpacity } from "react-native";
import { useAuthState } from "../contexts/AuthContext";
import { requestCloseTalk, requestEndTalk } from "../../screens/Talk";
import { useChatDispatch } from "../contexts/ChatContext";
import { useProfileDispatch, useProfileState } from "../contexts/ProfileContext";


const { width, height } = Dimensions.get("screen");

export const CommonMessage = (props) => {
  const { message } = props;
  return (
    <Block style={styles.commonMessage}>
      <Text style={{ alignSelf: "center", lineHeight: 18, }} bold size={14} color="#F69896">{message.replace("\\n", "\n")}</Text>
    </Block>
  );
}

export const TalkMenuButton = (props) => {
  const { navigation, talkObj } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEndTalk, setIsOpenEndTalk] = useState(false);
  const [isShowSpinner, setIsShowSpinner] = useState(false);
  const [canPressBackdrop, setCanPressBackdrop] = useState(true);

  const authState = useAuthState();
  const chatDispatch = useChatDispatch();
  const profileDispatch = useProfileDispatch();

  return (
    <>
      <TouchableOpacity style={[styles.TalkMenuButton, {}]} onPress={() => setIsOpen(true)}>
        <Icon family="font-awesome" size={20} name="sign-out" color="gray" />
        <MenuModal isOpen={isOpen} setIsOpen={setIsOpen}
          items={[
            {
              title: "トークを終了する", onPress: () => {
                if (!talkObj.isEnd) endTalk(navigation, setIsOpenEndTalk, talkObj, authState.token, chatDispatch, profileDispatch, setIsShowSpinner, setCanPressBackdrop);
                else {
                  setCanPressBackdrop(false);
                  requestEndTalk(talkObj.roomID, authState.token, setIsOpenEndTalk, navigation, chatDispatch, profileDispatch, setIsShowSpinner);
                }
              }
            },
            {
              title: "通報する", onPress: () => handleReport(navigation, setIsOpenEndTalk, talkObj, authState.token, chatDispatch, profileDispatch, setIsShowSpinner, setCanPressBackdrop)
            },
          ]}
          otherModal={
            <EndTalkScreen
              navigation={navigation}
              isOpen={isOpenEndTalk}
              setIsOpen={setIsOpenEndTalk}
              talkObj={talkObj}
              token={authState.token}
            />}
          spinnerOverlay={
            <Spinner
              visible={isShowSpinner}
              overlayColor="rgba(0,0,0,0)"
            />}
          canPressBackdrop={canPressBackdrop}
        />
      </TouchableOpacity >
    </>
  );
}

export const endTalk = (navigation, setIsOpenEndTalk, talkObj, token, chatDispatch, profileDispatch, setIsShowSpinner, setCanPressBackdrop) => {
  setCanPressBackdrop(false);
  alertModal({
    mainText: "トークを終了しますか？",
    subText: "あなたの端末と相手の端末から全ての会話内容が削除されます。",
    cancelButton: "キャンセル",
    okButton: "終了する",
    onPress: () => {
      requestEndTalk(talkObj.roomID, token, setIsOpenEndTalk, navigation, chatDispatch, profileDispatch, setIsShowSpinner);
    },
    cancelOnPress: () => {
      setCanPressBackdrop(true);
    }
  });
}

const handleReport = (navigation, setIsOpenEndTalk, talkObj, token, chatDispatch, profileDispatch, setIsShowSpinner, setCanPressBackdrop) => {
  setCanPressBackdrop(false);
  alertModal({
    mainText: "通報しますか？",
    subText: "トークは終了され、あなたの端末と相手の端末から全ての会話内容が削除されます。",
    cancelButton: "キャンセル",
    okButton: "通報する",
    onPress: () => {
      setCanPressBackdrop(true);
      requestEndTalk(talkObj.roomID, token, setIsOpenEndTalk, navigation, chatDispatch, profileDispatch, setIsShowSpinner, true);
    },
    cancelOnPress: () => {
      setCanPressBackdrop(true);
    }
  });
}

export const EndTalkScreen = (props) => {
  const { isOpen, setIsOpen, navigation, talkObj, token } = props;
  const scrollView = useRef(null);

  const chatDispatch = useChatDispatch();
  const profileDispatch = useProfileDispatch();
  const profileState = useProfileState();

  const renderFirstPage = () => {
    const animation = useRef(null);
    let pushed = false;
    const pushThunks = () => {
      if (!pushed) {
        pushed = true;
        animation.current.play();
        setTimeout(() => {
          // goNextPage();
          requestCloseTalk(talkObj.roomID, token, navigation, chatDispatch, profileDispatch, profileState, true);
        }, 800);
      }
    }
    const pushSkip = () => {
      if (!pushed) {
        pushed = true;
        // goNextPage();
        requestCloseTalk(talkObj.roomID, token, navigation, chatDispatch, profileDispatch, profileState);
      }
    }

    return (
      <Block style={styles.endTalkContainer} >
        <Block style={styles.endTalkHeader}>
          <Text bold size={26} color="gray">トークを終了しました</Text>
        </Block>
        <Block style={styles.endTalkContents}>
          <Block style={{ postion: "relative", width: width, height: "100%", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ width: "55%", position: "absolute", top: 0 }} size={20} color="gray">ハートをタップして、話をしてくれた方にありがとうを伝えましょう</Text>
            <LottieView
              ref={animation}
              style={{
                position: "absolute",
                backgroundColor: "transparent",
              }}
              loop={false}
              source={require("../../assets/animations/1087-heart.json")}
            />
            <Button round shadowless color="transparent" style={{ position: "absolute", width: 100, height: 100 }} onPress={pushThunks} ></Button>
          </Block>
        </Block>
        <Block style={styles.endTalkFooter}>
          <Button size="small" round shadowless color="lightgray" onPress={pushSkip}>
            <Text bold color="white" size={18}>スキップ</Text>
          </Button>
        </Block>
      </Block>
    );
  };
  
  return (
    <Modal
      backdropOpacity={0.3}
      isVisible={isOpen}
      style={styles.endTalkModal}>
      <ScrollView ref={scrollView} style={styles.endTalkScrollView} horizontal scrollEnabled={false}>
        <Block flex row>
          {renderFirstPage()}
        </Block>
      </ScrollView>
    </Modal >
  );
}

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
    position: "relative"
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