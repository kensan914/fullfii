import React, { createContext, useReducer, useContext, useEffect } from "react";
import { asyncSetJson, asyncRemoveItem, cvtKeyFromSnakeToCamel, URLJoin } from "./support";
import { useAuthState } from "./authContext";
import { BASE_URL } from "../../constantsEx/env";
import authAxios from "./authAxios";


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
  worriesToSympathize: {},
  all: true,
  me: true,
  birthday: { text: "", year: 0, month: 0, day: 0, },
  age: 0,
}

const ProfileReducer = (prevState, action) => {
  switch (action.type) {
    case "SET_ALL":
      const profile = Object.assign(initProfile, cvtKeyFromSnakeToCamel(action.profile));
      asyncSetJson("profile", profile);
      return {
        ...prevState,
        profile: profile,
      };
    case "SET_PARAMS":
      return {
        ...prevState,
        profileParams:  cvtKeyFromSnakeToCamel(action.profileParams),
      };
    default:
      console.warn(`Not found "${action.type}" action.type.`);
      return;
  }
};

const ProfileStateContext = createContext({
  profile: initProfile,
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
  const token = useAuthState().token;
  const [profileState, profileDispatch] = useReducer(ProfileReducer, {
    profile: profile ? profile : initProfile,
    profileParams: null,
  });

  useEffect(() => {
    if (!profile) {
      authAxios(token)
        .get(URLJoin(BASE_URL, "me/"))
        .then(res => {
          profileDispatch({ type: "SET_ALL", profile: res.data });
        });
    }
    authAxios(token)
      .get(URLJoin(BASE_URL, "profile-params/"))
      .then(res => {
        profileDispatch({ type: "SET_PARAMS", profileParams: res.data });
      });
  }, []);

  return (
    <ProfileStateContext.Provider value={profileState}>
      <ProfileDispatchContext.Provider value={profileDispatch}>
        {children}
      </ProfileDispatchContext.Provider>
    </ProfileStateContext.Provider>
  );
};