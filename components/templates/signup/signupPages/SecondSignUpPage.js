import React, { useRef, useState } from "react";
import { Dimensions } from "react-native";

import SignUpPageTemplate from "./SignUpPageTemplate";
import { useAuthDispatch } from "../../../contexts/AuthContext";
import { useProfileState } from "../../../contexts/ProfileContext";
import BubbleList from "../../../organisms/BubbleList";
import { logEvent } from "../../../modules/firebase/logEvent"


const { width, height } = Dimensions.get("screen");


const SecondSignUpPage = (props) => {
  const { goToPage } = props;
  const authDispatch = useAuthDispatch();
  const profileState = useProfileState();
  const progressNum = 2;

  const [worriesCollection, setWorriesCollection] = useState({});
  const checkCanNext = () => {
    return (
      Object.keys(worriesCollection).length >= 3
    );
  }

  const pressButton = () => {
    authDispatch({ type: "TO_PROGRESS_SIGNUP", didProgressNum: progressNum, isFinished: false, });
    authDispatch({ type: "SET_WORRIES_BUFFER", worries: Object.values(worriesCollection), });
    logEvent("intro_worry_bubble", {
      worries: Object.values(worriesCollection).map(worry => {
        return worry?.label
      }).join(", "),
    });

    goToPage(progressNum + 1);
  }

  const genreOfWorries =
    profileState.profileParams ?
      JSON.parse(JSON.stringify(profileState.profileParams.genreOfWorries)) :
      {};

  const pressBubble = (key) => {
    const _worriesCollection = { ...worriesCollection };
    if (_worriesCollection.hasOwnProperty(key)) {
      delete _worriesCollection[key];
    } else {
      _worriesCollection[key] = genreOfWorries[key];
    }
    setWorriesCollection(_worriesCollection);
  };

  const renderContents = () => {
    const iPhoneXHeight = 812;
    const isHigherDevice = height >= iPhoneXHeight;

    return (
      <BubbleList
        items={Object.values(genreOfWorries)}
        limitLines={isHigherDevice ? 3 : 3}
        diameter={isHigherDevice ? height / 10 : undefined}
        margin={isHigherDevice ? 3.0 : undefined}
        activeKeys={Object.keys(worriesCollection)}
        pressBubble={pressBubble}
      />
    );
  }

  return (
    <SignUpPageTemplate
      title="あなたの悩みをおしえて下さい。"
      subTitle="当てはまる悩みを一回タップ、合計で3つ選択してください。完了したら次へのボタンを押してください。"
      contents={renderContents()}
      isLoading={false}
      pressCallback={pressButton}
      buttonTitle="次へ"
      checkCanNext={checkCanNext}
      statesRequired={[worriesCollection]}
    />
  )
}


export default SecondSignUpPage;
