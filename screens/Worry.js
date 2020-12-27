import React, { useState } from "react";
import { useAuthState } from "../components/contexts/AuthContext";
import WorryDetailTemplate from "../components/templates/WorryDetailTemplate";


const Worry = (props) => {
  const { worry } = props.route.params;

  return (
    <WorryDetailTemplate worry={worry} />
  );
}

export default Worry;
