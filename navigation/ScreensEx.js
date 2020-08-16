import React from "react";
import { Easing, Dimensions } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Icon, Header } from "../components";
import { Images, materialTheme } from "../constants";

// screens
import OnboardingScreen from "../screens/Onboarding";
import HomeScreen from "../screens/Home";
import WomanScreen from "../screens/Woman";
import ManScreen from "../screens/Man";
import KidsScreen from "../screens/Kids";
import NewCollectionScreen from "../screens/NewCollection";
import DealsScreen from "../screens/Deals";

import CategoriesScreen from "../screens/Categories";
import CategoryScreen from "../screens/Category";
import ProductScreen from "../screens/Product";
import GalleryScreen from "../screens/Gallery";
import ChatScreen from "../screens/Chat";

import CartScreen from "../screens/Cart";
import SignInScreen from "../screens/SignIn";
import SignUpScreen from "../screens/SignUp";

import SearchScreen from "../screens/Search";
import ComponentsScreen from "../screens/Components";

import ProfileScreen from "../screens/Profile";
import SettingsScreen from "../screens/Settings";
import NotificationsScreen from "../screens/Notifications";
import PrivacyScreen from "../screens/Privacy";
import AboutScreen from "../screens/About";
import AgreementScreen from "../screens/Agreement";

import CustomDrawerContent from "./Menu";
import { tabs } from "../constants";

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const profile = {
  avatar: Images.Profile,
  name: "Rachel Brown",
  type: "Seller",
  plan: "Pro",
  rating: 4.8
};

function ManStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Man"
        component={ManScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              search
              options
              title="Man"
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name="Deals"
        component={DealsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              tabs={tabs.deals}
              title="Best Deals"
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          header: ({ navigation, scene, route }) => (
            <Header
              back
              tabs={tabs.categories}
              tabIndex={tabs.categories[1].id}
              title="Categories"
              navigation={navigation}
              route={route}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={{
          header: ({ navigation, scene }) => {
            const { params } = scene.descriptor;
            const title = (params && params.headerTitle) || "Category";
            return (
              <Header
                back
                title={title}
                navigation={navigation}
                scene={scene}
              />
            );
          }
        }}
      />
      <Stack.Screen
        name="Product"
        component={ProductScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              white
              transparent
              title=""
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              white
              transparent
              title=""
              navigation={navigation}
              scene={scene}
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
            />
          )
        }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header back title="Search" navigation={navigation} scene={scene} />
          )
        }}
      />
    </Stack.Navigator>
  );
}

function HomeStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              // search
              // options
              title="Home"
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name="Deals"
        component={DealsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              tabs={tabs.deals}
              title="Best Deals"
              navigation={navigation}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          header: ({ navigation, scene, route }) => (
            <Header
              back
              tabs={tabs.categories}
              tabIndex={tabs.categories[1].id}
              title="Categories"
              navigation={navigation}
              route={route}
              scene={scene}
            />
          )
        }}
      />
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={{
          header: ({ navigation, scene }) => {
            const { params } = scene.descriptor;
            const title = (params && params.headerTitle) || "Category";
            return (
              <Header
                back
                title={title}
                navigation={navigation}
                scene={scene}
              />
            );
          }
        }}
      />
      <Stack.Screen
        name="Product"
        component={ProductScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              white
              transparent
              title=""
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true
        }}
      />
      <Stack.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              back
              white
              transparent
              title=""
              navigation={navigation}
              scene={scene}
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
            />
          )
        }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header back title="Search" navigation={navigation} scene={scene} />
          )
        }}
      />
    </Stack.Navigator>
  );
}

const Tabs = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Search" component={ManStack} />
      <Tab.Screen name="Status" component={ManStack} />
      <Tab.Screen name="Message" component={ManStack} />
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
        name="Tabs"
        component={Tabs}
      />
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

      <Drawer.Screen
        name="Man"
        component={ManStack}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="man"
              family="entypo"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />

      <Drawer.Screen
        name="Sign In"
        component={SignInScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="ios-log-in"
              family="ionicon"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />
      <Drawer.Screen
        name="Sign Up"
        component={SignUpScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon
              size={16}
              name="md-person-add"
              family="ionicon"
              color={focused ? "white" : materialTheme.COLORS.MUTED}
            />
          )
        }}
      />
    </Drawer.Navigator>
  );
}