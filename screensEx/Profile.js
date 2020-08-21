import React, { useState } from 'react';
import { StyleSheet, Dimensions, ScrollView, Image, ImageBackground, Platform } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import { LinearGradient } from 'expo-linear-gradient';

import { fullConsultants } from '../constantsEx/Consultants';
import { HeaderHeight } from "../constantsEx/utils";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon, Hr } from '../componentsEx';

const { width, height } = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;
const profileContentBR = 13;
const profileImageHeight = 500;

const Profile = (props) => {
  const { item } = props.route.params;
  const titleSize = 28;
  const contentSize = 14;
  const statusInfo = { title: "", color: "" };
  switch (item.status) {
    case "accepting":
      statusInfo.title = "相談可";
      statusInfo.color = "dodgerblue";
      break;
    case "inConsultation":
      statusInfo.title = "相談中";
      statusInfo.color = "crimson";
      break;
    default:
      break;
  }
  const [profileTitleHeight, setProfileTitleHeight] = useState(0);


  return (
    <Block flex style={styles.profile}>
      <Block flex style={styles.profileDetails}>
        <ScrollView vertical={true} showsVerticalScrollIndicator={false}>

          <Block flex style={styles.profileImageContainer}>
            <Image source={{ uri: item.image }} style={styles.profileImage} />
          </Block>

          <Block style={styles.scrollContent}>

            <Block style={styles.profileWrapper}>
              <Block style={[styles.profileTitle, { top: -1 * profileTitleHeight, }]}
                onLayout={(e) => {
                  setProfileTitleHeight(e.nativeEvent.layout.height);
                }}>
                <Text bold color="white" size={28} style={{ paddingBottom: 8 }}>{item.name}</Text>
                <Block row style={{ marginBottom: 7 }} >
                  <Text size={14} style={{ marginRight: 10 }} color="white" >{item.gender}性 {item.age}歳</Text>
                  <Block middle style={[styles.status, { backgroundColor: statusInfo.color }]}>
                    <Text size={16} color="white">{statusInfo.title}</Text>
                  </Block>
                </Block>
                <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']} style={[styles.gradient, { height: profileTitleHeight + 10 }]} />
              </Block>

              <Block style={styles.profileContent}>
                <Block row space="around" style={{ padding: theme.SIZES.BASE, marginBottom: 8 }}>
                  <Block middle>
                    <Text bold size={16}>{item.numOfGoods}</Text>
                    <Text muted size={12}>
                      <Ionicons name="ios-heart" color="#F69896" />{" "}ありがとう
                    </Text>
                  </Block>
                  <Block middle>
                    <Text bold size={16}>{item.numOfComments}</Text>
                    <Text muted size={12}>
                      <Icon family="GalioExtra" name="chat-33" color="#F69896" />{" "}評価
                    </Text>
                  </Block>
                </Block>

                <Hr h={1} mb={5} color="#e6e6e6" />

                <Block style={{ paddingVertical: 16, alignItems: 'baseline' }}>
                  <Text size={16} bold style={{ marginBottom: 10 }}>特徴</Text>
                  <Block row style={{ flexWrap: "wrap" }}>
                    {fullConsultants[item.id].features.map(feature => (
                      <Block middle style={styles.feature} key={feature.id}>
                        <Text size={16} color="white">{feature}</Text>
                      </Block>
                    ))}
                  </Block>
                </Block>

                <Hr h={1} mb={5} color="#e6e6e6" />


                <Block style={{ paddingVertical: 16, alignItems: 'baseline' }}>
                  <Text size={16} bold style={{ marginBottom: 10 }}>自己紹介</Text>
                  <Text size={14} style={{ lineHeight: 18 }}>{item.introduction}</Text>
                </Block>

                <Hr h={1} mb={5} color="#e6e6e6" />

              </Block>
            </Block>
          </Block>
        </ScrollView>
      </Block>
    </Block >
  );
}

export default Profile;


const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
    backgroundColor: "white",
  },
  profileImage: {
    width: width,
    height: profileImageHeight,
  },
  profileImageContainer: {
    width: 0,
    height: 0,
    position: 'absolute',
    zIndex: 1,
  },
  profileDetails: {
    // paddingTop: theme.SIZES.BASE * 4,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  profileTitle: {
    paddingHorizontal: theme.SIZES.BASE * 1.5,
    paddingVertical: theme.SIZES.BASE,
    zIndex: 3,
    position: "absolute",
    width: "100%",
  },
  status: {
    paddingHorizontal: 6,
    marginRight: theme.SIZES.BASE / 2,
    borderRadius: 4,
    height: 19,
  },
  feature: {
    paddingHorizontal: 6,
    marginRight: theme.SIZES.BASE / 2,
    marginBottom: theme.SIZES.BASE / 2,
    borderRadius: 12,
    height: 24,
    backgroundColor: "#F69896",
  },
  seller: {
    marginRight: theme.SIZES.BASE / 2,
  },
  profileContent: {
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: theme.SIZES.BASE,
    marginBottom: 0,
    borderTopLeftRadius: profileContentBR,
    borderTopRightRadius: profileContentBR,
    backgroundColor: theme.COLORS.WHITE,
    zIndex: 3,
  },
  gradient: {
    zIndex: -1,
    left: 0,
    right: 0,
    bottom: -10,
    position: 'absolute',
  },
  scrollContent: {
    height: height,
    zIndex: 2,

  },
  profileWrapper: {
    marginTop: profileImageHeight,
    position: "relative",
  },
});
