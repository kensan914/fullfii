import { useEffect, useState } from "react";
import { AdEventType, InterstitialAd } from "@react-native-firebase/admob";
import { ShowAdMobInterstitial } from "../types/Types";

const useAdMobInterstitial = (adUnitId: string): ShowAdMobInterstitial => {
  const [interstitial] = useState(
    InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
      keywords: ["fashion", "clothing"],
    })
  );
  const [canShow, setCanShow] = useState(false);

  useEffect(() => {
    const eventListener = interstitial.onAdEvent((type) => {
      if (type === AdEventType.LOADED) {
        setCanShow(true);
      }
    });

    interstitial.load();

    return () => {
      eventListener();
    };
  }, []);

  const showAdMobInterstitial: ShowAdMobInterstitial = () => {
    if (!canShow) return false;
    interstitial.show();
    return true;
  };

  return showAdMobInterstitial;
};

export default useAdMobInterstitial;
