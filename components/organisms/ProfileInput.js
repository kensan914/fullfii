import React, { useEffect, useState } from "react";
import { TextInput } from "react-native";
import { Block, Input, Text, Checkbox, theme } from "galio-framework";
import SubmitButton from "../atoms/SubmitButton";
import { TouchableWithoutFeedback } from "react-native";
import { useProfileState } from "../contexts/ProfileContext";
import { alertModal } from "../modules/support";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("screen");

export const InputBlock = (props) => {
  const { screen } = props;
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
      return <CheckBoxInputBlock {...props} />;
    case "InputGender":
      return <RadioInputBlock {...props} />;
    default:
      return;
  }
};

const RadioInputBlock = (props) => {
  const { value, setValue, setCanSubmit } = props;

  const genderEnum = { MALE: "male", FEMALE: "female" };

  const GenderRadioButton = (props) => {
    const {
      label,
      genderKey,
      gender,
      setGender,
      genderEnum,
      setCanSubmit,
    } = props;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          setGender(genderEnum[genderKey]);
          setCanSubmit(true);
        }}
      >
        <Block row style={{ justifyContent: "center", alignItems: "center" }}>
          <Block
            style={{
              height: 20,
              width: 20,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "lightgray",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Block
              style={{
                height: 14,
                width: 14,
                borderRadius: 7,
                backgroundColor:
                  gender === genderEnum[genderKey] ? "#F69896" : "white",
              }}
            />
          </Block>
          <Text color="gray" style={{ marginLeft: 5 }}>
            {label}
          </Text>
        </Block>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <>
      <Text color="dimgray" style={{ paddingHorizontal: 20, marginBottom: 10 }}>
        性別は公開されます。
      </Text>
      <Text color="red" style={{ paddingHorizontal: 20, marginBottom: 10 }}>
        性別は一度しか変更できません。
      </Text>
      <Block
        style={{
          marginTop: 20,
          alignItems: "center",
          justifyContent: "space-evenly",
          flexDirection: "row",
        }}
      >
        <GenderRadioButton
          label="女性"
          genderKey="FEMALE"
          gender={value}
          setGender={setValue}
          genderEnum={genderEnum}
          setCanSubmit={setCanSubmit}
        />
        <GenderRadioButton
          label="男性"
          genderKey="MALE"
          gender={value}
          setGender={setValue}
          genderEnum={genderEnum}
          setCanSubmit={setCanSubmit}
        />
      </Block>
    </>
  );
};

const TextInputBlock = (props) => {
  const {
    maxLength,
    textarea,
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
  if (textarea) {
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
        onChangeText={(text) => setValue(text)}
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

const CheckBoxInputBlock = (props) => {
  const { screen, prevValue, setCanSubmit, setValue } = props;

  let prevCheckedItems = {};
  const [checkedItems, setCheckedItems] = useState(prevCheckedItems);
  const profileState = useProfileState();
  let checkBoxItemsOriginal;
  if (
    typeof prevValue === "object" &&
    !Object.keys(prevCheckedItems).length &&
    typeof checkBoxItemsOriginal === "undefined"
  ) {
    switch (screen) {
      case "InputFeature":
        checkBoxItemsOriginal = profileState.profileParams.features;
        break;
      case "InputGenreOfWorries":
        checkBoxItemsOriginal = profileState.profileParams.genreOfWorries;
        break;
      case "InputScaleOfWorries":
        checkBoxItemsOriginal = profileState.profileParams.scaleOfWorries;
        break;
      default:
        break;
    }
    Object.keys(checkBoxItemsOriginal).map((key) => {
      prevCheckedItems[key] = false;
    });
    prevValue.map((item) => {
      prevCheckedItems[item.key] = true;
    });
  }

  useEffect(() => {
    // set canSubmit
    const prevCheckedItemsJSON = JSON.stringify(prevCheckedItems);
    const checkedItemsJSON = JSON.stringify(checkedItems);
    setCanSubmit(prevCheckedItemsJSON !== checkedItemsJSON);
    let _value = [];
    Object.keys(checkedItems).map((key) => {
      if (checkedItems[key]) {
        _value.push(checkBoxItemsOriginal[key]);
      }
    });
    setValue(_value);
  }, [checkedItems]);

  return (
    <Block style={{ marginTop: 10 }}>
      {Object.keys(checkedItems).map((key) => (
        <Checkbox
          key={key}
          id={key}
          color="#F69896"
          style={{ marginVertical: 8, marginHorizontal: 8 }}
          label={checkBoxItemsOriginal[key].label}
          labelStyle={{ fontSize: 16 }}
          initialValue={checkedItems[key]}
          onChange={(value) => {
            setCheckedItems(
              Object.assign({ ...checkedItems }, { [key]: value })
            );
          }}
        />
      ))}
    </Block>
  );
};

export const SubmitProfileButton = (props) => {
  const {
    screen,
    value,
    canSubmit,
    token,
    profileDispatch,
    profileState,
    requestPatchProfile,
    navigation,
    setValidationText,
  } = props;
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
    case "InputGender":
      data = { gender: value };
      break;
    default:
      break;
  }

  const submit = () => {
    setIsLoading(true);
    requestPatchProfile(
      token,
      data,
      profileDispatch,
      profileState,
      successSubmit,
      errorSubmit
    );
  };

  const successSubmit = () => {
    setIsLoading(false);
    navigation.goBack();
  };

  const errorSubmit = (err) => {
    setValidationText(err.response.data.name);
    setIsLoading(false);
  };

  return (
    <Block style={styles.submitButtonWrapper}>
      <SubmitButton
        style={styles.submitButton}
        canSubmit={canSubmit}
        isLoading={isLoading}
        submit={() => {
          if (screen === "InputGender") {
            alertModal({
              mainText: "性別は一度しか変更できません。",
              subText: `あなたは${
                value == "male" ? "男性" : "女性"
              }で間違いありませんか?`,
              cancelButton: "キャンセル",
              okButton: "OK",
              onPress: () => {
                submit();
              },
            });
          } else {
            submit();
          }
        }}
      />
    </Block>
  );
};

const styles = StyleSheet.create({
  submitButtonWrapper: {
    position: "absolute",
    alignSelf: "center",
    bottom: theme.SIZES.BASE * 2,
  },
  submitButton: {
    width: width - 30,
  },
});
