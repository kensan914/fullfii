import React from 'react';
import { StyleSheet, Dimensions, FlatList } from 'react-native';
import { Block, theme, Text } from 'galio-framework';

import { ConsultantCard } from '../componentsEx/';

const { width, height } = Dimensions.get('screen');
import consultants from '../constantsEx/consultants';

export default class Home extends React.Component {
  renderConsultants = () => {
    const numColumns = 2;
    return (
      <FlatList
        // data={consultants.concat(consultants)}
        data={consultants}
        style={styles.consultants}
        renderItem={({ item, index }) => {
          const ml = (index % numColumns === 0) ? theme.SIZES.BASE / 2 : 0;
          const mr = ((index % numColumns) + 1 === numColumns) ? theme.SIZES.BASE / 2 : 0;
          const mt = (index < numColumns) ? theme.SIZES.BASE * 2 : 0;
          return (
            <Block style={[styles.consultItem, { marginLeft: ml, marginRight: mr, marginTop: mt }]} key={item.key}>
              <ConsultantCard item={item} />
            </Block>
          );
        }}
        numColumns={numColumns}
        keyExtractor={(item, index) => index.toString()}
      />
    )
  }

  render() {
    return (
      <Block flex center style={styles.home}>
        {this.renderConsultants()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,
  },
  consultants: {
    width: width,
  },
  consultItem: {
    flex: 0.5,
  }
});
