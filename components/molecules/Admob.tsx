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

export const showAdMobInterstitial = (
  adUnitId: string,
  willShowInterstitial: () => void
): void => {
  if (!isExpo) {
    (async () => {
      const _firebaseAdmobModule = await import("@react-native-firebase/admob");

      const _interstitial = _firebaseAdmobModule.InterstitialAd.createForAdRequest(
        adUnitId,
        {
          requestNonPersonalizedAdsOnly: true,
          // keywords: ["fashion", "clothing"],
        }
      );

      if (_interstitial) {
        _interstitial.onAdEvent((type) => {
          if (type === _firebaseAdmobModule.AdEventType.LOADED) {
            willShowInterstitial();
            _interstitial.show();
          }
        });
        _interstitial.load();
      }
    })();
  }
};
