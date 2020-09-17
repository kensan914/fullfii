import React from 'react';
import { Block } from 'galio-framework';

/**@example
 * <Hr h={1} mb={7} mt={4} color="gainsboro" style={{ }} />
 */
const Hr = (props) => {
  const {h, mb, mt, color, style} = props;

  return (
    <Block style={[{height: h, marginBottom: mb, marginTop: mt, backgroundColor: color}, style]}/>
  )
}

export default Hr;