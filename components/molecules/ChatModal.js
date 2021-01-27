import React, { useState, useRef } from "react";
import { StyleSheet, Dimensions, Switch } from "react-native";
import { Block, Text } from "galio-framework";
import Modal from "react-native-modal";
import Spinner from "react-native-loading-spinner-overlay";
import { withNavigation } from "@react-navigation/compat";

import ModalButton from "../atoms/ModalButton"
import { useAxios } from "../modules/axios";
import { alertModal, deepCvtKeyFromSnakeToCamel, URLJoin } from "../modules/support";
import { BASE_URL } from "../../constants/env";
import { useAuthState } from "../contexts/AuthContext";
import { useChatDispatch } from "../contexts/ChatContext";
import { useProfileState } from "../contexts/ProfileContext";


const { width, height } = Dimensions.get("screen");


const ChatModal = (props) => {
  const { isOpen, setIsOpen, talkTicket, EndTalkScreen } = props;
  const [isSpeaker, setIsSpeaker] = useState(talkTicket.isSpeaker);
  const [canTalkHeterosexual, setCanTalkHeterosexual] = useState(talkTicket.canTalkHeterosexual);
  const [canTalkDifferentJob, setCanTalkDifferentJob] = useState(talkTicket.canTalkDifferentJob);

  const ChatSwitch = (props) => {
    const { title, onChange, value } = props;

    return (
      <>
        <Block row space="between" style={styles.settingsCard}>
          <Block>
            <Text bold size={15} color="dimgray" style={{ marginHorizontal: 15 }}>{title}</Text>
          </Block>
          <Block style={{ alignItems: "center", justifyContent: "center" }} >
            <Switch
              trackColor={{ false: "dimgray", true: "#F69896" }}
              ios_backgroundColor={"gray"}
              value={value}
              style={{ marginVertical: 8, marginHorizontal: 15, }}
              onValueChange={onChange}
            />
          </Block>
        </Block>
      </>
    );
  }

  const roomId = useRef();
  const authState = useAuthState();
  const chatDispatch = useChatDispatch();
  const profileState = useProfileState();
  const { request } = useAxios(URLJoin(BASE_URL, "talk-ticket/", talkTicket.id), "post", {
    thenCallback: res => {
      roomId.current = talkTicket.room.id;
      const newTalkTicket = deepCvtKeyFromSnakeToCamel(res.data);
      chatDispatch({ type: "OVERWRITE_TALK_TICKET", talkTicket: newTalkTicket });
      if (talkTicket.status.key === "talking") {
        setIsOpenEndTalk(true);
      } else {
        setIsOpen(false);
        props.navigation.navigate("Home");
      }
    },
    finallyCallback: () => {
      setIsShowSpinner(false);
    },
    token: authState.token,
    limitRequest: 1,
  });
  const onPressStop = () => {
    setCanPressBackdrop(false);
    alertModal({
      mainText: `「${talkTicket.worry.label}」の話し相手の検索を停止します。`,
      subText: "今までのトーク内容は端末から削除されます。",
      cancelButton: "キャンセル",
      okButton: "停止する",
      onPress: () => {
        setIsShowSpinner(true);
        request({
          data: {
            is_speaker: isSpeaker,
            can_talk_heterosexual: canTalkHeterosexual,
            can_talk_different_job: canTalkDifferentJob,
            status: "stopping",
          },
        });
      },
      cancelOnPress: () => setCanPressBackdrop(true),
    });
  }
  const onPressShuffle = () => {
    setCanPressBackdrop(false);
    alertModal({
      mainText: `以下の条件で「${talkTicket.worry.label}」の話し相手を探します。`,
      subText: `\n・${isSpeaker ? "話したい" : "聞きたい"}
      ・${canTalkDifferentJob ? "全ての職業を許可" : `話し相手を${profileState.profile.job?.label}に絞る`}
      ・${canTalkHeterosexual ? "異性の話し相手を許可" : "話し相手に異性を含む"}
      \n今までのトーク内容は端末から削除されます。`,
      cancelButton: "キャンセル",
      okButton: "探す",
      onPress: () => {
        setIsShowSpinner(true);
        request({
          data: {
            is_speaker: isSpeaker,
            can_talk_heterosexual: canTalkHeterosexual,
            can_talk_different_job: canTalkDifferentJob,
            status: "waiting",
          },
        });
      },
      cancelOnPress: () => setCanPressBackdrop(true),
    });
  }

  const [isShowSpinner, setIsShowSpinner] = useState(false);
  const [isOpenEndTalk, setIsOpenEndTalk] = useState(false);
  const [canPressBackdrop, setCanPressBackdrop] = useState(true);

  return (
    <>
      <Modal
        backdropOpacity={0.3}
        isVisible={isOpen}
        onBackdropPress={() => {
          if (canPressBackdrop || typeof canPressBackdrop === "undefined") setIsOpen(false);
        }}
        style={styles.modal}
      >
        <Spinner
          visible={isShowSpinner}
          overlayColor="rgba(0,0,0,0)"
        />

        <Block style={styles.modalContents}>
          <Block>
            <Block style={{ justifyContent: "center" }}>
              <ChatSwitch title="話したい" value={isSpeaker} onChange={(val) => setIsSpeaker(val)} />
              <ChatSwitch title="聞きたい" value={!isSpeaker} onChange={(val) => setIsSpeaker(!val)} />
            </Block>
            <Block style={{ justifyContent: "center", marginTop: 10 }}>
              {/* TODO: 内緒処理 */}
              <ChatSwitch title={`話し相手を${profileState.profile.job?.label}に絞る`} value={!canTalkDifferentJob} onChange={(val) => setCanTalkDifferentJob(!val)} />
              <ChatSwitch title="話し相手に異性を含む" value={!canTalkHeterosexual} onChange={(val) => setCanTalkHeterosexual(!val)} />
            </Block>
            <Block />
            <Block row center style={{ justifyContent: "center", marginTop: 20 }}>
              <Block flex={0.45} center>
                <ModalButton
                  icon="logout"
                  iconFamily="AntDesign"
                  colorLess
                  onPress={onPressStop}
                />
              </Block>
              <Block />
              <Block flex={0.45} center>
                <ModalButton
                  icon="loop"
                  iconFamily="MaterialIcons"
                  onPress={onPressShuffle}
                />
              </Block>
            </Block>
          </Block>
        </Block>

        <EndTalkScreen
          navigation={props.navigation}
          isOpen={isOpenEndTalk}
          setIsOpen={setIsOpenEndTalk}
          setIsOpenChatModal={setIsOpen}
          roomId={roomId.current}
          token={authState.token}
        />
      </Modal>
    </>
  );
}


export default withNavigation(ChatModal);


const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContents: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    paddingTop: 40,
    paddingBottom: 40,
  },
  settingsCard: {
    backgroundColor: "white",
    alignItems: "center",
  },
});