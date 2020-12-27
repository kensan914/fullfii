import React from "react";
import { Block, Button, Text } from "galio-framework";
import { Dimensions, StyleSheet, KeyboardAvoidingView } from "react-native";
import { COLORS } from "../../../../constants/Theme";


const { width } = Dimensions.get("window");

const SignUpPageTemplate = (props) => {
  const {
    title,
    subTitle,
    contents,
    isLoading,
    pressCallback,
    buttonTitle,
  } = props;

  return (
    <>
      <Block flex middle style={styles.signupContainer}>
        <KeyboardAvoidingView behavior="padding" enabled>
          <Block flex={0.2} style={styles.signupTitleContainer}>
            <Text size={26} bold color="#F69896" style={styles.title}>{title}</Text>
            <Text size={14} bold color="#F69896" style={styles.subTitle}>{subTitle}</Text>
          </Block>

          <Block flex={0.7} style={styles.signupContentsContainer}>
            {contents}
          </Block>

          <Block flex={0.1} center>
            <Button
              round
              color={COLORS.PINK}
              shadowColor={COLORS.PINK}
              style={[styles.goNextButton]}
              disabled={isLoading}
              loading={isLoading}
              onPress={pressCallback}
            >
              <Text bold color="white" size={16}>{buttonTitle}</Text>
            </Button>
          </Block>
        </KeyboardAvoidingView>
      </Block>
    </>
  )
}

export default SignUpPageTemplate;


const styles = StyleSheet.create({
  signupContainer: {
    width: width,
    padding: 22,
    paddingBottom: 40,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  signupTitleContainer: {
    alignItems: "center",
    // backgroundColor: "red",
  },
  signupContentsContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
  subTitle: {
    paddingHorizontal: 2,
    textAlign: "center",
    color: "pink",
  },
  goNextButton: {
    alignSelf: "center",
  },
});
