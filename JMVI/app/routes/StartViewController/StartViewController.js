import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    Image,
    ActionSheetIOS,
    Picker,
    Linking
} from 'react-native';
import AsyncData from '../../config/AsyncData';
import styles from './styles'
import Images from '../../config/Images'
import Utility from '../../config/Utility'
// import SafeAreaView from '../../component/SafeAreaView'
import { NavigationActions, StackActions } from 'react-navigation';
import Colors from '../../config/Colors';
import User from '../../models/User'
import API from '../../config/API'
import Spinner from 'react-native-loading-spinner-overlay'
import firebase from 'react-native-firebase';
import type { RemoteMessage, Notification, NotificationOpen } from 'react-native-firebase';


class StartViewController extends Component {
    static navigationOptions = {
        headerShown: false,
    }
    constructor(props) {
        super(props)
        const { navigation } = this.props
        this.state = {
            spinnerVisible: false,
            isShowContent: true,
            isFromBack: false,
            selectedCountryId: -1,
            selectedCountryName: '',
            arrCountryANDROID: [],
            arrCountryIOS: [],
            arrCountryIOSVALUE: [],
        }
    }

    pickerPressed() {
        var mSelectedArray = [...this.state.arrCountryIOS]
        mSelectedArray.push('Cancel')
        ActionSheetIOS.showActionSheetWithOptions({
            options: mSelectedArray,
            // cancelButtonIndex: mSelectedArray.length-1,
            destructiveButtonIndex: mSelectedArray.length - 1,
        },
            (buttonIndex) => {
                // this.setState({ clicked: mSelectedArray[buttonIndex] });
                if (buttonIndex == (mSelectedArray.length - 1)) {
                    this.setState({ selectedCountryName: '' })
                } else {
                    // this.setState({
                    //     selectedCountryName: mSelectedArray[buttonIndex],
                    //     selectedCountryId: this.state.arrCountryIOSVALUE[buttonIndex]
                    // }, setTimeout(() => {
                    // }, 1000))
                    this.checkPropertyData(this.state.arrCountryIOSVALUE[buttonIndex], mSelectedArray[buttonIndex])
                }
            });
    }

    componentWillUnmount() {
        this.notificationDisplayedListener();
        this.notificationListener();
        this.notificationOpenedListener();
        // this.removeNotificationDisplayedListener();
        // this.removeNotificationListener();
    }

    componentDidMount() {

        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
            console.log('DATATAAA notificationDisplayedListener', notification)
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        });

        this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
            console.log('DATATAAA notificationListener ', notification)
            // Process your notification as required
            this.displayNotification(notification)
        });

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification: Notification = notificationOpen.notification;
            // console.log('DATATAAA notificationOpenedListener ', notification.data.id)
            // firebase.notifications().cancelAllNotifications()
            firebase.notifications().removeAllDeliveredNotifications()
            this.navigateAccordingNotifications(notification)
        });

        var isNotificationOPEN = false

        firebase.notifications().getInitialNotification()
            .then((notificationOpen: NotificationOpen) => {
                if (notificationOpen) {
                    isNotificationOPEN = true
                    // App was opened by a notification
                    // Get the action triggered by the notification being opened
                    const action = notificationOpen.action;
                    // Get information about the notification that was opened
                    const notification: Notification = notificationOpen.notification;
                    firebase.notifications().removeAllDeliveredNotifications()
                    console.log('DATATAAA getInitialNotification ', action, ' --------- ', notification)
                    // this.displayNotification(notification)
                    this.navigateAccordingNotifications(notification)
                }
            });

        // AsyncData.getAsyncData((country_name) => {
        //     console.log('country_name', country_name)
        //     if (country_name) {
        //         Utility.country_name = country_name
        //         // this.navigateToScreen.bind(this, Utility.SCREEN.Featured)
        //     }
        // }, 'country_name');
        // var context = this
        // AsyncData.getAsyncData((country_id) => {
        //     console.log('country_id', country_id)
        //     context.setState({ selectedCountryId: country_id })
        //     if (country_id) {
        //         // this.navigateToScreen.bind(this, Utility.SCREEN.Featured)
        //         // const navigateAction = NavigationActions.navigate({
        //         //     routeName: Utility.SCREEN.Featured
        //         // });
        //         // context.props.navigation.dispatch(navigateAction);
        //         if (isNotificationOPEN == false) {
        //             this.navigateToFeatures(country_id)
        //         }
        //     } else {
        //         context.setState({ isShowContent: true },
        //             // setTimeout(() => {
        //             context.callGetCountryList()
        //             // }, 1000)
        //         )
        //     }
        // }, 'country_id');


        // User.loggedInUser((user) => {
        //     console.log('user>>>>>>>>>>>>>>>>> ', user)
        //     if (user) {
        //         Utility.user = user;
        //         if (Utility.user.country_id) {
        //             // this.navigateToScreen.bind(this, Utility.SCREEN.Featured)
        //             const navigateAction = NavigationActions.navigate({
        //                 routeName: Utility.SCREEN.Featured
        //             });
        //             this.props.navigation.dispatch(navigateAction);
        //         } else {
        //             this.setState({ isShowContent: true })
        //         }
        //     } else {
        //         this.setState({ isShowContent: true })
        //     }
        // })

        this.callGetCountryList()

        //DeepLinking

        firebase.links()
            .getInitialLink()
            .then((url) => {
                console.warn('DATATAAA firebase getInitialLink URL ', url)
                if (url) {
                    // console.warn('DATATAAA firebase.links().onLink ', Utility.getParameterByNameFromQueryStringURL(url, 'link'))
                    // var link = Utility.getParameterByNameFromQueryStringURL(url, 'link')
                    var type = Utility.getParameterByNameFromQueryStringURL(url, 'type')
                    var id = Utility.getParameterByNameFromQueryStringURL(url, 'id')
                    // console.log('DATATAAA type', type, 'id', id)
                    this.navigateToDetails(type, id)
                } else {
                    Linking.getInitialURL().then(url => {
                        console.warn('DATATAAA getInitialURL URL ', url)
                        if (url) {
                            // console.warn('DATATAAA getInitialURL ', Utility.getParameterByNameFromQueryStringURL(url, 'link'))
                            var link = Utility.getParameterByNameFromQueryStringURL(url, 'link')
                            var type = Utility.getParameterByNameFromQueryStringURL(link, 'type')
                            var id = Utility.getParameterByNameFromQueryStringURL(link, 'id')
                            // console.log('DATATAAA type', type, 'id', id)
                            this.navigateToDetails(type, id)
                        }
                    });
                }
            });
    }

    componentWillUnmount() {
        // Linking.removeEventListener("url", url => console.warn(url));
    }

    displayNotification(notification) {
        const channelId = new firebase.notifications.Android.Channel("Default", "Default", firebase.notifications.Android.Importance.High);
        firebase.notifications().android.createChannel(channelId);

        let notification_to_be_displayed = new firebase.notifications.Notification({
            data: notification.data,
            sound: 'default',
            show_in_foreground: true,
            title: notification.title,
            body: notification.body,
        });

        if (Platform.OS == "android") {
            notification_to_be_displayed
                .android.setPriority(firebase.notifications.Android.Priority.High)
                .android.setChannelId("Default")
                .android.setVibrate(1000);
        }
        firebase.notifications().displayNotification(notification_to_be_displayed);
    }

    navigateAccordingNotifications(notification) {
        this.navigateToDetails(notification.data.type, notification.data.id)
    }
    navigateToDetails(type, id) {
        // if (type == 1) {//1 for auction 2 for property
        //     const navigateAction = NavigationActions.navigate({
        //         routeName: Utility.SCREEN.AuctionDetails,
        //         params: { 'id': id }
        //     });
        //     this.props.navigation.dispatch(navigateAction);
        // } else if (type == 2) {
        //     const navigateAction = NavigationActions.navigate({
        //         routeName: Utility.SCREEN.PropertyDetails,
        //         params: { 'id': id }
        //     });
        //     this.props.navigation.dispatch(navigateAction);
        // }
        const navigateAction = StackActions.replace({
            routeName: Utility.SCREEN.Featured,
            params: { 'id': id, 'type': type }
        });
        this.props.navigation.dispatch(navigateAction);
    }

    callGetCountryList() {
        this.setState({ spinnerVisible: true });
        var params = {
            api_key: Utility.API_KEY,
            'get_country': 1,
        }
        API.getRequest('get_data.php', params, (status, data) => {
            this.setState({
                spinnerVisible: false,
                isDataReceived: true
            });
            if (status) {
                if (Array.isArray(data.country)) {
                    // if (data.country.length > 0) {
                    //     if (this.state.selectedCountryId == 0) {
                    //         this.setState({ selectedCountryId: data.country[0].country_id })
                    //         Utility.country_id = data.country[0].country_id
                    //         Utility.country_name = data.country[0].country_name
                    //         AsyncData.saveAsyncDataString('country_id', data.country[0].country_id + '');
                    //         AsyncData.saveAsyncDataString('country_name', data.country[0].country_name + '');
                    //     }
                    // }

                    var arrTemp = []
                    var arrTempValues = []
                    var arrTempAndroid = []
                    arrTempAndroid.push(this.dummyData('SELECT YOUR COUNTRY'))
                    if (data.country) {
                        data.country.forEach(element => {
                            arrTemp.push(element.country_name)
                            arrTempValues.push(element.country_id)
                            var item = {}
                            item.title = element.country_name
                            item.value = element.country_id
                            arrTempAndroid.push(item)
                        });
                        this.setState({
                            arrCountryIOS: arrTemp,
                            arrCountryIOSVALUE: arrTempValues,
                            arrCountryANDROID: arrTempAndroid
                        })
                    }
                }
            } else {
                // Utility.showToast('' + data.message)
            }
        }, true, this.props);
    }

    dummyData(name) {
        return { title: name, value: -1 }
    }


    checkPropertyData(countryId, countryName) {
        this.setState({ spinnerVisible: true });
        var params = {
            api_key: Utility.API_KEY,
            country: countryName,
        }
        API.postRequest('check_property.php', params, (status, data) => {
            this.setState({
                spinnerVisible: false,
                isDataReceived: true
            });
            if (status) {
                if (data.result_count > 0) {
                    // this.setState({ isShowContent: false })
                    this.navigateToFeatures(countryId, countryName)
                } else {
                    Utility.showToast('No Results')
                }

            } else {
                // Utility.showToast('' + data.message)
            }
        }, true, this.props);
    }

    navigateToFeatures(countryId, countryName) {
        // console.log('CountryId', countryId, 'Country Name ', countryName)

        if (countryId) {
            AsyncData.saveAsyncDataString('country_id', countryId + '');
            Utility.country_id = countryId
        }
        if (countryName) {
            AsyncData.saveAsyncDataString('country_name', countryName + '');
            Utility.country_name = countryName
        }
        this.setState({ isFromBack: true })
        // setTimeout(() => {
        // NavigationActions.reset({
        //     index: 0,
        //     actions: [
        //         NavigationActions.navigate({ routeName: Utility.SCREEN.Featured })
        //     ]
        // })
        // }, 500)
        const navigateAction = StackActions.replace({
            routeName: Utility.SCREEN.Featured
        });
        this.props.navigation.dispatch(navigateAction);
    }

    navigateToScreen = (route) => () => {
        console.log('route', route)
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    }
    // componentDidUpdate(prevProps) {
    //     console.log('this.state.isFromBack', this.state.isFromBack, prevProps)
    //     this.props.navigation.goBack();
    //     if (this.state.isFromBack) {
    //     }
    // }
    render() {
        var { selectedCountryName } = this.state

        return (
            <SafeAreaView style={styles.safeAreaView}>
                {
                    this.state.isShowContent ?
                        < View style={{ flex: 1 }}>
                            <ScrollView contentContainerStyle={{ flex: 1, }}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={styles.welcomeToTxt}>WELCOME TO</Text>
                                    <Image resizeMode={'contain'} style={styles.magnnumLogo} source={Images.jmvi_logo} />
                                    <Text style={styles.welcomeToTxt}>THE FUTURE OF REAL ESTATE AT YOUR FINGERTIPS</Text>
                                    <Image resizeMode={'contain'} style={styles.powerdByImage} source={Images.ic_powerd_by} />
                                </View>
                            </ScrollView>
                            <TouchableOpacity style={styles.selectCountryContainer}
                                activeOpacity={0.5}
                            // onPress={this.navigateToScreen(Utility.SCREEN.Country)}
                            >
                                {
                                    Utility.isPlatformAndroid ?
                                        <Picker
                                            mode='dropdown'
                                            itemStyle={styles.pickerItem}
                                            style={[styles.pickerContainer, { height: 45, justifyContent: 'center', textAlign: 'center' }]}
                                            selectedValue={this.state.selectedCountryId}
                                            onValueChange={(itemValue, itemIndex) =>
                                                itemIndex > 0 ?
                                                    // setTimeout(() => {
                                                    this.checkPropertyData(itemValue, this.state.arrCountryANDROID[itemIndex].title)
                                                    // }, 1000)
                                                    : null
                                            } >
                                            {
                                                this.state.arrCountryANDROID.map((item, index) =>
                                                    <Picker.Item color={Colors.black} label={`${item.title}`} value={item.value} />
                                                )
                                            }
                                        </Picker>
                                        :
                                        <TouchableOpacity style={styles.inputContainer} activeOpacity={0.8} onPress={() => this.pickerPressed()}>
                                            <Text style={styles.selectCountryTxt}>{selectedCountryName ? selectedCountryName : 'SELECT YOUR COUNTRY'}</Text>
                                            {/* <Image style={styles.inputHintImage} source={Images.dorpdown_fill} /> */}
                                            <Image resizeMode={'contain'} style={styles.dropDownImage} source={Images.ic_drop_down_arrow} />
                                        </TouchableOpacity>
                                }
                                {/* <Text style={styles.selectCountryTxt}>SELECT YOUR COUNTRY</Text> */}
                                {/* <Image resizeMode={'contain'} style={styles.dropDownImage} source={Images.ic_drop_down_arrow} /> */}
                            </TouchableOpacity>
                        </View>
                        : null
                }
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
    onTermsOfServicePress(cmsType) {
        // this.props.navigation.navigate(Utility.SCREEN.CMS, { type: cmsType })
    }
    handleOnNavigateBack = (params) => {
        if (params.isSuccess == true) {
            switch (params.to) {
                case Utility.SCREEN.AgeGate:
                    break;
                default:
                    break;
            }
        }
    }

}
export default StartViewController