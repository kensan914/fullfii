import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Block, theme, Text } from "galio-framework";
import { ScrollView } from "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";

import { useAuthState } from "../contexts/AuthContext";
import { InputBlock } from "../organisms/ProfileInputBlock";
import { useProfileDispatch } from "../contexts/ProfileContext";
import {
  ProfileInputRouteProp,
  RequestPatchProfile,
  RequestPutGender,
} from "../types/Types";
import { ProfileSubmitButton } from "../molecules/ProfileSubmitButton";

type Props = {
  requestPatchProfile: RequestPatchProfile;
  requestPutGender: RequestPutGender;
};
const ProfileInputTemplate: React.FC<Props> = (props) => {
  const { requestPatchProfile, requestPutGender } = props;
  const route = useRoute<ProfileInputRouteProp>();
  const { prevValue, screen: profileInputScreen } = route.params;
  const authState = useAuthState();
  const profileDispatch = useProfileDispatch();

  const [value, setValue] = useState(prevValue);
  const [canSubmit, setCanSubmit] = useState(false);
  const [validationText, setValidationText] = useState("");

  return (
    <>
      <ScrollView style={styles.scrollView}>
        <Block style={styles.container}>
          <InputBlock
            screen={profileInputScreen}
            prevValue={prevValue}
            setCanSubmit={setCanSubmit}
            value={value}
            setValue={setValue}
          />
          <Text
            color="red"
            style={{ paddingHorizontal: 10, paddingVertical: 3 }}
          >
            {validationText}
          </Text>
        </Block>
      </ScrollView>
      <ProfileSubmitButton
        screen={profileInputScreen}
        value={value}
        canSubmit={canSubmit}
        token={authState.token}
        profileDispatch={profileDispatch}
        setValidationText={setValidationText}
        requestPatchProfile={requestPatchProfile}
        requestPutGender={requestPutGender}
      />
    </>
  );
};

export default ProfileInputTemplate;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "white",
  },
  container: {
    paddingHorizontal: theme.SIZES.BASE,
    marginVertical: theme.SIZES.BASE,
    paddingBottom: theme.SIZES.BASE * 5,
  },
});
