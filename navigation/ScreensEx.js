import React from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Text, Block } from "galio-framework";

import { Icon, Header } from "../componentsEx";
import { materialTheme } from "../constantsEx";

import HomeScreen from "../screensEx/Home";
import ProfileScreen from "../screensEx/Profile";
import ChatScreen from "../screensEx/Chat";
import PlanScreen from "../screensEx/Plan";
import ProfileEditorScreen from "../screensEx/ProfileEditor";
import ProfileInputScreen from "../screensEx/ProfileInput";
import TalkScreen from "../screensEx/Talk";
import NotificationScreen from "../screensEx/Notification";
import SettingsScreen from "../screensEx/Settings";
import SettingsInputScreen from "../screensEx/SettingsInput";
import SignUpScreen from "../screensEx/SignUp";
import SignInScreen from "../screensEx/SignIn";

import CustomDrawerContent from "./MenuEx";
import { useAuthState } from "../componentsEx/contexts/AuthContext";
import { useProfileState } from "../componentsEx/contexts/ProfileContext";
import { useNotificationState, useNotificationDispatch } from "../componentsEx/contexts/NotificationContext";
import { cvtBadgeCount } from "../componentsEx/tools/support";
import { useChatState } from "../componentsEx/contexts/ChatContext";

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


const HomeStack = (props) => {
  const profileState = useProfileState();
  const chatState = useChatState();

  return (
    <Stack.Navigator mode="card" headerMode="screen" >
      <Stack.Screen
        name="Home"
        component={BottomTabNavigator}
        options={({ route, navigation }) => {
          return {
            header: ({ navigation, scene }) => {
              const name = route.state
                ? route.state.routes[route.state.index].name
                : "Home";
              return (
                < Header
                  name={name}
                  navigation={navigation}
                  scene={scene}
                  profile={profileState.profile}
                />);
            }
          }
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              name="Profile"
              white
              transparent
              navigation={navigation}
              scene={scene}
              profile={profileState.profile}
            />
          ),
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name="ProfileEditor"
        component={ProfileEditorScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              name="ProfileEditor"
              navigation={navigation}
              scene={scene}
              profile={profileState.profile}
            />
          )
        }}
      />
      <Stack.Screen
        name="ProfileInput"
        component={ProfileInputScreen}
        options={({ route }) => ({
          header: ({ navigation, scene }) => {
            const name = route.params.screen;
            return (
              <Header
                back
                name={name}
                navigation={navigation}
                scene={scene}
                profile={profileState.profile}
              />);
          }
        })}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route, navigation }) => {
          return {
            header: ({ navigation, scene }) => {
              const roomID = route.params.roomID;
              const talkObj = chatState.talkCollection[roomID];
              const title = talkObj ? talkObj.user.name : "";
              return (
                <Header
                  title={title}
                  name={"Chat"}
                  talkObj={talkObj}
                  back
                  navigation={navigation}
                  scene={scene}
                  profile={profileState.profile}
                />
              );
            },
          }
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          header: ({ navigation, scene }) => {
            return (
              < Header
                back
                name={"Settings"}
                navigation={navigation}
                scene={scene}
                profile={profileState.profile}
              />);
          }
        }}
      />
      <Stack.Screen
        name="SettingsInput"
        component={SettingsInputScreen}
        options={({ route }) => ({
          header: ({ navigation, scene }) => {
            const name = typeof route.params.screen === "undefined" ? "SettingsInput" : route.params.screen;
            return (
              < Header
                back
                name={name}
                navigation={navigation}
                scene={scene}
                profile={profileState.profile}
              />);
          }
        })}
      />
      <Stack.Screen
        name="Plan"
        component={PlanScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              name="Plan"
              navigation={navigation}
              scene={scene}
              profile={profileState.profile}
            />
          )
        }}
      />
    </Stack.Navigator >
  );
}

const HomeTabNavigator = () => {
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabel: ({ focused, color, size }) => {
          let iconName;
          let title;
          if (route.name === "Work") {
            iconName = focused ? "shopping-bag" : "shopping-bag";
            title = "仕事";
          } else if (route.name === "Child") {
            iconName = focused ? "child" : "child";
            title = "子供";
          } else if (route.name === "Family") {
            iconName = focused ? "users" : "users";
            title = "家庭";
          } else if (route.name === "Love") {
            iconName = focused ? "heart" : "heart";
            title = "恋愛";
          }
          return (
            <Text size={size} color={color} >
              <Icon family="font-awesome" name={iconName} size={size} color={color} /> {title}
            </Text>
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: "#F69896",
        inactiveTintColor: "gray",
        indicatorStyle: {
          backgroundColor: "#F69896",
        },
        style: {
          backgroundColor: "white",
          borderTopColor: "silver",
          borderTopWidth: 0.5,
          shadowColor: "black",
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 6,
          shadowOpacity: 0.2,
        },
        scrollEnabled: true,
        showIcon: true,
        tabStyle: {
          width: width / 3.7,
        }
      }}>
      <Tab.Screen name="Work" component={HomeScreen} />
      <Tab.Screen name="Child" component={HomeScreen} />
      <Tab.Screen name="Family" component={HomeScreen} />
      <Tab.Screen name="Love" component={HomeScreen} />
    </Tab.Navigator>
  );
}

const BottomTabNavigator = () => {
  const Tab = createBottomTabNavigator();
  const notificationState = useNotificationState();
  const chatState = useChatState();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let badgeCount;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Talk") {
            iconName = focused ? "comments" : "comments-o";
            badgeCount = cvtBadgeCount(chatState.totalUnreadNum);
          } else if (route.name === "Notification") {
            iconName = focused ? "bell" : "bell-o";
            badgeCount = cvtBadgeCount(notificationState.unreadNum);
          }
          return (
            <Block style={{ position: "relative", height: 40, width: 40, justifyContent: "center", alignItems: "center" }}>
              <Icon family="font-awesome" name={iconName} size={size} color={color} />
              {(typeof badgeCount !== "undefined" && badgeCount !== null) &&
                <Block style={{ position: "absolute", backgroundColor: "#F69896", right: 0, top: 0, height: 18, minWidth: 18, borderRadius: 9, borderColor: "white", borderWidth: 1, justifyContent: "center", alignItems: "center" }}>
                  <Text size={13} color="white" style={{ paddingHorizontal: 3 }}>{badgeCount}</Text>
                </Block>
              }
            </Block>
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: "#F69896",
        inactiveTintColor: "gray",
        showLabel: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeTabNavigator} />
      <Tab.Screen name="Talk" component={TalkScreen} />
      <Tab.Screen name="Notification" options={{
        tabBarButton: (props) => <TouchableOpacity activeOpacity={1} {...props} onPress={() => {
          // additional processing
          props.onPress();
        }} />
      }} >
        {() => <NotificationScreen notificationState={notificationState} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const AppStack = (props) => {
  const authState = useAuthState();
  const profileState = useProfileState();

  return (
    <Stack.Navigator mode="card" headerMode="" >
      {authState.status === "Authenticated" ?
        <Stack.Screen name="Authenticated" >
          {() => (
            <Drawer.Navigator
              style={{ flex: 1 }}
              drawerContent={props => (
                <CustomDrawerContent {...props} profile={profileState.profile} />
              )}
              drawerStyle={{
                backgroundColor: "white",
                width: width * 0.8
              }}
              drawerContentOptions={{
                activeTintColor: "white",
                inactiveTintColor: "#000",
                activeBackgroundColor: materialTheme.COLORS.ACTIVE,
                inactiveBackgroundColor: "transparent",
                itemStyle: {
                  width: width * 0.74,
                  paddingHorizontal: 12,
                  // paddingVertical: 4,
                  justifyContent: "center",
                  alignItems: "center",
                  // alignItems: "center",
                  overflow: "hidden"
                },
                labelStyle: {
                  fontSize: 18,
                  fontWeight: "normal"
                }
              }}
              initialRouteName="Home"
            >
              <Drawer.Screen
                name="Home"
                component={HomeStack}
                options={{
                  drawerIcon: ({ focused }) => (
                    <Icon
                      size={16}
                      name="shop"
                      family="GalioExtra"
                      color={focused ? "white" : materialTheme.COLORS.MUTED}
                    />
                  ),
                }}
              />
            </Drawer.Navigator>
          )}
        </Stack.Screen> :
        <>
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
        </>
      }
    </Stack.Navigator>
  );
}

export default AppStack;