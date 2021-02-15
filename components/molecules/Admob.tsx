import React from "react";
import {
  BannerAd,
  BannerAdSize,
  FirebaseAdMobTypes,
} from "@react-native-firebase/admob";

type Props = {
  adSize?: FirebaseAdMobTypes.BannerAdSize;
  adUnitId: string;
};
const Admob: React.FC<Props> = (props) => {
  const { adSize = BannerAdSize.BANNER, adUnitId } = props;

  return (
    <BannerAd
      unitId={adUnitId}
      size={adSize}
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
};

export default Admob;
