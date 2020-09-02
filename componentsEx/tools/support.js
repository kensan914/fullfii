import { AsyncStorage, Alert } from "react-native";


// ex)URLJoin('http://www.google.com', 'a', undefined, '/b/cd', undifined, '?foo=123', '?bar=foo'); => 'http://www.google.com/a/b/cd/?foo=123&bar=foo' 
export const URLJoin = (...args) => {
  args = args.filter(n => n !== undefined);
  for (let i = args.length - 1; i >= 0; i--) {
    if (args[i].toString().startsWith('?')) continue;
    if (!args[i].toString().endsWith('/')) {
      args[i] += '/';
      break;
    }
  }
  return args.join('/').replace(/[\/]+/g, '/').replace(/^(.+):\//, '$1://').replace(/^file:/, 'file:/').replace(/\/(\?|&|#[^!])/g, '$1').replace(/\?/g, '&').replace('&', '?')
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

export const asyncRemoveItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
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