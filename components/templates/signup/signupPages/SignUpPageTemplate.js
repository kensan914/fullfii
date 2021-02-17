import React, { useEffect, useState } from "react";
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
    checkCanNext,
    statesRequired = [],
  } = props;

  const [canNext, setCanNext] = useState(false);
  useEffect(() => {
    if (typeof checkCanNext === "undefined") {
      setCanNext(true);
    } else {
      setCanNext(checkCanNext());
    }
  }, statesRequired);

  return (
    <>
      <Block flex middle style={styles.signupContainer}>
        <Block flex={0.15} style={styles.signupTitleContainer}>
          <Text size={26} bold color={COLORS.PINK} style={styles.title}>
            {title}
          </Text>
          <Text size={14} bold color={COLORS.PINK} style={styles.subTitle}>
            {subTitle}
          </Text>
        </Block>

        <Block flex={0.7} style={styles.signupContentsContainer}>
          {contents}
        </Block>

        <Block flex={0.15} style={styles.signupButtonContainer}>
          <Button
            round
            color={canNext ? COLORS.PINK : "gainsboro"}
            shadowless={!canNext}
            shadowColor={COLORS.PINK}
            style={[styles.goNextButton]}
            disabled={!canNext || isLoading}
            loading={isLoading}
            onPress={pressCallback}
          >
            <Text bold color="white" size={16}>
              {buttonTitle}
            </Text>
          </Button>
        </Block>
      </Block>
    </>
  );
};

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
    justifyContent: "flex-start",
    alignItems: "center",
  },
  signupButtonContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
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
