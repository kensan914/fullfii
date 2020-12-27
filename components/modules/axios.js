import axios from "axios";
import { useEffect, useState } from "react";
import { checkCorrectKey } from "./support";


const authAxios = (token) => {
  const _authAxios = axios.create({
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
    }
  });

  _authAxios.interceptors.request.use(request => {
    return request;
  });

  return _authAxios;
}

export default authAxios;


/** axiosを使用したリクエストのカスタムフック
 * @param {string} url
 * @param {string} method [get, post, delete, put, patch]
 * @param {Object} action [data, thenCallback, errorCallback, finallyCallback, didRequestCallback, token, didMountRequest] 
 * @return {Object} { isLoading, resData, request }
 * @example
 * // デフォルトではdidMount時にリクエストは走らない。didMount時の自動リクエストはaction.didMountRequestにtrueをsetし設定。
 * const {isLoading, resData, request} = useAxios(URLJoin(BASE_URL, "blogs/"), "get", {
 *   thenCallback: res => setBlogs(res),
 *   didMountRequest: true,
 * }); 
 * // request()でリクエスト。urlかdataパラメータをobjectで渡してそのリクエスト間だけで有効な上書き設定が可能。
 * request({ url: URLJoin(BASE_URL, "blogs/", "page=2") }); 
 * */
export const useAxios = (url, method, action) => {
  //---------- constants ----------//
  const axiosRequestMethods = ["get", "post", "delete", "put", "patch"];
  // ↓変更があれば都度追加していく↓
  const correctActionKeys = ["data", "thenCallback", "errorCallback", "finallyCallback", "didRequestCallback", "token", "didMountRequest"];
  const correctRequestActionKeys = ["url", "data"];
  //---------- constants ----------//

  const methodText = method.toLowerCase();  // httpメソッドの整形
  const actionKeys = Object.keys(action);

  const axiosSettings = {
    url: url,
    method: methodText,
  };

  // set token
  const authHeaders = actionKeys.indexOf("token") !== -1 ? {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `JWT ${action.token}`,
  } : {};
  axiosSettings["headers"] = authHeaders;

  // set data
  if (actionKeys.indexOf("data") !== -1) axiosSettings["data"] = action.data;

  // generate axios instance
  const axiosInstance = axios.create();

  // set didRequestCallback
  if (actionKeys.indexOf("didRequestCallback") !== -1) {
    axiosInstance.interceptors.request.use(request => {
      action.didRequestCallback(request);
      return request;
    });
  }

  const [resData, setResData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  /** 再リクエストしたい時に使用する。最初の設定から変更できるパラメータはurl, dataのみ。どちらも引数も省略し、最初の設定を使用することが可能。
   * @param {string} url
   * @param {Object} data
   * */
  const request = (reAction = null) => {
    setIsLoading(true);

    const _axiosSettings = { ...axiosSettings };
    if (reAction !== null) {
      const reActionKeys = Object.keys(reAction);
      // actionのエラーハンドリング
      checkCorrectKey(correctRequestActionKeys, reAction, incorrectkey => {
        console.error(`"${incorrectkey}" action key is not supported.`);
      });
      if (reActionKeys.indexOf("url") !== -1) _axiosSettings["url"] = reAction.url;
      if (reActionKeys.indexOf("data") !== -1) _axiosSettings["data"] = reAction.data;
    }

    axiosInstance.request(_axiosSettings)
      .then(res => {
        if (actionKeys.indexOf("thenCallback") !== -1) action.thenCallback(res);
        setResData(res.data);
      })
      .catch(err => {
        if (err.response) {
          console.error(err.response);
        } else {
          console.error(err);
        }
        if (actionKeys.indexOf("errorCallback") !== -1) action.errorCallback(err);
      })
      .finally(() => {
        if (actionKeys.indexOf("finallyCallback") !== -1) action.finallyCallback();
        setIsLoading(false);
      });
  }

  useEffect(() => {
    // http methodのエラーハンドリング
    if (!axiosRequestMethods.includes(methodText)) console.error(`"${methodText}" HTTP method is not supported.`);

    // actionのエラーハンドリング
    checkCorrectKey(correctActionKeys, action, incorrectkey => {
      console.error(`"${incorrectkey}" action key is not supported.`);
    });

    if (actionKeys.indexOf("didMountRequest") !== -1 && action.didMountRequest) {
      request();
    }
  }, []);

  return { isLoading, resData, request };
}