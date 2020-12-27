import analytics from "@react-native-firebase/analytics";


export const logEvent = async (name, params) => {
    await analytics().logEvent(name, params);
}