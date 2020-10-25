import React, { useState, useEffect } from "react";
import { Platform, StatusBar, Image } from "react-native";
// import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import { GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "react-native-splash-screen";

// Before rendering any navigation stack
import { enableScreens } from "react-native-screens";
enableScreens();

import Screens from "./navigation/Screens";
import materialTheme from "./constants/Theme";
import { AuthProvider } from "./components/contexts/AuthContext";
import { asyncGetItem, asyncGetJson, asyncRemoveItem } from "./components/modules/support";
import { ProfileProvider } from "./components/contexts/ProfileContext";
import { NotificationProvider } from "./components/contexts/NotificationContext";
import { ChatProvider } from "./components/contexts/ChatContext";
import Manager from "./screens/Manager";
import { ProductProvider } from "./components/contexts/ProductContext";


const assetImages = [
  require("./assets/images/top.jpg"),
  require("./assets/images/logo.png"),
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

const App = (props) => {
  const [isFinishLoadingResources, setIsFinishLoadingResources] = useState(false);

  const loadResourcesAsync = async () => {
    return Promise.all([
      ...cacheImages(assetImages),
    ]);
  };

  useEffect(() => {
    loadResourcesAsync()
      .then((val) => {
        setIsFinishLoadingResources(true);
      });
  }, []);

  return <RootNavigator isFinishLoadingResources={isFinishLoadingResources} />;
}


const RootNavigator = (props) => {
  const [token, setToken] = useState();
  const [profile, setProfile] = useState();
  const [notifications, setNotifications] = useState();

  useEffect(() => {
    asyncRemoveItem("profile");

    const fetchData = async () => {
      const _token = await asyncGetItem("token");
      setToken(_token ? _token : null);
      const _profile = await asyncGetJson("profile");
      setProfile(_profile ? _profile : null);
      const _notifications = await asyncGetJson("notifications");
      setNotifications(_notifications ? _notifications : null);
    }
    fetchData();
  }, []);

  if (typeof token === "undefined" || typeof profile === "undefined" || typeof notifications === "undefined" || !props.isFinishLoadingResources) {
    return <></>; // AppLording
  } else {
    SplashScreen.hide();

    return (
      <NavigationContainer>
        <AuthProvider token={token}>
          <ProfileProvider profile={profile} >
            <NotificationProvider notifications={notifications} >
              <ChatProvider >
                <ProductProvider token={token}>
                  <GalioProvider theme={materialTheme}>
                    <Manager>
                      {Platform.OS === "ios" && <StatusBar barStyle="default" />}
                      <Screens />
                    </Manager>
                  </GalioProvider>
                </ProductProvider>
              </ChatProvider>
            </NotificationProvider>
          </ProfileProvider>
        </AuthProvider>
      </NavigationContainer>
    );
  }
}


export default App;