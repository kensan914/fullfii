import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Block, Text } from "galio-framework";
import Modal from "react-native-modal";

import PlofileModalButton from "../atoms/PlofileModalButton"
import Avatar from "../atoms/Avatar"

const { width, height } = Dimensions.get("screen");
export const ProfileModal = (props) => {
  const { isOpen, setIsOpen, } = props;

  return (
    <Modal
      backdropOpacity={0.3}
      isVisible={isOpen}
      onBackdropPress={() => setIsOpen(false)}
      style={styles.modal}
    >
      <Block style={styles.modalContents}>
        <Block flex row center >
          <Block center style={{flex: 0.4}}>
            <Text bold size={15} color="dimgray" style={{ marginHorizontal: 15 }}>けんさん</Text>
          </Block>
          <Block center style={{flex: 0.2}}>
          <Avatar size={75} image={false} border={false}/>
            </Block>
          <Block center style={{flex: 0.4}}>
            <Text bold size={15} color="dimgray" style={{ marginHorizontal: 15 }}>大学生</Text>
          </Block>
        </Block>
        <Block flex center>
          <Text bold size={15} color="dimgray" style={{ marginHorizontal: 15 }}>いつも周りに応援してもらえるのが私の強みです。大学時代、陸上競技でインカレに出場しました。毎日一緒に練習に励んだ仲間に「あなたの出場が決まった時自分の事のように嬉しかった。 あなたなら、できるよ！」と、送り出されました。就職してからは、この人となら商売したいと思ってもらえるように頑張りたいです。</Text>
        </Block>
        <Block flex row center >
          <Block center style={{flex: 0.45}}>
            <PlofileModalButton icon="notification" iconFamily="AntDesign" color={false}/>
          </Block>
          <Block style={{flex: 0.1}}/>
          <Block center style={{flex: 0.45}}>
            <PlofileModalButton icon="block" iconFamily="Entypo" color={false}/>
          </Block>
        </Block>
      </Block>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    marginHorizontal: 0,
    marginBottom: 0,
    marginTop: 300,
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
  }
});