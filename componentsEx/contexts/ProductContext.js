import React, { createContext, useReducer, useContext, useEffect } from "react";
import { BASE_URL, PRODUCT_ID_LIST } from "../../constantsEx/env";
import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
} from "react-native-iap";
import authAxios from "../tools/authAxios";
import { URLJoin } from "../tools/support";
import { useProfileDispatch } from "./ProfileContext";


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
       * @param {Object} action [type, profile, profileDispatch] */

      action.profileDispatch({ type: "SET_ALL", profile: action.profile });
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
  const profileDispatch = useProfileDispatch();

  let purchaseUpdateSubscription = null
  let purchaseErrorSubscription = null

  useEffect(() => {
    requestGetProducts(productDispatch);

    // init product
    RNIap.initConnection().then(() => {
      // 私たちは、"ghost"の保留中の支払いが削除されていることを確認します
      // (ghostとは、Google のネイティブベンディングモジュールのキャッシュに保留中としてマークされたままの、失敗した保留中の支払いのことです)。
      RNIap.flushFailedPurchasesCachedAsPendingAndroid().catch(() => {
        // 例外は以下の場合に発生します。
        // まだ保留中の購入がある場合 (保留中の購入を消費することはできません) いずれにしても、エラーで特別なことをする必要はないかもしれません。
      }).then(() => {
        purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
          console.log("oooooooooooooooo");
          console.log(purchase);

          // TODO Debug時、失敗したpurchaseが溜まるのでリセット
          // await RNIap.finishTransaction(purchase);

          const receipt = purchase.transactionReceipt;
          if (receipt) {
            requestPostPurchase(purchase, token)
              .then(async (res) => {
                // これを怠ると、Androidでは購入したものが返金され、以下のことを成功させるまでアプリを再起動するたびに購入イベントが再表示されます。
                // また、これを行わない限り、ユーザーは消耗品を再度購入することはできません。
                if (Platform.OS === 'ios') {
                  await RNIap.finishTransactionIOS(purchase.transactionId);
                } else if (Platform.OS === 'android') {
                  // If consumable (can be purchased again)
                  await RNIap.consumePurchaseAndroid(purchase.purchaseToken);
                  // If not consumable
                  await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
                }
                await RNIap.finishTransaction(purchase);
                productDispatch({ type: "SUCCESS_PURCHASE", profile: res.data["profile"], profileDispatch: profileDispatch });
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
        });

        purchaseErrorSubscription = purchaseErrorListener((error) => {
          productDispatch({ type: "FAILED_PURCHASE" });
          console.warn("purchaseErrorListener", error);
        });

        return (() => {
          if (purchaseUpdateSubscription) {
            purchaseUpdateSubscription.remove();
            purchaseUpdateSubscription = null;
          }
          if (purchaseErrorSubscription) {
            purchaseErrorSubscription.remove();
            purchaseErrorSubscription = null;
          }
        });
      });
    });
  }, []);

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
    console.log("xxxxxxx");
    console.log(_products);
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