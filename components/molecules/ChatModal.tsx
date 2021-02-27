import React, { useState, useRef } from "react";
import { Alert, StyleSheet, Switch } from "react-native";
import { Block, Text } from "galio-framework";
import Modal from "react-native-modal";
import Spinner from "react-native-loading-spinner-overlay";

import ModalButton from "../atoms/ModalButton";
import { useAxios } from "../modules/axios";
import { alertModal, formatGender, URLJoin } from "../modules/support";
import { BASE_URL } from "../../constants/env";
import { useAuthState } from "../contexts/AuthContext";
import { useChatDispatch, useChatState } from "../contexts/ChatContext";
import { useProfileState } from "../contexts/ProfileContext";
import { logEvent } from "../modules/firebase/logEvent";
import { EndTalkScreenType } from "../organisms/Chat";
import {
  TalkTicketJson,
  TalkTicketJsonIoTs,
  TalkTicketKey,
} from "../types/Types.context";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  EndTalkScreen: React.FC<EndTalkScreenType>;
  talkTicketKey: TalkTicketKey;
};
const ChatModal: React.FC<Props> = (props) => {
  const { isOpen, setIsOpen, EndTalkScreen, talkTicketKey } = props;

  /* states, dispatches */
  const chatState = useChatState();
  const authState = useAuthState();
  const chatDispatch = useChatDispatch();
  const profileState = useProfileState();

  /* talkTicket */
  const talkTicket = chatState.talkTicketCollection[talkTicketKey];

  /* state */
  const [canTalkHeterosexual, setCanTalkHeterosexual] = useState(
    talkTicket.canTalkHeterosexual
  );
  const [canTalkDifferentJob, setCanTalkDifferentJob] = useState(
    talkTicket.canTalkDifferentJob
  );
  const [isSpeaker, setIsSpeaker] = useState(talkTicket.isSpeaker);
  const [isShowSpinner, setIsShowSpinner] = useState(false);
  const [isOpenEndTalk, setIsOpenEndTalk] = useState(false);
  const [canPressBackdrop, setCanPressBackdrop] = useState(true);

  const isSecretJob = profileState.profile.job.key === "secret";
  const isSecretGender =
    formatGender(
      profileState.profile.gender,
      profileState.profile.isSecretGender
    ).key === "secret";

  /* ref */
  const roomId = useRef<string>();

  const { request } = useAxios(
    URLJoin(BASE_URL, "talk-ticket/", talkTicket.id),
    "post",
    TalkTicketJsonIoTs,
    {
      thenCallback: (resData) => {
        const _resData = resData as TalkTicketJson;
        roomId.current = talkTicket.room.id;
        const newTalkTicketJson = _resData;

        chatDispatch({
          type: "OVERWRITE_TALK_TICKET",
          talkTicket: newTalkTicketJson,
        });
        if (talkTicket.status.key === "talking") {
          setIsOpenEndTalk(true);
        } else {
          closeChatModal();
        }
      },
      catchCallback: () => {
        closeChatModal();
      },
      finallyCallback: () => {
        // 遅延したchatDispatchを実行(同時にマッチしていた場合はSTART_TALKが実行される)
        chatDispatch({ type: "TURN_OFF_DELAY" });
        setIsShowSpinner(false);
      },
      didRequestCallback: () => {
        // この後のchatDispatchを遅延する(同時にマッチしていた場合はSTART_TALKが遅延される)
        chatDispatch({
          type: "TURN_ON_DELAY",
          excludeType: ["OVERWRITE_TALK_TICKET"],
        });
      },
      token: authState.token ? authState.token : "",
    }
  );

  const onPressStop = () => {
    setCanPressBackdrop(false);
    alertModal({
      mainText: `「${talkTicket.worry.label}」の話し相手の検索を停止します。`,
      subText: "今までのトーク内容は端末から削除されます。",
      cancelButton: "キャンセル",
      okButton: "停止する",
      onPress: () => {
        logEvent(
          "stop_talk_button",
          {
            job: profileState.profile?.job?.label,
          },
          profileState
        );
        setIsShowSpinner(true);
        request({
          data: {
            is_speaker: isSpeaker,
            ...(isSecretGender
              ? {}
              : { can_talk_heterosexual: canTalkHeterosexual }),
            ...(isSecretJob
              ? {}
              : { can_talk_different_job: canTalkDifferentJob }),
            status: "stopping",
          },
        });
      },
      cancelOnPress: () => setCanPressBackdrop(true),
    });
  };

  const onPressShuffle = () => {
    setCanPressBackdrop(false);
    const jobSubText = canTalkDifferentJob
      ? "全ての職業を許可"
      : `話し相手を${profileState.profile.job?.label}に絞る`;

    const genderSubText = canTalkHeterosexual
      ? "話し相手に異性を含む"
      : "話し相手を同性に絞る";
    alertModal({
      mainText: `以下の条件で「${talkTicket.worry.label}」の話し相手を探します。`,
      subText: `\n・${isSpeaker ? "話したい" : "聞きたい"}\n${
        isSecretJob ? "" : `・${jobSubText}\n`
      }${
        isSecretGender ? "" : `・${genderSubText}\n`
      }\n今までのトーク内容は端末から削除されます。`,
      cancelButton: "キャンセル",
      okButton: "探す",
      onPress: () => {
        logEvent(
          "shuffle_talk_button",
          {
            is_speaker: isSpeaker,
            ...(isSecretGender
              ? {}
              : { can_talk_heterosexual: canTalkHeterosexual }),
            ...(isSecretJob
              ? {}
              : { can_talk_different_job: canTalkDifferentJob }),
          },
          profileState
        );
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
  };

  const closeChatModal = () => {
    setIsOpen(false);
    setCanPressBackdrop(true);
    setIsOpenEndTalk(false);
  };

  return (
    <>
      <Modal
        backdropOpacity={0.3}
        isVisible={isOpen}
        onBackdropPress={() => {
          if (canPressBackdrop || typeof canPressBackdrop === "undefined")
            closeChatModal();
        }}
        style={styles.modal}
      >
        <Spinner visible={isShowSpinner} overlayColor="rgba(0,0,0,0)" />

        <Block style={styles.modalContents}>
          <Block>
            <Block style={{ justifyContent: "center" }}>
              <ChatSwitch
                title="話したい"
                value={isSpeaker}
                onChange={(val) => setIsSpeaker(val)}
              />
              <ChatSwitch
                title="聞きたい"
                value={!isSpeaker}
                onChange={(val) => setIsSpeaker(!val)}
              />
            </Block>
            <Block style={{ justifyContent: "center", marginTop: 10 }}>
              <ChatSwitch
                title={
                  isSecretJob
                    ? "話し相手を職業で絞る"
                    : `話し相手を${profileState.profile.job?.label}に絞る`
                }
                value={!canTalkDifferentJob}
                onChange={(val) => setCanTalkDifferentJob(!val)}
                disable={isSecretJob}
                alertMessageWhenDisable="話し相手を職業で絞り込むには職業を内緒以外に設定して下さい"
              />
              <ChatSwitch
                title="話し相手に異性を含む"
                value={canTalkHeterosexual}
                onChange={setCanTalkHeterosexual}
                disable={isSecretGender}
                alertMessageWhenDisable="話し相手を性別で絞り込むには性別を内緒以外に設定して下さい"
              />
            </Block>
            <Block />
            <Block
              row
              center
              style={{ justifyContent: "center", marginTop: 20 }}
            >
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

        {roomId.current && authState.token ? (
          <EndTalkScreen
            isOpen={isOpenEndTalk}
            closeChatModal={closeChatModal}
            roomId={roomId.current}
            token={authState.token}
          />
        ) : (
          <></>
        )}
      </Modal>
    </>
  );
};

export default ChatModal;

type ChatSwitchProps = {
  title: string;
  onChange: (val: boolean) => void;
  value: boolean;
  disable?: boolean;
  alertMessageWhenDisable?: string;
};
const ChatSwitch: React.FC<ChatSwitchProps> = (props) => {
  const {
    title,
    onChange,
    value,
    disable = false,
    alertMessageWhenDisable = "",
  } = props;
  return (
    <>
      <Block row space="between" style={styles.settingsCard}>
        <Block>
          <Text
            bold
            size={15}
            color={disable ? "silver" : "dimgray"}
            style={{ marginHorizontal: 15 }}
          >
            {title}
          </Text>
        </Block>
        <Block style={{ alignItems: "center", justifyContent: "center" }}>
          <Switch
            trackColor={{
              false: disable ? "gainsboro" : "dimgray",
              true: "#F69896",
            }}
            ios_backgroundColor={disable ? "gainsboro" : "gray"}
            value={disable ? false : value}
            style={{ marginVertical: 8, marginHorizontal: 15 }}
            onValueChange={(val) => {
              if (alertMessageWhenDisable && disable)
                Alert.alert(alertMessageWhenDisable);
              onChange(val);
            }}
          />
        </Block>
      </Block>
    </>
  );
};

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
