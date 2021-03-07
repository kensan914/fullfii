import React from "react";
import { Button, Icon, Text, Block } from "galio-framework";
import { Dimensions, StyleSheet } from "react-native";

import { COLORS } from "../../constants/Theme";
import { GenderKey } from "../types/Types.context";
import { FormattedGenderKey } from "../types/Types";

const { width } = Dimensions.get("window");

type GenderInputButtonListProps = {
  genderKeys: (GenderKey | FormattedGenderKey)[];
  genderKey: GenderKey | FormattedGenderKey | undefined;
  setGenderKey: React.Dispatch<GenderKey | FormattedGenderKey | undefined>;
};
const GenderInputButtonList: React.FC<GenderInputButtonListProps> = (props) => {
  const { genderKeys, genderKey, setGenderKey } = props;

  return (
    <Block flex justifyContent="center">
      <Block flex style={styles.genderInputContainer}>
        {genderKeys.map((_genderKey, i) => {
          const isActive = genderKey === _genderKey;
          const contentsColor = isActive ? COLORS.PINK : "lightgray";
          const shadowColor = isActive ? COLORS.PINK : "white";
          const genderAddInfo: {
            [key: string]: { iconName: string; title: string };
          } = {
            female: { iconName: "female", title: "女性" },
            male: { iconName: "male", title: "男性" },
            notset: { iconName: "lock", title: "内緒" },
            secret: { iconName: "lock", title: "内緒" },
          };
          return (
            <Block key={i} flex style={styles.genderInput}>
              <Button
                color="white"
                shadowColor={shadowColor}
                style={styles.genderInputButton}
                onPress={() => setGenderKey(_genderKey)}
              >
                <Icon
                  family="font-awesome"
                  size={50}
                  name={
                    _genderKey in genderAddInfo
                      ? genderAddInfo[_genderKey].iconName
                      : ""
                  }
                  color={contentsColor}
                />
                <Text
                  bold
                  size={12}
                  color={contentsColor}
                  style={{ marginTop: 4 }}
                >
                  {_genderKey in genderAddInfo
                    ? genderAddInfo[_genderKey].title
                    : ""}
                </Text>
              </Button>
            </Block>
          );
        })}
      </Block>
    </Block>
  );
};

export default GenderInputButtonList;

const styles = StyleSheet.create({
  genderInputContainer: {
    flexDirection: "row",
  },
  genderInput: {
    justifyContent: "center",
    alignItems: "center",
  },
  genderInputButton: {
    width: width / 4,
    height: width / 4,
    borderRadius: width / 8,
  },
});
