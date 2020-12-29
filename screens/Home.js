import React, { useState } from "react";
import WorryListTemplate from "../components/templates/WorryListTemplate";
import { useAuthState } from "../components/contexts/AuthContext";
import UserListTemplate from "../components/templates/UserListTemplate";


const Home = (props) => {
  const routeName = props.route.name;
  const genre = routeName.toLowerCase();
  const [users, setUsers] = useState([]);
  const authState = useAuthState();

  return (
    <UserListTemplate users={users} setUsers={setUsers} token={authState.token} genre={genre} />
  );
}

export default Home;
