import React, { useState } from "react";
import { Alert, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { Block, Checkbox, Icon, Input, Text } from "galio-framework";
import * as WebBrowser from "expo-web-browser";

import SignUpPageTemplate from "./SignUpPageTemplate";
import { useAuthDispatch, useAuthState } from "../../../contexts/AuthContext";
import { useAxios } from "../../../modules/axios";
import { generatePassword, URLJoin } from "../../../modules/support";
import { BASE_URL, USER_POLICY_URL } from "../../../../constants/env";
import {
  useProfileDispatch,
  useProfileState,
} from "../../../contexts/ProfileContext";
import { COLORS } from "../../../../constants/Theme";
import { MenuModal } from "../../../molecules/Menu";
import { logEvent } from "../../../modules/firebase/logEvent";
import {
  FormattedGenderKey,
  SignupResData,
  SignupResDataIoTs,
} from "../../../types/Types";
import GenderInputButtonList from "../../../molecules/GenderInputButtonList";
import { GenderKey } from "../../../types/Types.context";

const { width } = Dimensions.get("window");

const ThirdSignUpPage: React.FC = () => {
  const authState = useAuthState();
  const authDispatch = useAuthDispatch();
  const profileDispatch = useProfileDispatch();
  const profileState = useProfileState();
  const progressNum = 3;

  const [username, setUsername] = useState("");
  const [isActiveUsername, setIsActiveUsername] = useState(false);
  const maxUsernameLen = 15;

  const [genderKey, setGenderKey] = useState<GenderKey | FormattedGenderKey>();

  const [jobKey, setJobKey] = useState<string>();
  const [isOpenJobModal, setIsOpenJobModal] = useState(false);

  const [isAgreedUserpolicy, setIsAgreedUserpolicy] = useState(false);

  const checkCanNext = () => {
    return (
      0 < username.length &&
      username.length <= maxUsernameLen &&
      typeof genderKey !== "undefined" &&
      typeof jobKey !== "undefined" &&
      isAgreedUserpolicy
    );
  };

  const [password] = useState(generatePassword());
  const { isLoading, request } = useAxios(
    URLJoin(BASE_URL, "signup/"),
    "post",
    SignupResDataIoTs,
    {
      data: {
        username: username,
        password: password,
        genre_of_worries: authState.signupBuffer.worries,
        gender: genderKey,
        job: jobKey,
      },
      thenCallback: (resData) => {
        const _resData = resData as SignupResData;
        const _me = _resData.me;
        const _token = _resData.token;
        profileDispatch({ type: "SET_ALL", profile: _me });
        authDispatch({
          type: "COMPLETE_SIGNUP",
          token: _token,
          password: password,
        });
        authDispatch({
          type: "TO_PROGRESS_SIGNUP",
          didProgressNum: progressNum,
          isFinished: true,
        });

        // startUpLoggedin(_token, states, dispatches);
      },
      catchCallback: () => {
        Alert.alert("新規登録に失敗しました。");
      },
      limitRequest: 1,
    }
  );

  const pressButton = () => {
    logEvent("intro_user_info_button", {
      username: username,
      genre_of_worries: authState.signupBuffer.worries
        .map((worry) => {
          return worry?.label;
        })
        .join(", "),
      gender: genderKey,
      job: jobKey,
    });
    request();
  };

  const renderContents = () => {
    return (
      <Block flex>
        <Block flex justifyContent="center">
          <Input
            returnKeyType="done"
            bgColor="transparent"
            placeholderTextColor="darkgray"
            borderless
            color="lightcoral"
            placeholder="ユーザ名"
            autoCapitalize="none"
            style={[
              styles.usernameInput,
              username
                ? { borderBottomColor: COLORS.PINK }
                : { borderBottomColor: "silver" },
              isActiveUsername ? styles.usernameInputActive : null,
            ]}
            onChangeText={(text: string) => setUsername(text)}
            onBlur={() => setIsActiveUsername(false)}
            onFocus={() => setIsActiveUsername(true)}
            maxLength={maxUsernameLen}
          />
          <Block style={styles.usernameCounter}>
            <Text size={10} color="darkgray">
              {`${username.length}/${maxUsernameLen}`}
            </Text>
          </Block>
        </Block>

        {profileState.profileParams?.gender && (
          // expected genderKeys=["female", "male", "notset"]
          <GenderInputButtonList
            genderKeys={Object.values(profileState.profileParams.gender).map(
              (_gender) => _gender.key
            )}
            genderKey={genderKey}
            setGenderKey={setGenderKey}
          />
        )}

        <Block flex justifyContent="center">
          <TouchableOpacity
            activeOpacity={1.0}
            onPress={() => setIsOpenJobModal(true)}
            style={[
              styles.jobInput,
              jobKey ? { borderColor: COLORS.PINK } : { borderColor: "silver" },
            ]}
          >
            <Block flex style={styles.jobInputContent}>
              <Text
                color={jobKey ? "lightcoral" : "darkgray"}
                bold={Boolean(jobKey)}
              >
                {jobKey && profileState.profileParams?.job
                  ? profileState.profileParams.job[jobKey].label
                  : "-- 職業を選択してください --"}
              </Text>
              <Icon
                name="angle-down"
                family="font-awesome"
                color={jobKey ? COLORS.PINK : "gray"}
                size={22}
              />
            </Block>
          </TouchableOpacity>

          <MenuModal
            isOpen={isOpenJobModal}
            setIsOpen={setIsOpenJobModal}
            items={
              profileState.profileParams?.job &&
              Object.values(profileState.profileParams.job).map((jobObj) => {
                return {
                  title: jobObj.label,
                  onPress: () => {
                    setJobKey(jobObj.key);
                    setIsOpenJobModal(false);
                  },
                };
              })
            }
          />
        </Block>

        <Block flex={0.5} justifyContent="flex-end">
          <Block style={styles.agreeInput}>
            <Checkbox
              label=""
              color={COLORS.PINK}
              style={{ marginHorizontal: 8 }}
              initialValue={isAgreedUserpolicy}
              onChange={(value: boolean) => setIsAgreedUserpolicy(value)}
            />
            <Text
              color="lightcoral"
              onPress={() => WebBrowser.openBrowserAsync(USER_POLICY_URL)}
              style={{ textDecorationLine: "underline" }}
            >
              利用規約
            </Text>
            <Text color="gray">に同意する</Text>
          </Block>
        </Block>
      </Block>
    );
  };

  return (
    <SignUpPageTemplate
      title="新規登録"
      subTitle="ユーザ名・性別・職業を教えて下さい。"
      contents={renderContents()}
      isLoading={isLoading}
      pressCallback={pressButton}
      buttonTitle="登録してはじめる"
      checkCanNext={checkCanNext}
      statesRequired={[username, genderKey, jobKey, isAgreedUserpolicy]}
    />
  );
};

export default ThirdSignUpPage;

const styles = StyleSheet.create({
  inputContainerPart: {
    justifyContent: "center",
  },
  usernameInput: {
    width: width * 0.9,
    borderRadius: 0,
    borderBottomWidth: 1,
  },
  usernameInputActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.PINK,
  },
  usernameCounter: {
    alignItems: "flex-end",
  },
  jobInput: {
    borderWidth: 1,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
  },
  jobInputContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  jobModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  jobModalContent: {
    backgroundColor: "white",
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    paddingBottom: 40,
  },
  agreeInput: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
