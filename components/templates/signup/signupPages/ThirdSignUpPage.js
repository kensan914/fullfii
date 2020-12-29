import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import { Block, Button, Icon, Input, Text } from "galio-framework";
import Modal from "react-native-modal";

import SignUpPageTemplate from "./SignUpPageTemplate";
import { useAuthDispatch, useAuthState } from "../../../contexts/AuthContext";
import { useAxios } from "../../../modules/axios";
import { URLJoin } from "../../../modules/support";
import { BASE_URL } from "../../../../constants/env";
import { useProfileDispatch, useProfileState } from "../../../contexts/ProfileContext";
import { COLORS } from "../../../../constants/Theme";
import { MenuModal } from "../../../molecules/Menu";


const { height, width } = Dimensions.get("window");


const ThirdSignUpPage = (props) => {
  const { goToPage } = props;
  const authState = useAuthState();
  const authDispatch = useAuthDispatch();
  const progressNum = 3;

  const [username, setUsername] = useState("");
  const [isActiveUsername, setIsActiveUsername] = useState(false);
  const maxUsernameLen = 15;

  const GENDER = { FEMALE: 0, MALE: 1, SEQRET: 2 };
  const [gender, setGender] = useState();

  const [isOpenJobModal, setIsOpenJobModal] = useState(false);
  const [job, setJob] = useState();

  // テスト
  const testData = {
    username: "テストさん7",
    password: "gin-TK46",
    genre_of_worries: authState.signupBuffer.worries,
    gender: "male",
    job: "housewife",
  };

  const profileDispatch = useProfileDispatch();
  const { isLoading, resData, request } = useAxios(URLJoin(BASE_URL, "signup/"), "post", {
    data: testData,
    thenCallback: res => {
      const _me = res.data.me;
      const _token = res.data.token;
      profileDispatch({ type: "SET_ALL", profile: _me });
      authDispatch({ type: "COMPLETE_SIGNUP", token: _token, password: testData.password, });
      authDispatch({ type: "TO_PROGRESS_SIGNUP", didProgressNum: progressNum, isFinished: false, });
      goToPage(progressNum + 1);
    },
    catchCallback: err => {
      alert("新規登録に失敗しました。");
    },
    limitRequest: 1,
  });

  const pressButton = () => {
    request();
  }

  const renderContents = () => {
    const renderGenderInputButton = (iconName, title, isActive, key) => {
      const contentsColor = isActive ? COLORS.PINK : "lightgray";
      return (
        <Button
          color="white"
          shadowColor={isActive ? COLORS.PINK : "white"}
          style={styles.genderInputButton}
          onPress={() => setGender(key)}
        >
          <Icon
            family="font-awesome"
            size={50}
            name={iconName}
            color={contentsColor}
          />
          <Text
            bold
            size={12}
            color={contentsColor}
            style={{ marginTop: 4 }}
          >
            {title}
          </Text>
        </Button>
      );
    }


    return (
      <Block flex>
        <Block flex justifyContent="center">
          <Input
            bgColor="transparent"
            placeholderTextColor="darkgray"
            borderless
            color="lightcoral"
            placeholder="ユーザ名"
            autoCapitalize="none"
            style={[
              styles.usernameInput,
              Boolean(username) ? { borderBottomColor: COLORS.PINK } : { borderBottomColor: "silver" },
              isActiveUsername ? styles.usernameInputActive : null,
            ]}
            onChangeText={text => setUsername(text)}
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

        <Block flex justifyContent="center">
          <Block flex style={styles.genderInputContainer}>
            <Block flex style={styles.genderInput}>
              {renderGenderInputButton("female", "女性", gender === GENDER.FEMALE, GENDER.FEMALE)}
            </Block>
            <Block flex style={styles.genderInput}>
              {renderGenderInputButton("male", "男性", gender === GENDER.MALE, GENDER.MALE)}
            </Block>
            <Block flex style={styles.genderInput}>
              {renderGenderInputButton("question", "秘密", gender === GENDER.SEQRET, GENDER.SEQRET)}
            </Block>
          </Block>
        </Block>

        <Block flex justifyContent="center">
          <TouchableOpacity
            activeOpacity={1.0}
            onPress={() => setIsOpenJobModal(true)}
            style={[
              styles.jobInput,
              job ? { borderColor: COLORS.PINK, } : { borderColor: "silver", }
            ]}
          >
            <Block flex style={styles.jobInputContent}>
              <Text
                color={job ? "lightcoral" : "darkgray"}
                bold={Boolean(job)}
              >
                {job ? job : "-- 職業を選択してください --"}
              </Text>
              <Icon
                name="angle-down"
                family="font-awesome"
                color={job ? COLORS.PINK : "gray"}
                size={22}
              />
            </Block>
          </TouchableOpacity>

          <MenuModal isOpen={isOpenJobModal} setIsOpen={setIsOpenJobModal}
            items={[
              {
                title: "学生",
                onPress: () => {
                  setJob("学生");
                  setIsOpenJobModal(false);
                }
              },
              {
                title: "社会人",
                onPress: () => {
                  setJob("社会人");
                  setIsOpenJobModal(false);
                }
              },
            ]}
          />

        </Block>
      </Block >
    );
  }

  return (
    <SignUpPageTemplate
      title="新規登録"
      subTitle="ユーザ名・性別・職業を教えて下さい。"
      contents={renderContents()}
      isLoading={isLoading}
      pressCallback={pressButton}
      buttonTitle="登録して次へ"
    />
  )
}


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
  genderInputContainer: {
    flexDirection: "row",
  },
  genderInput: {
    justifyContent: "center",
    alignItems: "center",
  },
  genderInputButton: {
    width: width / 4,
    height: width / 4,
    borderRadius: width / 8,
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
  }
});
