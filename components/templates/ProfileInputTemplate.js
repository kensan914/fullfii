import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Block, theme, Text } from "galio-framework";
import { ScrollView } from "react-native-gesture-handler";
import { useAuthState } from "../contexts/AuthContext";
import { InputBlock, SubmitProfileButton } from "../organisms/ProfileInput";
import { useProfileDispatch, useProfileState } from "../contexts/ProfileContext";


const ProfileInputTemplate = (props) => {
  const { prevValue, screen } = props.route.params;
  const authState = useAuthState();
  const profileDispatch = useProfileDispatch();
  const profileState = useProfileState();

  const [value, setValue] = useState(prevValue);
  const [canSubmit, setCanSubmit] = useState(false);
  const [validationText, setValidationText] = useState("");

  return (
    <>
      <ScrollView>
        <Block style={styles.container}>
          <InputBlock screen={screen} prevValue={prevValue} setCanSubmit={setCanSubmit} value={value} setValue={setValue} />
          <Text color="red" style={{ paddingHorizontal: 10, paddingVertical: 3 }}>{validationText}</Text>
        </Block>
      </ScrollView>
      <SubmitProfileButton screen={screen} value={value} canSubmit={canSubmit} token={authState.token} profileDispatch={profileDispatch} profileState={profileState} setValidationText={setValidationText} {...props} />
    </>
  );
}

export default ProfileInputTemplate;


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.SIZES.BASE,
    marginVertical: theme.SIZES.BASE,
    paddingBottom: theme.SIZES.BASE * 5,
  },
});