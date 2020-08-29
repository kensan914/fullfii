import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import { StyleSheet, Dimensions, Image, TouchableWithoutFeedback } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Icon from '../atoms/Icon';
import Hr from '../atoms/Hr';
import { convertStatus, convertStatusColor } from '../../constantsEx/converters';


const { width } = Dimensions.get('screen');

const Card = (props) => {
  const { navigation, item, horizontal, full, style, imageStyle, consultant } = props;
  const imageStyles = [styles.image, full ? styles.fullImage : styles.horizontalImage, imageStyle];
  const titleSize = 14;
  const contentSize = 12;
  const navigateProfile = () => navigation.navigate('Profile', { item: item });

  return (
    <Block row={horizontal} card flex style={[styles.card, styles.shadow, style]}>
      <TouchableWithoutFeedback onPress={navigateProfile}>
        <Block style={[styles.statusContainer]}>
          <Block style={[styles.statusIcon, { backgroundColor: convertStatusColor(item.status.key) }]} />
        </Block>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={navigateProfile}>
        <Block flex style={[styles.imageContainer, styles.shadow]}>
          <Image source={{ uri: item.image }} style={imageStyles} />
        </Block>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={navigateProfile}>
        <Block flex style={styles.description}>
          {consultant &&
            <>
              <Block style={{ height: titleSize + contentSize + 17 }}>
                <Text size={titleSize} style={styles.title} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                <Block row style={{ marginBottom: 7 }} >
                  <Text size={contentSize} style={[{ marginRight: 10 }, styles.textPale]} >{item.age}歳</Text>
                  <Block style={{ justifyContent: "center" }}>
                    <Ionicons name="ios-heart" size={contentSize} color="#F69896" />
                  </Block>
                  <Text size={contentSize} style={[{ marginRight: 10 }, styles.textPale]} >{" "}{item.numOfThunks}</Text>
                </Block>
              </Block>

              <Hr h={1} mb={7} color="gainsboro" />

              <Block style={{ height: contentSize * 2 + 8 }}>
                <Text size={contentSize} style={[styles.textPale, { lineHeight: contentSize + 2 }]} numberOfLines={2} ellipsizeMode="tail">{item.introduction}</Text>
              </Block>
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
    paddingBottom: 6,
  },
  description: {
    padding: theme.SIZES.BASE / 2,
    justifyContent: "flex-start"
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
    width: width / 2 - theme.SIZES.BASE * 1.8,
    marginRight: "auto",
    marginLeft: "auto",
  },
  textPale: {
    color: "dimgray"
  },
  statusContainer: {
    width: 16,
    height: 16,
    zIndex: 1,
    position: "absolute",
    top: -11,
    left: theme.SIZES.BASE / 1.4,
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "white"
  },
  statusIcon: {
    top: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});