import React, { useState, useEffect } from "react";
import { Platform, StatusBar, Image } from "react-native";
import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";

// Before rendering any navigation stack
import { enableScreens } from "react-native-screens";
enableScreens();

import Screens from "./navigation/Screens";
import ScreensEx from "./navigation/ScreensEx";

import { materialTheme } from "./constants/";
import { Images } from "./constants/";
import { AuthProvider } from "./componentsEx/tools/authContext";
import { asyncGetItem, asyncGetJson, asyncRemoveItem } from "./componentsEx/tools/support";
import { ProfileProvider } from "./componentsEx/tools/profileContext";
import { NotificationProvider } from "./componentsEx/tools/notificationContext";
import { ChatProvider } from "./componentsEx/tools/chatContext";
import Manager from "./screensEx/Manager";

const assetImages = [
  Images.Profile,
  Images.Avatar,
  Images.Onboarding,
  Images.Products.Auto,
  Images.Products.Motocycle,
  Images.Products.Watches,
  Images.Products.Makeup,
  Images.Products.Accessories,
  Images.Products.Fragrance,
  Images.Products.BMW,
  Images.Products.Mustang,
  Images.Products["Harley-Davidson"],
];

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else
      return <RootNavigator />;
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      ...cacheImages(assetImages),
    ]);
  };

  _handleLoadingError = error => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}


const RootNavigator = () => {
  const [token, setToken] = useState();
  const [profile, setProfile] = useState();
  const [notifications, setNotifications] = useState();

  useEffect(() => {
    console.log("remove プロフィール")
    asyncRemoveItem("profile"); // TODO
    // asyncRemoveItem("notifications"); // TODO

    const fetchData = async () => {
      const _token = await asyncGetItem("token");
      console.log(_token);
      setToken(_token ? _token : null);
      const _profile = await asyncGetJson("profile");
      setProfile(_profile ? _profile : null);
      const _notifications = await asyncGetJson("notifications");
      console.log("_notifications_notifications");
      console.log(_notifications);
      setNotifications(_notifications ? _notifications : null);
    }
    fetchData();
  }, []);

  if (typeof token === "undefined" || typeof profile === "undefined" || typeof notifications === "undefined") {
    return <></>; // AppLording
  } else {
    return (
      <NavigationContainer>
        <AuthProvider token={token}>
          <ProfileProvider profile={profile} >
            <NotificationProvider notifications={notifications} >
              <ChatProvider >
                <GalioProvider theme={materialTheme}>
                  <Manager>
                    {Platform.OS === "ios" && <StatusBar barStyle="default" />}
                    {/* <Screens /> */}
                    <ScreensEx />
                  </Manager>
                </GalioProvider>
              </ChatProvider>
            </NotificationProvider>
          </ProfileProvider>
        </AuthProvider>
      </NavigationContainer>
    );
  }
}