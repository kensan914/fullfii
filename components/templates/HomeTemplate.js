import React from "react";
import { StyleSheet, Dimensions, FlatList, ActivityIndicator } from "react-native";
import { Block, theme } from "galio-framework";
import ConsultantCard from "../molecules/Card";

const { width, height } = Dimensions.get("screen");


const HomeTemplate = (props) => {
  const numColumns = 2;
  const { data, appendUsers, token, page, isLoading, setIsLoading, isFinished, genre } = props;

  return (
    <Block flex center style={styles.home}>
      <FlatList
        data={data}
        style={styles.consultants}
        renderItem={({ item, index }) => {
          const ml = (index % numColumns === 0) ? theme.SIZES.BASE / 2 : 0;
          const mr = ((index % numColumns) + 1 === numColumns) ? theme.SIZES.BASE / 2 : 0;
          const mt = (index < numColumns) ? theme.SIZES.BASE * 2 : 0;
          return (
            <Block style={[styles.consultItem, { marginLeft: ml, marginRight: mr, marginTop: mt }]} key={item.key}>
              <ConsultantCard item={item} />
            </Block>
          );
        }}
        numColumns={numColumns}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={() => {
          if (!isFinished && !isLoading) {
            requestGetUsers(token, appendUsers, page, genre);
            setIsLoading(true);
          }
        }}
        onEndReachedThreshold={0}
        ListFooterComponent={() => !isFinished && <ActivityIndicator size="large" style={{ marginVertical: 10 }} />}
      />
    </Block>
  );
}

export default HomeTemplate;

const styles = StyleSheet.create({
  home: {
    width: width,
  },
  consultants: {
    width: width,
  },
  consultItem: {
    flex: 0.5,
  }
});


const requestGetUsers = (token, appendUsers, page, genre) => {
  const genreQueryParam = genre !== "top" ? [`?genre=${genre}`] : []
  const url = URLJoin(BASE_URL, "users/", `?page=${page > 0 ? page : 1}`, ...genreQueryParam);

  authAxios(token)
    .get(url)
    .then(res => {
      appendUsers(res.data);
    })
    .catch(err => {
    });
}