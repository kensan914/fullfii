import React, { useState, useEffect } from "react";
import { Platform, StatusBar, LogBox } from "react-native";
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
import { ChatProvider } from "./components/contexts/ChatContext";
import StartUpManager from "./screens/StartUpManager";
import { setIsExpo } from "./constants/env";
import {
  AuthStatus,
  AuthStatusIoTs,
  MeProfile,
  MeProfileIoTs,
  SignupBuffer,
  SignupBufferIoTs,
  TalkTicketCollection,
  TalkTicketCollectionAsync,
  TalkTicketCollectionAsyncIoTs,
} from "./components/types/Types.context";

LogBox.ignoreAllLogs(true);

const App: React.FC = () => {
  const [isFinishLoadingResources, setIsFinishLoadingResources] = useState(
    false
  );

  useEffect(() => {
    setIsExpo(true);
    setIsFinishLoadingResources(true);
  }, []);

  return <RootNavigator isFinishLoadingResources={isFinishLoadingResources} />;
};

type Props = {
  isFinishLoadingResources: boolean;
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
      // asyncRemoveItem("versionNum"); // テスト

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
    return (
      <NavigationContainer>
        <AuthProvider status={status} token={token} signupBuffer={signupBuffer}>
          <ProfileProvider profile={profile}>
            <ChatProvider talkTicketCollection={talkTicketCollection}>
              <GalioProvider theme={materialTheme}>
                <StartUpManager>
                  {Platform.OS === "ios" && <StatusBar barStyle="default" />}
                  <Screens />
                </StartUpManager>
              </GalioProvider>
            </ChatProvider>
          </ProfileProvider>
        </AuthProvider>
      </NavigationContainer>
    );
  }
};

export default App;
