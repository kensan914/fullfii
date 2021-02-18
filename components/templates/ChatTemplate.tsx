import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Input, Block, Text, Button, theme } from "galio-framework";
import Icon from "../atoms/Icon";
import { CommonMessage } from "../organisms/Chat";
import Avatar from "../atoms/Avatar";
import { generateUuid4, fmtfromDateToStr } from "../modules/support";
import { useChatDispatch, useChatState } from "../contexts/ChatContext";
import ProfileModal from "../molecules/ProfileModal";
import { logEvent } from "../modules/firebase/logEvent";
import { useProfileState } from "../contexts/ProfileContext";
import {
  AllMessages,
  Profile,
  WsNullable,
  TokenNullable,
  TalkTicketKey,
  AllMessage,
} from "../types/Types.context";
import {
  AppendOfflineMessage,
  ItemLayout,
  OnContentSizeChange,
  SendWsMessage,
} from "../types/Types";

const { width } = Dimensions.get("screen");

type Props = {
  user: Profile;
  messages: AllMessages;
  appendOfflineMessage: AppendOfflineMessage;
  ws: WsNullable;
  sendWsMessage: SendWsMessage;
  token: TokenNullable;
  talkTicketKey: TalkTicketKey;
  isEnd: boolean;
};
const ChatTemplate: React.FC<Props> = (props) => {
  const {
    user,
    messages,
    appendOfflineMessage,
    ws,
    sendWsMessage,
    token,
    talkTicketKey,
    isEnd,
  } = props;

  const messagesScroll = useRef<FlatList>(null);
  const [message, setMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(0);

  const existUser = !!user.id.length;
  const chatDispatch = useChatDispatch();
  const chatState = useChatState();
  const profileState = useProfileState();

  useEffect(() => {
    chatDispatch({ type: "READ_BY_ROOM", talkTicketKey });
  }, [messages.length]);

  const itemLayout: ItemLayout = (data, index) => ({
    length: messages.length - 1,
    offset: 32 * index,
    index,
  });

  const onContentSizeChange: OnContentSizeChange = (width, height) => {
    const messagesScrollCurrent = messagesScroll.current;
    messagesScrollCurrent !== null &&
      messagesScrollCurrent.scrollToOffset({ offset: height });
  };

  const renderMessage = (message: AllMessage, index: number) => {
    if ("common" in message) {
      return (
        <Block style={{ marginBottom: 10 }}>
          <CommonMessage message={message.message} />
        </Block>
      );
    } else {
      return (
        <Block key={index}>
          <Block row space={message.isMe ? "between" : null}>
            {message.isMe ? (
              <Image source={{}} style={[styles.avatar, styles.shadow]} />
            ) : (
              <TouchableOpacity onPress={() => setIsOpenProfile(true)}>
                <Avatar
                  size={40}
                  image={user.image}
                  style={[styles.avatar, styles.shadow]}
                />
              </TouchableOpacity>
            )}
            <Block style={styles.messageCardWrapper}>
              {!message.isMe ? (
                <Block
                  style={[
                    styles.messageCard,
                    { backgroundColor: "lavenderblush" },
                  ]}
                >
                  <Text>{message.message}</Text>
                </Block>
              ) : (
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={["#F69896", "#F69896"]}
                  style={[styles.messageCard, styles.shadow]}
                >
                  <Text color={theme.COLORS.WHITE}>{message.message}</Text>
                </LinearGradient>
              )}
              <Block right>
                {"time" in message && (
                  <Text style={styles.time}>
                    {fmtfromDateToStr(message.time, "hh:mm")}
                  </Text>
                )}
              </Block>
            </Block>
          </Block>
        </Block>
      );
    }
  };

  const renderMessages = () => {
    // const insetBottom = messages.length * (theme.SIZES.BASE * 6.5) + 64; // total messages x message height
    return (
      <FlatList
        ref={messagesScroll}
        data={messages}
        showsVerticalScrollIndicator={false}
        getItemLayout={itemLayout}
        contentContainerStyle={styles.messagesWrapper}
        renderItem={({ item, index }) => renderMessage(item, index)}
        onContentSizeChange={onContentSizeChange}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  const handleMessageChange = (text: string): void => {
    setMessage(text);
  };

  const handleMessage = () => {
    if (message.length > 0) {
      if (isEnd) {
        Alert.alert(`${user.name}さんは退室しています`);
        return;
      } else if (!existUser) {
        Alert.alert("話し相手が見つかりません。");
        return;
      }
      logEvent(
        "send_message_button",
        {
          message: message,
          talkTicketKey: talkTicketKey,
        },
        profileState
      );
      const messageID = generateUuid4();
      appendOfflineMessage(messageID, message);
      setMessage("");
      ws !== null &&
        token !== null &&
        sendWsMessage(ws, messageID, message, token);
    }
  };

  const messageForm = () => {
    return (
      <View
        style={[
          styles.messageFormContainer,
          { height: inputHeight + theme.SIZES.BASE * 4.6 },
        ]}
      >
        <Block
          flex
          row
          middle
          space="evenly"
          style={{ alignItems: "flex-end", paddingLeft: 15 }}
        >
          <Input
            borderless
            color="#9fa5aa"
            multiline
            style={[styles.input, { height: inputHeight + theme.SIZES.BASE }]}
            placeholder="メッセージを入力"
            autoCapitalize="none"
            textContentType="none"
            placeholderTextColor="#9fa5aa"
            defaultValue={message}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onContentSizeChange={(event: any) => {
              setInputHeight(event.nativeEvent.contentSize.height);
            }}
            onChangeText={(text: string) => handleMessageChange(text)}
          />
          <Button
            round
            shadowless
            radius={28}
            opacity={0.9}
            style={styles.sedButton}
            onPress={handleMessage}
          >
            <Icon size={20} name="send" family="font-awesome" color="#F69896" />
          </Button>
        </Block>
      </View>
    );
  };

  const [isOpenProfile, setIsOpenProfile] = useState(false);
  return (
    <Block flex space="between" style={styles.container}>
      <KeyboardAvoidingView
        enabled
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={theme.SIZES.BASE * 3}
      >
        {renderMessages()}
        {messageForm()}
      </KeyboardAvoidingView>

      {existUser ? (
        <ProfileModal
          isOpen={isOpenProfile}
          setIsOpen={setIsOpenProfile}
          profile={user}
          talkTicket={chatState.talkTicketCollection[talkTicketKey]}
        />
      ) : (
        <></>
      )}
    </Block>
  );
};

export default ChatTemplate;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  messageFormContainer: {
    maxHeight: theme.SIZES.BASE * 12 + 10,
    paddingTop: 16,
    paddingBottom: 40,
    backgroundColor: "lavenderblush",
  },
  input: {
    width: width * 0.8,
    maxHeight: theme.SIZES.BASE * 9,
    minHeight: theme.SIZES.BASE * 2.2,
    borderRadius: theme.SIZES.BASE * 1.1,
    backgroundColor: theme.COLORS.WHITE,
  },
  iconButton: {
    width: width * 0.15,
    minHeight: theme.SIZES.BASE * 3,
    backgroundColor: "transparent",
  },
  sedButton: {
    width: width * 0.15,
    minHeight: theme.SIZES.BASE * 3,
    backgroundColor: "transparent",
  },
  messagesWrapper: {
    flexGrow: 1,
    top: 0,
    paddingLeft: 8,
    paddingRight: 16,
    paddingVertical: 16,
    paddingBottom: 68,
  },
  messageCardWrapper: {
    maxWidth: "85%",
    marginLeft: 8,
    marginBottom: 20,
  },
  messageCard: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: theme.COLORS.WHITE,
  },
  shadow: {
    shadowColor: "rgba(0, 0, 0, 0.12)",
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 20,
    shadowOpacity: 1,
  },
  time: {
    fontSize: 11,
    opacity: 0.5,
    marginTop: 8,
  },
  avatar: {
    marginBottom: theme.SIZES.BASE,
  },
});
