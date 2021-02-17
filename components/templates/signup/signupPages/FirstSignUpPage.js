import React from "react";
import { useAuthDispatch } from "../../../contexts/AuthContext";
import SignUpPageTemplate from "./SignUpPageTemplate";

const FirstSignUpPage = (props) => {
  const { goToPage } = props;
  const authDispatch = useAuthDispatch();
  const progressNum = 1;
  const pressButton = () => {
    authDispatch({
      type: "TO_PROGRESS_SIGNUP",
      didProgressNum: progressNum,
      isFinished: false,
    });
    goToPage(progressNum + 1);
  };

  return (
    <SignUpPageTemplate
      title={"はじめまして" + "\n" + "ようこそ、Fullfiiへ"}
      subTitle="これから使い方の説明を始めていきます。"
      // contents={}
      isLoading={false}
      pressCallback={pressButton}
      buttonTitle="次へ"
    />
  );
};

export default FirstSignUpPage;
