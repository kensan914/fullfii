import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from "react-native";
import { Appearance } from 'react-native-appearance';
import { Block, Text, theme } from "galio-framework";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Hr from "../atoms/Hr";
import Icon from "../atoms/Icon";
import { getPermissionAsync, onLoad, pickImage } from '../tools/imagePicker';
import { alertModal, URLJoin } from "../tools/support";
import Avatar from "../atoms/Avatar";
import { useProfileState, useProfileDispatch } from "../contexts/ProfileContext";
import BirthdayPicker from "../atoms/BirthdayPicker";
import { requestPatchProfile } from "../../screensEx/ProfileInput";
import { useAuthState } from "../contexts/AuthContext";
import { requestTalk } from "../../screensEx/Talk";


const { width } = Dimensions.get("screen");
const ProfileHr = () => <Hr h={1} mb={5} color="#e6e6e6" />;
export const profileImageHeight = 500;
export const profileContentBR = 13;


export const ProfileTabNavigator = (props) => {
  const Tab = createMaterialTopTabNavigator();
  let consultantChildren = <></>;
  let clientChildren = <></>;
  switch (props.screen) {
    case ("Profile"):
      consultantChildren = <ConsultantProfile {...props} />;
      clientChildren = <ClientProfile {...props} />;
      break;
    case ("ProfileEditor"):
      consultantChildren = <ConsultantProfileEditor {...props} />;
      clientChildren = <ClientProfileEditor {...props} />;
      break;
    default:
      break;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabel: ({ focused, color, size }) => {
          let title;
          if (route.name === "Consultant") {
            title = "聞き手";
          } else if (route.name === "Client") {
            title = "相談者";
          }
          return (
            <Text size={size} color={color} bold >{title}</Text>
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: "#F69896",
        inactiveTintColor: "gray",
        indicatorStyle: {
          backgroundColor: "#F69896",
        },
        style: {
          backgroundColor: "white",
          borderTopColor: "silver",
          borderTopWidth: 0.5,
          shadowColor: "black",
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 6,
          shadowOpacity: 0.2,
        },
        showIcon: true,
      }}>
      <Tab.Screen name="Consultant" children={() => consultantChildren} />
      <Tab.Screen name="Client" children={() => clientChildren} />
    </Tab.Navigator>
  );
}

export const ConsultantProfile = (props) => {
  const { user } = props;
  return (
    <Block style={[styles.profileContentBottom, { paddingBottom: theme.SIZES.BASE * 5 }]}>
      <Block style={styles.profileTextBlock}>
        <Text size={16} bold style={{ marginBottom: 10 }}>自己紹介</Text>
        <Text size={14} style={{ lineHeight: 18 }}>
          {user.introduction
            ? user.introduction
            : <Text size={14} >-</Text>
          }
        </Text>
      </Block>
      <ProfileHr />

      <Catalogue title="特徴" items={user.features} />
      <ProfileHr />
      <Catalogue title="話したい悩みのジャンル" items={user.genreOfWorries} />
      <ProfileHr />
      <Catalogue title="話せる悩みの大きさ" items={user.scaleOfWorries} />
      <ProfileHr />
      <Catalogue title="共感できる悩み" items={user.worriesToSympathize} />
      <ProfileHr />
    </Block>
  );
}

export const ClientProfile = (props) => {
  const { user } = props;
  return (
    <Block style={styles.profileContentBottom}>
      <Block style={styles.profileTextBlock}>
        <Text size={16} bold style={{ marginBottom: 10 }}>プライバシーネーム</Text>
        {user.privacyName
          ? <Text size={14} style={{ lineHeight: 18 }}>{user.privacyName}</Text>
          : <Text size={14} color="darkgray" style={{ lineHeight: 18 }} >プライバシーネームは設定されていません。相談の際には、聞き手側に「{user.name}」と表示されます。</Text>
        }
      </Block>
      <ProfileHr />

      <Block style={styles.profileTextBlock}>
        <Text size={16} bold style={{ marginBottom: 10 }}>プライバシー画像</Text>
        {user.privacyImage
          ? <Block flex style={{ alignItems: "center", width: "100%" }}>
            <Avatar border size={150} image={user.privacyImage} style={styles.avatar} />
          </Block>
          : <Text size={14} color="darkgray" style={{ lineHeight: 18 }} >プライバシー画像は設定されていません。相談の際には、聞き手側にプロフィール画像が表示されます。</Text>
        }
      </Block>
    </Block>
  );
}


const editButtonRate = { content: 9, button: 1 };

export const ConsultantProfileEditor = (props) => {
  const { navigation, requestPostProfileImage } = props;
  const profileState = useProfileState();
  const authState = useAuthState();
  const profileDispatch = useProfileDispatch();
  const user = profileState.profile;

  const [isOpenBirthdayPicker, setIsOpenBirthdayPicker] = useState(false);
  const [birthday, setBirthday] = useState(user.birthday ? new Date(user.birthday.year, user.birthday.month - 1, user.birthday.day) : undefined);
  const colorScheme = Appearance.getColorScheme();

  const [canSubmit, setCanSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const submit = () => {
    setIsLoading(true);
    requestPatchProfile(authState.token, { "birthday": `${birthday.getFullYear()}-${birthday.getMonth() + 1}-${birthday.getDate()}` }, profileDispatch, () => {
      setIsOpenBirthdayPicker(false);
      setIsLoading(false);
    }, (err) => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    // set canSubmit
    const prevBirthday = user.birthday;
    if (prevBirthday.year !== birthday.getFullYear() || prevBirthday.month - 1 !== birthday.getMonth() || prevBirthday.day !== birthday.getDate()) {
      setCanSubmit(true);
    }
    else setCanSubmit(false);
  }, [birthday]);

  return (
    <ScrollView style={{ width: width, backgroundColor: "white" }}>
      <Block style={[styles.profileContentBottom]}>
        <Block style={styles.profileTextBlock}>
          <Text size={16} bold style={{ marginBottom: 10 }}>ユーザネーム</Text>
          <EditorBlock onPress={() => navigation.navigate("ProfileInput", { user: user, prevValue: user.name, screen: "InputName" })} content={
            <Text size={14} style={{ lineHeight: 18, flex: editButtonRate.content }}>{user.name}</Text>
          } />
        </Block>
        <ProfileHr />

        <Block style={styles.profileTextBlock}>
          <Text size={16} bold style={{ marginBottom: 10 }}>プロフィール画像</Text>
          <EditorBlock onPress={async () => {
            const result = await getPermissionAsync();
            if (result) {
              onLoad();
              pickImage().then((image) => {
                if (image) {
                  setIsLoadingImage(true);
                  requestPostProfileImage(authState.token, image, profileDispatch, () => {
                    setIsLoadingImage(false);
                  }, (err) => {
                    setIsLoadingImage(false);
                  });
                }
              });
            }
          }} content={
            <Block flex style={{ alignItems: "center", width: "100%", flex: editButtonRate.content }}>
              <Avatar border size={150} image={user.image} style={styles.avatar} />
            </Block>
          } isImage isLoadingImage={isLoadingImage} />
        </Block>
        <ProfileHr />

        <Block style={styles.profileTextBlock}>
          <Text size={16} bold style={{ marginBottom: 10 }}>生年月日</Text>
          <EditorBlock onPress={() => setIsOpenBirthdayPicker(true)} content={
            <Text size={14} style={{ lineHeight: 18, flex: editButtonRate.content }}>{user.birthday.text}</Text>
          } />
          <BirthdayPicker birthday={birthday} setBirthday={setBirthday} isOpen={isOpenBirthdayPicker} setIsOpen={setIsOpenBirthdayPicker} colorScheme={colorScheme}
            submit={submit} canSubmit={canSubmit} isLoading={isLoading} />
        </Block>
        <ProfileHr />

        <Block style={styles.profileTextBlock}>
          <Text size={16} bold style={{ marginBottom: 10 }}>自己紹介</Text>
          <EditorBlock onPress={() => navigation.navigate("ProfileInput", { user: user, prevValue: user.introduction, screen: "InputIntroduction" })} content={
            <Text size={14} style={{ lineHeight: 18, flex: editButtonRate.content }}>
              {user.introduction
                ? user.introduction
                : <Text size={14} >-</Text>
              }
            </Text>
          } />
        </Block>
        <ProfileHr />

        <Catalogue title="特徴" items={user.features} isEditor onPress={() => navigation.navigate("ProfileInput", { user: user, prevValue: user.features, screen: "InputFeature" })} />
        <ProfileHr />
        <Catalogue title="話したい悩みのジャンル" items={user.genreOfWorries} isEditor onPress={() => navigation.navigate("ProfileInput", { user: user, prevValue: user.genreOfWorries, screen: "InputGenreOfWorries" })} />
        <ProfileHr />
        <Catalogue title="話せる悩みの大きさ" items={user.scaleOfWorries} isEditor onPress={() => navigation.navigate("ProfileInput", { user: user, prevValue: user.scaleOfWorries, screen: "InputScaleOfWorries" })} />
        <ProfileHr />
        <Catalogue title="共感できる悩み" items={user.worriesToSympathize} isEditor onPress={() => navigation.navigate("ProfileInput", { user: user, prevValue: user.worriesToSympathize, screen: "InputWorriesToSympathize" })} />
      </Block >
    </ScrollView>
  );
}

export const ClientProfileEditor = (props) => {
  const { user, navigation } = props;
  const pickPrivacyImage = async () => {
    const result = await getPermissionAsync();
    if (result) {
      onLoad();
      pickImage().then((image) => {
        console.log(image);
      });
    }
  }
  return (
    <ScrollView style={{ width: width, backgroundColor: "white" }}>
      <Block style={styles.profileContentBottom}>
        <Block style={styles.profileTextBlock}>
          <Text size={16} bold style={{ marginBottom: 10 }}>プライバシーネーム</Text>
          <EditorBlock onPress={() => navigation.navigate("ProfileInput", { user: user, prevValue: user.privacyName, screen: "InputPrivacyName" })} content={
            user.privacyName
              ? <Text size={14} style={{ lineHeight: 18, flex: editButtonRate.content }}>{user.privacyName}</Text>
              : <Text size={14} color="darkgray" style={{ lineHeight: 18, flex: editButtonRate.content }} >プライバシーネームは設定されていません。相談の際には、聞き手側に「{user.name}」と表示されます。</Text>
          } />
        </Block>
        <ProfileHr />

        <Block style={styles.profileTextBlock}>
          <Text size={16} bold style={{ marginBottom: 10 }}>プライバシー画像</Text>

          {user.privacyImage
            ? <EditorBlock onPress={pickPrivacyImage} content={
              <Block flex style={{ alignItems: "center", width: "100%", flex: editButtonRate.content }}>
                <Avatar border size={150} image={user.privacyImage} style={styles.avatar} />
              </Block>
            } isImage />
            : <EditorBlock onPress={pickPrivacyImage} content={
              <Text size={14} color="darkgray" style={{ lineHeight: 18, flex: editButtonRate.content }} >プライバシー画像は設定されていません。相談の際には、聞き手側にプロフィール画像が表示されます。</Text>
            } />
          }
        </Block>
      </Block>
    </ScrollView>
  );
}

const EditorBlock = (props) => {
  const { onPress, content, isImage, isLoadingImage } = props;
  return (
    isImage
      ? <TouchableOpacity onPress={onPress} style={{ flex: 1, width: "100%" }}>
        {content}
        <Block style={{ position: "absolute", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
          {isLoadingImage
            ? <ActivityIndicator size="large" color="white" />
            : <Icon name="camera" family="font-awesome" color="white" size={40} />
          }
        </Block>
      </TouchableOpacity>
      : <TouchableOpacity onPress={onPress} style={{ flex: 1, flexDirection: "row" }}>
        {content}
        <Block flex={editButtonRate.button} style={{ alignItems: "center", justifyContent: "center" }}>
          <Icon name="angle-right" family="font-awesome" color="gray" size={22} />
        </Block>
      </TouchableOpacity>
  );
}

export const Catalogue = (props) => {
  const { title, items, isEditor, onPress } = props;
  // const contentlist = Object.values(items);
  const content = items.length > 0
    ? items.map((item, index) => (
      <Block middle style={styles.catalogueItem} key={item.key}>
        <Text size={16} color="white">{item.label}</Text>
      </Block>
    ))
    : <Text size={14} >-</Text>

  return (
    <Block style={styles.profileTextBlock}>
      <Text size={16} bold style={{ marginBottom: 10 }}>{title}</Text>
      {isEditor
        ? <EditorBlock onPress={onPress} content={
          <Block style={{ flex: editButtonRate.content }}>
            <Block row style={{ flexWrap: "wrap" }}>{content}</Block>
          </Block>} />
        : <Block row style={{ flexWrap: "wrap" }}>{content}</Block>}
    </Block>
  );
}

export const sendTalkRequest = (user, navigation, token, chatDispatch) => {
  let alertTitle;
  let alertText;
  switch (user.status.key) {
    case "online":
      alertTitle = `${user.name}さんにリクエストを送ります。`;
      alertText = "";
      break;
    case "offline":
      alertTitle = `${user.name}さんは現在オフラインです。`;
      alertText = "リクエストが承諾される可能性が低いです。";
      break;
    case "talking":
      alertTitle = `${user.name}さんは現在誰かとトーク中です。`;
      alertText = "リクエストが承諾される可能性が低いです。";
      break;
    default:
      break;
  }
  alertModal({
    mainText: alertTitle,
    subText: alertText,
    cancelButton: "キャンセル",
    okButton: "送信する",
    onPress: () => {
      requestTalk(user, token, chatDispatch);
      navigation.navigate("Home");
    },
  });
}

const styles = StyleSheet.create({
  catalogueItem: {
    paddingHorizontal: 6,
    marginRight: theme.SIZES.BASE / 2,
    marginBottom: theme.SIZES.BASE / 2,
    borderRadius: 12,
    height: 24,
    backgroundColor: "#F69896",
  },
  profileWrapper: {
    marginTop: profileImageHeight,
    position: "relative",
  },
  profileContentBottom: {
    paddingHorizontal: theme.SIZES.BASE,
    paddingTop: 10,
    paddingBottom: theme.SIZES.BASE * 3,
    backgroundColor: "white",
    height: "100%",
  },
  profileTextBlock: {
    paddingVertical: 16,
    alignItems: "baseline",
  },
  avatar: {
    // marginLeft: 5,
    // marginTop: 5,
  },
});