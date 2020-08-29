import React, { useState, useEffect } from 'react';
import { StyleSheet, TextInput } from "react-native";
import { Block, Input, theme, Text, Button, Checkbox } from 'galio-framework';
import { ScrollView } from 'react-native-gesture-handler';
import { features, genreOfWorries, scaleOfWorries, worriesToSympathize } from '../constantsEx/checkBox';


const ProfileInput = (props) => {
  const { user, prevValue, screen } = props.route.params;

  let prevCheckedItems = {};
  let checkBoxItemsOriginal;
  if (typeof prevValue === "object" && !Object.keys(prevCheckedItems).length && typeof checkBoxItemsOriginal === "undefined") {
    switch (screen) {
      case "InputFeature":
        checkBoxItemsOriginal = features;
        break;
      case "InputGenreOfWorries":
        checkBoxItemsOriginal = genreOfWorries;
        break;
      case "InputScaleOfWorries":
        checkBoxItemsOriginal = scaleOfWorries;
        break;
      case "InputWorriesToSympathize":
        checkBoxItemsOriginal = worriesToSympathize;
        break;
      default:
        break;
    }
    Object.keys(checkBoxItemsOriginal).map((key) => {
      prevCheckedItems[key] = false;
    });
    Object.keys(prevValue).map((key) => {
      prevCheckedItems[key] = true;
    });
  }

  const [checkedItems, setCheckedItems] = useState(prevCheckedItems);
  const [value, setValue] = useState(prevValue);
  const [length, setLength] = useState(prevValue.length);
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    setLength(value.length);
    setCanSubmit(prevValue !== value);
  }, [value]);

  useEffect(() => {
    const prevCheckedItemsJSON = JSON.stringify(prevCheckedItems);
    const checkedItemsJSON = JSON.stringify(checkedItems);
    setCanSubmit(prevCheckedItemsJSON !== checkedItemsJSON);
  }, [checkedItems]);

  const validationText = "";

  return (
    <ScrollView>
      <Block style={styles.container}>
        <InputBlock screen={screen} value={value} setValue={setValue} length={length} checkedItems={checkedItems}
          setCheckedItems={setCheckedItems} checkBoxItemsOriginal={checkBoxItemsOriginal} />
        <Text color="red" style={{ paddingHorizontal: 10, paddingVertical: 3 }}>{validationText}</Text>
        <SubmitButton screen={screen} value={value} canSubmit={canSubmit} />
      </Block>
    </ScrollView>
  );
}

export default ProfileInput;

const InputBlock = (props) => {
  const { screen, value, setValue, length } = props;
  let maxLength;

  switch (screen) {
    case "InputName":
    case "InputPrivacyName":
      maxLength = 15;
      return <TextInputBlock maxLength={maxLength} {...props} />;
    case "InputIntroduction":
      maxLength = 500;
      return <TextInputBlock maxLength={maxLength} textarea {...props} />;
    case "InputFeature":
    case "InputGenreOfWorries":
    case "InputScaleOfWorries":
    case "InputWorriesToSympathize":
      return <CheckBoxInputBlock {...props} />;
    default:
      return;
  }
}

const TextInputBlock = (props) => {
  const { value, setValue, length, maxLength, textarea } = props;

  let input;
  if (textarea) {
    input =
      <TextInput
        multiline
        numberOfLines={4}
        editable
        style={{ height: 350, borderColor: "silver", borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 10, backgroundColor: "white" }}
        maxLength={maxLength}
        value={value}
        onChangeText={text => setValue(text)}
      />
  } else {
    input =
      <Input
        placeholder={""}
        rounded
        color="black"
        style={{ borderColor: "silver" }}
        placeholderTextColor="gray"
        maxLength={maxLength}
        value={value}
        onChangeText={text => setValue(text)}
      />
  }

  return (
    <>
      <Block flex style={{ alignItems: "flex-end", marginRight: 10 }}>
        <Text color="gray">{length.toString()}/{maxLength}</Text>
      </Block>
      {input}
    </>
  );
}

const CheckBoxInputBlock = (props) => {
  const { checkedItems, setCheckedItems, checkBoxItemsOriginal } = props;

  return (
    <Block style={{ marginTop: 10 }}>
      {Object.keys(checkedItems).map((key) =>
        <Checkbox
          key={key}
          id={key}
          color="#F69896"
          style={{ marginVertical: 8, marginHorizontal: 8, }}
          label={checkBoxItemsOriginal[key]}
          labelStyle={{ fontSize: 16 }}
          initialValue={checkedItems[key]}
          onChange={(value) => {
            setCheckedItems(Object.assign({ ...checkedItems }, { [key]: value }));
          }} />
      )}
    </Block>
  );
}

const SubmitButton = (props) => {
  const { screen, value, canSubmit } = props;
  let color;
  let textColor;
  let pressedFunc;
  if (canSubmit) {
    color = "lightcoral";
    textColor = "white";
    pressedFunc = () => { };
  } else {
    color = "gainsboro";
    textColor = "silver";
  }

  return (
    <Button round size="small" disabled color={color} style={[styles.submitButton, { shadowColor: color }]} onPress={pressedFunc} >
      <Text color={textColor} size={16}>決定</Text>
    </Button>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.SIZES.BASE,
    // paddingVertical: theme.SIZES.BASE,
    marginVertical: theme.SIZES.BASE,
  },
  submitButton: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
  }
});