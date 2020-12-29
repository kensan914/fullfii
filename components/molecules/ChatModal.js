import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Block, Text, Button } from "galio-framework";
import Modal from "react-native-modal";


export const ChatModal = (props) => {
  const { isOpen, setIsOpen, } = props;

  return (
    <Modal
      backdropOpacity={0.3}
      isVisible={isOpen}
      onBackdropPress={() => {
        setIsOpen(false);
      }}
      style={styles.modal}
    >

      <Block style={styles.modalContents}>
        <Text>テスト</Text>
      </Block>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    // justifyContent: "flex-end",
    // margin: 0,
  },
  modalContents: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
});