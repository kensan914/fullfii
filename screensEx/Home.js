import React from 'react';
import { StyleSheet, Dimensions, ScrollView, FlatList } from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';

import { Icon, ConsultantCard } from '../componentsEx/';

const { width } = Dimensions.get('screen');
import consultants from '../constantsEx/Consultants';

export default class Home extends React.Component {
  renderConsultants = () => {
    return (
      <Block flex>
        <FlatList
          data={consultants}
          style={styles.consultants}
          renderItem={({ item }) => (
            <Block flex style={styles.consultItem} key={item.key}>
              <ConsultantCard item={item} />
            </Block>
          )}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
        />
      </Block>
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
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 4,
    zIndex: 2,
  },
  tabs: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.50,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '300'
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED,
  },
  consultants: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
  },
  consultItem: {
    flex: 0.5,
  }
});
