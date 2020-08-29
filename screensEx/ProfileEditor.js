import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import { ProfileTabNavigator } from '../componentsEx/organisms/Profile';


const ProfileEditor = (props) => {
  const { user } = props.route.params;
  const { navigation } = props;

  return (
    <ProfileTabNavigator user={user} screen="ProfileEditor" navigation={navigation} />
  );
}

export default withNavigation(ProfileEditor);