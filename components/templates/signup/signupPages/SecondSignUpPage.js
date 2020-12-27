import React from "react";
import SignUpPageTemplate from "./SignUpPageTemplate";
import { Text } from "galio-framework";
import { useAuthDispatch } from "../../../contexts/AuthContext";
import { useProfileState } from "../../../contexts/ProfileContext";


const SecondSignUpPage = (props) => {
  const { goToPage } = props;
  const authDispatch = useAuthDispatch();
  const progressNum = 2;

  const profileState = useProfileState();
  const pressButton = () => {
    authDispatch({ type: "TO_PROGRESS_SIGNUP", didProgressNum: progressNum, isFinished: false, });

    // テスト
    const genreOfWorries = profileState.profileParams.genreOfWorries;
    authDispatch({ type: "SET_WORRIES_BUFFER", worries: [genreOfWorries[3], genreOfWorries[6],], });
    
    goToPage(progressNum + 1);
  }
  return (
    <SignUpPageTemplate
      title="あなたの悩みをおしえて下さい。"
      subTitle="当てはまる悩みを一回タップ、合計で3つ選択してください。完了したら次へのボタンを押してください。"
      // contents={<><Text>コンテンツ</Text></>}
      isLoading={false}
      pressCallback={pressButton}
      buttonTitle="次へ"
    />
  )
}


export default SecondSignUpPage;
