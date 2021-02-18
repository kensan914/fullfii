import React from "react";
import * as t from "io-ts";
import { either } from "fp-ts/lib/Either";

//========== Auth ==========//
export type AuthState = {
  status: AuthStatus;
  token: TokenNullable;
  signupBuffer: SignupBuffer;
  isShowSpinner: boolean;
};
export type AuthDispatch = React.Dispatch<AuthActionType>;
export type UnauthenticatedType = t.TypeOf<typeof UnauthenticatedTypeIoTs>;
export type AuthenticatingType = t.TypeOf<typeof AuthenticatingTypeIoTs>;
export type AuthenticatedType = t.TypeOf<typeof AuthenticatedTypeIoTs>;
export type AuthStatus = t.TypeOf<typeof AuthStatusIoTs>;
export type AuthStatusNullable = AuthStatus | null;
export type SignupBuffer = t.TypeOf<typeof SignupBufferIoTs>;
export type TokenNullable = string | null;
export type AuthActionType =
  | { type: "TO_PROGRESS_SIGNUP"; didProgressNum: number; isFinished: boolean }
  | { type: "SET_WORRIES_BUFFER"; worries: GenreOfWorries }
  | { type: "COMPLETE_SIGNUP"; token: string; password: string }
  | { type: "SET_TOKEN"; token: string }
  | { type: "SET_IS_SHOW_SPINNER"; value: boolean };
//========== Auth ==========//

//========== Auth io-ts ==========//
export const UnauthenticatedTypeIoTs = t.literal("Unauthenticated");
export const AuthenticatingTypeIoTs = t.literal("Authenticating");
export const AuthenticatedTypeIoTs = t.literal("Authenticated");
export const AuthStatusIoTs = t.union([
  UnauthenticatedTypeIoTs,
  AuthenticatingTypeIoTs,
  AuthenticatedTypeIoTs,
]);
//========== Auth io-ts ==========//

//========== Profile ==========//
export type ProfileState = {
  profile: MeProfile;
  profileParams: ProfileParams | null;
};
export type ProfileDispatch = React.Dispatch<ProfileActionType>;
export type ProfileActionType =
  | { type: "SET_ALL"; profile: MeProfile }
  | { type: "SET_PARAMS"; profileParams: ProfileParams }
  | { type: "RESET" };

export type Plan = t.TypeOf<typeof PlanIoTs>;
export type GenderKey = t.TypeOf<typeof GenderKeyIoTs>;
export type Gender = t.TypeOf<typeof GenderIoTs>;
export type Genders = t.TypeOf<typeof GendersIoTs>;
export type GenreOfWorry = t.TypeOf<typeof GenreOfWorryIoTs>;
export type GenreOfWorries = t.TypeOf<typeof GenreOfWorriesIoTs>;
export type GenreOfWorriesCollection = t.TypeOf<
  typeof GenreOfWorriesCollectionIoTs
>;
export type Job = t.TypeOf<typeof JobIoTs>;
export type Jobs = t.TypeOf<typeof JobsIoTs>;
export type ProfileParams = t.TypeOf<typeof ProfileParamsIoTs>;
export type MeProfile = t.TypeOf<typeof MeProfileIoTs>;
export type Profile = t.TypeOf<typeof ProfileIoTs>;

export type WorriesResJson = t.TypeOf<typeof WorriesResJsonIoTs>;
//========== Profile ==========//

//========== Profile io-ts ==========//
export const GenderKeyIoTs = t.keyof({
  female: null,
  male: null,
  secret: null,
});
export const GenderIoTs = t.type({
  key: GenderKeyIoTs,
  name: t.string,
  label: t.string,
});
export const GendersIoTs = t.record(t.string, GenderIoTs);
export const GenreOfWorryIoTs = t.type({
  key: t.string,
  value: t.string,
  label: t.string,
});
export const GenreOfWorriesIoTs = t.array(GenreOfWorryIoTs);
export const GenreOfWorriesCollectionIoTs = t.record(
  t.string,
  GenreOfWorryIoTs
);
export const JobIoTs = t.type({
  key: t.string,
  name: t.string,
  label: t.string,
});
export const JobsIoTs = t.record(t.string, JobIoTs);
export const ProfileParamsIoTs = t.type({
  gender: GendersIoTs,
  genreOfWorries: GenreOfWorriesCollectionIoTs,
  job: JobsIoTs,
});

export const PlanIoTs = t.type({
  key: t.string,
  label: t.string,
});
export const ProfileIoTs = t.type({
  id: t.string,
  name: t.string,
  gender: GenderIoTs,
  job: JobIoTs,
  introduction: t.string,
  numOfThunks: t.number,
  genreOfWorries: GenreOfWorriesIoTs,
  image: t.union([t.string, t.null]),
  me: t.boolean,
});
export const MeProfileIoTs = t.intersection([
  t.type({
    dateJoined: t.string,
    plan: PlanIoTs,
    canTalkHeterosexual: t.boolean,
  }),
  ProfileIoTs,
]);

//========== Profile io-ts ==========//

//========== Chat ==========//
export type ChatState = {
  totalUnreadNum: TotalUnreadNum;
  talkTicketCollection: TalkTicketCollection;
};
export type ChatDispatch = React.Dispatch<ChatActionType>;
export type ChatActionType =
  | {
      type: "UPDATE_TALK_TICKETS";
      talkTickets: (TalkTicket | TalkTicketJson)[];
    }
  | { type: "START_TALK"; talkTicketKey: TalkTicketKey; ws: WebSocket }
  | { type: "RESTART_TALK"; talkTicketKey: TalkTicketKey; ws: WebSocket }
  | { type: "RESTART_TALK_ONLY_MESSAGE"; talkTicketKey: TalkTicketKey }
  | { type: "RECONNECT_TALK"; talkTicketKey: TalkTicketKey; ws: WebSocket }
  | {
      type: "APPEND_MESSAGE";
      talkTicketKey: TalkTicketKey;
      messageId: string;
      message: string;
      isMe: boolean;
      time: Date | string;
      token: string;
    }
  | {
      type: "DELETE_OFFLINE_MESSAGE";
      talkTicketKey: TalkTicketKey;
      messageId: string;
    }
  | {
      type: "MERGE_MESSAGES";
      talkTicketKey: TalkTicketKey;
      messages: MessageJson[];
      token: string;
    }
  | {
      type: "APPEND_COMMON_MESSAGE";
      talkTicketKey: TalkTicketKey;
      alert: boolean;
    }
  | { type: "END_TALK"; talkTicketKey: TalkTicketKey; timeOut?: boolean }
  | {
      type: "APPEND_OFFLINE_MESSAGE";
      talkTicketKey: TalkTicketKey;
      messageId: string;
      messageText: string;
    }
  | { type: "READ_BY_ROOM"; talkTicketKey: TalkTicketKey }
  | { type: "OVERWRITE_TALK_TICKET"; talkTicket: TalkTicket | TalkTicketJson }
  | { type: "REMOVE_TALK_TICKETS"; talkTicketKeys: TalkTicketKey[] };

export type TotalUnreadNum = number;
export type TalkStatus = t.TypeOf<typeof TalkStatusIoTs>;
export type TalkTicket = t.TypeOf<typeof TalkTicketJsonExceptRoomIoTs> & {
  room: Room;
};
export type TalkTicketJson = t.TypeOf<typeof TalkTicketJsonIoTs>;
export type TalkTicketKey = t.TypeOf<typeof TalkTicketKeyIoTs>;
export type TalkTicketCollection = { [talkTicketKey: string]: TalkTicket };
export type TalkTicketCollectionJson = t.TypeOf<
  typeof TalkTicketCollectionJsonIoTs
>;
export type TalkTicketCollectionAsync = t.TypeOf<
  typeof TalkTicketCollectionAsyncIoTs
>;
export type TalkInfoJson = t.TypeOf<typeof TalkInfoJsonIoTs>;
export type RoomJson = t.TypeOf<typeof RoomJsonIoTs>;
export type RoomAdd = {
  messages: AllMessages;
  offlineMessages: OfflineMessage[];
  unreadNum: number;
  ws: WsNullable;
  isEnd: boolean;
};
/** RoomAsyncとの違い: wsのtypeがWsNullable */
export type Room = RoomAdd & RoomJson;
/** Roomとの違い: wsのtypeがnull */
export type RoomAsync = t.TypeOf<typeof RoomAsyncIoTs>;
export type WsNullable = WebSocket | null;

export type OfflineMessage = t.TypeOf<typeof OfflineMessageIoTs>;
export type Message = t.TypeOf<typeof MessageIoTs>;
export type MessageJson = t.TypeOf<typeof MessageJsonIoTs>;
export type CommonMessage = t.TypeOf<typeof CommonMessageIoTs>;
export type AllMessage = t.TypeOf<typeof AllMessageIoTs>;
export type AllMessages = t.TypeOf<typeof AllMessagesIoTs>;
//========== Chat ==========//

//========== Chat io-ts ==========//
/** https://github.com/gcanti/io-ts/blob/master/index.md */
export const DateType = new t.Type<Date, string, unknown>(
  "DateFromString",
  (u): u is Date => u instanceof Date,
  (u, c) =>
    either.chain(t.string.validate(u, c), (s) => {
      const d = new Date(s);
      return isNaN(d.getTime()) ? t.failure(u, c) : t.success(d);
    }),
  (a) => a.toISOString()
);
export const OfflineMessageIoTs = t.type({
  messageId: t.string,
  message: t.string,
  isMe: t.boolean,
});
export const MessageIoTs = t.intersection([
  OfflineMessageIoTs,
  t.type({
    time: DateType,
  }),
]);
export const MessageJsonIoTs = t.intersection([
  OfflineMessageIoTs,
  t.type({
    time: t.string,
  }),
]);
export const CommonMessageIoTs = t.type({
  messageId: t.string,
  message: t.string,
  time: DateType,
  common: t.boolean,
});
export const AllMessageIoTs = t.union([
  OfflineMessageIoTs,
  MessageIoTs,
  CommonMessageIoTs,
]);
export const AllMessagesIoTs = t.array(AllMessageIoTs);

export const RoomJsonIoTs = t.type({
  id: t.string,
  user: ProfileIoTs,
  startedAt: t.union([t.string, t.null]),
  endedAt: t.union([t.string, t.null]),
  isAlert: t.boolean,
  isTimeOut: t.boolean,
});
export const RoomAddJsonIoTs = t.type({
  messages: AllMessagesIoTs,
  offlineMessages: t.array(OfflineMessageIoTs),
  unreadNum: t.number,
  ws: t.null,
  isEnd: t.boolean,
});
export const RoomAsyncIoTs = t.intersection([RoomAddJsonIoTs, RoomJsonIoTs]);

export const TalkStatusIoTs = t.type({
  key: t.string,
  name: t.string,
  label: t.string,
});
export const TalkTicketKeyIoTs = t.string;
const TalkTicketJsonExceptRoomIoTs = t.type({
  id: t.string,
  owner: MeProfileIoTs,
  worry: GenreOfWorryIoTs,
  isSpeaker: t.boolean,
  status: TalkStatusIoTs,
  waitStartTime: t.string,
  canTalkHeterosexual: t.boolean,
  canTalkDifferentJob: t.boolean,
});
/** TalkTicketAsyncIoTsとの違い: roomがnullable & roomJson */
export const TalkTicketJsonIoTs = t.intersection([
  TalkTicketJsonExceptRoomIoTs,
  t.type({
    room: t.union([RoomJsonIoTs, t.null]),
  }),
]);
/** TalkTicketJsonIoTsとの違い: roomのwsのみがnull */
export const TalkTicketAsyncIoTs = t.intersection([
  TalkTicketJsonExceptRoomIoTs,
  t.type({
    room: RoomAsyncIoTs,
  }),
]);
/** TalkTicketCollectionAsyncIoTsとの違い: roomがnullable & roomJson */
export const TalkTicketCollectionJsonIoTs = t.record(
  t.string,
  TalkTicketJsonIoTs
);
/** TalkTicketCollectionJsonIoTsとの違い: roomのwsのみがnull */
export const TalkTicketCollectionAsyncIoTs = t.record(
  t.string,
  TalkTicketAsyncIoTs
);
export const TalkInfoJsonIoTs = t.type({
  talkTickets: t.array(TalkTicketJsonIoTs),
});
//========== Chat io-ts ==========//

//========== ContextUtils ==========//
export type States = {
  authState: AuthState;
  profileState: ProfileState;
  chatState: ChatState;
};
export type Dispatches = {
  authDispatch: AuthDispatch;
  profileDispatch: ProfileDispatch;
  chatDispatch: ChatDispatch;
};
//========== ContextsUtils ==========//

//========== 呼び出し順 ==========//
export const SignupBufferIoTs = t.type({
  didProgressNum: t.number,
  worries: GenreOfWorriesIoTs,
});
export const WorriesResJsonIoTs = t.type({
  addedTalkTickets: t.array(TalkTicketJsonIoTs),
  removedTalkTicketKeys: t.array(TalkTicketKeyIoTs),
});
//========== 呼び出し順 ==========//
