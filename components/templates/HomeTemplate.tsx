import React from "react";
import { StyleSheet, Dimensions, FlatList } from "react-native";
import { Block, theme } from "galio-framework";

import Card from "../molecules/Card";
import { ADMOB_BANNER_HEIGHT } from "../../constants/env";
import { HomeItems } from "../types/Types";

const { width } = Dimensions.get("screen");

type Props = {
  items: HomeItems;
};
const HomeTemplate: React.FC<Props> = (props) => {
  const numColumns = 2;
  const { items } = props;

  return (
    <Block flex center style={styles.home}>
      <FlatList
        data={items}
        style={styles.list}
        renderItem={({ item, index }) => {
          const ml = index % numColumns === 0 ? theme.SIZES.BASE / 2 : 0;
          const mr =
            (index % numColumns) + 1 === numColumns ? theme.SIZES.BASE / 2 : 0;
          const mt = index < numColumns ? theme.SIZES.BASE : 2; // 上2
          const mb = (
            index % numColumns == 0
              ? index >= items.length - numColumns
              : index >= items.length - (index % numColumns)
          )
            ? theme.SIZES.BASE + ADMOB_BANNER_HEIGHT
            : 2; // 下2 (奇数の時は下1)
          return (
            <Block
              style={[
                styles.item,
                {
                  marginLeft: ml,
                  marginRight: mr,
                  marginTop: mt,
                  marginBottom: mb,
                },
              ]}
              key={index}
            >
              <Card
                item={item}
                onPress={item.onPress}
                countNum={"countNum" in item ? item.countNum : 0}
              />
            </Block>
          );
        }}
        numColumns={numColumns}
        keyExtractor={(item, index) => index.toString()}
      />
    </Block>
  );
};

export default HomeTemplate;

const styles = StyleSheet.create({
  home: {
    width: width,
    backgroundColor: "white",
  },
  list: {
    width: width,
    zIndex: 1,
  },
  item: {
    flex: 0.5,
  },
});
