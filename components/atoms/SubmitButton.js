import React from "react";
import { StyleSheet } from "react-native";
import { Text, Button } from "galio-framework";


const SubmitButton = (props) => {
  const {canSubmit, isLoading, submit, style, children} = props;

  let color;
  let textColor;
  let pressedFunc;
  if (canSubmit) {
    color = "lightcoral";
    textColor = "white";
    pressedFunc = submit;
  } else {
    color = "gainsboro";
    textColor = "silver";
  }

  return (
    <Button round size="small" disabled={!canSubmit || isLoading} color={color} style={[styles.submitButton, { shadowColor: color }, style]} loading={isLoading} onPress={pressedFunc} >
      <Text color={textColor} size={16}>{children ? children : "決定"}</Text>
    </Button>
  );
}

export default SubmitButton;


const styles = StyleSheet.create({
  submitButton: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
  }
});