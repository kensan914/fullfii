import React, { useState, useEffect } from "react";
import { Platform, StatusBar, LogBox } from "react-native";
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
import { asyncGetItem, asyncGetJson } from "./components/modules/support";
import { ProfileProvider } from "./components/contexts/ProfileContext";
import { ChatProvider } from "./components/contexts/ChatContext";
import Manager from "./screens/StartUpManager";
import {
  MeProfileIoTs,
  SignupBufferIoTs,
  SignupBuffer,
  MeProfile,
  AuthStatus,
  AuthStatusIoTs,
  TalkTicketCollection,
  TalkTicketCollectionAsyncIoTs,
  TalkTicketCollectionAsync,
} from "./components/types/Types.context";
import usePushNotification from "./components/modules/firebase/pushNotification";
import { Assets } from "./components/types/Types";

LogBox.ignoreAllLogs(true);

const assetImages: { logo: number } = {
  logo: require("./assets/images/icon_2/ios/Icon-512.png"),
};

function cacheImages(images: (string | number)[]): Promise<Asset>[] {
  return images.map((image) => {
    // if (typeof image === "string") {
    //   return Image.prefetch(image);
    // } else {
    //   return Asset.fromModule(image).downloadAsync();
    // }
    return Asset.fromModule(image).downloadAsync();
  });
}

const App: React.FC = () => {
  const deviceToken = usePushNotification();
  useEffect(() => {
    console.error(deviceToken);
  }, [deviceToken]);

  const [isFinishLoadingResources, setIsFinishLoadingResources] = useState(
    false
  );
  const [assets, setAssets] = useState<Assets>({});

  const loadResourcesAsync = async (): Promise<Asset[]> => {
    const images = Object.values(assetImages);
    const assetPromises = cacheImages(images);
    return Promise.all(assetPromises);
  };

  useEffect(() => {
    loadResourcesAsync().then((assetList) => {
      const downloadedAssets: Assets = {};
      assetList.forEach((elm: Asset) => {
        if ("name" in elm) downloadedAssets[elm.name] = elm;
      });
      setAssets(downloadedAssets);
      setIsFinishLoadingResources(true);
    });
  }, []);

  return (
    <RootNavigator
      isFinishLoadingResources={isFinishLoadingResources}
      assets={assets}
    />
  );
};

type Props = {
  isFinishLoadingResources: boolean;
  assets: Assets;
};
const RootNavigator: React.FC<Props> = (props) => {
  type InitState<T> = undefined | null | T;
  const [status, setStatus] = useState<InitState<AuthStatus>>();
  const [token, setToken] = useState<InitState<string>>();
  const [signupBuffer, setSignupBuffer] = useState<InitState<SignupBuffer>>();
  const [profile, setProfile] = useState<InitState<MeProfile>>();
  const [talkTicketCollection, setTalkTicketCollection] = useState<
    InitState<TalkTicketCollection>
  >();

  useEffect(() => {
    (async () => {
      // asyncRemoveItem("status"); // テスト
      // asyncRemoveItem("token"); // テスト
      // asyncRemoveItem("signupBuffer"); // テスト
      // asyncRemoveItem("talkTicketCollection"); // テスト

      const _status = (await asyncGetItem(
        "status",
        AuthStatusIoTs
      )) as AuthStatus;
      setStatus(_status ? _status : null);
      const _token = await asyncGetItem("token");
      setToken(_token ? _token : null);
      const _signupBuffer = (await asyncGetJson(
        "signupBuffer",
        SignupBufferIoTs
      )) as SignupBuffer;
      setSignupBuffer(_signupBuffer ? _signupBuffer : null);
      const _profile = (await asyncGetJson(
        "profile",
        MeProfileIoTs
      )) as MeProfile;
      setProfile(_profile ? _profile : null);
      const _talkTicketCollectionJson = (await asyncGetJson(
        "talkTicketCollection",
        TalkTicketCollectionAsyncIoTs
      )) as TalkTicketCollectionAsync;
      setTalkTicketCollection(
        _talkTicketCollectionJson ? _talkTicketCollectionJson : null
      );
    })();
  }, []);

  if (
    typeof status === "undefined" ||
    typeof token === "undefined" ||
    typeof signupBuffer === "undefined" ||
    typeof profile === "undefined" ||
    typeof talkTicketCollection === "undefined" ||
    !props.isFinishLoadingResources
  ) {
    return <></>; // AppLording
  } else {
    setTimeout(() => {
      SplashScreen.hide();
    }, 150);

    return (
      <NavigationContainer>
        <AuthProvider status={status} token={token} signupBuffer={signupBuffer}>
          <ProfileProvider profile={profile}>
            <ChatProvider talkTicketCollection={talkTicketCollection}>
              <GalioProvider theme={materialTheme}>
                <Manager>
                  {Platform.OS === "ios" && <StatusBar barStyle="default" />}
                  <Screens {...props} />
                </Manager>
              </GalioProvider>
            </ChatProvider>
          </ProfileProvider>
        </AuthProvider>
      </NavigationContainer>
    );
  }
};

export default App;
