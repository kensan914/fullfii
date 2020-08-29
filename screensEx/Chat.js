import React from "react";
import { View, Image, Dimensions, StyleSheet, FlatList, KeyboardAvoidingView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Input, Block, Text, Button, theme } from "galio-framework";
import Icon from "../componentsEx/atoms/Icon";
import materialTheme from "../constantsEx/Theme";
import { CommonMessage } from "../componentsEx/organisms/Chat";


const { width } = Dimensions.get("screen");

export default class Chat extends React.Component {
  state = {
    messages: [{
      id: 0,
      message: "聞き手に最初のメッセージを送りましょう。\n聞き手からの返信が返ってきたら相談が開始されます。",
      common: true,
    }],
    height: 0,
    inputHeight: 0,
  };

  messagesScroll = React.createRef();

  itemLayout = (data, index) => (
    { length: (this.state.messages.length - 1), offset: 32 * index, index }
  )

  handleScroll = () => {
    // const totalIndex = this.state.messages.length - 1;
    // const insetBottom = this.state.messages.length * (theme.SIZES.BASE * 6.5) + 64; // total messages x message height
    setTimeout(() => {
      this.messagesScroll.current.scrollToOffset({ offset: this.state.height });
    }, 1);

  }

  onContentSizeChange = (width, height) => {
    this.setState({
      height
    });
  }

  componentDidMount() {
    // this.handleScroll();
  }
  
  renderMessage = (msg) => {
    if (msg.common) {
      return (
        <Block style={{ marginBottom: 10 }}>
          <CommonMessage message={msg.message} />
        </Block>
      );
    } else {
      return (
        <Block key={msg.id}>
          <Block row space={!msg.avatar ? "between" : null}>
            <Image source={{ uri: msg.avatar }} style={[styles.avatar, styles.shadow]} />
            <Block style={styles.messageCardWrapper}>
              {msg.avatar ?
                <Block style={[styles.messageCard, styles.shadow]}>
                  <Text>{msg.message}</Text>
                </Block> :
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={["#F69896", "#F69896"]}
                  style={[styles.messageCard, styles.shadow]}>
                  <Text color={theme.COLORS.WHITE}>{msg.message}</Text>
                </LinearGradient>
              }
              <Block right>
                <Text style={styles.time}>{msg.time}</Text>
              </Block>
            </Block>
          </Block>
        </Block>
      );
    }
  }

  renderMessages = () => {
    const insetBottom = this.state.messages.length * (theme.SIZES.BASE * 6.5) + 64; // total messages x message height
    return (
      <FlatList
        ref={this.messagesScroll}
        data={this.state.messages}
        keyExtractor={item => `${item.id}`}
        showsVerticalScrollIndicator={false}
        getItemLayout={this.itemLayout}
        contentContainerStyle={[styles.messagesWrapper]}
        renderItem={({ item }) => this.renderMessage(item)}
        onContentSizeChange={this.onContentSizeChange}
      />
    )
  }

  handleMessageChange = (type, text) => {
    this.setState({ message: text });
  }

  handleMessage = () => {
    const { messages, message } = this.state;
    if (typeof message !== "undefined" && message.length > 0) {
      const date = new Date();

      const newMessages = messages.concat([{
        id: messages.length + 1,
        message: message,
        time: date.toLocaleString("ja", { hour: "2-digit", minute: "numeric" }),
      }]);

      this.setState({ messages: newMessages, message: "" });
      this.handleScroll();
    }
  }

  messageForm = () => {
    const { navigation } = this.props;

    return (
      <View style={[styles.messageFormContainer, { height: this.state.inputHeight + theme.SIZES.BASE * 4.6 }]}>
        <Block flex row middle space="between" style={{ alignItems: "flex-end" }} >
          <Button
            round
            shadowless
            radius={28}
            opacity={0.9}
            style={styles.iconButton}
            color={materialTheme.COLORS.BUTTON_COLOR}
            onPress={() => { }}>
            <Icon size={20} name="phone" family="font-awesome" color={theme.COLORS.MUTED} />
          </Button>
          <Input
            borderless
            color="#9fa5aa"
            multiline
            style={[styles.input, { height: this.state.inputHeight + theme.SIZES.BASE }]}
            placeholder="メッセージ"
            autoCapitalize="none"
            returnKeyType="none"
            textContentType="none"
            placeholderTextColor="#9fa5aa"
            defaultValue={this.state.message}
            onContentSizeChange={(event) => {
              this.setState({
                inputHeight: event.nativeEvent.contentSize.height,
              })
            }}
            onChangeText={text => this.handleMessageChange("message", text)}
          />
          <Button
            round
            shadowless
            radius={28}
            opacity={0.9}
            style={styles.sedButton}
            onPress={this.handleMessage}>
            <Icon size={20} name="send" family="font-awesome" color="#F69896" />
          </Button>
        </Block>
      </View>
    );
  }

  render() {
    return (
      <Block flex space="between" style={styles.container}>
        <KeyboardAvoidingView
          enabled
          behavior="padding"
          style={{ flex: 1 }}
          keyboardVerticalOffset={theme.SIZES.BASE * 3}>
          {this.renderMessages()}
          {this.messageForm()}
        </KeyboardAvoidingView>
      </Block>
    );
  }
}


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
    height: 40,
    width: 40,
    borderRadius: 20,
    marginBottom: theme.SIZES.BASE,
  },
});
