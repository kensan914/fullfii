import React, { useEffect, useState } from "react";
import { isExpo } from "../../constants/env";

type Props = {
  adSize?: unknown;
  adUnitId: string;
};
const Admob: React.FC<Props> = (props) => {
  const { adSize, adUnitId } = props;

  const [firebaseAdmobModule, setFirebaseAdmobModule] = useState();
  useEffect(() => {
    (async () => {
      if (!isExpo) {
        setFirebaseAdmobModule(await import("@react-native-firebase/admob"));
      }
    })();
  }, []);

  if (firebaseAdmobModule) {
    return (
      <firebaseAdmobModule.BannerAd
        unitId={adUnitId}
        size={adSize ? adSize : firebaseAdmobModule.BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          return void 0;
        }}
        onAdFailedToLoad={() => {
          return void 0;
        }}
        onAdOpened={() => {
          return void 0;
        }}
        onAdClosed={() => {
          return void 0;
        }}
        onAdLeftApplication={() => {
          return void 0;
        }}
      />
    );
  } else return <></>;
};

export default Admob;
