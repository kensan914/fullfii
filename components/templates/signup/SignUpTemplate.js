import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Platform, ScrollView } from "react-native";
import { Block, theme } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";

import { HeaderHeight } from "../../../constants/utils";
import useSlideView from "./useSlideView";
import FirstPage from "./signupPages/FirstSignUpPage";
import SecondPage from "./signupPages/SecondSignUpPage";
import ThirdPage from "./signupPages/ThirdSignUpPage";
import { useAuthState } from "../../contexts/AuthContext";

const { width } = Dimensions.get("window");

const SignUpTemplate = (props) => {
  const authState = useAuthState();
  const [initPage] = useState(
    // didProgressNumは完了済みのページ番号なのでその次のページから(+1)
    authState.signupBuffer.didProgressNum
      ? authState.signupBuffer.didProgressNum + 1
      : 1
  );
  const [currentPage, scrollViewRef, goToPage] = useSlideView(initPage);

  const [pageStack, setPageStack] = useState([
    <FirstPage goToPage={goToPage} key={1} />,
    <SecondPage goToPage={goToPage} key={2} />,
    <ThirdPage goToPage={goToPage} key={3} />,
  ]);

  useEffect(() => {
    // 既に完了しているページは省略(ex. didProgressNum===2 --> ThirdPageから)
    const _pageStack = pageStack.slice(authState.signupBuffer.didProgressNum);
    setPageStack(_pageStack);
  }, []);

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 0.25, y: 1.1 }}
      locations={[0.2, 1]}
      colors={["white", "white"]}
      style={[styles.container, { flex: 1, paddingTop: theme.SIZES.BASE * 4 }]}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.signupScrollView}
        horizontal
        scrollEnabled={false}
      >
        <Block flex row>
          {pageStack}
        </Block>
      </ScrollView>
    </LinearGradient>
  );
};

export default SignUpTemplate;

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
  },
  input: {
    width: width * 0.9,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#F69896",
  },
  inputActive: {
    borderBottomWidth: 2,
  },
  signupScrollView: {
    marginTop: 10,
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
  signupContainer: {
    width: width,
    padding: 22,
    paddingBottom: 40,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  secondPageButton: {
    width: width / 2.4,
    marginHorizontal: 10,
    height: 48,
    borderRadius: 24,
    marginTop: 0,
    marginBottom: 0,
  },
});
