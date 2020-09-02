import React from 'react';
import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Block, Text, theme, Button } from 'galio-framework';
import Modal from 'react-native-modal';


const { width } = Dimensions.get('screen');

export const MenuModal = (props) => {
  const { isOpen, setIsOpen, items, otherModal } = props;

  return (
    <Modal
      backdropOpacity={0.3}
      isVisible={isOpen}
      onBackdropPress={() => setIsOpen(false)}
      style={styles.menuModal}
    >
      <Block style={styles.menuContainer}>
        {items.map((item, index) => (
          <TouchableOpacity key={index} onPress={item.onPress} style={styles.menuItem}>
            <Text style={{}} size={20} bold color="dimgray">{item.title}</Text>
          </TouchableOpacity>
        ))}
        <Button round shadowless size="small" color="lightgray" onPress={() => setIsOpen(false)} >
          <Text bold color="white">閉じる</Text>
        </Button>
      </Block>
      {otherModal}
    </Modal>
  );
}

const styles = StyleSheet.create({
  menuModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  menuContainer: {
    backgroundColor: 'white',
    padding: 22,
    paddingBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
  menuItem: {
    paddingVertical: 15,
    width: "100%",
    textAlign: 'right',
  }
});