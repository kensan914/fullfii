import React, { useEffect, useState } from "react";
import { StyleSheet, Dimensions, ScrollView, TextInput } from "react-native";
import { withNavigation } from "@react-navigation/compat";
import { Block, Text, theme } from "galio-framework";
import { showToast, URLJoin } from "../modules/support";
import SubmitButton from "../atoms/SubmitButton";
import { useAxios } from "../modules/axios";
import { BASE_URL } from "../../constants/env";
import { useAuthState } from "../contexts/AuthContext";


const { width, height } = Dimensions.get("screen");

const WorryPostTemplate = (props) => {
  const [value, setValue] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [validationText, setValidationText] = useState("");
  const maxLength = 280;

  const authState = useAuthState();

  const { isLoading, resData, request } = useAxios(URLJoin(BASE_URL, "worries/"), "post", {
    thenCallback: res => {
      props.navigation.goBack();
      showToast({
        text1: "つぶやきを投稿しました",
        type: "success",
      });
    },
    catchCallback: err => {
      setValidationText(err.response.data.message.length > 0 ? err.response.data.message[0] : "");
    },
    token: authState.token,
  });

  const submitPostWorry = () => {
    request({
      data: {
        message: value,
      }
    });
  }

  // validate canSubmit
  useEffect(() => {
    if (value.length > 0 && !canSubmit) {
      setCanSubmit(true);
    } else if (!value) {
      setCanSubmit(false);
    }
  }, [value]);

  return (
    <>
      <ScrollView bounces={false}>
        <Block style={styles.container}>
          <Block flex style={styles.maxLengthBlock}>
            <Text color="gray">{value.length.toString()}/{maxLength}</Text>
          </Block>
          <TextInput
            multiline
            numberOfLines={4}
            editable
            style={styles.textInput}
            maxLength={maxLength}
            value={value}
            placeholder=""
            onChangeText={text => setValue(text)}
          />

          <Text color="red" style={{ paddingHorizontal: 10, paddingVertical: 3 }}>{validationText}</Text>
        </Block>
      </ScrollView>

      <Block style={styles.submitButtonWrapper}>
        <SubmitButton style={styles.submitButton} canSubmit={canSubmit} isLoading={isLoading} submit={() => {
          submitPostWorry();
        }} >
          投稿する
        </SubmitButton>
      </Block>
    </>
  );
}

export default withNavigation(WorryPostTemplate);


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.SIZES.BASE,
    marginVertical: theme.SIZES.BASE,
    paddingBottom: theme.SIZES.BASE * 5,
  },
  maxLengthBlock: {
    alignItems: "flex-end",
    marginRight: 10,
  },
  textInput: {
    height: 350,
    borderColor: "silver",
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "white",
  },

  submitButtonWrapper: {
    position: "absolute",
    alignSelf: "center",
    bottom: theme.SIZES.BASE * 2,
  },
  submitButton: {
    width: width - 30,
  }
});
