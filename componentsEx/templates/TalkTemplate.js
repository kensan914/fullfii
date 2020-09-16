import React from 'react';
import { StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Block, Text } from 'galio-framework';

import { Hr } from '../../componentsEx';
import Avatar from '../../componentsEx/atoms/Avatar';
import { cvtListDate, cvtBadgeCount } from '../tools/support';
import { useAuthState } from '../contexts/AuthContext';
import { useChatDispatch, useChatState } from '../contexts/ChatContext';


const { width, height } = Dimensions.get('screen');

const TalkTemplate = (props) => {
  const { navigation, sendCollection, inCollection, talkCollection, connectWsChat } = props;

  return (
    <ScrollView>
      <TalkTitle title="トーク中" />
      <TalkCollection talkCollection={talkCollection} navigation={navigation} />
      <TalkTitle title="受信" />
      <SendInCollection collection={inCollection} connectWsChat={connectWsChat} />
      <TalkTitle title="送信" />
      <SendInCollection collection={sendCollection} />
    </ScrollView>
  );
}

export default TalkTemplate;


const TalkTitle = (props) => {
  const { title } = props;
  return (
    <Block flex style={{ paddingHorizontal: 15, paddingVertical: 10, marginTop: 5 }}>
      <Text size={18} bold color="gray" >{title}</Text>
    </Block>
  );
}

const TalkCollection = (props) => {
  const { talkCollection, navigation } = props;
  const talkList = Object.values(talkCollection)
    .sort((a, b) => {
      const timeA = a.messages[a.messages.length - 1].time;
      const timeB = b.messages[b.messages.length - 1].time;
      if (timeA > timeB) return -1;
      if (timeA < timeB) return 1;
      return 0;
    });

  const getNewestMessage = (item) => {
    let neweseMessage = { message: "", time: "" };
    if (item.messages.length > 0) {
      neweseMessage.message = item.messages[item.messages.length - 1].message;
      neweseMessage.time = cvtListDate(item.messages[item.messages.length - 1].time);
    }
    return neweseMessage;
  }

  return (
    talkList.map((item, index) => {
      const newestMessage = getNewestMessage(item);
      const badgeCount = cvtBadgeCount(item.unreadNum);

      return (
        <TouchableOpacity key={index} onPress={() => navigation.navigate("Chat", { roomID: item.roomID })}>
          <Block flex row style={styles.talkCard}>
            <Block flex={0.2}>
              <Avatar size={56} image={item.user.image} style={{ alignSelf: "center" }} />
            </Block>
            <Block flex={0.65}>
              <Text size={16} bold color="#F69896" style={{ marginBottom: 4 }}>{item.user.name}</Text>
              <Text size={13} color="gray" numberOfLines={2} ellipsizeMode="tail">{newestMessage.message}</Text>
            </Block>
            <Block flex={0.15} style={{ height: 80, alignItems: "center" }}>
              <Block flex={0.4} style={{ justifyContent: "center" }}>
                <Text size={11} color="silver">{newestMessage.time}</Text>
              </Block>
              {badgeCount &&
                <Block flex={0.6}>
                  <Block style={{ backgroundColor: "#F69896", height: 30, minWidth: 30, borderRadius: 15, borderColor: "white", borderWidth: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text size={16} color="white" style={{ paddingHorizontal: 3 }}>{badgeCount}</Text>
                  </Block>
                </Block>
              }
            </Block>
          </Block>
          <Hr h={1} color="whitesmoke" />
        </TouchableOpacity>
      );
    })
  );
}

const SendInCollection = (props) => {
  const { collection, connectWsChat } = props;
  const authState = useAuthState();
  const chatState = useChatState();
  const chatDispatch = useChatDispatch();

  const list = Object.values(collection)
    .sort((a, b) => {
      const timeA = a.date;
      const timeB = b.date;
      if (timeA > timeB) return -1;
      if (timeA < timeB) return 1;
      return 0;
    });

  return (
    list.map((item, index) => (
      <TouchableOpacity key={index} onPress={connectWsChat && (() => connectWsChat(item.roomID, authState.token, chatState, chatDispatch))}>
        <Block flex row style={styles.talkCard}>
          <Block flex={0.2}>
            <Avatar size={56} image={item.user.image} style={{ alignSelf: "center" }} />
          </Block>
          <Block flex={0.65}>
            <Text size={16} bold color="#F69896" style={{ marginBottom: 4 }}>{item.user.name}</Text>
            {/* <Text size={13} color="gray" numberOfLines={2} ellipsizeMode="tail">{}</Text> */}
          </Block>
          <Block flex={0.15} style={{ height: 80 }}>
            <Text size={11} color="silver" style={{ marginTop: 16, alignSelf: "center" }}>{cvtListDate(item.date)}</Text>
          </Block>
        </Block>
        <Hr h={1} color="whitesmoke" />
      </TouchableOpacity>
    ))
  );
}

const styles = StyleSheet.create({
  talkCard: {
    height: 80,
    width: width,
    backgroundColor: "white",
    alignItems: "center"
  },
});
