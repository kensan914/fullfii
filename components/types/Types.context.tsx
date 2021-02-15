import React from "react";
import * as t from "io-ts";

//========== Auth ==========//
export type AuthState = {
  status: AuthStatus;
  token: TokenNullable;
  signupBuffer: SignupBufferType;
  isShowSpinner: boolean;
};
export type AuthDispatch = React.Dispatch<AuthActionType>;
export type UnauthenticatedType = "Unauthenticated";
export type AuthenticatingType = "Authenticating";
export type AuthenticatedType = "Authenticated";
export type AuthStatus =
  | UnauthenticatedType
  | AuthenticatingType
  | AuthenticatedType;
export type SignupBufferType = {
  didProgressNum: number;
  worries: GenreOfWorries;
};
export type TokenNullable = string | null;
export type AuthActionType =
  | { type: "TO_PROGRESS_SIGNUP"; didProgressNum: number; isFinished: boolean }
  | { type: "SET_WORRIES_BUFFER"; worries: GenreOfWorries }
  | { type: "COMPLETE_SIGNUP"; token: string; password: string }
  | { type: "SET_TOKEN"; token: string }
  | { type: "SET_IS_SHOW_SPINNER"; value: boolean };
//========== Auth ==========//

//========== Auth io-ts ==========//
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
export const GenderIoTs = t.type({
  key: t.string,
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
export type TalkTicketKey = string;
export type TalkTicketCollection = { [talkTicketKey: string]: TalkTicket };
export type TalkTicketCollectionJson = t.TypeOf<
  typeof TalkTicketCollectionJsonIoTs
>;
export type TalkInfoJson = t.TypeOf<typeof TalkInfoJsonIoTs>;
// export type RoomJson = { type: "roomJson" } & t.TypeOf<typeof RoomJsonIoTs>;
export type RoomJson = t.TypeOf<typeof RoomJsonIoTs>;
export type RoomAdd = {
  messages: AllMessages;
  offlineMessages: OfflineMessage[];
  unreadNum: number;
  ws: WsNullable;
  isEnd: boolean;
};
// export type Room = { type: "room" } & RoomAdd & t.TypeOf<typeof RoomJsonIoTs>;
export type Room = RoomAdd & t.TypeOf<typeof RoomJsonIoTs>;
export type WsNullable = WebSocket | null;

export type AllMessage = Message | OfflineMessage | CommonMessage;
export type AllMessages = AllMessage[];
export type OfflineMessage = {
  messageId: string;
  message: string;
  isMe: boolean;
};
export type MessageJson = t.TypeOf<typeof MessageJsonIoTs>;
export type Message = {
  time: Date;
} & OfflineMessage;
export type CommonMessage = {
  messageId: string;
  message: string;
  time: Date;
  common: boolean;
};
//========== Chat ==========//

//========== Chat io-ts ==========//
export const MessageJsonIoTs = t.type({
  messageId: t.string,
  message: t.string,
  isMe: t.boolean,
  time: t.string,
});
export const RoomJsonIoTs = t.type({
  id: t.string,
  user: ProfileIoTs,
  startedAt: t.union([t.string, t.null]),
  endedAt: t.union([t.string, t.null]),
  isAlert: t.boolean,
  isTimeOut: t.boolean,
});
export const TalkStatusIoTs = t.type({
  key: t.string,
  name: t.string,
  label: t.string,
});
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
export const TalkTicketJsonIoTs = t.intersection([
  TalkTicketJsonExceptRoomIoTs,
  t.type({
    room: t.union([RoomJsonIoTs, t.null]),
  }),
]);
export const TalkInfoJsonIoTs = t.type({
  talkTickets: t.array(TalkTicketJsonIoTs),
});
export const TalkTicketCollectionJsonIoTs = t.record(
  t.string,
  TalkTicketJsonIoTs
);
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
export const WorriesResJsonIoTs = t.type({
  addedTalkTickets: t.array(TalkTicketJsonIoTs),
  removedTalkTicketKeys: t.array(t.string),
});
//========== 呼び出し順 ==========//
