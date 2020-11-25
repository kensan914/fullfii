import React, { useEffect, useRef, useState } from "react";
import { FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { withNavigation } from "@react-navigation/compat";

import { BASE_URL } from "../../constants/env";
import { useAxios } from "../modules/axios";
import { cvtKeyFromSnakeToCamel, URLJoin } from "../modules/support";
import WorryCard from "../molecules/WorryCard";


const WorryListTemplate = (props) => {
  const { worries, setWorries, token, genre } = props;

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isRefreshingRef = useRef(false);

  const genreQueryParam = genre !== "top" ? [`?genre=${genre}`] : [];
  const urlExcludePage = URLJoin(BASE_URL, "worries/", ...genreQueryParam);
  const { isLoading, resData, request } = useAxios(
    URLJoin(urlExcludePage, `?page=${page}`),
    "get", {
    thenCallback: res => {
      const resDataHasMore = res.data.has_more;
      const resDataWorries = res.data.worries;

      if (resDataWorries.length > 0) {
        const newWorries = resDataWorries.map((worry, index) => (
          {
            id: worry.id,
            time: worry.time,
            message: worry.message,
            user: cvtKeyFromSnakeToCamel(worry.user),
          }
        ));

        if (isRefreshingRef.current) {
          setWorries([...newWorries]);
        } else {
          setWorries([...worries, ...newWorries]);
        }

        if (!resDataHasMore) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    },
    errorCallback: err => {
      if (err.response.status === 404) {

      }
    },
    finallyCallback: () => {
      setPage(page + 1);
      isRefreshingRef.current = false;
    },
    didRequestCallback: r => {
    },
    didMountRequest: true,
    token: token,
  });

  useEffect(() => {
    setIsRefreshing(isRefreshingRef.current);
  }, [isRefreshingRef.current]);

  const handleRefresh = () => {
    setWorries([]);
    setPage(1);
    setHasMore(false);
    isRefreshingRef.current = true;
    request({ url: URLJoin(urlExcludePage, `?page=${1}`), });
  }

  return (
    <FlatList
      data={worries}
      renderItem={({ item, index }) => (
        <TouchableOpacity key={index} activeOpacity={.6} onPress={() => props.navigation.navigate("Worry", { worry: item })}>
          <WorryCard worry={item} />
        </TouchableOpacity>
      )}
      keyExtractor={(item, index) => index.toString()}
      onEndReached={() => {
        if (hasMore && !isLoading) {
          request({ url: URLJoin(urlExcludePage, `?page=${page}`), });
        }
      }}
      onEndReachedThreshold={0}
      ListFooterComponent={() => hasMore && <ActivityIndicator size="large" style={{ marginVertical: 10 }} />}
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
    />
  );
}

export default withNavigation(WorryListTemplate);
