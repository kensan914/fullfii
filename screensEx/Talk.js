import React from 'react';
import { StyleSheet, Dimensions, FlatList, Image, TouchableNativeFeedback, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Block, theme, Text } from 'galio-framework';

import { ConsultantCard, Hr } from '../componentsEx';

const { width, height } = Dimensions.get('screen');
import { talks } from '../constantsEx/talks';
import Avatar from '../componentsEx/atoms/Avatar';

const Talk = (props) => {
  const { navigation } = props;
  return (
    <FlatList
      data={talks}
      renderItem={({ item, index }) => (
        <TouchableOpacity key={index} onPress={() => navigation.navigate("Chat", { user: item.companion })}>
          <Block flex row style={styles.talkCard}>
            <Block flex={0.2}>
              <Avatar size={56} image={item.companion.image} style={{ alignSelf: "center" }} />
            </Block>
            <Block flex={0.65}>
              <Text size={16} bold color="#F69896" style={{ marginBottom: 4 }}>{item.companion.name}</Text>
              <Text size={13} color="gray" numberOfLines={2} ellipsizeMode="tail">{item.messages[item.messages.length - 1].message}</Text>
            </Block>
            <Block flex={0.15} style={{ height: 80 }}>
              <Text size={11} color="silver" style={{ marginTop: 16, alignSelf: "center" }}>{item.messages[item.messages.length - 1].day}</Text>
            </Block>
          </Block>
          <Hr h={1} color="whitesmoke" />
        </TouchableOpacity>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

export default Talk;

const styles = StyleSheet.create({
  talkCard: {
    height: 80,
    width: width,
    backgroundColor: "white",
    alignItems: "center"
  },
});
