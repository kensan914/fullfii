import React, { createContext, useReducer, useContext, useEffect } from "react";
import { BASE_URL } from "../../constants/env";
import { useAxios } from "../modules/axios";
import { asyncStoreJson, cvtKeyFromSnakeToCamel, URLJoin } from "../modules/support";


// イントロステップの完了状態
// const initIntroStep = {
//   1: true,
//   2: true,
//   3: true,
//   4: true,
// };
// Object.freeze(initIntroStep);

const initProfile = {
  id: 0,
  name: "",
  image: "",
  status: { key: "", title: "" },
  age: 0,
  numOfThunks: 0,
  plan: { key: "", title: "" }, // or {key: "pro", title: "PRO"}
  introduction: "",
  features: {},
  genreOfWorries: {},
  scaleOfWorries: {},
  all: true,
  me: true,
  birthday: { text: "", year: 0, month: 0, day: 0, },
  age: 0,
  // introStep: { ...initIntroStep },
}
Object.freeze(initProfile);


const ProfileReducer = (prevState, action) => {
  let _profile;
  switch (action.type) {
    case "SET_ALL":
      /** profileをset
       * @param {Object} action [type, profile] */

      _profile = { ...initProfile, ...cvtKeyFromSnakeToCamel(action.profile) }
      asyncStoreJson("profile", _profile);
      return {
        ...prevState,
        profile: _profile,
      };

    case "SET_PARAMS":
      /** profileParamsをset
       * @param {Object} action [type, profileParams] */

      return {
        ...prevState,
        profileParams: cvtKeyFromSnakeToCamel(action.profileParams),
      };

    case "RESET":
      /** リセット wsの切断
       * @param {Object} action [type] */

      return {
        ...prevState,
        profile: { ...initProfile },
        profileParams: null,
      };

    // case "TAKE_INTRO_STEP":
    //   /** ステップを一つ完了
    //    * @param {Object} action [type, stepNum, requestPatchIntroStep] */

    //   _profile = Object.assign({}, prevState.profile);
    //   _profile.introStep[action.stepNum] = true;
    //   asyncStoreJson("profile", _profile);
    //   action.requestPatchIntroStep(_profile.introStep);

    //   return {
    //     ...prevState,
    //     profile: _profile,
    //   };

    // case "INIT_INTRO_STEP":
    //   /** introStepをfalseで初期化. サインアップ時(厳密にはサインアップ後のオプション等を入力し、Homeに切り替わる直前)に実行.
    //    * @param {Object} action [type, requestPatchIntroStep] */

    //   _profile = Object.assign({}, prevState.profile);
    //   Object.keys(_profile.introStep).forEach(elm => {
    //     _profile.introStep[elm] = false;
    //   });
    //   asyncStoreJson("profile", _profile);
    //   action.requestPatchIntroStep(_profile.introStep);

    //   return {
    //     ...prevState,
    //     profile: _profile,
    //   };

    default:
      console.warn(`Not found "${action.type}" action.type.`);
      return;
  }
};

const ProfileStateContext = createContext({
  profile: initProfile,
  profileParams: null,
});
const ProfileDispatchContext = createContext(undefined);

export const useProfileState = () => {
  const context = useContext(ProfileStateContext);
  return context;
};
export const useProfileDispatch = () => {
  const context = useContext(ProfileDispatchContext);
  return context;
};

export const ProfileProvider = ({ children, profile }) => {
  const [profileState, profileDispatch] = useReducer(ProfileReducer, {
    profile: profile ? profile : initProfile,
    profileParams: null,
  });

  // fetch profile params
  useAxios(URLJoin(BASE_URL, "profile-params/"), "get", {
    thenCallback: res => {
      profileDispatch({ type: "SET_PARAMS", profileParams: res.data });
    },
    shouldRequestDidMount: true,
  });

  useEffect(() => {
    console.log(profileState.profileParams);
  }, [profileState.profileParams]);

  return (
    <ProfileStateContext.Provider value={profileState}>
      <ProfileDispatchContext.Provider value={profileDispatch}>
        {children}
      </ProfileDispatchContext.Provider>
    </ProfileStateContext.Provider>
  );
};