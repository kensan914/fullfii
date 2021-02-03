import { isExpo } from "../../../constants/env";

export const logEvent = async (name, params, profileState) => {
  if (!isExpo) {
    const module = await import("@react-native-firebase/analytics");
    const joined_params = {
      ...params,
      ...profileState ? {
        sender_gender: profileState?.profile?.gender?.label,
        sender_name: profileState?.profile?.name,
        sender_job: profileState?.profile?.job?.label,
      } : {},
    }
    await module.firebase.analytics().logEvent(name, joined_params);
  }
}