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
import { useChatDispatch, useChatState } from "../contexts/ChatContext";
import { useProfileState } from "../contexts/ProfileContext";
import { logEvent } from "../modules/firebase/logEvent"

const { width, height } = Dimensions.get("screen");


const ChatModal = (props) => {
  const { isOpen, setIsOpen, EndTalkScreen, talkTicketKey } = props;

  /* states, dispatches */
  const chatState = useChatState();
  const authState = useAuthState();
  const chatDispatch = useChatDispatch();
  const profileState = useProfileState();

  /* talkTicket */
  const talkTicket = chatState.talkTicketCollection[talkTicketKey];

  /* state */
  const [canTalkHeterosexual, setCanTalkHeterosexual] = useState(talkTicket.canTalkHeterosexual);
  const [canTalkDifferentJob, setCanTalkDifferentJob] = useState(talkTicket.canTalkDifferentJob);
  const [isSpeaker, setIsSpeaker] = useState(talkTicket.isSpeaker);
  const [isShowSpinner, setIsShowSpinner] = useState(false);
  const [isOpenEndTalk, setIsOpenEndTalk] = useState(false);
  const [canPressBackdrop, setCanPressBackdrop] = useState(true);

  /* ref */
  const roomId = useRef();

  const { request } = useAxios(URLJoin(BASE_URL, "talk-ticket/", talkTicket.id), "post", {
    thenCallback: res => {
      roomId.current = talkTicket.room.id;
      const newTalkTicket = deepCvtKeyFromSnakeToCamel(res.data);
      chatDispatch({ type: "OVERWRITE_TALK_TICKET", talkTicket: newTalkTicket });
      if (talkTicket.status.key === "talking") {
        setIsOpenEndTalk(true);
      } else {
        closeChatModal();
      }
    },
    catchCallback: (e) => { console.error(e); closeChatModal(); },
    finallyCallback: () => {
      setIsShowSpinner(false);
    },
    token: authState.token,
    // limitRequest: 1,
  });

  const onPressStop = () => {
    setCanPressBackdrop(false);
    alertModal({
      mainText: `「${talkTicket.worry.label}」の話し相手の検索を停止します。`,
      subText: "今までのトーク内容は端末から削除されます。",
      cancelButton: "キャンセル",
      okButton: "停止する",
      onPress: () => {
        logEvent("stop_talk_button", {
          job: profileState.profile.job?.label,
        });
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
      ・${canTalkHeterosexual ? "話し相手に異性を含む" : "話し相手を同性に絞る"}
      \n今までのトーク内容は端末から削除されます。`,
      cancelButton: "キャンセル",
      okButton: "探す",
      onPress: () => {
        logEvent("shuffle_talk_button", {
          is_speaker: isSpeaker,
          can_talk_heterosexual: canTalkHeterosexual,
          can_talk_different_job: canTalkDifferentJob,
          job: profileState.profile.job?.label,
        });
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

  const closeChatModal = () => {
    setIsOpen(false);
    setCanPressBackdrop(true);
    setIsOpenEndTalk(false);
  }

  return (
    <>
      <Modal
        backdropOpacity={0.3}
        isVisible={isOpen}
        onBackdropPress={() => {
          if (canPressBackdrop || typeof canPressBackdrop === "undefined") closeChatModal();
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
              <ChatSwitch title="話し相手に異性を含む" value={canTalkHeterosexual} onChange={setCanTalkHeterosexual} />
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
          isOpen={isOpenEndTalk}
          closeChatModal={closeChatModal}
          roomId={roomId.current}
          token={authState.token}
        />
      </Modal>
    </>
  );
}


export default withNavigation(ChatModal);


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