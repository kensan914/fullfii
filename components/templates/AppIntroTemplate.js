import React from "react";
import { ImageBackground } from "react-native";
import { Dimensions } from "react-native";
import { View, SafeAreaView, Text, Image, StyleSheet, StatusBar, TouchableOpacity, } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import materialTheme from "../../constants/Theme";
import { LinearGradient } from "expo-linear-gradient";


const { width, height } = Dimensions.get("screen");

const AppIntroTemplate = (props) => {
  const { navigation } = props;

  const _renderItem = ({ item, index }) => {
    if (index === 0) {
      return (
        <View style={styles.slide}>
          <ImageBackground style={[styles.imageBackground]} source={item.bgImage}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 0.25, y: 1.1 }}
              locations={[0.2, 1]}
              colors={["#ffe4e1bb", "#db7093dd"]}
              style={[styles.topWrapper]} />
            <Image source={item.brandLogo} style={styles.brandLogo} resizeMode="contain" />
            <Text style={styles.topTitle}>{item.title}</Text>
            <Text style={styles.topText}>{item.text}</Text>
          </ImageBackground>
        </View>
      );
    } else
      return (
        <View
          style={[
            styles.slide,
            {
              backgroundColor: item.bg,
            },
          ]}>
          <Text style={styles.title}>{item.title}</Text>
          <Image source={item.image} style={styles.image} resizeMode="contain" />
          <Text style={styles.text}>{item.text}</Text>
        </View>
      );
  };

  const _keyExtractor = (item) => item.title;

  const _renderPagination = (activeIndex) => {
    return (
      <View style={styles.paginationContainer}>
        <SafeAreaView>
          <View style={styles.paginationDots}>
            {data.length > 1 &&
              data.map((_, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.dot,
                    i === activeIndex
                      ? { backgroundColor: materialTheme.COLORS.FULLFII }
                      : { backgroundColor: "rgba(0, 0, 0, .2)" },
                  ]}
                  onPress={() => this.slider?.goToSlide(i, true)}
                />
              ))}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "gray" }]}
              onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.buttonText}>ログイン</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}
              onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.buttonText}>サインアップ</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <AppIntroSlider
        keyExtractor={_keyExtractor}
        renderItem={_renderItem}
        renderPagination={_renderPagination}
        data={data}
        ref={(ref) => (slider = ref)}
      />
    </View>
  );
}

export default AppIntroTemplate;

const data = [
  {
    title: "Fullfiiへようこそ",
    bgImage: require("../../assets/images/top.jpg"),
    brandLogo: require("../../assets/images/logo.png"),
  },
  {
    title: "相談したい相手を\n選びましょう",
    text: "",
    image: require("../../assets/images/intro1.png"),
    bg: materialTheme.COLORS.FULLFII,
  },
  {
    title: "悩みの共通した相手へ\nトークのリクエスト",
    text: "",
    image: require("../../assets/images/intro2.png"),
    bg: materialTheme.COLORS.FULLFII,
  },
  {
    title: "リクエストが承認されたら\nトークを開始しましょう",
    text: "",
    image: require("../../assets/images/intro3.png"),
    bg: materialTheme.COLORS.FULLFII,
  },
  {
    title: "最後に話してくれた相手へ\n感謝の気持を送りましょう",
    text: "",
    image: require("../../assets/images/intro4.png"),
    bg: materialTheme.COLORS.FULLFII,
  },
];

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: materialTheme.COLORS.FULLFII,
  },
  imageBackground: {
    width: width,
    height: height,
    alignItems: "center",
    justifyContent: "center",
  },
  topWrapper: {
    position: "absolute",
    top: 0,
    width: width,
    height: height,
  },
  brandLogo: {
    width: width / 4,
    height: width / 4,
    borderRadius:  width / 11,
  },
  image: {
    width: 320,
    height: 320,
    marginVertical: 32,
  },
  topText: {
    fontSize: 30,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
  },
  text: {
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  topTitle: {
    fontSize: 40,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    color: "white",
    textAlign: "center",
  },
  paginationContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  paginationDots: {
    height: 16,
    margin: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    marginHorizontal: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 20,
    marginHorizontal: 8,
    borderRadius: 24,
    backgroundColor: materialTheme.COLORS.FULLFII,
    marginBottom: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
});
