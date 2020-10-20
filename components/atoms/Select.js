import React, { useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { Block, Text, Icon, theme } from 'galio-framework';


const { width, height } = Dimensions.get("screen");

const DropDown = (props) => {
  const { style, onSelect, ...otherProps } = props;
  const [value, setVlalue] = useState("・・・");

  const handleOnSelect = (index, value) => {
    setVlalue(value);
    onSelect && onSelect(index, value);
  }

  return (
    <ModalDropdown
      style={[styles.qty, style]}
      onSelect={handleOnSelect}
      dropdownStyle={styles.dropdown}
      dropdownTextStyle={{ paddingLeft: theme.SIZES.BASE, fontSize: 14 }}
      {...otherProps}>
      <Text size={14} color="dimgray" style={{ textAlign: "center" }}>
        {value}{" "}<Icon name="angle-down" family="font-awesome" size={11} />
      </Text>
    </ModalDropdown>
  );
}

export default DropDown;

const styles = StyleSheet.create({
  qty: {
    // width: theme.SIZES.BASE * 6,
    width: width / 1.3,
    height: 46,
    justifyContent: "center",
    backgroundColor: "mistyrose",
    // paddingHorizontal: theme.SIZES.BASE,
    // paddingTop: 10,
    // paddingBottom: 9.5,
    borderRadius: 14,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 1,
  },
  dropdown: {
    marginTop: 16,
    // marginLeft: -theme.SIZES.BASE,
    // width: theme.SIZES.BASE * 6,
    width: width / 1.3,
    height: 106,
  },
});