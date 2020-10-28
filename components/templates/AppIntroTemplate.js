import React from "react";
import { ImageBackground } from "react-native";
import { Dimensions } from "react-native";
import { View, SafeAreaView, Text, Image, StyleSheet, StatusBar, TouchableOpacity, } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import materialTheme from "../../constants/Theme";
import { LinearGradient } from "expo-linear-gradient";
import { Asset } from "expo-asset";


const { width, height } = Dimensions.get("screen");

const AppIntroTemplate = (props) => {
  const { navigation, assets } = props;
  const data = getData(assets);

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
          <Text style={styles.text}>{item.text}</Text>
          <View style={styles.imageContainer}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            {item.speechBubble &&
              <Image source={item.speechBubble.image} style={[
                styles.speechBubble,
                item.speechBubble.direction === "right" ? { right: -10 } : {},
                item.speechBubble.direction === "left" ? { left: -10 } : {},
              ]} resizeMode="contain" />
            }
          </View>
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


const getData = (assets) => [
  {
    title: "Fullfiiへようこそ",
    bgImage: assets.top,
    brandLogo: assets.logo,
  },
  {
    title: "Fullfiiの使いかた！",
    text: "全部で5STEP！",
    image: require("../../assets/images/intro0.png"),
    bg: materialTheme.COLORS.FULLFII,
  },
  {
    title: "STEP 1",
    text: "マイページを埋めよう！",
    image: require("../../assets/images/intro1.png"),
    bg: "mediumturquoise",
    speechBubble: { image: require("../../assets/images/intro1-2.png"), direction: "right" }
  },
  {
    title: "STEP 2",
    text: "話したい相手を探そう！",
    image: require("../../assets/images/intro2.png"),
    bg: "darkkhaki",
    speechBubble: { image: require("../../assets/images/intro2-2.png"), direction: "right" }
  },
  {
    title: "STEP 3",
    text: "見つけたらリクエストを送ろう！",
    image: require("../../assets/images/intro3.png"),
    bg: "skyblue",
    speechBubble: { image: require("../../assets/images/intro3-2.png"), direction: "left" }
  },
  {
    title: "STEP 4",
    text: "承認されたら話してみよう！",
    image: require("../../assets/images/intro0.png"),
    bg: "sandybrown",
    speechBubble: { image: require("../../assets/images/intro4-2.png"), direction: "left" }
  },
  {
    title: "STEP 5",
    text: "相談終了後、感謝を送ろう！",
    image: require("../../assets/images/intro5.png"),
    bg: "mediumseagreen",
    speechBubble: { image: require("../../assets/images/intro5-2.png"), direction: "right" }
  },
  {
    title: "STEP 6",
    text: "以上です！会員登録に進みます！",
    image: require("../../assets/images/intro6.png"),
    bg: "mediumslateblue",
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
    borderRadius: width / 11,
  },
  imageContainer: {
    width: 320,
    height: 320,
    marginVertical: 32,
  },
  image: {
    width: 320,
    height: 320,
    position: "absolute",
  },
  speechBubble: {
    width: 200,
    height: 200,
    top: -50,
    position: "absolute",
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
    fontSize: 18,
  },
  topTitle: {
    fontSize: 40,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  title: {
    fontSize: 30,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
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
