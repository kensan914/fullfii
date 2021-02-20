import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import { Linking } from "expo";
import { alertModal } from "./support";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";

export const getPermissionAsync = async (): Promise<boolean> => {
  if (Constants?.platform?.ios) {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (status !== "granted") {
      alertModal({
        mainText: "写真への許可が無効になっています",
        subText: "設定画面へ移動しますか？",
        cancelButton: "キャンセル",
        okButton: "設定する",
        onPress: () => {
          Linking.openURL("app-settings:");
        },
      });
      return false;
    } else return true;
  } else return false;
};

export const pickImage = async (): Promise<ImageInfo | undefined> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });
  if (!result.cancelled) {
    return result;
  }
};
