import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, Dimensions } from "react-native";
import { Button, Block, Text, Icon } from "galio-framework";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import Spinner from "react-native-loading-spinner-overlay";

import { FREE_PLAN, USER_POLICY_URL } from "../../constantsEx/env";
import { HeaderHeight } from "../../constantsEx/utils";
import { useProductDispatch, useProductState } from "../contexts/ProductContext";
import { useProfileDispatch } from "../contexts/ProfileContext";
import { useAuthState } from "../contexts/AuthContext";


const { width, height } = Dimensions.get("screen");

const PlanTemplate = (props) => {
  const productState = useProductState();

  return (
    <ScrollView bounces={false}>

      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0.25, y: 1.1 }}
        locations={[0.2, 1]}
        colors={["white", "mistyrose"]}
        style={[styles.container, { flex: 1 }]}>

        <Block flex row>
          <PlanTemplateContent {...props} />
        </Block>
      </LinearGradient>
    </ScrollView>
  );
}

export default PlanTemplate;


export const PlanTemplateContent = (props) => {
  const { requestSubscription, getPurchases, plan, handleSelectedPlan } = props;

  const productState = useProductState();
  const productDispatch = useProductDispatch();
  const profileDispatch = useProfileDispatch();
  const token = useAuthState().token;

  const handleOpenWithWebBrowser = () => {
    WebBrowser.openBrowserAsync(USER_POLICY_URL);
  };

  let plans = productState.products;
  if (plan === FREE_PLAN.productId) plans = plans.concat([FREE_PLAN]);

  if (typeof plan === "undefined") plans = plans.concat([{
    productId: "skip",
    title: "加入しない",
    description: "",
  }]);

  return (
    <Block flex middle>
      <Block flex={0.1} style={{ alignItems: "center", marginTop: 30 }}>
        <Text size={26} bold color="#F69896">プラン一覧</Text>
      </Block>
      <Block flex={0.6}>
        <Block flex style={{ marginTop: 20, paddingHorizontal: 10, alignItems: "center" }}>

          {plans.map((_plan) => (
            <Block key={_plan.productId}>
              <Button
                style={{ height: 80, shadowColor: plan === _plan.productId ? "silver" : "lightcoral", borderRadius: 20, flexDirection: "row", alignSelf: "center" }}
                color={plan === _plan.productId ? "white" : "lightcoral"}
                onPress={() => {
                  if (_plan.productId === "skip") {
                    handleSelectedPlan();
                  } else if (plan !== _plan.productId) requestSubscription(_plan.productId, productDispatch, handleSelectedPlan);
                }}>

                <Block style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <Text color={plan === _plan.productId ? "lightcoral" : "white"} size={20} bold>{_plan.title}</Text>
                  {_plan.localizedPrice &&
                    <Text color={plan === _plan.productId ? "lightcoral" : "white"} size={16} bold>{_plan.localizedPrice} / 月</Text>}
                </Block>
                {plan === _plan.productId &&
                  <Icon family="font-awesome" name="check-circle" size={30} color="lightcoral" styles={{ marginLeft: 20 }} />
                }
              </Button>
              <Block style={{ padding: 10, paddingBottom: 20 }}>
                <Text color="silver" size={12} bold center>{_plan.description}</Text>
              </Block>
            </Block>
          ))}

        </Block>
      </Block>

      <Block flex={0.2}>
        <Block style={{ padding: 10 }}>
          <Text color="lightcoral" size={12} bold center onPress={() => {
            if (plan === FREE_PLAN.productId) {
              getPurchases(token, productDispatch, profileDispatch, handleSelectedPlan);
            } else alert("すでに購入したプランが適用されています。");
          }}>購入を復元する</Text>
        </Block>
        <Block style={{ padding: 10, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <Text color="#F69896" size={12} bold center onPress={handleOpenWithWebBrowser}>利用規約</Text>
          <Text color="silver" size={12} bold center>と</Text>
          <Text color="#F69896" size={12} bold center onPress={handleOpenWithWebBrowser}>プライバシーポリシー</Text>
        </Block>
      </Block>

      <Spinner
        visible={productState.isProcessing}
      />
    </Block>
  );
}


const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    minHeight: height - 88,
  }
});
