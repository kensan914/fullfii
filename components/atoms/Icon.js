import React from "react";
import * as Font from "expo-font";
import { createIconSetFromIcoMoon } from "@expo/vector-icons";
import { Icon } from "galio-framework";

import GalioConfig from "../../assets/fonts/galioExtra";
const IconGalioExtra = createIconSetFromIcoMoon(GalioConfig, "GalioExtra");

export default class IconExtra extends React.Component {
  state = {
    fontLoaded: false,
  };

  async componentDidMount() {
    const galioExtra = await import("../../assets/fonts/galioExtra.ttf");
    await Font.loadAsync({
      GalioExtra: galioExtra.default,
    });
    this.setState({ fontLoaded: true });
  }

  render() {
    const { name, family, ...rest } = this.props;

    if (name && family && this.state.fontLoaded) {
      if (family === "GalioExtra") {
        return <IconGalioExtra name={name} family={family} {...rest} />;
      }
      return <Icon name={name} family={family} {...rest} />;
    }

    return null;
  }
}
