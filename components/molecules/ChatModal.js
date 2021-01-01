import React, { useState } from "react";
import { StyleSheet, Dimensions, Switch } from "react-native";
import { Block, Text, Button } from "galio-framework";
import Modal from "react-native-modal";

import ChangeModalButton from "../atoms/ChangeModalButton"
const { width, height } = Dimensions.get("screen");

export const ChatModal = (props) => {
  const { isOpen, setIsOpen, } = props;
  const [ isSpeak, setIsSpeak] = useState(true);
  const [ isListen, setIsListen] = useState(false);
  const [ sameType, setSameType] = useState(false);

  const SettingsSwitch = (props) => {
    const { title, onChange, value } = props;
    
    return (
      <>
          <Block row space="between" style={styles.settingsCard}>
            <Block>
              <Text bold size={15} color="dimgray" style={{ marginHorizontal: 15 }}>{title}</Text>
            </Block>
            <Block style={{ alignItems: "center", justifyContent: "center" }} >
              <Switch
                trackColor={{ false: "dimgray", true: "#F69896" }}
                ios_backgroundColor={"gray"}
                // initialValue={value}
                value={value}
                style={{ marginVertical: 8, marginHorizontal: 15, }}
                onValueChange={onChange}
              />
            </Block>
          </Block>
      </>
    );
  }
  const listener = (value) => {
    if (value) {
      setIsListen(true);
      setIsSpeak(false);}
    else {
      setIsSpeak(true);
      setIsListen(false);
    }
  }
  const speaker = (value) => {
    if (value) {
      setIsListen(false);
      setIsSpeak(true);}
    else {
      setIsSpeak(false);
      setIsListen(true);
    }
  }
  return (
    <Modal
      backdropOpacity={0.3}
      isVisible={isOpen}
      onBackdropPress={() => setIsOpen(false)}
      style={styles.modal}
    >
      <Block style={styles.modalContents}>
        <Block >
          <Block style={{flex: 3.5}}>
            <SettingsSwitch title="話したい" value={isSpeak} onChange={(value)=>{speaker(value);}}/>
            <SettingsSwitch title="聞きたい" value={isListen} onChange={(value)=>{listener(value);}}/>
          </Block>
          <Block style={{flex:3.5}}>
            <SettingsSwitch title="話し相手を高校生に絞る" value={sameType} onChange={(value)=>{value ? setSameType(true) : setSameType(false)}}/>
          </Block>
          <Block flex row center >
            <Block center style={{flex: 0.45}}>
              <ChangeModalButton icon="logout" iconFamily="AntDesign" color={false}/>
            </Block>
            <Block style={{flex: 0.1}}/>
            <Block center style={{flex: 0.45}}>
              <ChangeModalButton icon="loop" iconFamily="MaterialIcons" color={true}/>
            </Block>
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
    marginTop: 320,
  },
  modalContents: {
    backgroundColor: "white",
    justifyContent: "flex-end",
    flex: 1,
    alignItems: 'center',
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    paddingTop: 40,
    paddingBottom: 60
  },
  settingsCard: {
    backgroundColor: "white",
    alignItems: "center",
  },
});