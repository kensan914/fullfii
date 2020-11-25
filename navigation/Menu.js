import React from "react";
import {
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { useSafeArea } from "react-native-safe-area-context";

import DrawerCustomItem from "../components/organisms/Drawer";
import { LinearGradient } from "expo-linear-gradient";
import Avatar from "../components/atoms/Avatar";


const CustomDrawerContent = ({
  drawerPosition,
  navigation,
  profile,
  focused,
  state,
  ...rest
}) => {
  const insets = useSafeArea();
  const screens = [
    "Profile",
    "Settings",
  ];

  return (
    <Block
      style={styles.container}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={["#ffcccc", "lightcoral"]}
        style={[styles.header, { flex: 0.23 }]}>
        <TouchableWithoutFeedback onPress={() => navigation.navigate("Profile", { item: profile })}>
          <Block style={styles.profile}>
            <Block style={styles.avatarContainer} >
              {profile.image
                ? <Avatar image={profile.image} size={60} style={styles.avatar} />
                : <Avatar nonAvatar size={60} style={styles.avatar} />
              }
            </Block>
            <Text h5 color={"white"} bold>
              {profile.name}
            </Text>
          </Block>
        </TouchableWithoutFeedback>

        <Block row style={{ alignItems: "center" }}>
          {profile.plan ?
            <Block middle style={styles.plan}>
              <Text size={16} color="#F69896" bold>
                {profile.plan.label}
              </Text>
            </Block>
            : <></>
          }
          {/* FULL-47: ユーザステータス表示の一時的停止 */}
          {/* {profile.status &&
            <>
              <Block style={{ justifyContent: "center", alignItems: "center", marginRight: 5 }}>
                <Block style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: profile.status.color }} />
              </Block>
              <Text size={14} color="white">{profile.status.label}</Text>
            </>
          } */}
        </Block>
      </LinearGradient>

      {/* <Hr h={20} color="white" /> */}

      <Block flex style={{ paddingLeft: 7, paddingRight: 14 }}>
        <ScrollView
          contentContainerStyle={[
            {
              paddingTop: insets.top * 0.4,
              paddingLeft: drawerPosition === "left" ? insets.left : 0,
              paddingRight: drawerPosition === "right" ? insets.right : 0
            }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {screens.map((item, index) => {
            return (
              <DrawerCustomItem
                item={item}
                key={index}
                navigation={navigation}
                focused={state.index === index ? true : false}
                profile={profile}
              />
            );
          })}
        </ScrollView>
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: "#F69896",
    paddingHorizontal: 28,
    paddingBottom: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 2,
    justifyContent: "center"
  },
  footer: {
    paddingHorizontal: 28,
    justifyContent: "flex-end"
  },
  profile: {
    marginBottom: theme.SIZES.BASE / 2
  },
  avatarContainer: {
    position: "relative",
    marginBottom: theme.SIZES.BASE,
    backgroundColor: "white",
    height: 64,
    width: 64,
    borderRadius: 32,
    padding: 0,
  },
  avatar: {
    position: "absolute",
    top: 2,
    left: 2,
  },
  plan: {
    backgroundColor: "white",
    paddingHorizontal: 6,
    marginRight: 8,
    borderRadius: 4,
    height: 19,
  },
});

export default CustomDrawerContent;
