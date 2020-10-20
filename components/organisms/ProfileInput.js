import React, { useState } from "react";
import { TextInput } from "react-native";
import { Block, Input, Text, Checkbox } from "galio-framework";
import SubmitButton from "../atoms/SubmitButton";


export const InputBlock = (props) => {
  const { screen, value, setValue, length } = props;
  let maxLength;

  switch (screen) {
    case "InputName":
    case "InputPrivacyName":
      maxLength = 15;
      return <TextInputBlock maxLength={maxLength} {...props} />;
    case "InputIntroduction":
      maxLength = 250;
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
          label={checkBoxItemsOriginal[key].label}
          labelStyle={{ fontSize: 16 }}
          initialValue={checkedItems[key]}
          onChange={(value) => {
            setCheckedItems(Object.assign({ ...checkedItems }, { [key]: value }));
          }} />
      )}
    </Block>
  );
}


export const SubmitProfileButton = (props) => {
  const { screen, value, canSubmit, token, profileDispatch, requestPatchProfile, navigation, setValidationText } = props;
  const [isLoading, setIsLoading] = useState(false);

  let data;
  switch (screen) {
    case "InputName":
      data = { name: value };
      break;
    case "InputIntroduction":
      data = { introduction: value };
      break;
    case "InputFeature":
      data = { features: value };
      break;
    case "InputGenreOfWorries":
      data = { genre_of_worries: value };
      break;
    case "InputScaleOfWorries":
      data = { scale_of_worries: value };
      break;
    case "InputWorriesToSympathize":
      data = { worries_to_sympathize: value };
      break;
    default:
      break;
  }

  const submit = () => {
    setIsLoading(true);
    requestPatchProfile(token, data, profileDispatch, successSubmit, errorSubmit);
  }

  const successSubmit = () => {
    setIsLoading(false);
    navigation.goBack();
  }

  const errorSubmit = (err) => {
    setValidationText(err.response.data.name);
    setIsLoading(false);
  }

  return <SubmitButton canSubmit={canSubmit} isLoading={isLoading} submit={submit} />
}