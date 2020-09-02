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
import { AuthProvider } from "./componentsEx/tools/authentication";
import { asyncGetItem } from "./componentsEx/tools/support";

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
  useEffect(() => {
    const fetchData = async () => {
      const _token = await asyncGetItem("token");
      if (_token) {
        setToken(_token);
      } else {
        setToken(null);
      }
    }
    fetchData();
  }, []);

  if (typeof token === "undefined") {
    return <></>; // AppLording
  } else {
    return (
      <NavigationContainer>
        <AuthProvider token={token}>
          <GalioProvider theme={materialTheme}>
            <Block flex>
              {Platform.OS === "ios" && <StatusBar barStyle="default" />}
              {/* <Screens /> */}
              <ScreensEx />
            </Block>
          </GalioProvider>
        </AuthProvider>
      </NavigationContainer>
    );
  }
}