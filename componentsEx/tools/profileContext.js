import React, { createContext, useReducer, useContext } from "react";
import { asyncSetJson, cvtKeyFromSnakeToCamel } from "./support";


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
      /** profileをset
       * @param {Object} action [type, profile] */

      const profile = Object.assign(initProfile, cvtKeyFromSnakeToCamel(action.profile));
      asyncSetJson("profile", profile);
      return {
        ...prevState,
        profile: profile,
      };
    case "SET_PARAMS":
      /** profileParamsをset
       * @param {Object} action [type, profileParams] */
      
      return {
        ...prevState,
        profileParams: cvtKeyFromSnakeToCamel(action.profileParams),
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
  const [profileState, profileDispatch] = useReducer(ProfileReducer, {
    profile: profile ? profile : initProfile,
    profileParams: null,
  });

  return (
    <ProfileStateContext.Provider value={profileState}>
      <ProfileDispatchContext.Provider value={profileDispatch}>
        {children}
      </ProfileDispatchContext.Provider>
    </ProfileStateContext.Provider>
  );
};