import { AsyncStorage, Alert } from "react-native";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import { Dimensions } from "react-native";

import { FREE_PLAN } from "../../constants/env";
import { CODE } from "../../constants/statusCodes";
import { TypeIoTsOfResData, WsSettings } from "../types/Types";
import {
  MeProfile,
  Room,
  RoomJson,
  TalkTicket,
  TalkTicketCollection,
  TalkTicketJson,
} from "../types/Types.context";
import { isRight } from "fp-ts/lib/Either";

/**
 * ex)URLJoin("http://www.google.com", "a", undefined, "/b/cd", undefined, "?foo=123", "?bar=foo"); => "http://www.google.com/a/b/cd/?foo=123&bar=foo"
 */
export const URLJoin = (...args: (string | undefined)[]): string => {
  args = args.filter((n) => n !== void 0);
  for (let i = args.length - 1; i >= 0; i--) {
    const arg = args[i];
    if (typeof arg === "string") {
      if (arg.toString().startsWith("?")) continue;
      if (!arg.toString().endsWith("/")) {
        args[i] += "/";
        break;
      }
    }
  }
  return args
    .join("/")
    .replace(/[/]+/g, "/")
    .replace(/^(.+):\//, "$1://")
    .replace(/^file:/, "file:/")
    .replace(/\/(\?|&|#[^!])/g, "$1")
    .replace(/\?/g, "&")
    .replace("&", "/?");
};

export const generateUuid4 = (): string => {
  const chars = [];
  for (const char of "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx") {
    switch (char) {
      case "x":
        chars.push(Math.floor(Math.random() * 16).toString(16));
        break;
      case "y":
        chars.push((Math.floor(Math.random() * 4) + 8).toString(16));
        break;
      default:
        chars.push(char);
        break;
    }
  }
  return chars.join("");
};

export const cvtListDate = (date: Date): string => {
  const today = new Date(Date.now());
  if (today.getFullYear() === date.getFullYear()) {
    if (today.getMonth() === date.getMonth()) {
      if (today.getDate() === date.getDate()) {
        // 当日
        return fmtfromDateToStr(date, "hh:mm");
      } else if (today.getDate() - 1 === date.getDate()) {
        // 1日前
        return "昨日";
      } else {
        // 1日以上前
        return fmtfromDateToStr(date, "MM/DD");
      }
    } else {
      // 1か月以上前
      return fmtfromDateToStr(date, "MM/DD");
    }
  } else {
    // 昨年以前
    return fmtfromDateToStr(date, "YYYY/MM/DD");
  }
};

/** fmtfromDateToStr(new Date(), "YYYY/MM/DD hh:mm:ss"); */
export const fmtfromDateToStr = (date: Date, format: string): string => {
  let _date: Date = date;
  if (!format) {
    format = "YYYY/MM/DD hh:mm:ss";
  }
  if (typeof date === "string") {
    _date = new Date(date);
  }
  format = format.replace(/YYYY/g, _date.getFullYear().toString());
  format = format.replace(/MM/g, ("0" + (_date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ("0" + _date.getDate()).slice(-2));
  format = format.replace(/hh/g, ("0" + _date.getHours()).slice(-2));
  format = format.replace(/mm/g, ("0" + _date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ("0" + _date.getSeconds()).slice(-2));
  return format;
};

/**
 * (deep Ver)スネークケースのobjのkeyをすべてキャメルケースに変換
 **/
export const deepCvtKeyFromSnakeToCamel = (
  obj: Record<string, unknown>
): Record<string, unknown> => {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => {
      let _v;
      if (isObject(v)) {
        // object
        _v = deepCvtKeyFromSnakeToCamel(v as Record<string, unknown>);
      } else if (Array.isArray(v)) {
        // Array
        _v = v.map((elm) =>
          isObject(elm) ? deepCvtKeyFromSnakeToCamel(elm) : elm
        );
      } else {
        _v = v;
      }
      return [fromSnakeToCamel(k), _v];
    })
  );
};

/**
 * @deprecated
 * スネークケースのobjのkeyをすべてキャメルケースに変換
 * @param obj
 */
export const cvtKeyFromSnakeToCamel = (
  obj: Record<string, unknown>
): Record<string, unknown> => {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [fromSnakeToCamel(k), v])
  );
};

/**
 * スネークケースのtextをキャメルケースに変換(例外: id => ID)
 * @param text
 */
export const fromSnakeToCamel = (text: string): string => {
  // const textConvertedID = text.replace(/_id/g, () => "ID");
  return text.replace(/_./g, (s) => {
    return s.charAt(1).toUpperCase();
  });
};

export const cvtBadgeCount = (badgeCount: number): string => {
  if (badgeCount <= 0) {
    return "";
  } else {
    if (badgeCount > 99) {
      return "99";
    } else {
      return badgeCount.toString();
    }
  }
};

export const asyncStoreItem = async (
  key: string,
  value: string
): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error(error);
  }
};

export const asyncStoreJson = async (
  key: string,
  value: Record<string, unknown>
): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
};

/**
 * async storageからstringをget.
 * type checkがleftでもobjectを返しエラーのみ出力する.
 * (アップデート時, 古いデータがleftされる可能性がある & async storageのデータはAPIレスより安全であると判断)
 **/
export const asyncGetItem = async (
  key: string,
  typeIoTsOfResData?: TypeIoTsOfResData
): Promise<string | null> => {
  try {
    const str = await AsyncStorage.getItem(key);
    if (str === null) return null;
    if (typeof typeIoTsOfResData !== "undefined") {
      const typeIoTsResult = typeIoTsOfResData.decode(str);
      if (!isRight(typeIoTsResult)) {
        console.group();
        console.error(
          `Type does not match(asyncGetItem). key is "${key}". value can be found below.`
        );
        console.error(str);
        console.groupEnd();
        return str;
      }
    }
    return str;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * async storageからobjectをget.
 * type checkがleftでもobjectを返しエラーのみ出力する.
 * (アップデート時, 古いデータがleftされる可能性がある & async storageのデータはAPIレスより安全であると判断)
 **/
export const asyncGetJson = async (
  key: string,
  typeIoTsOfResData: TypeIoTsOfResData
): Promise<Record<string, unknown> | null> => {
  try {
    const json = await AsyncStorage.getItem(key);
    if (json === null) return null;
    else {
      const obj = JSON.parse(json);
      const formattedObj = deepCvtKeyFromSnakeToCamel(obj);
      const typeIoTsResult = typeIoTsOfResData.decode(formattedObj);

      if (isRight(typeIoTsResult)) {
        return formattedObj;
      } else {
        console.group();
        console.error(
          `Type does not match(asyncGetJson). key is "${key}". value can be found below.`
        );
        console.error({ ...formattedObj });
        console.groupEnd();
        return formattedObj;
      }
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const asyncRemoveItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
};

export const asyncRemoveAll = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.error(error);
  }
};

export const asyncStoreTalkTicketCollection = async (
  talkTicketCollection: TalkTicketCollection
): Promise<void> => {
  const _talkTicketCollection: TalkTicketCollection = deepCopy(
    talkTicketCollection,
    ["ws"]
  ) as TalkTicketCollection; // deep copy
  Object.keys(_talkTicketCollection).forEach((key) => {
    _talkTicketCollection[key].room.ws = null;
  });
  asyncStoreJson("talkTicketCollection", _talkTicketCollection);
};

type alertModalProps = {
  mainText: string;
  subText?: string;
  cancelButton?: string;
  okButton?: string;
  onPress?: () => void;
  cancelOnPress?: () => void;
};
/**
 *  @example
    alertModal({
      mainText: alertTitle,
      subText: alertText,
      cancelButton: "キャンセル",
      okButton: "送信する",
      onPress: () => {
        navigation.navigate("Home");
      },
      cancelOnPress: () => {}, // 任意. キャンセルを押した際の付加処理
    });
 */
export const alertModal = ({
  mainText,
  subText,
  cancelButton,
  okButton,
  onPress,
  cancelOnPress,
}: alertModalProps): void => {
  Alert.alert(mainText ? mainText : "", subText ? subText : "", [
    {
      text: cancelButton ? cancelButton : "キャンセル",
      onPress: cancelOnPress,
      style: "cancel",
    },
    {
      text: okButton ? okButton : "OK",
      onPress: onPress,
    },
  ]);
};

export const isString = (str: unknown): str is string => {
  return typeof str === "string" || str instanceof String;
};

export const deepCopy = (
  obj: Record<string, unknown>,
  passKeys: string[] = []
): Record<string, unknown> => {
  const r: Record<string, unknown> = {};
  for (const name in obj) {
    const a = obj[name];
    if (passKeys.includes(name)) {
      // ["ws"] そのままcopy
      r[name] = a;
    } else if (isObject(a)) {
      r[name] = deepCopy(a, passKeys);
    } else {
      r[name] = obj[name];
    }
  }
  return r;
};

export const isObject = (val: unknown): val is Record<string, unknown> => {
  return val !== null && typeof val === "object" && !Array.isArray(val);
};

/**
 * Object.keys(webSetting) >>> [url, onopen, onmessage, onclose, registerWs]
 * axios.ts同様、wsSettings.onmessageのeDataは整形済みであり型安全が保証されているためasしても構わない
 * @param wsSettings
 */
export class Ws {
  connectIntervalTime = 2000;
  wsSettings: WsSettings;
  isReconnect: boolean;
  connectInterval: NodeJS.Timeout;
  constructor(wsSettings: WsSettings) {
    this.wsSettings = wsSettings;
    this.isReconnect = false;
    this.connectInterval = setTimeout(() => {
      return void 0;
    }, 0);

    this.connect();
  }

  connect = (isReconnect = false): void => {
    const ws = new WebSocket(this.wsSettings.url);

    ws.onopen = this.wsSettings.onopen
      ? () => {
          clearTimeout(this.connectInterval);
          this.wsSettings.onopen(ws);
        }
      : () => {
          return void 0;
        };
    ws.onmessage = this.wsSettings.onmessage
      ? (e) => {
          const eData = deepCvtKeyFromSnakeToCamel(JSON.parse(e.data));
          const typeIoTsResult = this.wsSettings.typeIoTsOfResData.decode(
            eData
          );
          if (!isRight(typeIoTsResult)) {
            console.group();
            console.error(
              `Type does not match(ws onmessage). The object can be found below.`
            );
            console.error({ ...eData });
            console.groupEnd();
          }
          this.wsSettings.onmessage(eData, e, ws, isReconnect);
        }
      : (e) => {
          return e;
        };
    ws.onclose = (e) => {
      if (
        e.code === CODE.WS.UNAUTHORIZED ||
        e.code === 1000 /* 接続の正常な完了 */ ||
        typeof e.code === "undefined" /* サーバダウン */
      ) {
        // ログアウト
      } else {
        this.connectInterval = setTimeout(() => {
          if (!ws || ws.readyState == WebSocket.CLOSED) {
            this.connect(true); // isReconnect = true
          }
        }, this.connectIntervalTime);
      }
      this.wsSettings.onclose(e, ws);
    };
    this.wsSettings.registerWs && this.wsSettings.registerWs(ws);
  };
}
export const initWs = (wsSettings: WsSettings): void => {
  const connectIntervalTime = 2000;

  const connect = (isReconnect = false) => {
    const ws = new WebSocket(wsSettings.url);
    let connectInterval: NodeJS.Timeout = setTimeout(() => {
      return void 0;
    }, 0);

    ws.onopen = wsSettings.onopen
      ? () => {
          clearTimeout(connectInterval);
          wsSettings.onopen(ws);
        }
      : () => {
          return void 0;
        };
    ws.onmessage = wsSettings.onmessage
      ? (e) => {
          const eData = deepCvtKeyFromSnakeToCamel(JSON.parse(e.data));
          const typeIoTsResult = wsSettings.typeIoTsOfResData.decode(eData);
          if (!isRight(typeIoTsResult)) {
            console.group();
            console.error(
              `Type does not match(ws onmessage). The object can be found below.`
            );
            console.error({ ...eData });
            console.groupEnd();
          }
          wsSettings.onmessage(eData, e, ws, isReconnect);
        }
      : (e) => {
          return e;
        };
    ws.onclose = (e) => {
      if (e.code === CODE.WS.UNAUTHORIZED) {
        // ログアウト
      } else {
        connectInterval = setTimeout(() => {
          if (!ws || ws.readyState == WebSocket.CLOSED) {
            connect(true); // isReconnect = true
          }
        }, connectIntervalTime);
      }
      wsSettings.onclose(e, ws);
    };
    wsSettings.registerWs && wsSettings.registerWs(ws);
  };
  connect();
};

// ios環境でcloseCodeが1001で固定されてしまうため対処
export const closeWsSafely = (ws: WebSocket): void => {
  if (isObject(ws) && Object.keys(ws).length) {
    ws.onclose = (e) => {
      return e;
    };
    ws.close();
  } else {
    console.error("ws is empty object");
  }
};

/**
 * 有料Planに加入しているか判定し、加入していれば、callbackを実行。加入していなければalertTextをアラートし加入を促す。
 */
export const checkSubscribePlan = (
  profile: MeProfile,
  callback: () => void,
  alertText: string
): void => {
  if (profile.plan.key !== FREE_PLAN.productId) {
    callback();
  } else {
    Alert.alert(alertText);
  }
};

/**
 * iPhoneX系か判定
 */
export const checkiPhoneX = (Dimensions: Dimensions): boolean => {
  const { height, width } = Dimensions.get("window");
  const iPhoneX =
    Platform.OS === "ios" &&
    (height === 812 || width === 812 || height === 896 || width === 896);
  return iPhoneX;
};

type ShowToastSettings = {
  type?: "success" | "error" | "info";
  position?: "top" | "bottom";
  text1: string;
  text2?: string;
  visibilityTime?: number;
  autoHide?: boolean;
  topOffset?: number;
  bottomOffset?: number;
  onShow?: () => void;
  onHide?: () => void;
  onPress?: () => void;
};
/**
 * custom Toast.show()
 */
export const showToast = (settings: ShowToastSettings): void => {
  Toast.show({
    ...settings,
    topOffset: checkiPhoneX(Dimensions) ? 50 : 30,
  });
};

/** オブジェクトに不正なkeyが含まれていないか判定
 * @param {array} correctKeys
 * @param {Object} targetObj
 * @param {function} discoverIncorrectCallback (incorrectkey{string}) => {}
 * */
export const checkCorrectKey = (
  correctKeys: string[],
  targetObj: Record<string, unknown>,
  discoverIncorrectCallback: (incorrectkey: string) => void
): void => {
  const targetObjKeys = Object.keys(targetObj);
  targetObjKeys.forEach((targetObjKey) => {
    if (!correctKeys.includes(targetObjKey)) {
      discoverIncorrectCallback(targetObjKey);
    }
  });
};

/**
 * パスワード生成
 */
export const generatePassword = (length = 12): string => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!#$%&()-";

  const string = letters + letters.toUpperCase() + numbers + symbols;

  let password = "";
  for (let i = 0; i < length; i++) {
    password += string.charAt(Math.floor(Math.random() * string.length));
  }
  return password;
};

/**
 * 単純にobj.hasOwnProperty(key)だとESLintが怒るので
 * https://qiita.com/qoAop/items/9605de1186c4b1a79965
 */
export const hasProperty = (
  obj: Record<string, unknown>,
  key: string
): boolean => {
  return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
};

/**
 *
 * @param talkTicketJson
 */
export const isTalkTicket = (
  _talkTicket: TalkTicketJson | TalkTicket
): _talkTicket is TalkTicket => {
  return !!_talkTicket.room && "messages" in _talkTicket.room;
};

/**
 *
 * @param talkTicketJson
 */
export const isRoom = (room: Room | RoomJson): room is Room => {
  return !!room && "messages" in room;
};
