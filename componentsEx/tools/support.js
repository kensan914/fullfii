import { AsyncStorage, Alert } from "react-native";


// ex)URLJoin("http://www.google.com", "a", undefined, "/b/cd", undefined, "?foo=123", "?bar=foo"); => "http://www.google.com/a/b/cd/?foo=123&bar=foo" 
export const URLJoin = (...args) => {
  args = args.filter(n => n !== undefined);
  for (let i = args.length - 1; i >= 0; i--) {
    if (args[i].toString().startsWith("?")) continue;
    if (!args[i].toString().endsWith("/")) {
      args[i] += "/";
      break;
    }
  }
  return args.join("/").replace(/[\/]+/g, "/").replace(/^(.+):\//, "$1://").replace(/^file:/, "file:/").replace(/\/(\?|&|#[^!])/g, "$1").replace(/\?/g, "&").replace("&", "/?")
}

export const generateUuid4 = () => {
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

export const cvtListDate = (date) => {
  const today = new Date(Date.now());
  if (today.getFullYear() === date.getFullYear()) {
    if (today.getMonth() === date.getMonth()) {
      if (today.getDate() === date.getDate()) {
        // 当日
        return fmtfromDateToStr(date, "hh:mm");
      } else if (today.getDate() - 1 === date.getDate()) {
        // 1日前
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
}

export const fmtfromDateToStr = (date, format) => {
  // fmtfromDateToStr(new Date(), "YYYY/MM/DD hh:mm:ss")
  if (!format) {
    format = "YYYY/MM/DD hh:mm:ss"
  }
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ("0" + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ("0" + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ("0" + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ("0" + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ("0" + date.getSeconds()).slice(-2));
  return format;
}

// スネークケースのobjのkeyをすべてキャメルケースに変換
export const cvtKeyFromSnakeToCamel = (obj) => {
  return (
    Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [fromSnakeToCamel(k), v])
    )
  );
}

// スネークケースのtextをキャメルケースに変換
export const fromSnakeToCamel = (text) => {
  return text.replace(/_./g, (s) => {
    return s.charAt(1).toUpperCase();
  });
}

export const cvtBadgeCount = (badgeCount) => {
  if (badgeCount <= 0) {
    return;
  } else {
    if (badgeCount > 99) {
      return "99";
    } else {
      return badgeCount.toString();
    }
  }
}

export const asyncSetItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log(error);
  }
}

export const asyncGetItem = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.log(error);
  }
}

export const asyncSetJson = async (key, value) => {
  try {
    console.log("asyncSetJson実行");
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
}

export const asyncGetJson = async (key) => {
  try {
    const json = await AsyncStorage.getItem(key);
    console.log("asyncGetJson実行");
    if (json === null) return null;
    else return JSON.parse(json);
  } catch (error) {
    console.log(error);
  }
}

export const asyncRemoveItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
}

export const asyncRemoveAll = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.log(error);
  }
}

export const alertModal = ({ mainText, subText, cancelButton, okButton, onPress }) => {
  Alert.alert(
    mainText ? mainText : "", subText ? subText : "",
    [
      {
        text: cancelButton ? cancelButton : "キャンセル",
        style: "cancel",
      },
      {
        text: okButton ? okButton : "OK",
        onPress: onPress,
      }
    ]
  );
}

export const isString = (obj) => {
  return typeof (obj) == "string" || obj instanceof String;
};