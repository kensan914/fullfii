import React from "react";
import {
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ListView
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { useSafeArea } from "react-native-safe-area-context";

// import { Icon } from "../components";
import { MaterialCommunityIcons } from '@expo/vector-icons';


import { Drawer as DrawerCustomItem, Hr } from "../componentsEx";
import { Images, materialTheme } from "../constants";

const { width } = Dimensions.get("screen");

const profile = {
  avatar: Images.Profile,
  name: "とりうみけんと",
  type: "Seller",
  plan: "Pro",
  rating: 4.8,
};

function CustomDrawerContent({
  drawerPosition,
  navigation,
  profile,
  focused,
  state,
  ...rest
}) {
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
      <Block flex={0.23} style={styles.header}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate("Profile")}
        >
          <Block style={styles.profile}>
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            <Text h5 color={"dimgray"} bold>
              {profile.name}
            </Text>
          </Block>
        </TouchableWithoutFeedback>


        <Text size={16} color={"dimgray"}>
          {/* <Icon name="doubleright" family="Galio" size={14} /> */}
          <MaterialCommunityIcons name="coins" size={13} color="gold" />
          {" "}{profile.coins}
        </Text>
        {/* <Block row>
          <Block middle style={styles.pro}>
            <Text size={16} color="white">
              {profile.plan}
            </Text>
          </Block>
          <Text size={16} muted style={styles.seller}>
            {profile.type}
          </Text>
          <Text size={16} color={materialTheme.COLORS.WARNING}>
            {profile.rating}{" "}
            <Icon name="shape-star" family="GalioExtra" size={14} />
          </Text>
        </Block> */}
      </Block>

      {/* <Block
        style={{
          borderBottomColor: 'whitesmoke',
          borderBottomWidth: 12,
        }}
      /> */}
      <Hr h={20} color="whitesmoke" />

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
    backgroundColor: "white",
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
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginBottom: theme.SIZES.BASE
  },
  pro: {
    backgroundColor: "gold",
    paddingHorizontal: 6,
    marginRight: 8,
    borderRadius: 4,
    height: 19,
    width: 38,
  },
  seller: {
    marginRight: 16
  },
});

export default CustomDrawerContent;
