import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Block, theme, Text } from "galio-framework";
import { ScrollView } from "react-native-gesture-handler";
import { useAuthState } from "../tools/authContext";
import { InputBlock, SubmitProfileButton } from "../organisms/ProfileInput";
import { useProfileDispatch, useProfileState } from "../tools/profileContext";


const ProfileInputTemplate = (props) => {
  const { user, prevValue, screen } = props.route.params;
  const authState = useAuthState();
  const profileDispatch = useProfileDispatch();
  const profileState = useProfileState();

  let prevCheckedItems = {};
  let isCheckBox = true;
  let checkBoxItemsOriginal;
  if (typeof prevValue === "object" && !Object.keys(prevCheckedItems).length && typeof checkBoxItemsOriginal === "undefined") {
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
      case "InputWorriesToSympathize":
        checkBoxItemsOriginal = profileState.profileParams.worriesToSympathize;
        break;
      default:
        break;
    }
    Object.keys(checkBoxItemsOriginal).map((key) => {
      prevCheckedItems[key] = false;
    });
    prevValue.map((item) => {
      prevCheckedItems[item.key] = true;
    })
  } else {
    isCheckBox = false;
  }

  const [checkedItems, setCheckedItems] = useState(prevCheckedItems);
  const [value, setValue] = useState(prevValue);
  const [length, setLength] = useState(prevValue.length);
  const [canSubmit, setCanSubmit] = useState(false);
  const [validationText, setValidationText] = useState("");

  useEffect(() => {
    setLength(value.length);
    setCanSubmit(prevValue !== value);
  }, [value]);

  useEffect(() => {
    // set canSubmit
    const prevCheckedItemsJSON = JSON.stringify(prevCheckedItems);
    const checkedItemsJSON = JSON.stringify(checkedItems);
    setCanSubmit(prevCheckedItemsJSON !== checkedItemsJSON);

    // set value if checkBox is true
    if (isCheckBox) {
      let _value = [];
      Object.keys(checkedItems).map((key) => {
        if (checkedItems[key]) {
          _value.push(checkBoxItemsOriginal[key]);
        }
      });
      setValue(_value);
    }
  }, [checkedItems]);

  return (
    <ScrollView>
      <Block style={styles.container}>
        <InputBlock screen={screen} value={value} setValue={setValue} length={length} checkedItems={checkedItems}
          setCheckedItems={setCheckedItems} checkBoxItemsOriginal={checkBoxItemsOriginal} />
        <Text color="red" style={{ paddingHorizontal: 10, paddingVertical: 3 }}>{validationText}</Text>
        <SubmitProfileButton screen={screen} value={value} canSubmit={canSubmit} token={authState.token} profileDispatch={profileDispatch} setValidationText={setValidationText} {...props} />
      </Block>
    </ScrollView>
  );
}

export default ProfileInputTemplate;


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.SIZES.BASE,
    // paddingVertical: theme.SIZES.BASE,
    marginVertical: theme.SIZES.BASE,
  },
});