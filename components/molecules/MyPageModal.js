import React from "react";
import { StyleSheet } from "react-native";
import { Block, Text, theme, Button } from "galio-framework";
import Modal from "react-native-modal";

import Avatar from "../atoms/Avatar"
import Icon from "../atoms/Icon";

export const MyPageModal = (props) => {
  const { isOpen, setIsOpen, } = props;

  return (
    <Modal
      backdropOpacity={0.3}
      isVisible={isOpen}
      onBackdropPress={() => setIsOpen(false)}
      style={styles.modal}
    >
      <Block style={styles.modalContents}>
        <Block  row center style={{flex: 0.3, justifyContent:"center"}}>
          <Block center column style={{flex: 0.4}}>
              <Text bold size={15} color="dimgray" style={{ marginHorizontal: 15 }}>けんさん</Text>
          </Block>
          <Block center style={{flex: 0.2}}>
            <Avatar size={75} image={false} border={false}/>
          </Block>
          <Block center column style={{flex: 0.4}}>
              <Text bold size={15} color="dimgray" style={{ marginHorizontal: 15 }}>大学生</Text>
          </Block>
        </Block>
        <Block row center style={{flex: 0.1, justifyContent: "center"}}>
          <Block column center style={{flex: 0.5, justifyContent: "center"}}>
            {/*<Text bold size={user.me ? 16 : 18} color="#333333">{user.numOfThunks}</Text>*/}
            <Text bold size={16} color="#333333">5</Text>
            <Text muted size={15}>
              <Icon name="heart" family="font-awesome" color="#F69896" size={15} />{" "}ありがとう
            </Text>
          </Block>
          <Block column center style={{flex: 0.5, justifyContent: "center"}}>
            {/*<Text bold size={16} color="#333333">{user.plan ? user.plan.label : ""}</Text>*/}
            <Text bold size={16} color="#333333">ノーマル</Text>
            <Text muted size={15}>
              <Icon name="id-card-o" family="font-awesome" color="#F69896" size={15} />{" "}プラン
            </Text>
          </Block>
        </Block>
        <Block  center style={{flex:0.4, justifyContent:"center"}}>
          <Text bold size={15} color="dimgray" style={{ marginHorizontal: 15 }}>いつも周りに応援してもらえるのが私の強みです。大学時代、陸上競技でインカレに出場しました。毎日一緒に練習に励んだ仲間に「あなたの出場が決まった時自分の事のように嬉しかった。 あなたなら、できるよ！」と、送り出されました。就職してからは、この人となら商売したいと思ってもらえるように頑張りたいです。</Text>
        </Block>
        <Block  center style={{flex: 0.2, justifyContent:"center"}}>
          <Button round color="lightcoral" opacity={0.9} style={styles.bottomButton} onPress={() => navigation.navigate("ProfileEditor")} >
            <Text color="white" size={16}><Icon name="pencil" family="font-awesome" color="white" size={16} />{" "}プロフィールを編集する</Text>
          </Button>
        </Block>
      </Block>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    marginHorizontal: 0,
    marginBottom: 0,
    marginTop: 280,
  },
  modalContents: {
    backgroundColor: "white",
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
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
    position: "absolute",
    alignSelf: "center",
    bottom: theme.SIZES.BASE * 2,
  },
});