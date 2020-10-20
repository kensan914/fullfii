import React, { useState, useEffect } from "react";
import HomeTemplate from "../components/templates/HomeTemplate";
import { URLJoin, cvtKeyFromSnakeToCamel } from "../components/modules/support";
import { BASE_URL } from "../constants/env";
import { useAuthState } from "../components/contexts/AuthContext";
import authAxios from "../components/modules/authAxios";


const Home = (props) => {
  const genre = props.route.name.toLowerCase();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const authState = useAuthState();
  const paginateBy = 10;

  let isLoading;
  const setIsLoading = (bool) => isLoading = bool;

  const appendUsers = (newUsers) => {
    setUsers(users.concat(
      newUsers.map((user) => cvtKeyFromSnakeToCamel(user))
    ));
    setPage(page + 1);
    if (newUsers.length < paginateBy) setIsFinished(true);
    setIsLoading(false);
    isLoading = false;
  }

  useEffect(() => {
    requestGetUsers(authState.token, appendUsers, page, genre);
  }, []);

  return (
    <HomeTemplate data={users} appendUsers={appendUsers} requestGetUsers={requestGetUsers} token={authState.token} page={page}
      isLoading={isLoading} setIsLoading={setIsLoading} isFinished={isFinished} genre={genre} />
  );
}

export default Home;


export const requestGetUsers = (token, appendUsers, page, genre) => {
  const url = URLJoin(BASE_URL, "users/", `?page=${page > 0 ? page : 1}`, `?genre=${genre}`);

  authAxios(token)
    .get(url)
    .then(res => {
      appendUsers(res.data);
    })
    .catch(err => {
    });
}