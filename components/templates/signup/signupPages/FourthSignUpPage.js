import React from "react";
import SignUpPageTemplate from "./SignUpPageTemplate";
import { Text } from "galio-framework";
import { useAuthDispatch, useAuthState } from "../../../contexts/AuthContext";


const FourthSignUpPage = (props) => {
  const authState = useAuthState();
  const authDispatch = useAuthDispatch();
  const progressNum = 4;
  const pressButton = () => {
    authDispatch({ type: "TO_PROGRESS_SIGNUP", didProgressNum: progressNum, isFinished: true, });
  }
  return (
    <SignUpPageTemplate
      title="相談相手を探します。"
      subTitle="あなたと同じ悩みを持つ方を探します。追加する検索条件を選んでください。"
      // contents={<><Text>コンテンツ</Text></>}
      isLoading={false}
      pressCallback={pressButton}
      buttonTitle="終了"
    />
  )
}


export default FourthSignUpPage;
