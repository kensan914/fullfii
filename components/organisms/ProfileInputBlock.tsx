import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import { Block, Input, Text } from "galio-framework";
import {
  FormattedGender,
  FormattedGenderKey,
  ProfileInputScreen,
} from "../types/Types";
import { useProfileState } from "../contexts/ProfileContext";
import { formatGender } from "../modules/support";
import GenderInputButtonList from "../molecules/GenderInputButtonList";
import { GenderKey } from "../types/Types.context";

type InputBlockProps = {
  screen: ProfileInputScreen;
  prevValue: unknown;
  setCanSubmit: React.Dispatch<boolean>;
  value: unknown;
  setValue: React.Dispatch<unknown>;
};
export const InputBlock: React.FC<InputBlockProps> = (props) => {
  const { screen, prevValue, value, setCanSubmit, setValue } = props;

  const me = useProfileState().profile;
  let maxLength;

  switch (screen) {
    case "InputName":
      maxLength = 15;
      if (typeof value === "string" && typeof prevValue === "string")
        return (
          <TextInputBlock
            maxLength={maxLength}
            value={value}
            prevValue={prevValue}
            setCanSubmit={setCanSubmit}
            setValue={setValue}
          />
        );
      else return <></>;

    case "InputGender":
      return (
        <GenderInputBlock
          value={value as FormattedGenderKey}
          prevValue={prevValue as FormattedGenderKey}
          setCanSubmit={setCanSubmit}
          setValue={setValue}
          formattedGender={formatGender(me.gender, me.isSecretGender)}
        />
      );

    case "InputIntroduction":
      maxLength = 250;
      if (typeof value === "string" && typeof prevValue === "string")
        return (
          <TextInputBlock
            isTextarea
            maxLength={maxLength}
            value={value}
            prevValue={prevValue}
            setCanSubmit={setCanSubmit}
            setValue={setValue}
          />
        );
      else return <></>;
    default:
      return <></>;
  }
};

type GenderInputBlockProps = {
  prevValue: FormattedGenderKey;
  value: FormattedGenderKey;
  setValue: React.Dispatch<GenderKey | FormattedGenderKey | undefined>;
  setCanSubmit: React.Dispatch<boolean>;
  formattedGender: FormattedGender;
};
const GenderInputBlock: React.FC<GenderInputBlockProps> = (props) => {
  const { prevValue, value, setValue, setCanSubmit, formattedGender } = props;

  useEffect(() => {
    setCanSubmit(prevValue !== value);
  }, [value]);

  const femaleMaleKeys: FormattedGenderKey[] = ["female", "male"];
  let genderKeys: FormattedGenderKey[] = [];
  const realGenderKey = formattedGender.realGenderKey;
  if (!formattedGender.isNotSet && realGenderKey !== "notset") {
    genderKeys = [realGenderKey, "secret"];
  } else {
    genderKeys = [...femaleMaleKeys, "secret"];
  }

  return (
    <Block style={styles.genderInputButtonListContainer}>
      {/* expected genderKeys=[("female"), ("male"), "secret"] */}
      <GenderInputButtonList
        genderKeys={genderKeys}
        genderKey={value}
        setGenderKey={setValue}
      />
    </Block>
  );
};

type TextInputBlockProps = {
  maxLength: number;
  isTextarea?: boolean;
  prevValue: string;
  setCanSubmit: React.Dispatch<boolean>;
  value: string;
  setValue: React.Dispatch<string>;
};
const TextInputBlock: React.FC<TextInputBlockProps> = (props) => {
  const {
    maxLength,
    isTextarea,
    prevValue,
    setCanSubmit,
    value,
    setValue,
  } = props;

  const [length, setLength] = useState(prevValue.length);
  useEffect(() => {
    setLength(value.length);
    setCanSubmit(prevValue !== value);
  }, [value]);

  let input;
  if (isTextarea && typeof value === "string") {
    input = (
      <TextInput
        multiline
        numberOfLines={4}
        editable
        style={{
          height: 350,
          borderColor: "silver",
          borderWidth: 1,
          padding: 10,
          marginVertical: 10,
          borderRadius: 10,
          backgroundColor: "white",
        }}
        maxLength={maxLength}
        value={value}
        placeholder="（例）最近結婚して専業主婦になったのですが、夫の転勤で地方で新しく暮らすことになり、周りに悩みを話せる人がいないです...友達はみんな働いているので気楽に電話もできません。どなたか雑談程度で話せる方いないでしょうか？？"
        onChangeText={(text) => setValue(text)}
      />
    );
  } else {
    input = (
      <Input
        placeholder={""}
        rounded
        color="black"
        style={{ borderColor: "silver" }}
        placeholderTextColor="gray"
        maxLength={maxLength}
        value={value}
        onChangeText={(text: string) => setValue(text)}
      />
    );
  }

  return (
    <>
      <Block flex style={{ alignItems: "flex-end", marginRight: 10 }}>
        <Text color="gray">
          {length.toString()}/{maxLength}
        </Text>
      </Block>
      {input}
    </>
  );
};

const styles = StyleSheet.create({
  genderInputButtonListContainer: {
    marginTop: 30,
  },
});
