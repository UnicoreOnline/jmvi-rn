/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, { Component } from 'react'
import {
  View,
  Image,
  TouchableOpacity
} from 'react-native'
// import Router from './app/routes';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Images from '../config/Images';

class NavigationDrawerRight extends Component {
  constructor(props) {
    super(props)

  }

  toggleDrawer = () => {
    // this.props.navigationProps.toggleDrawer();
  };

  render() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          <Image
            source={Images.ic_search}
            style={{ width: 25, height: 25, marginLeft: 10 }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
export default createAppContainer(NavigationDrawerRight);
