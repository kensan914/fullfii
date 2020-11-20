import React, { useState } from "react";
import WorryListTemplate from "../components/templates/WorryListTemplate";
import { useAuthState } from "../components/contexts/AuthContext";


const Home = (props) => {
  const routeName = props.route.name;
  const genre = routeName.toLowerCase();
  const [worries, setWorries] = useState([]);
  const authState = useAuthState();

  return (
    <WorryListTemplate worries={worries} setWorries={setWorries} token={authState.token} genre={genre} />
  );
}

export default Home;
