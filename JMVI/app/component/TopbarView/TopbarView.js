import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image , DeviceEventEmitter} from 'react-native';

import Colors from '../../config/Colors';
import Images from '../../config/Images';
import Utility from '../../config/Utility';
import WebClient from '../../config/WebClient';
;
import Fonts from '../../config/Fonts';

const styles = StyleSheet.create({
    container: {
        width: Utility.screenWidth,
        height: Settings.topBarHeight,
        flexDirection: 'row',
        paddingTop: Settings.topBarTopPadding,
        backgroundColor: Colors.topBar,
        //backgroundColor: '#00000050',
        justifyContent: 'center',
        alignItems: 'center',

    },
    leftButton: {

        //backgroundColor: 'red',
        //top: Settings.topBarTopPadding,
        left: Settings.topBarHorizontalPadding,
        position: 'absolute',
        //padding: 10
    },
    rightBtnView: {

        position: 'absolute',
        //paddingHorizontal:10,
        right: Settings.topBarHorizontalPadding,
        flexDirection: 'row',
        //   backgroundColor:'red'
    },
    rightButton: {
        top: Settings.topBarTopPadding,
        padding: 10,
        //backgroundColor: 'yellow',
    },
    titleView: {
        flex: 0.5,
        //backgroundColor: 'orange',
        // padding: 10
    },
    titleText: {
        fontFamily: Fonts.semibold,
        fontSize: Settings.titleFontSize,
        color: Colors.topTitle,
        textAlign: 'center'
    },
    doneView: {
        padding: 10,
        // backgroundColor:'blue',

    },
    doneBtnText: {
        fontFamily: Fonts.semibold,
        fontSize: 14,
        color: Colors.doneBtn,
    },



});

class TopbarView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notificationCount: 0 //this.props.notificationCount
        };
    }
    static defaultProps = {
        isLeftItemTypeLogo: false,
        showSearchBtn: false,
        showOptionsBtn: false,
        showDoneButton: false,
        showNotificationBtn: false,
        showCalenderBtn: false,
        doneText: 'Done',
        showBottomShadowLine: true
    };
    
    
    componentDidMount() {
        // let thisRef = this
        // DeviceEventEmitter.addListener('UnreadNotificationCountDidUpdate', function(sender) {
        //     thisRef.setState({notificationCount : Utility.UnreadNotificationCount})
        //   });
    }
    
    componentWillUnmount(){
        // DeviceEventEmitter.removeAllListeners();
    }
    


    leftBtnTaaped() {
        if (this.props.isLeftItemTypeLogo == true && this.props.onLeftBtnPress == undefined) {

        } else if (this.props.isLeftItemTypeLogo == false && this.props.onLeftBtnPress == undefined) {
            Utility.navigator.pop({
                animated: true,
                //animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
            });

        } else if (this.props.onLeftBtnPress != undefined) {
            this.props.onLeftBtnPress()
        }
    }

   

    notificationBtnTapped() {
        if (this.props.onNotificationTapped != undefined) {
            this.props.onNotificationTapped()
        }else {
        }
    }

    doneBtnTapped() {
        if (this.props.onDoneTapped != undefined) {
            this.props.onDoneTapped()
        }
    }

    optionBtnTapped() {
        if (this.props.onOptionsTapped != undefined) {
            this.props.onOptionsTapped(this.optionBtn)
        }
    }

    searchBtnTapped() {
        if (this.props.onSearchTapped != undefined) {
            this.props.onSearchTapped()
        }
    }

    calenderBtnTapped() {
        if (this.props.calenderBtnTapped != undefined) {
            this.props.calenderBtnTapped()
        }
    }


    render() {
        let shadowProps = {}
        if (this.props.showBottomShadowLine) {
            shadowProps = {
                shadowColor: '#00000015',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 3,
                marginBottom: 2
            }
        }
        return (
            <View style={[styles.container, shadowProps]}>


                {this.props.title
                    ? <View style={styles.titleView}>
                        <Text style={styles.titleText} numberOfLines={1}>
                            {this.props.title}
                        </Text>
                    </View>
                    : null}
                {this.props.children}
                
                <TouchableOpacity style={styles.leftButton} onPress={this.leftBtnTaaped.bind(this)} activeOpacity={0.7}>
                    <Image source={this.props.isLeftItemTypeLogo
                        ? Images.topBarLogo
                        : Images.topBarBackBtn} />
                </TouchableOpacity>

                <View style={styles.rightBtnView}>
                    {this.props.showCalenderBtn == true
                        ? <TouchableOpacity style={styles.rightButton} onPress={this.calenderBtnTapped.bind(this)} activeOpacity={0.7}>
                            <Image source={Images.topBarCalender}></Image>
                        </TouchableOpacity>
                        : null
                    }

                    {this.props.showNotificationBtn == true
                        ? <TouchableOpacity style={styles.rightButton} onPress={this.notificationBtnTapped.bind(this)} activeOpacity={0.7}>
                            {this.state.notificationCount > 0
                                ? <Image source={Images.notificationsIconSelected}></Image>
                                : <Image source={Images.notificationsIcon}></Image>
                            }
                        </TouchableOpacity>
                        : null
                    }

                    {this.props.showSearchBtn == true
                        ? <TouchableOpacity style={styles.rightButton} onPress={this.searchBtnTapped.bind(this)} activeOpacity={0.7}>
                            <Image source={Images.topBarSearch}></Image>
                        </TouchableOpacity>
                        : null
                    }

                    {this.props.showOptionsBtn == true
                        ? <TouchableOpacity ref={(optionBtn) => { this.optionBtn = optionBtn }} style={styles.rightButton} onPress={this.optionBtnTapped.bind(this)} activeOpacity={0.7}>
                            <Image source={Images.topBarMore}></Image>
                        </TouchableOpacity>
                        : null
                    }

                    {this.props.showDoneButton == true
                        ? <TouchableOpacity style={styles.doneView} onPress={this.doneBtnTapped.bind(this)} activeOpacity={0.7}>
                            <Text style={styles.doneBtnText}>
                                {this.props.doneText}
                            </Text>
                        </TouchableOpacity>
                        : null
                    }

                </View>
                {/* <Image style = {{backgroundColor : "red"}} source = {Images.topBarShadowLine}/> */}
            </View>
        );
    }
}
export default TopbarView
