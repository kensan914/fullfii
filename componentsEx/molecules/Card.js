import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from '../atoms/Icon';
import Hr from '../atoms/Hr';


const { width } = Dimensions.get('screen');

const Card = (props) => {
  const { navigation, item, horizontal, full, style, imageStyle, consultant } = props;
  const imageStyles = [styles.image, full ? styles.fullImage : styles.horizontalImage, imageStyle];
  const titleSize = 14;
  const contentSize = 12;

  return (
    <Block row={horizontal} card flex style={[styles.card, styles.shadow, style]}>
      <TouchableWithoutFeedback onPress={() => navigation.navigate('Profile', { item: item })}>
        <Block flex style={[styles.imageContainer, styles.shadow]}>
          <Image source={{ uri: item.image }} style={imageStyles} />
        </Block>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => navigation.navigate('Profile', { item: item })}>
        <Block flex space="between" style={styles.description}>
          {consultant &&
            <>
              <Text size={titleSize} style={styles.title} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
              <Block row style={{ marginBottom: 7 }} >
                <Text size={contentSize} style={[{ marginRight: 10 }, styles.textPale]} >{item.gender}性 {item.age}歳</Text>
                <Ionicons name="ios-heart" size={contentSize} color="#F69896" />
                <Text size={contentSize} style={[{ marginRight: 10 }, styles.textPale]} >{" "}{item.numOfGoods}</Text>
                <Icon family="GalioExtra" size={contentSize} name="chat-33" color="#F69896" />
                <Text size={contentSize} style={styles.textPale} >{" "}{item.numOfComments}</Text>
              </Block>
              <Hr h={1} mb={7} color="gainsboro" />
              <Text size={contentSize} style={[styles.textPale, { lineHeight: contentSize + 2 }]} numberOfLines={2} ellipsizeMode="tail">{item.introduction}</Text>
            </>
          }
        </Block>
      </TouchableWithoutFeedback>
    </Block>
  );
}

const ConsultantCard = (props) => {
  return (
    <Card consultant {...props} style={styles.consultantCard} />
  );
}

export default withNavigation(ConsultantCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
  },
  title: {
    flex: 1,
    flexWrap: 'wrap',
    paddingBottom: 6,
  },
  description: {
    padding: theme.SIZES.BASE / 2,
  },
  imageContainer: {
    elevation: 1,
  },
  image: {
    borderRadius: 3,
    marginHorizontal: theme.SIZES.BASE / 2,
    marginTop: -16,
  },
  horizontalImage: {
    height: 122,
    width: 'auto',
  },
  fullImage: {
    height: 215,
    width: width - theme.SIZES.BASE * 3,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  consultantCard: {
    width: width / 2 - theme.SIZES.BASE * 2,
    marginRight: "auto",
    marginLeft: "auto",
  },
  textPale: {
    color: "dimgray"
  },
});