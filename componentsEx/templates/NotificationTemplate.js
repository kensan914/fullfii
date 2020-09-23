import React from 'react';
import { StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Block, Text } from 'galio-framework';

import { Hr } from '../../componentsEx';
import Avatar from '../../componentsEx/atoms/Avatar';
import { cvtListDate } from '../../componentsEx/tools/support';


const { width, height } = Dimensions.get('screen');

const NotificationTemplate = (props) => {
  const { navigation, notifications } = props;

  return (
    <FlatList
      data={notifications}
      renderItem={({ item, index }) => (
        <TouchableOpacity key={index} activeOpacity={.6} onPress={() => { }}>
          <Block flex row style={[styles.notificationCard, {backgroundColor: item.read ? "white" : "lavenderblush"}]}>
            <Block flex={0.2}>
              <Avatar size={56} image={item.subject.image} style={{ alignSelf: "center" }} />
            </Block>
            <Block flex={0.65} style={{ padding: 0 }}>
              <Text size={14} style={{ lineHeight: 20 }}>{item.message}</Text>
            </Block>
            <Block flex={0.15} style={{ height: 80 }}>
              <Text size={11} color="silver" style={{ marginTop: 16, alignSelf: "center" }}>{cvtListDate(new Date(item.date))}</Text>
            </Block>
          </Block>
          <Hr h={1} color="whitesmoke" />
        </TouchableOpacity>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

export default NotificationTemplate;

const styles = StyleSheet.create({
  notificationCard: {
    height: 80,
    width: width,
    backgroundColor: "white",
    alignItems: "center"
  },
});
