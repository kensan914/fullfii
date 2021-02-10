import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import Hr from "../atoms/Hr";
import Icon from "../atoms/Icon";
import { getPermissionAsync, onLoad, pickImage } from "../modules/imagePicker";
import Avatar from "../atoms/Avatar";
import {
  useProfileState,
  useProfileDispatch,
} from "../contexts/ProfileContext";
import { useAuthState } from "../contexts/AuthContext";

const { width } = Dimensions.get("screen");
const ProfileHr = () => <Hr h={1} mb={5} color="#e6e6e6" />;
const profileImageHeight = 500;
const editButtonRate = { content: 9, button: 1 };

export const ProfileEditorTemplate = (props) => {
  const { navigation, requestPostProfileImage } = props;
  const profileState = useProfileState();
  const authState = useAuthState();
  const profileDispatch = useProfileDispatch();
  const user = profileState.profile;

  const [isLoadingImage, setIsLoadingImage] = useState(false);

  return (
    <ScrollView style={{ width: width, backgroundColor: "white" }}>
      <Block style={[styles.profileContentBottom]}>
        <Block style={styles.profileTextBlock}>
          <Text size={16} bold style={{ marginBottom: 10 }}>
            ユーザネーム
          </Text>
          <EditorBlock
            onPress={() =>
              navigation.navigate("ProfileInput", {
                user: user,
                prevValue: user.name,
                screen: "InputName",
              })
            }
            content={
              <Text
                size={14}
                style={{ lineHeight: 18, flex: editButtonRate.content }}
              >
                {user.name}
              </Text>
            }
          />
        </Block>
        <ProfileHr />

        <Block style={styles.profileTextBlock}>
          <Text size={16} bold style={{ marginBottom: 10 }}>
            プロフィール画像
          </Text>
          <EditorBlock
            onPress={async () => {
              const result = await getPermissionAsync();
              if (result) {
                onLoad();
                pickImage().then((image) => {
                  if (image) {
                    setIsLoadingImage(true);
                    requestPostProfileImage(
                      authState.token,
                      image,
                      profileDispatch,
                      () => {
                        setIsLoadingImage(false);
                      },
                      (err) => {
                        setIsLoadingImage(false);
                      }
                    );
                  }
                });
              }
            }}
            content={
              <Block
                flex
                style={{
                  alignItems: "center",
                  width: "100%",
                  flex: editButtonRate.content,
                }}
              >
                <Avatar
                  border
                  size={150}
                  image={user.image}
                  style={styles.avatar}
                />
              </Block>
            }
            isImage
            isLoadingImage={isLoadingImage}
          />
        </Block>
        <ProfileHr />

        <Block style={styles.profileTextBlock}>
          <Text size={16} bold style={{ marginBottom: 10 }}>
            今悩んでいること
          </Text>
          <EditorBlock
            onPress={() =>
              navigation.navigate("ProfileInput", {
                user: user,
                prevValue: user.introduction,
                screen: "InputIntroduction",
              })
            }
            content={
              <Text
                size={14}
                style={{ lineHeight: 18, flex: editButtonRate.content }}
              >
                {user.introduction ? (
                  user.introduction
                ) : (
                  <Text size={14}>-</Text>
                )}
              </Text>
            }
          />
        </Block>
        <ProfileHr />
      </Block>
    </ScrollView>
  );
};

const EditorBlock = (props) => {
  const { onPress, content, isImage, isLoadingImage } = props;
  return isImage ? (
    <TouchableOpacity onPress={onPress} style={{ flex: 1, width: "100%" }}>
      {content}
      <Block
        style={{
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {isLoadingImage ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <Icon name="camera" family="font-awesome" color="white" size={40} />
        )}
      </Block>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={onPress}
      style={{ flex: 1, flexDirection: "row" }}
    >
      {content}
      <Block
        flex={editButtonRate.button}
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <Icon name="angle-right" family="font-awesome" color="gray" size={22} />
      </Block>
    </TouchableOpacity>
  );
};

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
  avatar: {},
});
