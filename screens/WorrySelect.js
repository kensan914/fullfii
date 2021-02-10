import React from "react";
import { withNavigation } from "@react-navigation/compat";

import WorrySelectTemplate from "../components/templates/WorrySelectTemplate";

const WorrySelect = (props) => {
  return <WorrySelectTemplate />;
};

export default withNavigation(WorrySelect);
