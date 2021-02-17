import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Pressable,
  LayoutAnimation,
} from "react-native";
import { Block, Text } from "galio-framework";
import { COLORS } from "../../constants/Theme";

const { width, height } = Dimensions.get("screen");

const Bubble = (props) => {
  const { item, diameter, margin, style, pressBubble, activeKeys } = props;
  const [isPressed, setIsPressed] = useState(false);
  const weightPressed = 3; // 値が大きいほど押したときの動きが大きく
  const posWhenPressInX = useRef(0);
  const posWhenPressInY = useRef(0);

  let textSize = 12;
  const txtLen = item.label.length;
  if (txtLen > 20) {
    textSize = 9;
  } else if (txtLen > 15) {
    textSize = 10;
  } else if (txtLen > 10) {
    textSize = 11;
  }

  const isActive = activeKeys.includes(item.key);
  const diameterDiff = isPressed ? weightPressed : 0;
  const onAnimationPress = (isPressed) => {
    LayoutAnimation.spring();
    setIsPressed(isPressed);
  };

  const onPressIn = useCallback(
    (e) => {
      e.persist();
      posWhenPressInX.current = e.nativeEvent.pageX;
      posWhenPressInY.current = e.nativeEvent.pageY;

      onAnimationPress(true);
    },
    [posWhenPressInX, posWhenPressInY, item]
  );
  const onPress = useCallback(
    (e) => {
      e.persist();
      onAnimationPress(false);

      // // pressIn時からスクロールされていれば処理を無効化
      if (
        e.nativeEvent?.pageX === posWhenPressInX.current &&
        e.nativeEvent?.pageY === posWhenPressInY.current
      ) {
        pressBubble(item.key);
      }
    },
    [posWhenPressInX, posWhenPressInY, item]
  );

  return (
    <Pressable
      onPressIn={onPressIn}
      onPress={onPress}
      onPressOut={() => onAnimationPress(false)} // onPressが発火しないときのため
    >
      <Block
        style={[
          styles.bubble,
          {
            width: diameter - diameterDiff,
            height: diameter - diameterDiff,
            borderRadius: (diameter - diameterDiff) / 2,
            margin: diameterDiff / 2,
            marginHorizontal: diameterDiff / 2 + margin,
            backgroundColor: isActive ? COLORS.PINK : "white",
            borderWidth: isActive ? 0 : 1,
          },
          style ? style : {},
        ]}
      ></Block>
      <Block
        style={[
          styles.bubbleTextContainer,
          {
            width: diameter,
            height: diameter,
            marginHorizontal: margin,
          },
        ]}
      >
        <Text
          color={isActive ? "white" : "lightpink"}
          bold
          size={isPressed ? textSize - weightPressed * 0.2 : textSize}
          ellipsizeMode="tail"
          style={styles.bubbleText}
        >
          {item.label}
        </Text>
      </Block>
    </Pressable>
  );
};

const BubbleList = (props) => {
  const {
    items = [], // item = { key: "", label: "", }
    diameter = width / 4.5,
    limitLines = 3,
    margin = 2.0,
    activeKeys = [],
    pressBubble = () => {
      return;
    },
  } = props;

  // itemsの二次元配列
  const [items2d, setItems2d] = useState([[]]);
  // 列ごとの右にずらすべきかを表したlist
  const [shouldShiftRowList, setShouldShiftRowList] = useState(
    new Array(items.length >= limitLines ? limitLines : items.length).fill(
      false
    )
  );
  const bubbleListScrollViewRef = useRef();

  useEffect(() => {
    const _items2d = splitAndDeepenList(items, limitLines);
    setItems2d(_items2d);

    const _shouldShiftRowList = [...shouldShiftRowList];
    _items2d.forEach((rowItems, i) => {
      _shouldShiftRowList[i] = shouldShiftRow(i, rowItems.length);
    });
    // 全てtrueの場合、ずらさなくてよい
    const isAllTrue = _shouldShiftRowList.every((val) => val);
    if (isAllTrue) {
      _shouldShiftRowList.fill(false);
    }
    setShouldShiftRowList(_shouldShiftRowList);
  }, [items]);

  const shouldShiftRow = (rowIndex, rowLen) => rowIndex % 2 == 0;

  return (
    <ScrollView
      horizontal
      centerContent
      showsHorizontalScrollIndicator={false}
      ref={bubbleListScrollViewRef}
      style={styles.bubbleListScrollView}
      onContentSizeChange={(contentWidth) => {
        // 中央にスクロール
        bubbleListScrollViewRef.current.scrollTo({
          x: (contentWidth - width) / 2,
          y: 0,
          animated: false,
        });
      }}
    >
      <Block justifyContent="center">
        <Block style={[styles.bubbleListContainer]}>
          {items2d.map((rowItems, i) => (
            <Block
              key={i}
              style={[
                styles.bubbleListRow,
                // ↓列単位のずらし↓
                shouldShiftRowList[i]
                  ? { paddingLeft: diameter / 2 + margin }
                  : {},
              ]}
            >
              {rowItems.map((item, j) => (
                <Bubble
                  key={j}
                  item={item}
                  diameter={diameter}
                  margin={margin}
                  pressBubble={pressBubble}
                  activeKeys={activeKeys}
                />
              ))}
            </Block>
          ))}
        </Block>
      </Block>
    </ScrollView>
  );
};

export default BubbleList;

const styles = StyleSheet.create({
  bubbleListScrollView: {
    width: width,
  },
  bubbleListContainer: {
    alignItems: "flex-start",
  },
  bubbleListRow: {
    flexDirection: "row",
  },
  bubble: {
    borderColor: "pink",
  },
  bubbleTextContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  bubbleText: {
    paddingHorizontal: 6,
    textAlign: "center",
  },
});

/**
 * listのネストを一つだけ深くし、splitNumの数だけ分割。剰余は、より中央のリストに追加する。
 * @param {Array} list
 * @param {Number} limitLen
 * @example
 * splitAndDeepenList([1, 2, 3, 4, 5, 6, 7], 3);
 * ↓↓↓ return ↓↓↓
 * [[1, 2], [3, 4, 5], [6, 7]]
 */
const splitAndDeepenList = (list, splitNum) => {
  // splitAndDeepenList([1, 2, 3], 5); => [[1], [2], [3]]
  if (list.length <= splitNum) {
    return list.map((elm) => [elm]);
  }

  // 子リストの最小length。上の例では2
  const minChildLen = Math.floor(list.length / splitNum);
  const remainder = list.length % splitNum;

  const lengthList = new Array(splitNum).fill(minChildLen); // [2, 2, 2]
  const willAddList = new Array(remainder).fill(1); // [1]
  const startIndex = Math.floor((splitNum - remainder) / 2); // どこから足し始めるか

  willAddList.forEach((one, i) => {
    lengthList[startIndex + i] += one;
  }); // [2, 3, 2]

  const resultList = [...list];
  return lengthList.map((len) => resultList.splice(0, len));
};
