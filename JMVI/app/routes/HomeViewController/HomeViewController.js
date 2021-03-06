import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native'

import styles from './styles'
import Images from '../../config/Images'
import Utility from '../../config/Utility'
import SafeAreaView from '../../component/SafeAreaView'
import Spinner from 'react-native-loading-spinner-overlay'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import API from '../../config/API'
import User from '../../models/User';
import Colors from '../../config/Colors';
import ProgressiveImage from '../../component/ProgressiveImage'
import { NavigationActions, StackActions } from 'react-navigation';
import AsyncData from '../../config/AsyncData';
var headersType = {
    HOTELS: 'HOTELS',
    FLIGHTS: 'FLIGHTS',
    ACTIVITIES: 'ACTIVITIES',
}

class HomeViewController extends Component {
    static navigationOptions = {
        header: null,
    }
    constructor(props) {
        super(props)
        const { navigation } = this.props
        this.state = {
            spinnerVisible: false,
            isLoginSuccess: false,
            isClickLoginOption: false,
            selectedHeader: headersType.HOTELS,
            selectedCategoryHeader: 'https://i.picsum.photos/id/100/2500/1656.jpg'
        }
    }
    componentWillMount() {
        this._sub21 = this.props.navigation.addListener('willBlur', this._handleFocusChanged.bind(this));
        this._sub22 = this.props.navigation.addListener('willFocus', this._handleFocusChanged.bind(this));
    }
    componentWillUnmount() {
        this._sub21.remove()
        this._sub22.remove()
    }
    _handleFocusChanged(event) {
        if (event.type) {
            if (event.type == 'willBlur') {
            } else {

            }
        }
    }

    getHotels() {

    }

    getFlights() {

    }

    getActivites() {

    }

    render() {
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <ProgressiveImage
                        resizeMode={"stretch"}
                        style={styles.categoryBannerImg}
                        placeholderStyle={styles.placeHolderPhotoStyle}
                        uri={this.state.selectedCategoryHeader}
                        placeholderSource={Images.placeHolderGrey}
                        onLoadEnd={(a) => { console.log('load end >> ' + a); }} />
                    <View style={styles.topBG}>
                        <Image
                            resizeMode={'contain'}
                            style={styles.topBarImage}
                            source={Images.magnumLogoBlack} />
                    </View>

                    <View style={{ flexDirection: 'row', backgroundColor: Colors.greyEBEBEB }}>
                        <TouchableOpacity style={{
                            flex: 1, justifyContent: 'center',
                            borderBottomWidth: this.state.selectedHeader == headersType.HOTELS ? 2 : 0,
                            borderBottomColor: Colors.grey7F7F,
                        }} onPress={() => { this.setState({ selectedHeader: headersType.HOTELS }, this.getHotels(false)) }} activeOpacity={0.5}>
                            <Text style={styles.headerTitle}>HOTELS</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flex: 1, justifyContent: 'center',
                            borderBottomWidth: this.state.selectedHeader == headersType.FLIGHTS ? 2 : 0,
                            borderBottomColor: Colors.grey7F7F,
                        }} onPress={() => { this.setState({ selectedHeader: headersType.FLIGHTS }, this.getFlights(false)) }} activeOpacity={0.5}>
                            <Text style={styles.headerTitle}>FLIGHTS</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flex: 1, justifyContent: 'center',
                            borderBottomWidth: this.state.selectedHeader == headersType.ACTIVITIES ? 2 : 0,
                            borderBottomColor: Colors.grey7F7F,
                        }} onPress={() => { this.setState({ selectedHeader: headersType.ACTIVITIES }, this.getActivites(false)) }} activeOpacity={0.5}>
                            <Text style={styles.headerTitle}>ACTIVITIES</Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
                <Spinner visible={this.state.spinnerVisible} />
            </SafeAreaView>
        )
    }

    //Navigation
    onBackPressed(isSuccess) {
        // var params = {
        //     'isSuccess': isSuccess,
        //     to: this.props.navigation.state.params.to,
        // }
        // this.props.navigation.state.params.onNavigateBack(params);
        this.props.navigation.goBack();
    }
    handleOnNavigateBack = (params) => {
        if (params.isSuccess == true) {
            switch (params.to) {
                case Utility.SCREEN.Signin:
                    break;
                default:
                    break;
            }

        }
    }

}
export default HomeViewController