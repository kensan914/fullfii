import React, { createContext, useReducer, useContext, useEffect, useState } from "react";
import { BASE_URL, PRODUCT_ID_LIST } from "../../constants/env";
import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
} from "react-native-iap";
import authAxios from "../modules/axios";
import { showToast, URLJoin } from "../modules/support";
import { useProfileDispatch, useProfileState } from "./ProfileContext";
import { startUpLoggedin } from "../../screens/StartUpManager";
import { useChatDispatch, useChatState } from "./ChatContext";
import { useAuthDispatch, useAuthState } from "./AuthContext";
import { useNotificationDispatch, useNotificationState } from "./NotificationContext";
import useAllContext from "./ContextUtils";


const productReducer = (prevState, action) => {
  switch (action.type) {
    case "SET_PRODUCTS":
      /** set products. product情報取得時に実行.
       * @param {Object} action [type, products] */

      return {
        ...prevState,
        products: action.products,
      };

    case "START_PURCHASE":
      /** 購入開始時に実行.
       * @param {Object} action [type] */

      return {
        ...prevState,
        isProcessing: true,
      };

    case "SUCCESS_PURCHASE":
    case "SUCCESS_RESTORE":
      /** 購入(復元)成功時に実行.
       * @param {Object} action [type, profile, profileDispatch, token, authDispatch, startUpLoggedin] */

      action.profileDispatch({ type: "SET_ALL", profile: action.profile });

      // TODO: COMPLETE_SIGNINでなく、COMPLETE_SIGNUPに変更
      // action.authDispatch({ type: "COMPLETE_SIGNIN", token: action.token, startUpLoggedin: action.startUpLoggedin });

      return {
        ...prevState,
        isProcessing: false,
      };

    case "FAILED_PURCHASE":
    case "FAILED_RESTORE":
      /** 購入(復元)失敗時に実行.
       * @param {Object} action [type] */

      return {
        ...prevState,
        isProcessing: false,
      };

    case "SET_WILL_ALERT":
      /** isProcessingがfalseになった際にalertするtextをset.
       * @param {Object} action [type, text] */

      return {
        ...prevState,
        willAlertText: action.text,
      };

    default:
      console.warn(`Not found "${action.type}" action.type.`);
      return;
  }
};

const ProductStateContext = createContext({
  products: [],
  isProcessing: false,
  willAlertText: "",
});
const ProductDispatchContext = createContext(undefined);

export const useProductState = () => {
  const context = useContext(ProductStateContext);
  return context;
};
export const useProductDispatch = () => {
  const context = useContext(ProductDispatchContext);
  return context;
};

export const ProductProvider = ({ children, token }) => {
  const [productState, productDispatch] = useReducer(productReducer, {
    products: [],
    isProcessing: false,
    willAlertText: "",
  });

  const dispatches = {
    authDispatch: useAuthDispatch(),
    profileDispatch: useProfileDispatch(),
    notificationDispatch: useNotificationDispatch(),
    chatDispatch: useChatDispatch(),
    productDispatch: productDispatch,
  }
  const states = {
    authState: useAuthState(),
    profileState: useProfileState(),
    notificationState: useNotificationState(),
    chatState: useChatState(),
    productState: productState,
  };
  // const [states, dispatches] = useAllContext();

  const [purchaseUpdateSubscription, setPurchaseUpdateSubscription] = useState();
  const [purchaseErrorSubscription, setPurchaseErrorSubscription] = useState();

  useEffect(() => {
    requestGetProducts(productDispatch);
  }, []);

  useEffect(() => {
    // init product
    RNIap.initConnection().then(() => {
      // 私たちは、"ghost"の保留中の支払いが削除されていることを確認します
      // (ghostとは、Google のネイティブベンディングモジュールのキャッシュに保留中としてマークされたままの、失敗した保留中の支払いのことです)。
      RNIap.flushFailedPurchasesCachedAsPendingAndroid().catch(() => {
        // 例外は以下の場合に発生します。
        // まだ保留中の購入がある場合 (保留中の購入を消費することはできません) いずれにしても、エラーで特別なことをする必要はないかもしれません。
      }).then(() => {
        if (purchaseUpdateSubscription) {
          ("purchaseUpdateSubscriptionを初期化します。");
          purchaseUpdateSubscription.remove();
          setPurchaseUpdateSubscription(null);
        }
        if (purchaseErrorSubscription) {
          purchaseErrorSubscription.remove();
          setPurchaseErrorSubscription(null);
        }
        setPurchaseUpdateSubscription(purchaseUpdatedListener(async (purchase) => {
          // TODO Debug時、失敗したpurchaseが溜まるのでリセット
          // await RNIap.finishTransaction(purchase);

          const receipt = purchase.transactionReceipt;
          if (receipt) {
            requestPostPurchase(purchase, states.authState.token)
              .then(async (res) => {
                // これを怠ると、Androidでは購入したものが返金され、以下のことを成功させるまでアプリを再起動するたびに購入イベントが再表示されます。
                // また、これを行わない限り、ユーザーは消耗品を再度購入することはできません。
                if (Platform.OS === "ios") {
                  await RNIap.finishTransactionIOS(purchase.transactionId);
                } else if (Platform.OS === "android") {
                  // If consumable (can be purchased again)
                  await RNIap.consumePurchaseAndroid(purchase.purchaseToken);
                  // If not consumable
                  await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
                }
                await RNIap.finishTransaction(purchase);
                productDispatch({
                  type: "SUCCESS_PURCHASE", profile: res.data["profile"], profileDispatch: dispatches.profileDispatch, token: states.authState.token,
                  authDispatch: dispatches.authDispatch, startUpLoggedin: () => startUpLoggedin(states.authState.token, states, dispatches),
                });
              })
              .catch(async (err) => {
                if (err.response.status === 404 || err.response.status === 409) {
                  if (err.response.message) {
                    productDispatch({ type: "SET_WILL_ALERT", text: err.response.message });
                  }
                  await RNIap.finishTransaction(purchase);
                }
                productDispatch({ type: "FAILED_PURCHASE" });
                console.log(err.response);
              });
          }
        }));

        setPurchaseErrorSubscription(purchaseErrorListener((error) => {
          productDispatch({ type: "FAILED_PURCHASE" });
          console.warn("purchaseErrorListener", error);
        }));

        return (() => {
          if (purchaseUpdateSubscription) {
            purchaseUpdateSubscription.remove();
            setPurchaseUpdateSubscription(null);
          }
          if (purchaseErrorSubscription) {
            purchaseErrorSubscription.remove();
            setPurchaseErrorSubscription(null);
          }
        });
      });
    });
  }, [states.authState]);

  useEffect(() => {
    if (!productState.isProcessing) {
      if (productState.willAlertText) alert(productState.willAlertText);
      productDispatch({ type: "SET_WILL_ALERT", text: "" });
    }
  }, [productState.isProcessing]);

  return (
    <ProductStateContext.Provider value={productState}>
      <ProductDispatchContext.Provider value={productDispatch}>
        {children}
      </ProductDispatchContext.Provider>
    </ProductStateContext.Provider>
  );
};


const requestGetProducts = async (productDispatch) => {
  try {
    const productIDs = Platform.select({
      ios: PRODUCT_ID_LIST,
    });
    const _products = await RNIap.getProducts(productIDs);
    productDispatch({ type: "SET_PRODUCTS", products: _products });
  } catch (err) {
    console.warn(err); // standardized err.code and err.message available
  }
}

const requestPostPurchase = async (purchase, token) => {
  const { productId, transactionReceipt } = purchase;
  if (transactionReceipt !== undefined) {
    const url = URLJoin(BASE_URL, "products/", productId, "purchase/");
    return (
      authAxios(token)
        .post(url, {
          receipt: transactionReceipt,
        })
    );
  }
}