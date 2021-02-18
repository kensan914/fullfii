import React, { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { Block, Text, theme, Button } from "galio-framework";
import Modal from "react-native-modal";
import * as WebBrowser from "expo-web-browser";

import Avatar from "../atoms/Avatar";
import Icon from "../atoms/Icon";
import { useProfileState } from "../contexts/ProfileContext";
import ModalButton from "../atoms/ModalButton";
import { alertModal, URLJoin } from "../modules/support";
import { useAxios } from "../modules/axios";
import { BASE_URL, REPORT_URL } from "../../constants/env";
import { useChatDispatch } from "../contexts/ChatContext";
import { useAuthState } from "../contexts/AuthContext";
import {
  MeProfile,
  Profile,
  TalkTicket,
  TalkTicketJson,
  TalkTicketJsonIoTs,
} from "../types/Types.context";
import { useNavigation } from "@react-navigation/native";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  profile: MeProfile | Profile;
  talkTicket?: TalkTicket;
};
/**
 *
 * @param {*} props talkTicketはchat画面時のみ必要
 */
const ProfileModal: React.FC<Props> = (props) => {
  const { isOpen, setIsOpen, profile, talkTicket } = props;
  const navigation = useNavigation();
  const profileState = useProfileState();
  const user = profile.me ? profileState.profile : profile;

  const authState = useAuthState();
  const chatDispatch = useChatDispatch();
  const { request: requestReport } = useAxios(
    URLJoin(BASE_URL, "talk-ticket/", talkTicket?.id),
    "post",
    TalkTicketJsonIoTs,
    {
      data: {
        status: "waiting",
      },
      thenCallback: (resData) => {
        const newTalkTicket = resData as TalkTicketJson;
        (async () => {
          await WebBrowser.openBrowserAsync(REPORT_URL);
          chatDispatch({
            type: "OVERWRITE_TALK_TICKET",
            talkTicket: newTalkTicket,
          });
          navigation.navigate("Home");
        })();
      },
      token: authState.token ? authState.token : "",
      limitRequest: 1,
    }
  );
  const onPressReport = () => {
    setCanPressBackdrop(false);
    alertModal({
      mainText: "通報します。",
      subText: "トークは終了され、通報ページに移動します。よろしいですか？",
      cancelButton: "キャンセル",
      okButton: "通報する",
      onPress: () => {
        setCanPressBackdrop(true);
        requestReport();
      },
      cancelOnPress: () => setCanPressBackdrop(true),
    });
  };

  const { request: requestBlock } = useAxios(
    URLJoin(BASE_URL, "users/", user.id, "block/"),
    "patch",
    null,
    {
      data: {
        status: "waiting",
      },
      thenCallback: async () => {
        Alert.alert(`${user.name}さんをブロックしました。`);
      },
      catchCallback: (err) => {
        if (
          err?.response &&
          err.response.data.type === "have_already_blocked"
        ) {
          Alert.alert(err.response.data.message);
        }
      },
      token: authState.token ? authState.token : "",
      limitRequest: 1,
    }
  );
  const onPressBlock = () => {
    alertModal({
      mainText: `${user.name}さんをブロックしますか？`,
      subText: `あなたの端末と${user.name}さんの端末からお互いの情報が表示されなくなります。また、相手にこのブロックは通知されません。`,
      cancelButton: "キャンセル",
      okButton: "ブロックする",
      onPress: () => {
        setCanPressBackdrop(true);
        requestBlock();
      },
      cancelOnPress: () => setCanPressBackdrop(true),
    });
  };

  const [canPressBackdrop, setCanPressBackdrop] = useState(true);
  return (
    <Modal
      backdropOpacity={0.3}
      isVisible={isOpen}
      onBackdropPress={() => {
        if (canPressBackdrop || typeof canPressBackdrop === "undefined")
          setIsOpen(false);
      }}
      style={styles.modal}
    >
      <Block style={styles.modalContents}>
        <Block row center style={{ marginTop: 24, marginHorizontal: 15 }}>
          <Block flex={0.4} center>
            <Text bold size={15} color="dimgray">
              {user.name}
            </Text>
          </Block>
          <Block flex={0.4} center>
            <Avatar size={75} image={user.image} border={false} />
          </Block>
          <Block flex={0.4} center>
            <Text bold size={15} color="dimgray">
              {user.job.label}
            </Text>
          </Block>
        </Block>

        {user.me && (
          <Block row center style={{ marginVertical: 28 }}>
            <Block center column>
              <Text bold size={16} color="#333333">
                {user.numOfThunks}
              </Text>
              <Text muted size={15}>
                <Icon
                  name="heart"
                  family="font-awesome"
                  color="#F69896"
                  size={15}
                />{" "}
                ありがとう
              </Text>
            </Block>
          </Block>
        )}

        <Block center>
          <Text bold size={15} color="dimgray" style={{ marginHorizontal: 15 }}>
            {user.introduction}
          </Text>
        </Block>

        {user.me ? (
          <Block center>
            <Button
              round
              color="lightcoral"
              opacity={0.9}
              style={styles.bottomButton}
              onPress={() => {
                setIsOpen(false);
                navigation.navigate("ProfileEditor");
              }}
            >
              <Text color="white" size={16}>
                <Icon
                  name="pencil"
                  family="font-awesome"
                  color="white"
                  size={16}
                />{" "}
                プロフィールを編集する
              </Text>
            </Button>
          </Block>
        ) : (
          <Block row center style={{ marginVertical: theme.SIZES.BASE * 2 }}>
            <Block flex={0.45} center>
              <ModalButton
                icon="notification"
                iconFamily="AntDesign"
                colorLess
                onPress={onPressReport}
              />
            </Block>
            <Block flex={0.1} />
            <Block flex={0.45} center>
              <ModalButton
                icon="block"
                iconFamily="Entypo"
                colorLess
                onPress={onPressBlock}
              />
            </Block>
          </Block>
        )}
      </Block>
    </Modal>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContents: {
    backgroundColor: "white",
    flexDirection: "column",
    alignItems: "center",
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },

  settingsCard: {
    backgroundColor: "white",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    paddingBottom: 40,
  },
  bottomButton: {
    shadowColor: "lightcoral",
    alignSelf: "center",
    marginVertical: theme.SIZES.BASE * 2,
  },
});
