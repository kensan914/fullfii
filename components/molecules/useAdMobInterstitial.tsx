import { useEffect, useState } from "react";
import { ShowAdMobInterstitial } from "../types/Types";
import { isExpo } from "../../constants/env";

const useAdMobInterstitial = (adUnitId: string): ShowAdMobInterstitial => {
  const [interstitial, setInterstitial] = useState();
  const [canShow, setCanShow] = useState(false);

  useEffect(() => {
    (async () => {
      if (!isExpo) {
        const _firebaseAdmobModule = await import(
          "@react-native-firebase/admob"
        );

        const _interstitial = _firebaseAdmobModule.InterstitialAd.createForAdRequest(
          adUnitId,
          {
            requestNonPersonalizedAdsOnly: true,
            keywords: ["fashion", "clothing"],
          }
        );

        if (_interstitial) {
          const eventListener = _interstitial.onAdEvent((type) => {
            if (type === _firebaseAdmobModule.AdEventType.LOADED) {
              setCanShow(true);
            }
          });
          _interstitial.load();

          setInterstitial(_interstitial);
          return () => {
            eventListener();
          };
        }
      }
    })();
  }, []);

  const showAdMobInterstitial: ShowAdMobInterstitial = () => {
    if (!canShow) return false;
    if (typeof interstitial !== "undefined") interstitial.show();
    return true;
  };

  return showAdMobInterstitial;
};

export default useAdMobInterstitial;
