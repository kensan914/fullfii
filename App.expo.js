import React, { useState, useEffect } from "react";
import { Platform, StatusBar, Image } from "react-native";
import { Asset } from "expo-asset";
import { GalioProvider } from "galio-framework";
import { NavigationContainer } from "@react-navigation/native";

// Before rendering any navigation stack
import { enableScreens } from "react-native-screens";
enableScreens();

import Screens from "./navigation/Screens";
import materialTheme from "./constants/Theme";
import { AuthProvider } from "./components/contexts/AuthContext";
import {
  asyncGetItem,
  asyncGetJson,
  asyncRemoveItem,
} from "./components/modules/support";
import { ProfileProvider } from "./components/contexts/ProfileContext";
import { NotificationProvider } from "./components/contexts/NotificationContext";
import { ChatProvider } from "./components/contexts/ChatContext";
import StartUpManager from "./screens/StartUpManager";
import { ProductProvider } from "./components/contexts/ProductContext";
// import { logEvent } from "./components/modules/firebase";
import { LogBox } from "react-native";
import { setIsExpo } from "./constants/env";

LogBox.ignoreAllLogs(true);

const assetImages = {
  logo: require("./assets/images/icon_2/ios/Icon-512.png"),
};

function cacheImages(images) {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

const App = (props) => {
  const [isFinishLoadingResources, setIsFinishLoadingResources] = useState(
    false
  );
  const [assets, setAssets] = useState();

  const loadResourcesAsync = async () => {
    return Promise.all([...cacheImages(Object.values(assetImages))]);
  };

  useEffect(() => {
    setIsExpo(true);

    loadResourcesAsync().then((assetList) => {
      const downloadedAssets = {};
      assetList.forEach((elm) => {
        downloadedAssets[elm.name] = elm;
      });
      setAssets(downloadedAssets);
      setIsFinishLoadingResources(true);
    });
  }, []);
  // setIsFinishLoadingResources(true);
  return <RootNavigator isFinishLoadingResources={isFinishLoadingResources} />;
};

const RootNavigator = (props) => {
  const [status, setStatus] = useState();
  const [token, setToken] = useState();
  const [signupBuffer, setSignupBuffer] = useState();
  const [profile, setProfile] = useState();
  const [notifications, setNotifications] = useState();
  const [talkTicketCollection, setTalkTicketCollection] = useState();

  useEffect(() => {
    (async () => {
      // asyncRemoveItem("status"); // テスト
      // asyncRemoveItem("token"); // テスト
      // asyncRemoveItem("signupBuffer"); // テスト
      // asyncRemoveItem("talkTicketCollection"); // テスト

      const _status = await asyncGetItem("status");
      setStatus(_status ? _status : null);
      const _token = await asyncGetItem("token");
      setToken(_token ? _token : null);
      const _signupBuffer = await asyncGetJson("signupBuffer");
      setSignupBuffer(_signupBuffer ? _signupBuffer : null);
      const _profile = await asyncGetJson("profile");
      setProfile(_profile ? _profile : null);
      const _notifications = await asyncGetJson("notifications");
      setNotifications(_notifications ? _notifications : null);
      const _talkTicketCollection = await asyncGetJson("talkTicketCollection");
      setTalkTicketCollection(
        _talkTicketCollection ? _talkTicketCollection : null
      );
    })();

    // send event to firebase
    // logEvent("sample_event");
  }, []);
  if (
    typeof status === "undefined" ||
    typeof token === "undefined" ||
    typeof signupBuffer === "undefined" ||
    typeof profile === "undefined" ||
    typeof notifications === "undefined" ||
    typeof talkTicketCollection === "undefined" ||
    !props.isFinishLoadingResources
  ) {
    return <></>; // AppLording
  } else {
    // setTimeout(() => {
    //   SplashScreen.hide();
    // }, 150);

    return (
      <NavigationContainer>
        <AuthProvider status={status} token={token} signupBuffer={signupBuffer}>
          <ProfileProvider profile={profile}>
            <NotificationProvider notifications={notifications}>
              <ChatProvider talkTicketCollection={talkTicketCollection}>
                <ProductProvider token={token}>
                  <GalioProvider theme={materialTheme}>
                    <StartUpManager>
                      {Platform.OS === "ios" && (
                        <StatusBar barStyle="default" />
                      )}
                      <Screens {...props} />
                    </StartUpManager>
                  </GalioProvider>
                </ProductProvider>
              </ChatProvider>
            </NotificationProvider>
          </ProfileProvider>
        </AuthProvider>
      </NavigationContainer>
    );
  }
};

export default App;
