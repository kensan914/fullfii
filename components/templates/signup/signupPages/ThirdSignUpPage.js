import React, { useRef } from "react";
import SignUpPageTemplate from "./SignUpPageTemplate";
import { Text } from "galio-framework";
import { useAuthDispatch, useAuthState } from "../../../contexts/AuthContext";
import { useAxios } from "../../../modules/axios";
import { URLJoin } from "../../../modules/support";
import { BASE_URL } from "../../../../constants/env";
import { useProfileDispatch, useProfileState } from "../../../contexts/ProfileContext";


const ThirdSignUpPage = (props) => {
  const { goToPage } = props;
  const authState = useAuthState();
  const authDispatch = useAuthDispatch();
  const progressNum = 3;

  const profileState = useProfileState();
  // テスト
  const testData = {
    username: "テストさん7",
    password: "gin-TK46",
    genre_of_worries: authState.signupBuffer.worries,
    gender: "male",
    job: "housewife",
  };

  const isRequested = useRef(false);
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
    errorCallback: err => {
      alert("新規登録に失敗しました。");
    }
  });
  const pressButton = () => {
    if (!isRequested.current) {
      request();
      isRequested.current = true;
      console.log("サインアップします");
    } else {
      console.log("サインアップ済みです。");
    }
  }

  return (
    <SignUpPageTemplate
      title="新規登録"
      subTitle="ユーザ名・性別・職業を教えて下さい。"
      // contents={<><Text>コンテンツ</Text></>}
      isLoading={isLoading}
      pressCallback={pressButton}
      buttonTitle="次へ"
    />
  )
}


export default ThirdSignUpPage;
