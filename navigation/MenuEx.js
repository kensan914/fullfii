import React from "react";
import {
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { useSafeArea } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Drawer as DrawerCustomItem, Hr } from "../componentsEx";
import { convertStatusColor } from "../constantsEx/converters";
import { LinearGradient } from "expo-linear-gradient";


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
        colors={["#F69896", "lightcoral"]}
        style={[styles.header, { flex: 0.23 }]}>
        <TouchableWithoutFeedback onPress={() => navigation.navigate("Profile", { item: profile })}>
          <Block style={styles.profile}>
            <Block style={styles.avatarContainer} >
              <Image source={{ uri: profile.image }} style={styles.avatar} />
            </Block>
            <Text h5 color={"white"} bold>
              {profile.name}
            </Text>
          </Block>
        </TouchableWithoutFeedback>

        <Block row style={{ alignItems: "center" }}>
          <Block middle style={styles.plan}>
            <Text size={16} color="#F69896">
              {profile.plan.title}
            </Text>
          </Block>
          <Block style={{ justifyContent: "center", alignItems: "center", marginRight: 5 }}>
            <Block style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: convertStatusColor(profile.status.key) }} />
          </Block>
          <Text size={14} color="white">{profile.status.title}</Text>
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
  },
  avatar: {
    position: "absolute",
    top: 2,
    left: 2,
    height: 60,
    width: 60,
    borderRadius: 30,
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
