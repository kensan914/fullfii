import { AsyncStorage, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Linking } from "expo";


const PHOTO = "@photo"

export const onLoad = async () => {
  try {
    const Photo = await AsyncStorage.getItem(PHOTO);
    if (Photo) {
      const photo = JSON.parse(Photo);
      return photo;
    }
  } catch (e) {
    console.log(e)
  }
}

export const onSave = async (photo) => {
  try {
    const Photo = JSON.stringify(photo);
    await AsyncStorage.setItem(PHOTO, Photo);
  } catch (e) {
    console.log(e)
  }
}

export const getPermissionAsync = async () => {
  if (Constants.platform.ios) {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      Alert.alert(
        "写真への許可が無効になっています",
        "設定画面へ移動しますか？",
        [
          {
            text: "キャンセル",
            style: "cancel"
          },
          {
            text: "設定する",
            onPress: () => {
              Linking.openURL("app-settings:");
            }
          }
        ]
      );
      return false;
    } else return true;
  }
};

export const pickImage = async (item) => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });
  if (!result.cancelled) {
    onSave(result.uri);
    return result;
  }
};