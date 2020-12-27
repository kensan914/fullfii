import React from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Text, Block } from "galio-framework";
import Toast from "react-native-toast-message";
import { getFocusedRouteNameFromRoute, useNavigation } from "@react-navigation/native";

import Icon from "../components/atoms/Icon";
import Header from "../components/organisms/Header";
import materialTheme from "../constants/Theme";
import HomeScreen from "../screens/Home";
import ProfileScreen from "../screens/Profile";
import ChatScreen from "../screens/Chat";
import PlanScreen from "../screens/Plan";
import ProfileEditorScreen from "../screens/ProfileEditor";
import ProfileInputScreen from "../screens/ProfileInput";
import TalkScreen from "../screens/Talk";
import NotificationScreen from "../screens/Notification";
import SettingsScreen from "../screens/Settings";
import SettingsInputScreen from "../screens/SettingsInput";
import AppIntroScreen from "../screens/AppIntro";
import SignUpScreen from "../screens/SignUp";
import SignInScreen from "../screens/SignIn";
import WorryScreen from "../screens/Worry";
import WorryPostScreen from "../screens/WorryPost";
import WorryListScreen from "../screens/WorryList";
import CustomDrawerContent from "./Menu";
import { useAuthState, AUTHENTICATED, UNAUTHENTICATED } from "../components/contexts/AuthContext";
import { useProfileState } from "../components/contexts/ProfileContext";
import { useNotificationState } from "../components/contexts/NotificationContext";
import { cvtBadgeCount } from "../components/modules/support";
import { useChatState } from "../components/contexts/ChatContext";


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
              <Header
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
      <Stack.Screen
        name="Worry"
        component={WorryScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              name="Worry"
              navigation={navigation}
              scene={scene}
              profile={profileState.profile}
            />
          )
        }}
      />
      <Stack.Screen
        name="WorryPost"
        component={WorryPostScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              name="WorryPost"
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
  const profileState = useProfileState();

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabel: ({ focused, color, size }) => {
            let iconName;
            let title;
            // const routeName = getFocusedRouteNameFromRoute(route);
            const routeName = route.name;
            if (routeName === "Work") {
              iconName = focused ? "shopping-bag" : "shopping-bag";
              title = "仕事";
            } else if (routeName === "Child") {
              iconName = focused ? "child" : "child";
              title = "子供";
            } else if (routeName === "Family") {
              iconName = focused ? "users" : "users";
              title = "家庭";
            } else if (routeName === "Love") {
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
        <Tab.Screen
          name="Top"
          component={HomeScreen}
          options={{
            tabBarLabel: ({ focused, color, size }) => (
              <Text size={size} color={color} bold={focused}>TOP</Text>
            )
          }} />
        {profileState.profile.genreOfWorries.length > 0 &&
          profileState.profile.genreOfWorries.map((genreOfWorry) => (
            <Tab.Screen
              key={genreOfWorry.key}
              name={genreOfWorry.value}
              component={HomeScreen}
              options={{
                tabBarLabel: ({ focused, color, size }) => (
                  <Text size={size} color={color} bold={focused}>{genreOfWorry.label}</Text>
                )
              }} />
          ))
        }
      </Tab.Navigator>
    </>
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
          // const routeName = getFocusedRouteNameFromRoute(route);
          const routeName = route.name;
          if (routeName === "Home") {
            iconName = focused ? "home" : "home";
          } else if (routeName === "WorryList") {
            iconName = focused ? "commenting" : "commenting-o";
          } else if (routeName === "Talk") {
            iconName = focused ? "comments" : "comments-o";
            badgeCount = cvtBadgeCount(chatState.totalUnreadNum);
          } else if (routeName === "Notification") {
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
      <Tab.Screen name="WorryList" component={WorryListScreen} />
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

  console.log({ ...authState.signupBuffer });
  return (
    <>
      {authState.status === AUTHENTICATED ?
        <Stack.Navigator mode="card" headerMode="" >

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
                    justifyContent: "center",
                    alignItems: "center",
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
          </Stack.Screen>
        </Stack.Navigator> :

        <Stack.Navigator
          // mode="card"
          mode="modal"
          headerMode=""
          screenOptions={{
            // gestureEnabled: false,  // backを可能に。
          }} >
            
          {(!authState.status || authState.status === UNAUTHENTICATED) &&
            <Stack.Screen name="AppIntro">
              {() => {
                const navigation = useNavigation();
                return <AppIntroScreen {...props} navigation={navigation} />
              }}
            </Stack.Screen>
          }
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
        </Stack.Navigator>
      }
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
}

export default AppStack;