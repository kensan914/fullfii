import React, { useState } from "react";
import { StyleSheet, Dimensions, ScrollView, Image, Platform } from "react-native";
import { Block, Text, theme, Button } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";
import { withNavigation } from "@react-navigation/compat";

import { HeaderHeight } from "../../constantsEx/utils";
import { Icon, Hr } from "../../componentsEx";
import { ConsultantProfile, profileImageHeight, profileContentBR, sendTalkRequest } from "../organisms/Profile";
import { useProfileState } from "../contexts/ProfileContext";
import { useAuthState } from "../contexts/AuthContext";
import { useChatDispatch, useChatState } from "../contexts/ChatContext";
import { checkSubscribePlan } from "../tools/support";


const { width, height } = Dimensions.get("screen");

const ProfileTemplate = (props) => {
  const { navigation } = props;
  const { item } = props.route.params;
  const [profileTitleHeight, setProfileTitleHeight] = useState(0);

  const profileState = useProfileState();
  const user = item.me ? profileState.profile : item;
  const authState = useAuthState();
  const chatDispatch = useChatDispatch();
  const chatState = useChatState();

  const paramsTitleSize = user.me ? 12 : 12;
  return (
    <Block flex style={styles.profile}>
      <Block flex style={styles.profileDetails}>
        <ScrollView vertical={true} showsVerticalScrollIndicator={false}>

          <Block flex style={styles.profileImageContainer}>
            {user.image
              ? <Image source={{ uri: user.image }} style={styles.profileImage} />
              : <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={["#ffcccc", "lightcoral"]}
                style={[styles.profileImage, { justifyContent: "center", alignItems: "center" }]}>
                <Icon family="font-awesome" size={250} name="user-circle-o" color="whitesmoke" />
              </LinearGradient>}
          </Block>

          <Block style={styles.scrollContent}>

            <Block style={styles.profileWrapper}>
              <Block style={[styles.profileTitle, { top: -1 * profileTitleHeight, }]}
                onLayout={(e) => {
                  setProfileTitleHeight(e.nativeEvent.layout.height);
                }}>
                <Text bold color="white" size={28} style={{ paddingBottom: 8 }}>{user.name}</Text>

                <Block row style={{ justifyContent: "space-between" }}>
                  <Block row style={{ marginBottom: 7 }} >
                    <Text size={15} style={{ marginRight: 10 }} color="white" >{user.gender.label}{"  "}{user.age}歳</Text>
                    {user.status &&
                      <>
                        <Block style={{ justifyContent: "center", alignItems: "center", marginRight: 5 }}>
                          <Block style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: user.status.color }} />
                        </Block>
                        <Text size={16} color="white">{user.status.label}</Text>
                      </>
                    }
                  </Block>
                </Block>

                {user.image
                  ? <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,1)"]} style={[styles.gradient, { height: profileTitleHeight + 10 }]} />
                  : <Block style={[styles.gradient, { height: 10, backgroundColor: "lightcoral" }]} />
                }
              </Block>

              <Block style={styles.profileContent}>
                <Block flex row space="around" style={{ padding: theme.SIZES.BASE, marginBottom: 8 }}>
                  <Block middle flex>
                    <Text bold size={user.me ? 16 : 18} color="#333333">{user.numOfThunks}</Text>
                    <Text muted size={paramsTitleSize}>
                      <Icon name="heart" family="font-awesome" color="#F69896" size={paramsTitleSize} />{" "}ありがとう
                    </Text>
                  </Block>
                  {user.me && (
                    <Block middle flex>
                      <Text bold size={16} color="#333333">{user.plan ? user.plan.label : ""}</Text>
                      <Text muted size={paramsTitleSize}>
                        <Icon name="id-card-o" family="font-awesome" color="#F69896" size={paramsTitleSize} />{" "}プラン
                        </Text>
                    </Block>
                  )}
                </Block>
                <Hr h={15} color="whitesmoke" />
                <ConsultantProfile user={user} />
              </Block>
            </Block>
          </Block>
        </ScrollView>
      </Block >
      {
        user.me ?
          <Button round color="lightcoral" opacity={0.9} style={styles.bottomButton} onPress={() => navigation.navigate("ProfileEditor")} >
            <Text color="white" size={16}><Icon name="pencil" family="font-awesome" color="white" size={16} />{" "}プロフィールを編集する</Text>
          </Button> :
          (!chatState.includedUserIDs.includes(user.id) &&
            <Button round color="lightcoral" opacity={0.9} style={styles.bottomButton} onPress={() => {
              checkSubscribePlan(profileState.profile, () => sendTalkRequest(user, navigation, authState.token, chatDispatch), "現在プランに加入しておりません。リクエストを送るにはノーマルプランに加入してください。");
            }}>リクエストを送る</Button>)
      }
    </Block >
  );
}

export default withNavigation(ProfileTemplate);


const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    backgroundColor: "white",
  },
  profileImage: {
    width: width,
    height: profileImageHeight,
  },
  profileImageContainer: {
    width: 0,
    height: 0,
    position: "absolute",
    zIndex: 1,
  },
  profileDetails: {
    justifyContent: "flex-end",
    position: "relative",
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
  profileContent: {
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
    position: "absolute",
  },
  scrollContent: {
    zIndex: 2,
  },
  profileWrapper: {
    marginTop: profileImageHeight,
    position: "relative",
  },
  bottomButton: {
    shadowColor: "lightcoral",
    position: "absolute",
    alignSelf: "center",
    bottom: theme.SIZES.BASE * 2,
  }
});
