import React from "react";
import { Dimensions } from "react-native";
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
import SignUpScreen from "../screensEx/SignUp";
import SignInScreen from "../screensEx/SignIn";

import CustomDrawerContent from "./MenuEx";
import { profile } from "../constantsEx/consultants";
import { unreadCount } from "../constantsEx/talks";
import { notificationsCount } from "../constantsEx/notifications";
import { useAuthState } from "../componentsEx/tools/authentication";

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


const HomeStack = (props) => {
  return (
    <Stack.Navigator mode="card" headerMode="screen" >
      <Stack.Screen
        name="Home"
        component={BottomTabNavigator}
        options={({ route, navigation }) => {
          return {
            header: ({ navigation, scene }) => {
              const title = route.state
                ? route.state.routes[route.state.index].name
                : "Home";
              return (
                < Header
                  title={title}
                  navigation={navigation}
                  scene={scene}
                  profile={profile}
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
              title=""
              white
              transparent
              navigation={navigation}
              scene={scene}
              profile={profile}
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
              title="ProfileEditor"
              navigation={navigation}
              scene={scene}
              profile={profile}
            />
          )
        }}
      />
      <Stack.Screen
        name="ProfileInput"
        component={ProfileInputScreen}
        options={({ route }) => ({
          header: ({ navigation, scene }) => {
            const title = route.params.screen;
            return (
              < Header
                back
                title={title}
                navigation={navigation}
                scene={scene}
                profile={profile}
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
              const title = route.params.user.name;
              return (
                <Header
                  title={title}
                  back
                  navigation={navigation}
                  scene={scene}
                  profile={profile}
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
            const title = "設定";
            return (
              < Header
                back
                title={title}
                navigation={navigation}
                scene={scene}
                profile={profile}
              />);
          }
        }}
      />
      <Stack.Screen
        name="SettingsInput"
        component={SettingsScreen}
        options={({ route }) => ({
          header: ({ navigation, scene }) => {
            const title = typeof route.params.screen === "undefined" ? "設定" : route.params.screen;
            return (
              < Header
                back
                title={title}
                navigation={navigation}
                scene={scene}
                profile={profile}
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
              title="PROプラン"
              navigation={navigation}
              scene={scene}
              profile={profile}
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
            badgeCount = unreadCount > 99 ? "99" : unreadCount;
          } else if (route.name === "Notification") {
            iconName = focused ? "bell" : "bell-o";
            badgeCount = notificationsCount > 99 ? "99" : notificationsCount;
          }
          return (
            <Block style={{ position: "relative", height: 40, width: 40, justifyContent: "center", alignItems: "center" }}>
              <Icon family="font-awesome" name={iconName} size={size} color={color} />
              {typeof badgeCount !== "undefined" &&
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
      <Tab.Screen name="Notification" component={NotificationScreen} />
    </Tab.Navigator>
  );
}

const AppStack = (props) => {
  const state = useAuthState();
  if (state.status === "Loading") {
    // return <Text>ローディング...</Text>;
  } else if (state.status === "Authenticated") {
    return (
      <Drawer.Navigator
        style={{ flex: 1 }}
        drawerContent={props => (
          <CustomDrawerContent {...props} profile={profile} />
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
    );
  } else {
    return (
      <Stack.Navigator mode="card" headerMode="" >
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
      </Stack.Navigator>
    );
  }
}

export default AppStack;