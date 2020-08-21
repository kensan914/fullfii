import React from "react";
import { Easing, Dimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { Icon, Header } from "../componentsEx";
import { Images, materialTheme } from "../constants";

// screens
import HomeScreen from "../screensEx/Home";
import SearchScreen from "../screensEx/Search";

import DealsScreen from "../screens/Deals";
import ProfileScreen from "../screensEx/Profile";
import ChatScreen from "../screensEx/Chat";
import CartScreen from "../screensEx/Cart";

import CustomDrawerContent from "./MenuEx";
import Ionicons from 'react-native-vector-icons/Ionicons';


const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const profile = {
  avatar: Images.Profile,
  name: "けんさん",
  coins: 500,
};

function HomeStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Home"
        component={BottomTabNavigator}
        options={({ route }) => ({
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
        })}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              white
              transparent
              title=""
              navigation={navigation}
              scene={scene}
              profile={profile}
            />
          ),
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Rachel Brown"
              navigation={navigation}
              scene={scene}
              profile={profile}
            />
          )
        }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              title="Shopping Cart"
              navigation={navigation}
              scene={scene}
              profile={profile}
            />
          )
        }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header back title="Search" navigation={navigation} scene={scene} profile={profile} />
          )
        }}
      />
    </Stack.Navigator>
  );
}

const HomeTabNavigator = () => {
  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={DealsScreen} />
      <Tab.Screen name="Status" component={DealsScreen} />
      <Tab.Screen name="Notification" component={DealsScreen} />
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

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search';
          } else if (route.name === 'Status') {
            iconName = focused ? 'ios-list-box' : 'ios-list';
          } else if (route.name === 'Message') {
            iconName = focused ? 'envelope-o' : 'envelope-o';
          } else if (route.name === 'Notification') {
            iconName = focused ? 'bell' : 'bell-o';
          }

          // You can return any component that you like here!
          return <Icon family="font-awesome" name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#F69896',
        inactiveTintColor: 'gray',
        showLabel: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeTabNavigator} />
      {/* <Tab.Screen name="Search" component={SearchScreen} /> */}
      <Tab.Screen name="Status" component={DealsScreen} />
      <Tab.Screen name="Notification" component={DealsScreen} />
      {/* <Tab.Screen name="Message" component={DealsScreen} options={{ tabBarBadge: "3", }} /> */}
    </Tab.Navigator>
  );
}

export default function AppStack(props) {
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
          alignContent: "center",
          // alignItems: 'center',
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
          )
        }}
      />
    </Drawer.Navigator>
  );
}