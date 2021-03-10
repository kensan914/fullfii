import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AxiosError, AxiosResponse } from "axios";
import { GestureResponderEvent } from "react-native";
import * as t from "io-ts";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import { Asset } from "expo-asset";

import {
  GenderKey,
  MeProfile,
  MeProfileIoTs,
  MessageJsonIoTs,
  ProfileDispatch,
  TalkTicketJsonIoTs,
  TalkTicketKey,
} from "./Types.context";

//--------- App.tsx ---------//
export type Assets = { [key: string]: Asset };
//--------- App.tsx ---------//

//--------- Screens.tsx ---------//
export type RootStackParamList = {
  Home: undefined;
  WorrySelect: undefined;
  ProfileEditor: undefined;
  ProfileInput: {
    screen: ProfileInputScreen;
    prevValue: unknown;
    user: MeProfile;
  };
  Chat: { talkTicketKey: TalkTicketKey };
  Settings: undefined;
  Authenticated: undefined;
  SignUp: undefined;
};
export type ChatRouteProp = RouteProp<RootStackParamList, "Chat">;
export type ProfileInputRouteProp = RouteProp<
  RootStackParamList,
  "ProfileInput"
>;
export type HomeNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;
export type ProfileEditorNavigationPros = StackNavigationProp<
  RootStackParamList,
  "ProfileEditor"
>;
export type ProfileInputNavigationProps = StackNavigationProp<
  RootStackParamList,
  "ProfileInput"
>;
export type WorrySelectNavigationProps = StackNavigationProp<
  RootStackParamList,
  "WorrySelect"
>;

export type ProfileInputScreen =
  | "InputName"
  | "InputGender"
  | "InputIntroduction";
//--------- Screens.tsx ---------//

//--------- Home.tsx ---------//
export type HomeRooms = {
  title: string;
  color: string;
  content: string;
  onPress: () => void;
  countNum: number;
}[];
export type HomeFirstItem = {
  icon: string;
  iconFamily: string;
  iconColor: string;
  color: string;
  borderLess: boolean;
  onPress: () => void;
};
export type HomeItems = [HomeFirstItem, ...HomeRooms];
//--------- Home.tsx ---------//

//--------- HomeTemplate.tsx ---------//
//--------- HomeTemplate.tsx ---------//

//--------- ProfileInput.tsx ---------//
export type SuccessSubmitProfile = () => void;
export type ErrorSubmitProfile = (err: AxiosError) => void;
export type ProfileInputData = { [key: string]: unknown };
export type RequestPatchProfile = (
  token: string,
  data: ProfileInputData,
  profileDispatch: ProfileDispatch,
  successSubmit?: SuccessSubmitProfile,
  errorSubmit?: ErrorSubmitProfile,
  finallySubmit?: () => void
) => void;
export type RequestPutGender = (
  token: string,
  putGenderKey: FormattedGenderKey,
  profileDispatch: ProfileDispatch,
  successSubmit?: SuccessSubmitProfile,
  errorSubmit?: ErrorSubmitProfile
) => void;
export type FormattedGenderKey = "female" | "male" | "secret";
export type FormattedGender = {
  key: FormattedGenderKey;
  label: string;
  isNotSet: boolean;
  realGenderKey: GenderKey;
};
//--------- ProfileInput.tsx ---------//

//--------- Chat.tsx ---------//
export type AppendOfflineMessage = (
  messageId: string,
  messageText: string
) => void;
export type SendWsMessage = (
  ws: WebSocket,
  messageId: string,
  messageText: string,
  token: string
) => void;
export type AnimationObject = {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm: string;
  ddd: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assets: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  layers: any[];
};
export type LottieSource = string | AnimationObject | { uri: string };
//--------- Chat.tsx ---------//

//--------- ChatTemplate.tsx ---------//
export type ItemLayout = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[] | null | undefined,
  index: number
) => {
  length: number;
  offset: number;
  index: number;
};
export type OnContentSizeChange = (width: number, height: number) => void;
//--------- ChatTemplate.tsx ---------//

//--------- ProfileEditor.tsx ---------//
export type RequestPostProfileImage = (
  token: string,
  image: ImageInfo,
  profileDispatch: ProfileDispatch,
  successSubmit: () => void,
  errorSubmit: (err?: AxiosError) => void
) => void;
//--------- ProfileEditor.tsx ---------//

//--------- useSlideView.tsx ---------//
export type GoToPage = (toPageNum: number) => void;
//--------- useSlideView.tsx ---------//

//--------- useAdMobInterstitial.tsx ---------//
export type ShowAdMobInterstitial = () => boolean;
//--------- useAdMobInterstitial.tsx ---------//

//--------- BubbleList.tsx ---------//
export type PressBubble = (key: TalkTicketKey) => void;
export type BubbleItem = { key: string; label: string };
export type BubbleItems = BubbleItem[];
//--------- BubbleList.tsx ---------//

//--------- axios ---------//
export type AxiosMethod = "get" | "post" | "delete" | "put" | "patch";
export type AxiosHeaders = {
  Accept?: string;
  "Content-Type"?: string;
  Authorization?: string;
};
export type AxiosSettings = {
  url: string;
  method: AxiosMethod;
  headers?: AxiosHeaders;
  data?: unknown;
};

export type UseAxiosActionType = RequestAxiosActionType & {
  data?: unknown;
  didRequestCallback?: () => void;
  shouldRequestDidMount?: boolean;
  limitRequest?: number;
};
export type AxiosReActionType = {
  url?: string;
  data?: unknown;
};
export type Request = (reAction?: AxiosReActionType | null) => void;
export type UseAxiosReturn = {
  isLoading: boolean;
  resData: unknown;
  request: Request;
};
export type TypeIoTsOfResData =
  /* eslint-disable @typescript-eslint/no-explicit-any */
  t.TypeC<any> | t.RecordC<any, any> | t.UnionC<any> | t.IntersectionC<any>;
/* eslint-enable @typescript-eslint/no-explicit-any */
export type UseAxios = (
  url: string,
  method: AxiosMethod,
  typeIoTsOfResData: TypeIoTsOfResData | null,
  action: UseAxiosActionType
) => UseAxiosReturn;

export type RequestAxiosActionType = {
  data?: unknown;
  thenCallback?: (resData: unknown, res: AxiosResponse) => void;
  catchCallback?: (err?: AxiosError) => void;
  finallyCallback?: () => void;
  token?: string;
  headers?: { [key: string]: string };
};
export type RequestAxios = (
  url: string,
  method: AxiosMethod,
  typeIoTsOfResData: TypeIoTsOfResData | null,
  action: RequestAxiosActionType
) => void;
//--------- axios ---------//

//--------- axios res.data ---------//
export type SignupResData = t.TypeOf<typeof SignupResDataIoTs>;
export const SignupResDataIoTs = t.type({
  me: MeProfileIoTs,
  token: t.string,
});
export type PutGenderResData = t.TypeOf<typeof PutGenderResDataIoTs>;
export const PutGenderResDataIoTs = t.type({
  me: MeProfileIoTs,
});
//--------- axios res.data ---------//

//--------- ws ---------//
export type WsSettings = {
  url: string;
  onopen: (ws: WebSocket) => void;
  onmessage: (
    eData: unknown,
    e: WebSocketMessageEvent,
    ws: WebSocket,
    isReconnect: boolean
  ) => void;
  onclose: (e: WebSocketCloseEvent, ws: WebSocket) => void;
  typeIoTsOfResData: TypeIoTsOfResData;
  registerWs?: (ws: WebSocket) => void;
};
export type WsResNotification = t.TypeOf<typeof WsResNotificationIoTs>;
export type WsResChat = t.TypeOf<typeof WsResChatIoTs>;
//--------- ws ---------//

//--------- ws io-ts ---------//
export const WsResNotificationAuthIoTs = t.type({
  type: t.literal("auth"),
  // profile: MeProfileIoTs,
});
export const WsResNoticeTalkIoTs = t.type({
  type: t.literal("notice_talk"),
  roomId: t.string,
  status: t.union([t.literal("start"), t.literal("end")]),
  talkTicket: TalkTicketJsonIoTs,
});
export const WsResNotificationIoTs = t.union([
  WsResNotificationAuthIoTs,
  WsResNoticeTalkIoTs,
]);

export const WsResChatAuthIoTs = t.type({
  type: t.literal("auth"),
  roomId: t.string,
  // targetUser: ProfileIoTs,
  // profile: MeProfileIoTs,
});
export const WsResChatMessageIoTs = t.type({
  type: t.literal("chat_message"),
  roomId: t.string,
  message: MessageJsonIoTs,
});
export const WsResMultiChatMessagesIoTs = t.type({
  type: t.literal("multi_chat_messages"),
  roomId: t.string,
  messages: t.array(MessageJsonIoTs),
});
export const WsResEndTalkAlertIoTs = t.type({
  type: t.literal("end_talk_alert"),
  profile: MeProfileIoTs,
});
export const WsResEndTalkTimeOutIoTs = t.type({
  type: t.literal("end_talk_time_out"),
  profile: MeProfileIoTs,
});
export const WsResEndTalkIoTs = t.type({
  type: t.literal("end_talk"),
  profile: MeProfileIoTs,
});
export const WsResErrorIoTs = t.intersection([
  t.type({
    type: t.literal("error"),
    errorType: t.string,
  }),
  t.partial({
    message: t.string,
  }),
]);
export const WsResChatIoTs = t.union([
  WsResChatAuthIoTs,
  WsResChatMessageIoTs,
  WsResMultiChatMessagesIoTs,
  WsResEndTalkAlertIoTs,
  WsResEndTalkTimeOutIoTs,
  WsResEndTalkIoTs,
  WsResErrorIoTs,
]);
//--------- ws io-ts ---------//

//--------- support ---------//
//--------- support ---------//

//--------- Utils ---------//
export type OnPress = (event: GestureResponderEvent) => void;
//--------- Utils ---------//
