import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert
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
import { NavigationActions, StackActions, SwitchActions } from 'react-navigation';
import AsyncData from '../../config/AsyncData';
const activateOpacity = 0.7
class SideMenuViewController extends Component {
    // static navigationOptions = {
    //     heade: null,
    // }

    constructor(props) {
        super(props)
        const { navigation } = this.props
        this.state = {
            spinnerVisible: false,
            isUserLoggedIn: false,
        }

    }

    componentDidUpdate(prevProps) {
        const { isDrawerOpen } = this.props.navigation.state;
        const wasDrawerOpen = prevProps.navigation.state.isDrawerOpen;
        // console.debug('isDrawerOpen', isDrawerOpen);
        if (isDrawerOpen) {
            Utility.hideKeyboard()
            User.loggedInUser((user) => {
                if (user) {
                    Utility.user = user;
                    this.setState({ isUserLoggedIn: true })
                } else {
                    this.setState({ isUserLoggedIn: false })
                }
            })
        }
    }
    componentDidMount() {

    }

    navigateToScreen = (route) => () => {
        // const popAction = StackActions.pop(1);
        // this.props.navigation.dispatch(popAction);
        this.props.navigation.dispatch(StackActions.popToTop());
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
        
        // this.props.navigation.popToTop(null)

        // const navigateAction = NavigationActions.navigate({
        //     routeName: route,
        //     params: {},
        //     action: NavigationActions.navigate({ routeName: Utility.SCREEN.Featured }),
        //   });

        //   this.props.navigation.dispatch(navigateAction);

        // this.props.navigation.navigate(route);
        // const resetAction = NavigationActions.reset({
        //     index: 0,
        //     actions: [
        //         NavigationActions.navigate({ routeName: route })
        //     ]
        // })
        // this.props.navigation.dispatch(resetAction)
    }

    closeDrawer() {
        this.props.navigation.toggleDrawer();
    }

    logoutPress() {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                { text: 'Yes', onPress: () => this.logout() },
            ],
            { cancelable: true }
        )
    }

    logout() {
        User.delete(() => {
            Utility.showSuccessToast('Logged out successful')
            Utility.user = undefined;
            this.navigateToScreen(Utility.SCREEN.Featured)
        });
    }

    render() {
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <TouchableOpacity activeOpacity={0.3} onPress={this.closeDrawer.bind(this)}>
                    <Image style={styles.cancelImage} source={Images.cancel} />
                </TouchableOpacity>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={'handled'}
                >
                    <View>
                        <Image style={styles.logoJMVI} source={Images.jmvi_logo} />
                        <View style={styles.viewLine}></View>
                        {/* <Text style={styles.sectionHeadingStyle}> Section 1 </Text> */}
                        <View style={styles.navSectionStyle}>
                            <TouchableOpacity style={styles.navItemStyle} onPress={this.navigateToScreen(Utility.SCREEN.Featured)} activeOpacity={activateOpacity}>
                                <Image style={styles.navItemIconStyle} source={Images.featured} />
                                <Text style={styles.navItemTextStyle}>Featured</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.navItemStyle} onPress={this.navigateToScreen(Utility.SCREEN.ForSale)} activeOpacity={activateOpacity}>
                                <Image style={styles.navItemIconStyle} source={Images.sale} />
                                <Text style={styles.navItemTextStyle}>Real Estate Sales</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.navItemStyle} onPress={this.navigateToScreen(Utility.SCREEN.ForRent)} activeOpacity={activateOpacity}>
                                <Image style={styles.navItemIconStyle} source={Images.rent} />
                                <Text style={styles.navItemTextStyle}>Real Estate Rentals</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.navItemStyle} onPress={this.navigateToScreen(Utility.SCREEN.Auction)} activeOpacity={activateOpacity}>
                                <Image style={styles.navItemIconStyle} source={Images.bid} />
                                <Text style={styles.navItemTextStyle}>Auction House</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.navItemStyle} onPress={this.navigateToScreen(Utility.SCREEN.MyFavourite)} activeOpacity={activateOpacity}>
                                <Image style={styles.navItemIconStyle} source={Images.favourite} />
                                <Text style={styles.navItemTextStyle}>My Favourite</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.navItemStyle} onPress={this.navigateToScreen(Utility.SCREEN.FindAnAgent)} activeOpacity={activateOpacity}>
                                <Image style={styles.navItemIconStyle} source={Images.find_an_agent} />
                                <Text style={styles.navItemTextStyle}>Find an Agent</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.navItemStyle} onPress={this.navigateToScreen(Utility.SCREEN.MortgageCalculator)} activeOpacity={activateOpacity}>
                                <Image style={styles.navItemIconStyle} source={Images.mortgage_calculator} />
                                <Text style={styles.navItemTextStyle}>Mortgage Calculator</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.navItemStyle} onPress={this.navigateToScreen(Utility.SCREEN.MortgageFinancing)} activeOpacity={activateOpacity}>
                                <Image style={styles.navItemIconStyle} source={Images.mortgage_financing} />
                                <Text style={styles.navItemTextStyle}>Mortgage Financing</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.navItemStyle} onPress={this.navigateToScreen(Utility.SCREEN.PropertyLawyers)} activeOpacity={activateOpacity}>
                                <Image style={styles.navItemIconStyle} source={Images.property_lawyers} />
                                <Text style={styles.navItemTextStyle}>Property Lawyers</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.navItemStyle} onPress={this.navigateToScreen(Utility.SCREEN.Country)} activeOpacity={activateOpacity}>
                                <Image style={styles.navItemIconStyle} source={Images.location} />
                                <Text style={styles.navItemTextStyle}>Select Country</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.navItemStyle} onPress={this.navigateToScreen(Utility.SCREEN.AboutUs)} activeOpacity={activateOpacity}>
                                <Image style={styles.navItemIconStyle} source={Images.about_us} />
                                <Text style={styles.navItemTextStyle}>About Us</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.navItemStyle} onPress={this.navigateToScreen(Utility.SCREEN.ContactUs)} activeOpacity={activateOpacity}>
                                <Image style={styles.navItemIconStyle} source={Images.contact_us} />
                                <Text style={styles.navItemTextStyle}>Contact Us</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.navItemStyle} onPress={this.navigateToScreen(Utility.SCREEN.TNC)} activeOpacity={activateOpacity}>
                                <Image style={styles.navItemIconStyle} source={Images.tnc} />
                                <Text style={styles.navItemTextStyle}>Terms &amp; Conditions</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <View style={styles.viewLine}></View>
                        <Text style={styles.sectionHeadingStyle}>User</Text>
                        {
                            this.state.isUserLoggedIn ?
                                <View style={styles.navSectionStyle}>
                                    <TouchableOpacity style={styles.navItemStyle} onPress={this.navigateToScreen(Utility.SCREEN.Profile)} activeOpacity={activateOpacity}>
                                        <Image style={styles.navItemIconStyle} source={Images.user} />
                                        <Text style={styles.navItemTextStyle}>Profile</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.navItemStyle} onPress={this.logoutPress.bind(this)} activeOpacity={activateOpacity}>
                                        <Image style={styles.navItemIconStyle} source={Images.logout} />
                                        <Text style={styles.navItemTextStyle}>Logout</Text>
                                    </TouchableOpacity>
                                </View> :
                                <View style={styles.navSectionStyle}>
                                    <TouchableOpacity style={styles.navItemStyle} onPress={this.navigateToScreen(Utility.SCREEN.SignIn)} activeOpacity={activateOpacity}>
                                        <Image style={styles.navItemIconStyle} source={Images.user} />
                                        <Text style={styles.navItemTextStyle}>Login</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.navItemStyle} onPress={this.navigateToScreen(Utility.SCREEN.SignUp)} activeOpacity={activateOpacity}>
                                        <Image style={styles.navItemIconStyle} source={Images.register} />
                                        <Text style={styles.navItemTextStyle}>Register</Text>
                                    </TouchableOpacity>
                                </View>

                        }
                    </View>
                </ScrollView>
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
export default SideMenuViewController