import React from "react";
import PlanTemplate from "../componentsEx/templates/PlanTemplate";
import * as RNIap from 'react-native-iap';
import { Block } from "galio-framework";
import { Dimensions } from "react-native";
import { ActivityIndicator } from "react-native";
import { useProductState } from "../componentsEx/contexts/ProductContext";
import { useProfileState } from "../componentsEx/contexts/ProfileContext";
import { BASE_URL, PRODUCT_ID_LIST } from "../constantsEx/env";
import { URLJoin } from "../componentsEx/tools/support";
import authAxios from "../componentsEx/tools/authAxios";


const { width, height } = Dimensions.get("screen");

const Plan = () => {
  const productState = useProductState();
  const plan = useProfileState().profile.plan.key;

  if (productState.products) {
    return <PlanTemplate products={productState.products} requestSubscription={requestSubscription} plan={plan}
      getPurchases={getPurchases} />;
  } else {
    return (
      <Block style={{ height: height - 88, width: width, backgroundColor: "whitesmoke", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </Block>
    );
  }
}

export default Plan;

const requestSubscription = async (productID, productDispatch, handleSelectedPlan) => {
  try {
    productDispatch({ type: "START_PURCHASE" });
    await RNIap.requestSubscription(productID);
    handleSelectedPlan && handleSelectedPlan();
  } catch (err) {
    console.warn(err.code, err.message);
  }
}

const getPurchases = async (token, productDispatch, profileDispatch, handleSelectedPlan) => {
  try {
    productDispatch({ type: "START_PURCHASE" });
    const purchases = await RNIap.getAvailablePurchases();

    let _purchase;
    purchases.forEach(purchase => {
      if (PRODUCT_ID_LIST.includes(purchase.productId)) {
        _purchase = purchase;
      }
    });
    const { productId, transactionReceipt } = _purchase;
    const url = URLJoin(BASE_URL, "products/", productId, "restore/");
    authAxios(token)
      .post(url, {
        receipt: transactionReceipt,
      })
      .then(res => {
        productDispatch({ type: "SET_WILL_ALERT", text: "復元完了" });
        productDispatch({ type: "SUCCESS_RESTORE", profile: res.data["profile"], profileDispatch: profileDispatch });
        handleSelectedPlan && handleSelectedPlan();
      })
      .catch(err => {
        if (err.response.status === 404 || err.response.status === 409) {
          if (err.response.data.message) {
            productDispatch({ type: "SET_WILL_ALERT", text: err.response.data.message });
            productDispatch({ type: "FAILED_RESTORE" });
            return;
          }
        }
        productDispatch({ type: "FAILED_RESTORE" });
      });
  } catch (err) {
    productDispatch({ type: "FAILED_RESTORE" });
    console.warn(err); // standardized err.code and err.message available
  }
}