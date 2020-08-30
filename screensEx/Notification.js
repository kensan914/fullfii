import React from 'react';
import { StyleSheet, Dimensions, FlatList, Image, TouchableNativeFeedback, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Block, theme, Text } from 'galio-framework';

import { ConsultantCard, Hr } from '../componentsEx';

const { width, height } = Dimensions.get('screen');
import { notifications } from '../constantsEx/notifications';

const Notification = (props) => {
  const { navigation } = props;
  return (
    <FlatList
      data={notifications}
      renderItem={({ item, index }) => (
        <TouchableOpacity key={index} onPress={() => { }}>
          <Block flex row style={styles.notificationCard}>
            <Block flex={0.85} style={{paddingLeft: 10}}>
              <Text size={14} style={{lineHeight: 20}}>{item.message}</Text>
            </Block>
            <Block flex={0.15} style={{ height: 80 }}>
              <Text size={11} color="silver" style={{ marginTop: 16, alignSelf: "center" }}>{item.day}</Text>
            </Block>
          </Block>
          <Hr h={1} color="whitesmoke" />
        </TouchableOpacity>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

export default Notification;

const styles = StyleSheet.create({
  notificationCard: {
    height: 80,
    width: width,
    backgroundColor: "white",
    alignItems: "center"
  },
  avatar: {
    height: 56,
    width: 56,
    borderRadius: 28,
    alignSelf: "center",
  }
});
