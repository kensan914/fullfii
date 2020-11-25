import React from "react";
import { StyleSheet, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { Block, Text } from "galio-framework";

import Hr from "../../components/atoms/Hr";
import Avatar from "../../components/atoms/Avatar";
import { cvtListDate, cvtBadgeCount, alertModal, checkSubscribePlan, checkProfileIsBuried } from "../modules/support";
import useAllContext from "../contexts/ContextUtils";


const { width, height } = Dimensions.get("screen");

const TalkTemplate = (props) => {
  const { navigation, sendCollection, inCollection, talkCollection, initConnectWsChat, requestCancelTalk } = props;

  return (
    <ScrollView>
      <TalkTitle title="トーク中" collection={talkCollection} />
      <TalkList talkCollection={talkCollection} navigation={navigation} />
      <Hr h={8} color="whitesmoke" />

      <TalkTitle title="リクエスト受信" collection={inCollection} />
      <SendInList collection={inCollection} initConnectWsChat={initConnectWsChat} navigation={navigation} />
      <Hr h={8} color="whitesmoke" />

      <TalkTitle title="リクエスト送信" collection={sendCollection} />
      <SendInList collection={sendCollection} requestCancelTalk={requestCancelTalk} navigation={navigation} />
    </ScrollView>
  );
}

export default TalkTemplate;


const TalkTitle = (props) => {
  const { title, collection } = props;
  const length = Object.keys(collection).length;
  return (
    <>
      <Block flex row style={{ paddingHorizontal: 15, paddingVertical: 10, paddingTop: 15, backgroundColor: "white" }}>
        <Text size={14} bold color="gray" >{title}{"  "}{length}</Text>
      </Block>
      {length > 0 &&
        <Hr h={1} color="whitesmoke" />
      }
    </>
  );
}

const TalkList = (props) => {
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
        <TouchableOpacity key={index} activeOpacity={.6} onPress={() => navigation.navigate("Chat", { roomID: item.roomID })}>
          <Block flex row style={styles.talkCard}>
            <TouchableOpacity style={{ flex: 0.2 }} onPress={() => navigation.navigate("Profile", { item: item.user })}>
              <Avatar size={56} image={item.user.image} style={{ alignSelf: "center" }} />
            </TouchableOpacity>
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

const SendInList = (props) => {
  const { collection, initConnectWsChat, requestCancelTalk, navigation } = props;

  const [states, dispatches] = useAllContext();

  const list = Object.values(collection)
    .sort((a, b) => {
      const timeA = a.date;
      const timeB = b.date;
      if (timeA > timeB) return -1;
      if (timeA < timeB) return 1;
      return 0;
    });

  const onPress = (item) => {
    if (initConnectWsChat) {
      alertModal({
        mainText: `${item.user.name}さんとトークを開始しますか？`,
        subText: "トーク開始から2週間後に自動で会話内容は削除されます。",
        cancelButton: "キャンセル",
        okButton: "開始する",
        onPress: () => {
          checkProfileIsBuried(states.profileState.profile, () => {
            checkSubscribePlan(states.profileState.profile, () => {
              // initConnectWsChat(item.roomID, states.authState.token, states, dispatches, item.worriedUserID !== item.user.id)
              initConnectWsChat(item.roomID, states.authState.token, states, dispatches);
            }, "現在プランに加入しておりません。トークを開始するにはノーマルプランに加入してください。");
          }, "トークを開始することができません。");
        },
      });
    } else if (requestCancelTalk) {
      alertModal({
        mainText: `${item.user.name}さんへのリクエストをキャンセルしますか？`,
        subText: `${item.user.name}さんの端末からもこのリクエストは削除されます。`,
        cancelButton: "やめる",
        okButton: "キャンセルする",
        onPress: () => requestCancelTalk(item.roomID, states.authState.token, dispatches.chatDispatch),
      });
    }
  }

  // sendInMessageの設定
  const geneSendInMessage = (item) => {
    if (item.worriedUserID === item.user.id) {
      if (initConnectWsChat) {
        // リクエスト受信 && 相手が相談者
        return "「話を聞いてほしい」リクエストが届きました";
      } else if (requestCancelTalk) {
        // リクエスト送信 && 相手が相談者
        return "「話聞くよ」リクエストを送信しています";
      }
    } else {
      if (initConnectWsChat) {
        // リクエスト受信 && 自分が相談者
        return "「話聞くよ」リクエストが届きました";
      } else if (requestCancelTalk) {
        // リクエスト送信 && 自分が相談者
        return "「話を聞いてほしい」リクエストを送信しています";
      }
    }
  }

  return (
    list.map((item, index) => (
      <TouchableOpacity key={index} activeOpacity={.6} onPress={() => onPress(item)}>
        <Block flex row style={styles.talkCard}>
          <TouchableOpacity style={{ flex: 0.2 }} activeOpacity={.6} onPress={() => navigation.navigate("Profile", { item: item.user })}>
            <Avatar size={56} image={item.user.image} style={{ alignSelf: "center" }} />
          </TouchableOpacity>
          <Block flex={0.65}>
            <Text size={16} bold color="#F69896" style={{ marginBottom: 4 }}>{item.user.name}</Text>
            <Text size={13} color="gray" numberOfLines={2} ellipsizeMode="tail">{geneSendInMessage(item)}</Text>
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
