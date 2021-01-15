import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Dimensions, FlatList, ActivityIndicator } from "react-native";
import { Block, theme } from "galio-framework";
import ConsultantCard from "../molecules/UserCard";
import { useAxios } from "../modules/axios";
import { cvtKeyFromSnakeToCamel, URLJoin } from "../modules/support";
import { BASE_URL } from "../../constants/env";

const { width, height } = Dimensions.get("screen");


const UserListTemplate = (props) => {
  const numColumns = 2;
  const paginateBy = 10;

  const { users, setUsers, token, genre } = props;

  const page = useRef(1);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isRefreshingRef = useRef(false);

  const genreQueryParam = genre !== "top" ? [`?genre=${genre}`] : [];
  const urlExcludePage = URLJoin(BASE_URL, "users/", ...genreQueryParam);
  const { isLoading, resData, request } = useAxios(
    URLJoin(urlExcludePage, `?page=${page.current}`),
    "get", {
    thenCallback: res => {
      const resDataUsers = res.data;

      if (resDataUsers.length > 0) {
        const newUsers = resDataUsers.map((user, index) => {
          return cvtKeyFromSnakeToCamel(user);
        });

        if (isRefreshingRef.current) {
          setUsers([...newUsers]);
        } else {
          setUsers([...users, ...newUsers]);
        }

        if (newUsers.length < paginateBy) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    },
    catchCallback: err => {
      if (err.response.status === 404) {

      }
    },
    finallyCallback: () => {
      page.current += 1;
      isRefreshingRef.current = false;
    },
    didRequestCallback: r => {
    },
    shouldRequestDidMount: true,
    token: token,
  });

  useEffect(() => {
    setIsRefreshing(isRefreshingRef.current);
  }, [isRefreshingRef.current]);

  const handleRefresh = () => {
    setUsers([]);
    page.current = 1;
    setHasMore(true);
    isRefreshingRef.current = true;
    request({ url: URLJoin(urlExcludePage, `?page=${1}`), });
  }


  return (
    <Block flex center style={styles.home}>
      <FlatList
        data={users}
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
          if (hasMore && !isLoading) {
            request({ url: URLJoin(urlExcludePage, `?page=${page.current}`), });
          }
        }}
        onEndReachedThreshold={0}
        ListFooterComponent={() => hasMore && <ActivityIndicator size="large" style={{ marginVertical: 10 }} />}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
      />
    </Block>
  );
}

export default UserListTemplate;

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
