import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import Modal from "react-native-modal";
import { Block } from "galio-framework";
import DateTimePicker from "@react-native-community/datetimepicker";
import SubmitButton from "./SubmitButton";

const { width } = Dimensions.get("screen");

const BirthdayPicker = (props) => {
  const { birthday, setBirthday, isOpen, setIsOpen, colorScheme, submit, canSubmit, isLoading } = props;

  return (
    <Modal
      backdropOpacity={0.3}
      isVisible={isOpen}
      onBackdropPress={() => setIsOpen(false)}
      style={styles.modal}
    >
      <Block style={[styles.container, { backgroundColor: colorScheme === "dark" ? "#222" : "white" }]}>
        <DateTimePicker
          value={typeof birthday === "undefined" ? new Date() : birthday}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
          mode="date"
          display="default"
          onChange={(event, date) => { setBirthday(date) }}
          style={{ width: width }}
          locale="ja"
        />
        {(typeof submit !== "undefined" && typeof canSubmit !== "undefined" && typeof isLoading !== "undefined") &&
          < SubmitButton canSubmit={canSubmit} isLoading={isLoading} submit={submit} />
        }
      </Block>
    </Modal>
  );
}

export default BirthdayPicker;

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  container: {
    backgroundColor: "white",
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    paddingBottom: 40,
  }
});