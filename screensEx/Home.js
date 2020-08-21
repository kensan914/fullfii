import React from 'react';
import { StyleSheet, Dimensions, FlatList } from 'react-native';
import { Block, theme, Text } from 'galio-framework';

import { ConsultantCard } from '../componentsEx/';

const { width, height } = Dimensions.get('screen');
import consultants from '../constantsEx/Consultants';

export default class Home extends React.Component {
  renderConsultants = () => {
    return (
      <FlatList
        // data={consultants.concat(consultants)}
        data={consultants}
        style={styles.consultants}
        renderItem={({ item, index }) => {
          const ml = (index % 2 === 0) ? theme.SIZES.BASE / 2 : 0;
          const mr = (index % 2 !== 0) ? theme.SIZES.BASE / 2 : 0;
          return (
            <>
              {/* {index === 0 && <Block style={{ width: width, height: 100, backgroundColor: "red"}}/>} */}
              <Block flex style={[styles.consultItem, { marginLeft: ml, marginRight: mr }]} key={item.key}>
                <ConsultantCard item={item} />
              </Block>
            </>
          );
        }}
        numColumns={2}
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
    // paddingVertical: theme.SIZES.BASE * 2,
    paddingVertical: 0,
  },
  consultItem: {
    flex: 0.5,
  }
});
