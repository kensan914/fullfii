import React from 'react';
import { Block } from 'galio-framework';

const Hr = (props) => {
  const {h, mb, mt, color, style} = props;

  return (
    <Block style={[{height: h, marginBottom: mb, marginTop: mt, backgroundColor: color}, style]}/>
  )
}

export default Hr;