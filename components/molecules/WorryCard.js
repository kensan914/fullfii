import { withNavigation } from "@react-navigation/compat";
import { Block, Text } from "galio-framework";
import React from "react";
import { StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Avatar from "../atoms/Avatar";
import Hr from "../atoms/Hr";
import { cvtListDate } from "../modules/support";


const { width, height } = Dimensions.get('screen');


/**
 * 
 * @param {*} props {worry, isDetail}
 * isDetail: 本文強調表示(default: false)
 */
const WorryCard = (props) => {
  const { worry, isDetail } = props;

  const handleNavigateProfile = (worry) => {
    props.navigation.navigate("Profile", { item: worry.user });
  }

  const avatarFlex = 0.2;
  const contentsFlex = 0.8;

  return (
    <>
      <Block flex style={[styles.worryCard]}>
        <Block flex row >

          <Block flex={avatarFlex} style={styles.avatarContainer}>
            <TouchableOpacity activeOpacity={.9} onPress={() => handleNavigateProfile(worry)}>
              <Avatar size={56} image={worry.user.image} style={{ alignSelf: "center" }} />
            </TouchableOpacity>
          </Block>

          <Block flex={contentsFlex} style={[styles.contentsContainer, { alignSelf: isDetail ? "center" : "flex-start" }]}>
            {/* title */}
            <Block style={[styles.titleContainer]} >
              <Block flex={0.8} style={{}}>
                <TouchableOpacity style={styles.userName} activeOpacity={.9} onPress={() => handleNavigateProfile(worry)}>
                  {/* user name */}
                  <Text size={isDetail ? 15 : 14} color="dimgray" bold numberOfLines={1} ellipsizeMode="tail">
                    {worry.user.name}
                  </Text>
                </TouchableOpacity>
                {/* gender and age */}
                <Text size={12} color="darkgray" >{worry.user.gender.label}{" "}{worry.user.age}{"歳"}</Text>
              </Block>

              {!isDetail &&
                // time when list
                < Block flex={0.2} style={styles.timeContainer} >
                  <Text size={12} color="gray">{cvtListDate(new Date(worry.time))}</Text>
                </Block >
              }
            </Block>

            {!isDetail &&
              // message when list
              <Block style={styles.listMessage}>
                <Text size={13} color="#333333" style={{ lineHeight: 16 }}>{worry.message}</Text>
              </Block>
            }

          </Block>
        </Block>

        {isDetail &&
          <>
            {/* message when detail */}
            <Block flex style={styles.detailMessage}>
              <Text size={17} color="#333333" style={{ lineHeight: 20 }}>{worry.message}</Text>
            </Block>

            <Hr h={1} color="whitesmoke" style={{width: width}} />

            {/* time when detail */}
            <Block flex style={styles.detailTime} >
              <Text size={13} color="gray">{worry.time}</Text>
            </Block >
          </>
        }
      </Block>

      <Hr h={1} color="gainsboro" />
    </>
  );
}

export default withNavigation(WorryCard);


const styles = StyleSheet.create({
  worryCard: {
    width: width,
    backgroundColor: "white",
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  avatarContainer: {
  },
  contentsContainer: {
    padding: 0,
    paddingRight: 10,
  },
  titleContainer: {
    flexDirection: "row",
  },
  timeContainer: {
    alignItems: "flex-end",
  },
  detailMessage: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  detailTime: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    paddingTop: 12,
  },
  listMessage: {
    paddingTop: 6,
    paddingBottom: 4,
  },
  userName: {
    marginBottom: 3,
  },
});