import React, { useRef, useState } from "react";
import { StyleSheet, Dimensions, ScrollView } from "react-native";
import { Block, Text, theme, Button, Icon } from "galio-framework";
import Modal from "react-native-modal";
import LottieView from "lottie-react-native";
import { TextInput } from "react-native-gesture-handler";
import Spinner from "react-native-loading-spinner-overlay";

import DropDown from "../atoms/Select";
import { alertModal } from "../tools/support";
import { MenuModal } from "../molecules/Menu";
import { TouchableOpacity } from "react-native";
import { useAuthState } from "../contexts/AuthContext";
import { requestCloseTalk, requestEndTalk } from "../../screensEx/Talk";
import { useChatDispatch } from "../contexts/ChatContext";


const { width, height } = Dimensions.get("screen");

export const CommonMessage = (props) => {
  const { message } = props;
  return (
    <Block style={styles.commonMessage}>
      <Text style={{ alignSelf: "center", lineHeight: 18, }} bold size={14} color="#F69896">{message.replace("\\n", "\n")}</Text>
    </Block>
  );
}

export const TalkMenuButton = (props) => {
  const { navigation, talkObj } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEndTalk, setIsOpenEndTalk] = useState(false);
  const [isShowSpinner, setIsShowSpinner] = useState(false);
  const [canPressBackdrop, setCanPressBackdrop] = useState(true);

  const authState = useAuthState();
  const chatDispatch = useChatDispatch();

  return (
    <>
      <TouchableOpacity style={[styles.TalkMenuButton, {}]} onPress={() => setIsOpen(true)}>
        <Icon family="font-awesome" size={20} name="ellipsis-h" color="gray" />
        <MenuModal isOpen={isOpen} setIsOpen={setIsOpen}
          items={[
            {
              title: "トークを終了する", onPress: () => {
                if (!talkObj.isEnd) endTalk(navigation, setIsOpenEndTalk, talkObj, authState.token, chatDispatch, setIsShowSpinner, setCanPressBackdrop);
                else {
                  setCanPressBackdrop(false);
                  requestEndTalk(talkObj.roomID, authState.token, setIsOpenEndTalk, navigation, chatDispatch, setIsShowSpinner);
                }
              }
            },
            { title: "通報する", onPress: () => { } },
          ]}
          otherModal={
            <EndTalkScreen
              navigation={navigation}
              isOpen={isOpenEndTalk}
              setIsOpen={setIsOpenEndTalk}
              talkObj={talkObj}
              token={authState.token}
            />}
          spinnerOverlay={
            <Spinner
              visible={isShowSpinner}
              overlayColor="rgba(0,0,0,0)"
            />}
          canPressBackdrop={canPressBackdrop}
        />
      </TouchableOpacity >
    </>
  );
}

export const endTalk = (navigation, setIsOpenEndTalk, talkObj, token, chatDispatch, setIsShowSpinner, setCanPressBackdrop) => {
  setCanPressBackdrop(false);
  alertModal({
    mainText: "トークを終了しますか？",
    subText: "あなたの端末と相手の端末から全ての会話内容が削除されます。",
    cancelButton: "キャンセル",
    okButton: "終了する",
    onPress: () => {
      setIsShowSpinner(true);
      requestEndTalk(talkObj.roomID, token, setIsOpenEndTalk, navigation, chatDispatch, setIsShowSpinner);
    },
    cancelOnPress: () => {
      setCanPressBackdrop(true);
    }
  });
}

export const EndTalkScreen = (props) => {
  const { isOpen, setIsOpen, navigation, talkObj, token } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = 1;
  const scrollView = useRef(null);

  const chatDispatch = useChatDispatch();

  const goNextPage = () => {
    scrollView.current.scrollTo({ y: 0, x: width * currentPage, animated: true });
    setCurrentPage(currentPage + 1);
  }

  const renderFirstPage = () => {
    const animation = useRef(null);
    let pushed = false;
    const pushThunks = () => {
      if (!pushed) {
        pushed = true;
        animation.current.play();
        setTimeout(() => {
          // goNextPage();
          requestCloseTalk(talkObj.roomID, token, navigation, chatDispatch, true);
        }, 800);
      }
    }
    const pushSkip = () => {
      if (!pushed) {
        pushed = true;
        // goNextPage();
        requestCloseTalk(talkObj.roomID, token, navigation, chatDispatch);
      }
    }

    return (
      <Block style={styles.endTalkContainer} >
        <Block style={styles.endTalkHeader}>
          <Text bold size={26} color="gray">トークを終了しました</Text>
        </Block>
        <Block style={styles.endTalkContents}>
          <Text style={{ width: "55%" }} size={20} color="gray">ハートをタップして、話をしてくれた方にありがとうを伝えましょう</Text>
          <Block style={{ postion: "relative", width: width, height: width, justifyContent: "center", alignItems: "center" }}>
            <LottieView
              ref={animation}
              style={{
                position: "absolute",
                backgroundColor: "transparent",
              }}
              loop={false}
              source={require("../../assets/animations/1087-heart.json")}
            />
            <Button round shadowless color="transparent" style={{ position: "absolute", width: 100, height: 100 }} onPress={pushThunks} ></Button>
          </Block>
        </Block>
        <Block style={styles.endTalkFooter}>
          <Button size="small" round shadowless color="lightgray" onPress={pushSkip}>
            <Text bold color="white" size={18}>スキップ</Text>
          </Button>
        </Block>
      </Block>
    );
  };

  const renderSecondPage = () => {
    const [value, setValue] = useState("");
    let pushed = false;
    const pushSubmit = () => {
      if (!pushed) {
        pushed = true;
        //
        goNextPage();
      }
    }
    const pushSkip = () => {
      if (!pushed) {
        pushed = true;
        goNextPage();
      }
    }

    return (
      <Block style={styles.endTalkContainer} >
        <Block style={styles.endTalkHeader}>
          <Text bold size={26} color="gray">聞き手の評価をしましょう。</Text>
        </Block>
        <Block style={[styles.endTalkContents]}>
          <Block flex={0.55} style={{ width: "90%", paddingVertical: 15, justifyContent: "center" }}>
            <TextInput
              multiline
              numberOfLines={4}
              editable
              style={{ height: "100%", borderColor: "silver", borderWidth: 1, padding: 10, borderRadius: 10, backgroundColor: "white" }}
              maxLength={500}
              value={value}
              onChangeText={text => setValue(text)}
            />
          </Block>
          <Block flex={0.25} style={{ justifyContent: "flex-start", width: "85%", paddingVertical: 15 }}>
            <Text size={15} color="silver" style={{ textAlign: "left" }}>
              この評価は公開されますが、あなたの名前が公開されることはありません。{"\n"}
              例{")"}{"\n"}職場の人間関係について悩みを聞いてもらったのですが、相槌が少なめなので、話が遮られることなく話しやすかったです。質問が多いので、今までにない気づきが得られました。ありがとうございます。
            </Text>
          </Block>
          <Block flex={0.2} style={{ justifyContent: "flex-end", paddingBottom: 15 }}>
            <Button size="small" round shadowless color="#F69896" onPress={pushSubmit}>
              <Text bold color="white" size={18}>決定</Text>
            </Button>
          </Block>
        </Block>
        <Block style={styles.endTalkFooter}>
          <Button size="small" round shadowless color="lightgray" onPress={pushSkip}>
            <Text bold color="white" size={18}>スキップ</Text>
          </Button>
        </Block>
      </Block >
    );
  };

  const renderThirdPage = () => {
    let pushed = false;
    const pushSubmit = () => {
      if (!pushed) {
        pushed = true;
        //
        navigation.navigate("Home");
      }
    }
    const pushSkip = () => {
      if (!pushed) {
        pushed = true;
        navigation.navigate("Home");
      }
    }

    const [answer, setAnswer] = useState({ 0: null, 1: null, 2: null });
    const renderForm = ({ formNum, title } = {}) => (
      <Block flex={1 / 3} style={{ justifyContent: "center", alignItems: "center" }}>
        <Text size={16}>{title}</Text>
        <DropDown
          style={{ marginTop: 5 }}
          disabled={false}
          options={["良かった", "普通", "イマイチ"]}
          onSelect={(index, value) => {
            setAnswer(Object.assign(answer, { [formNum]: index }));
          }}
        />
      </Block>
    );

    return (
      <Block style={styles.endTalkContainer} >
        <Block style={styles.endTalkHeader}>
          <Text bold size={26} color="gray">聞き手の詳しい評価をお願いします。</Text>
        </Block>
        <Block style={[styles.endTalkContents]}>
          <Block flex={0.8}>
            {renderForm({ formNum: 0, title: "1. 返信の早さは適切でしたか？" })}
            {renderForm({ formNum: 1, title: "2. 返信の早さは適切でしたか？" })}
            {renderForm({ formNum: 2, title: "3. 返信の早さは適切でしたか？" })}
          </Block>
          <Block flex={0.2} style={{ justifyContent: "flex-end", paddingBottom: 15 }}>
            <Button size="small" round shadowless color="#F69896" onPress={pushSubmit}>
              <Text bold color="white" size={18}>決定</Text>
            </Button>
          </Block>
        </Block>
        <Block style={styles.endTalkFooter}>
          <Button size="small" round shadowless color="lightgray" onPress={pushSkip}>
            <Text bold color="white" size={18}>スキップ</Text>
          </Button>
        </Block>
      </Block >
    );
  };

  const renderScrollDots = () => {
    const renderDots = () => {
      let dots = [];
      for (let i = 1; i <= maxPage; i++) {
        let dot;
        if (i === currentPage) {
          dot = <Block key={i} style={{ width: 12, height: 12, backgroundColor: "#F69896", borderRadius: 6 }}></Block>
        } else {
          dot = <Block key={i} style={{ width: 6, height: 6, backgroundColor: "gray", borderRadius: 3 }}></Block>
        }
        dots.push(dot)
      }
      return dots;
    }
    return (
      <Block style={{ postion: "relative", width: 0, height: 0 }}>
        <Block style={{ postion: "absolute", bottom: 80, alignItems: "center", width: width, height: 80 }}>
          <Block flex={0.5} row style={{ width: width / 3, justifyContent: "space-around", alignItems: "center" }}>
            {renderDots()}
          </Block>
        </Block>
      </Block>
    );
  }

  return (
    <Modal
      backdropOpacity={0.3}
      isVisible={isOpen}
      style={styles.endTalkModal}>
      <ScrollView ref={scrollView} style={styles.endTalkScrollView} horizontal scrollEnabled={false}>
        <Block flex row>
          {renderFirstPage()}
          {/* {renderSecondPage()}
          {renderThirdPage()} */}
        </Block>
      </ScrollView>
      {/* {renderScrollDots()} */}
    </Modal >
  );
}

const styles = StyleSheet.create({
  commonMessage: {
    backgroundColor: "lavenderblush",
    width: "80%",
    alignSelf: "center",
    padding: theme.SIZES.BASE / 2,
    borderRadius: theme.SIZES.BASE,
    marginVertical: theme.SIZES.BASE / 2,
  },
  endTalkModal: {
    margin: 0,
    position: "relative"
  },
  endTalkScrollView: {
    marginTop: 50,
    backgroundColor: "white",
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
  endTalkContainer: {
    width: width,
    backgroundColor: "white",
    padding: 22,
    paddingBottom: 40,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  endTalkHeader: {
    flex: 0.15,
    justifyContent: "flex-end",
  },
  endTalkContents: {
    flex: 0.7,
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  endTalkFooter: {
    flex: 0.15,
    justifyContent: "flex-start",
  },
  TalkMenuButton: {
    padding: 12,
    position: "relative",
  },
});