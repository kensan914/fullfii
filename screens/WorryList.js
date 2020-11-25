import React, { useState } from "react";
import WorryListTemplate from "../components/templates/WorryListTemplate";
import { useAuthState } from "../components/contexts/AuthContext";
import WorryPostButton from "../components/atoms/WorryPostButton";


const Home = (props) => {
  const [worries, setWorries] = useState([]);
  const authState = useAuthState();

  return (
    <>
      <WorryListTemplate worries={worries} setWorries={setWorries} token={authState.token} />
      <WorryPostButton />
    </>
  );
}

export default Home;
