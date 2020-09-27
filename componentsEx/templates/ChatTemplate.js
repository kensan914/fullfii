import React, { useRef, useState, useEffect } from "react";
import { View, Image, Dimensions, StyleSheet, FlatList, KeyboardAvoidingView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Input, Block, Text, Button, theme } from "galio-framework";
import Icon from "../atoms/Icon";
import materialTheme from "../../constantsEx/Theme";
import { CommonMessage } from "../organisms/Chat";
import Avatar from "../atoms/Avatar";
import { generateUuid4, fmtfromDateToStr } from "../tools/support";
import { useChatDispatch } from "../contexts/ChatContext";


const { width } = Dimensions.get("screen");


const ChatTemplate = (props) => {
  const { user, messages, appendOfflineMessage, ws, sendWsMesssage, token, roomID, isEnd } = props;

  const messagesScroll = useRef(null);
  const [message, setMessage] = useState("");
  const [height, setHeight] = useState(0);
  const [inputHeight, setInputHeight] = useState(0);

  const chatDispatch = useChatDispatch();

  useEffect(() => {
    handleScroll();
    chatDispatch({ type: "READ_BY_ROOM", roomID: roomID });
  }, [messages.length]);

  const itemLayout = (data, index) => (
    { length: (messages.length - 1), offset: 32 * index, index }
  )

  const handleScroll = () => {
    setTimeout(() => {
      messagesScroll.current.scrollToOffset({ offset: height });
    }, 1);
  }

  const onContentSizeChange = (width, height) => {
    setHeight(height);
  }

  const renderMessage = (message, index) => {
    if (message.common) {
      return (
        <Block style={{ marginBottom: 10 }}>
          <CommonMessage message={message.message} />
        </Block>
      );
    } else {
      return (
        <Block key={index}>
          <Block row space={message.isMe ? "between" : null}>
            {!message.isMe
              ? <Avatar size={40} image={user.image} style={[styles.avatar, styles.shadow]} />
              : <Image source={null} style={[styles.avatar, styles.shadow]} />
            }
            <Block style={styles.messageCardWrapper}>
              {!message.isMe ?
                <Block style={[styles.messageCard, { backgroundColor: "lavenderblush" }]}>
                  <Text>{message.message}</Text>
                </Block> :
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={["#F69896", "#F69896"]}
                  style={[styles.messageCard, styles.shadow]}>
                  <Text color={theme.COLORS.WHITE}>{message.message}</Text>
                </LinearGradient>
              }
              <Block right>
                {message.time &&
                  <Text style={styles.time}>{fmtfromDateToStr(message.time, "hh:mm")}</Text>
                }
              </Block>
            </Block>
          </Block>
        </Block>
      );
    }
  }

  const renderMessages = () => {
    const insetBottom = messages.length * (theme.SIZES.BASE * 6.5) + 64; // total messages x message height
    return (
      <FlatList
        ref={messagesScroll}
        data={messages}
        keyExtractor={item => `${item.id}`}
        showsVerticalScrollIndicator={false}
        getItemLayout={itemLayout}
        contentContainerStyle={[styles.messagesWrapper]}
        renderItem={({ item, index }) => renderMessage(item, index)}
        onContentSizeChange={onContentSizeChange}
        keyExtractor={(item, index) => index.toString()}
      />
    )
  }

  const handleMessageChange = (text) => {
    setMessage(text);
  }

  const handleMessage = () => {
    if (typeof message !== "undefined" && message.length > 0) {
      if (isEnd) {
        alert(`${user.name}さんは退室しています`);
        return;
      }
      const messageID = generateUuid4();
      appendOfflineMessage(messageID, message);
      setMessage("");
      sendWsMesssage(ws, messageID, message, token);
    }
  }

  const messageForm = () => {
    return (
      <View style={[styles.messageFormContainer, { height: inputHeight + theme.SIZES.BASE * 4.6 }]}>
        <Block flex row middle space="between" style={{ alignItems: "flex-end" }} >
          <Button
            round
            shadowless
            radius={28}
            opacity={0.9}
            style={styles.iconButton}
            color={materialTheme.COLORS.BUTTON_COLOR}
            onPress={() => { if (!isEnd) { } }}>
            <Icon size={20} name="phone" family="font-awesome" color={theme.COLORS.MUTED} />
          </Button>
          <Input
            borderless
            color="#9fa5aa"
            multiline
            style={[styles.input, { height: inputHeight + theme.SIZES.BASE }]}
            placeholder="メッセージ"
            autoCapitalize="none"
            returnKeyType="send"
            textContentType="none"
            placeholderTextColor="#9fa5aa"
            defaultValue={message}
            onContentSizeChange={(event) => {
              setInputHeight(event.nativeEvent.contentSize.height);
            }}
            onChangeText={text => handleMessageChange(text)}
          />
          <Button
            round
            shadowless
            radius={28}
            opacity={0.9}
            style={styles.sedButton}
            onPress={handleMessage}>
            <Icon size={20} name="send" family="font-awesome" color="#F69896" />
          </Button>
        </Block>
      </View>
    );
  }

  return (
    <Block flex space="between" style={styles.container}>
      <KeyboardAvoidingView
        enabled
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={theme.SIZES.BASE * 3}>
        {renderMessages()}
        {messageForm()}
      </KeyboardAvoidingView>
    </Block>
  );
}

export default ChatTemplate;


const styles = StyleSheet.create({
  container: {
    backgroundColor: "white"
  },
  messageFormContainer: {
    maxHeight: theme.SIZES.BASE * 12 + 10,
    // paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    backgroundColor: "lavenderblush",
  },
  input: {
    width: width * 0.7,
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
    shadowOpacity: 1
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
