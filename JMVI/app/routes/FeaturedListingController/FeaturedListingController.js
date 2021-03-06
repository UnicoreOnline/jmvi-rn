import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList,
    Linking
} from 'react-native'

import commonstyles from '../commonstyles'
import Images from '../../config/Images'
import Utility from '../../config/Utility'
import SafeAreaView from '../../component/SafeAreaView'
import Spinner from 'react-native-loading-spinner-overlay'
import API from '../../config/API'
import User from '../../models/User';
import Colors from '../../config/Colors';
import ProgressiveImage from '../../component/ProgressiveImage'
import { NavigationActions, StackActions, NavigationEvents } from 'react-navigation';
import AsyncData from '../../config/AsyncData';
import Geolocation from 'react-native-geolocation-service';
import firebase from 'react-native-firebase';
import NumberFormat from 'react-number-format';
const TYPE = {
    BANNER: 1,
    OTHER: 2
}
class FeaturedListingController extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: () => (
                <TouchableOpacity onPress={() => {
                    navigation.navigate(Utility.SCREEN.Search);
                }}><Image style={{ height: 25, width: 25, marginEnd: 15 }} source={Images.search} /></TouchableOpacity>
            ),
        };
    };
    constructor(props) {
        super(props)
        const { navigation } = this.props
        this.state = {
            id: navigation.getParam('id', -1),
            type: navigation.getParam('type', -1),
            spinnerVisible: false,
            hasLocationPermission: false,
            arrDATA: [],
            isDataReceived: false,
            userGeoPosition: undefined,
            isFetching: false,
            bannerObj: undefined,
        }
    }
    // componentDidUpdate(prevProps) {
    //     console.log('componentDidUpdate prevProps ', prevProps.isFocused, 'this.props.isFocused ', this.props.isFocused)
    //     if (prevProps.isFocused !== this.props.isFocused) {
    //         // Use the `this.props.isFocused` boolean
    //         // Call any action
    //         // const resetAction = StackActions.reset({
    //         //     index: 0,
    //         //     actions: [NavigationActions.navigate({ routeName: Utility.SCREEN.Featured })],
    //         // });
    //         // this.props.navigation.dispatch(resetAction);
    //     }
    // }

    componentWillUnmount() {
        if (this.watchId != undefined) {
            Geolocation.clearWatch(this.watchId)
        }
    }
    componentDidMount() {
        User.loggedInUser((user) => {
            if (user) {
                Utility.user = user;
            }
        })
        Utility._checkLocationPermission().then((hasLocationPermission) => {
            console.log('hasLocationPermission', hasLocationPermission)
            if (!hasLocationPermission) {
                this.callGetData(true)
                return;
            } else {
                this.setState({ hasLocationPermission, spinnerVisible: true }, () => this.setupGeolocation());
            }
        });

        //DeepLinking
        // Linking.getInitialURL().then(url => {
        //     console.warn('DATATAAA getInitialURL URL ', url)
        //     if (url) {
        //         // console.warn('DATATAAA getInitialURL ', Utility.getParameterByNameFromQueryStringURL(url, 'link'))
        //         var link = Utility.getParameterByNameFromQueryStringURL(url, 'link')
        //         var type = Utility.getParameterByNameFromQueryStringURL(link, 'type')
        //         var id = Utility.getParameterByNameFromQueryStringURL(link, 'id')
        //         // console.log('DATATAAA type', type, 'id', id)
        //         this.navigateToDetails(type, id)
        //     }
        // });

        // firebase.links()
        //     .getInitialLink()
        //     .then((url) => {
        //         console.warn('DATATAAA firebase getInitialLink URL ', url)
        //         if (url) {
        //             // console.warn('DATATAAA firebase.links().onLink ', Utility.getParameterByNameFromQueryStringURL(url, 'link'))
        //             // var link = Utility.getParameterByNameFromQueryStringURL(url, 'link')
        //             var type = Utility.getParameterByNameFromQueryStringURL(url, 'type')
        //             var id = Utility.getParameterByNameFromQueryStringURL(url, 'id')
        //             // console.log('DATATAAA type', type, 'id', id)
        //             this.navigateToDetails(type, id)
        //         } else {
        //             // app NOT opened from a url
        //         }
        //     });
        // console.log('IDDDDDD>>>>>> ',this.state.id)
        if (this.state.type != -1 && this.state.id != -1) {
            this.navigateToDetails(this.state.type, this.state.id)
        }
    }

    navigateToDetails(type, id) {
        if (type == 1) {//1 for auction 2 for property
            const navigateAction = NavigationActions.navigate({
                routeName: Utility.SCREEN.AuctionDetails,
                params: { 'id': id }
            });
            this.props.navigation.dispatch(navigateAction);
        } else if (type == 2) {
            const navigateAction = NavigationActions.navigate({
                routeName: Utility.SCREEN.PropertyDetails,
                params: { 'id': id }
            });
            this.props.navigation.dispatch(navigateAction);
        }
    }

    setupGeolocation() {
        Geolocation.getCurrentPosition(
            (userGeoPosition) => {
                // console.log("Position.getCurrentPosition: ", userGeoPosition);
                this.setState({
                    userGeoPosition
                });
                if (userGeoPosition.coords.latitude != 0 && userGeoPosition.coords.longitude != 0) {
                    AsyncData.saveAsyncData('latitude', userGeoPosition.coords.latitude + '');
                    AsyncData.saveAsyncData('longitude', userGeoPosition.coords.longitude + '');
                    Utility.currentLATITUDE = userGeoPosition.coords.latitude
                    Utility.currentLONGITUDE = userGeoPosition.coords.longitude
                }
                this.setCurrentLatLong()
            },
            //    this.setState({ userGeoPosition }, () => this.setCurrentLatLong())
            (error) => { if (Utility.currentLatitude == "") { Utility.showToast('Could not fetch your location.') } this.setCurrentLatLong() },
            // (error) => {Utility.showToast(error.message)},
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 },
            // { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 100, useSignificantChanges: true },
        );
        this.watchId = Geolocation.watchPosition((userGeoPosition) => {
            // console.log("Position.watchPosition: ", userGeoPosition);
            this.setState({ userGeoPosition }, () => { this.setCurrentLatLong() })
        })
    }

    setCurrentLatLong() {
        if (this.watchId != undefined && this.state.userGeoPosition) {
            Geolocation.clearWatch(this.watchId)
        }
        this.callGetData(true)
    }

    onRefresh() {
        console.log('refreshing')
        this.setState({ isFetching: true }, function () {
            this.callGetData(false)
        });
    }

    callGetData(isShowLoading) {
        if (Utility.country_name == undefined) {
            return;
        }
        this.setState({ spinnerVisible: isShowLoading });
        var params = {
            api_key: Utility.API_KEY,
            'user_id': Utility.user ? Utility.user.user_id : 0,
            country: Utility.country_name ? Utility.country_name : '',
            'lat': Utility.currentLATITUDE,
            'lon': Utility.currentLONGITUDE,
            'radius': 1,
            'featured': 1,
            'get_banner': 1,
        }
        API.getRequest('get_data.php', params, (status, data) => {
            this.setState({
                spinnerVisible: false,
                isDataReceived: true,
                isFetching: false
            });
            if (status) {
                var tempArray = []
                var tempBanner = data.banner
                tempBanner.type = TYPE.BANNER
                // tempArray.push(tempBanner)
                // tempArray.push(data.real_estates)
                if (data.real_estates.length > 0) {
                    if (data.real_estates.length > 1) {
                        for (let index = 0; index < data.real_estates.length; index++) {
                            const element = data.real_estates[index];
                            if (index == 1) {
                                tempArray.push(tempBanner)
                                tempArray.push(element)
                            } else {
                                tempArray.push(element)
                            }
                        }
                    } else {
                        tempArray.push(data.real_estates[0])
                        tempArray.push(tempBanner)
                    }
                }
                this.setState({
                    // arrDATA: data.real_estates,
                    arrDATA: tempArray,
                });

            } else {
                // Utility.showToast('' + data.message)
            }
        }, true, this.props);
    }


    renderRowItem(rowData) {
        var item = rowData.item
        var index = rowData.index
        // console.log('ITESSS ', item.type)
        var renderITEM =
            item.type == TYPE.BANNER ?
                <TouchableOpacity style={commonstyles.auctionItemMainContainer} activeOpacity={0.8} onPress={() => this.advertisingBannerPress(item)}>
                    <ProgressiveImage
                        resizeMode='contain'
                        style={commonstyles.imageStyleBanner}
                        uri={item.banner_name}
                        // placeholderSource={Images.home}
                        onLoadEnd={(a) => { console.log('load end >> ' + a); }} />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={this.itemPressed.bind(this, item)} style={commonstyles.auctionItemMainContainer} activeOpacity={1}>
                    <ProgressiveImage
                        style={commonstyles.imageStyle}
                        uri={Array.isArray(item.photos) ? item.photos.length > 0 ? item.photos[0].thumb_url : '' : ''}
                        // placeholderSource={Images.home}
                        onLoadEnd={(a) => { console.log('load end >> ' + a); }} />
                    <Image style={{ position: 'absolute', top: 0, right: 20, tintColor: Colors.green }} source={Images.featured} />
                    <View style={commonstyles.auctionItemContainer}>
                        <View style={commonstyles.txtContainer}>
                            {/* <Text style={commonstyles.txtAuctionName}>{item.currency}{Utility.currency}{item.price}</Text> */}
                            <NumberFormat
                                value={item.price}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={''}
                                renderText={value => <Text style={commonstyles.txtAuctionName}>{item.currency}{Utility.currency}{value}</Text>}
                            />
                            <Text style={commonstyles.txtAuctionName}>{item.address
                                // + ', ' + item.zipcode + ', ' + item.country
                            }</Text>
                            <Text style={commonstyles.txtAuctionDate}>{item.status == 0 ? 'For Rent' : 'For Sale'}</Text>
                        </View>
                        <View style={commonstyles.txtBedBathContainer}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image style={commonstyles.bedsImage} source={Images.bed} />
                                <Text style={commonstyles.txtAuctionName}>{item.beds}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                <Image style={commonstyles.bedsImage} source={Images.bath} />
                                <Text style={commonstyles.txtAuctionName}>{item.baths}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

        return (
            renderITEM
        )
    }
    flatListItemSeparator = () => {
        return (
            <View
                style={{
                    height: 0.5,
                    width: "100%",
                    backgroundColor: Colors.grayBorderColor,
                }}
            />
        )
    }
    render() {
        var emptyView = <View style={commonstyles.noRecordsFoundContainerStyle}>
            <Text style={commonstyles.noRecordsFoundTextStyle}>No records available</Text>
            <TouchableOpacity onPress={() => this.callGetData(true)} activeOpacity={0.5}>
                <Text style={commonstyles.retryTextStyle}>Try Again</Text>
            </TouchableOpacity>
        </View>
        return (
            <View style={commonstyles.safeAreaView}>
                <NavigationEvents
                    onWillFocus={payload => {
                        if (Utility.country_name) {
                            if (this.state.arrDATA.length == 0) {
                                this.callGetData(true)
                            }
                        }
                        // console.log('AAAAAAAAA will focus', payload)
                    }
                    }
                    onDidFocus={payload => {
                        //  console.log('AAAAAAAAA did focus', payload)
                    }}
                    onWillBlur={payload => {
                        // console.log('AAAAAAAAA will blur', payload)
                    }}
                    onDidBlur={payload => {
                        // this.setState({ isFocusSecondTime: true }); console.log('AAAAAAAAA did blur', payload)
                    }}
                />
                {
                    this.state.arrDATA.length > 0 ?
                        <FlatList
                            data={this.state.arrDATA}
                            extraData={this.state}
                            onRefresh={() => this.onRefresh()}
                            refreshing={this.state.isFetching}
                            renderItem={this.renderRowItem.bind(this)}
                            keyExtractor={(item, index) => index.toString()}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={this.flatListItemSeparator}
                        />
                        : this.state.isDataReceived ? emptyView : null
                }

                <View style={commonstyles.bottomBarContainer}>
                    <TouchableOpacity onPress={this.onBottomBarIconPress.bind(this, Utility.BOTTOM.SALE)} activeOpacity={0.5}>
                        <Image style={commonstyles.bottomImage} source={Images.sale} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onBottomBarIconPress.bind(this, Utility.BOTTOM.RENT)} activeOpacity={0.5}>
                        <Image style={commonstyles.bottomImage} source={Images.rent} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onBottomBarIconPress.bind(this, Utility.BOTTOM.BID)} activeOpacity={0.5}>
                        <Image style={commonstyles.bottomImage} source={Images.bid} />
                    </TouchableOpacity>
                </View>
                <Spinner visible={this.state.spinnerVisible}
                    textContent={"Contents loading"}
                    textStyle={commonstyles.textLoading} />
            </View>
        )
    }

    //Navigation
    onBackPressed(isSuccess) {
        var params = {}

        this.props.navigation.state.params.onNavigateBack(params);
        this.props.navigation.goBack();
    }

    advertisingBannerPress(item) {
        if (item.link) {
            Linking.openURL(item.link)
        }
    }
    // case Utility.BOTTOM.SALE:
    //     // this.navigateToScreen(Utility.SCREEN.ForSale);
    //     const navigateActionSALE = NavigationActions.navigate({
    //         routeName: Utility.SCREEN.ForSale
    //     });
    //     this.props.navigation.dispatch(navigateActionSALE);
    //     break
    // case Utility.BOTTOM.RENT:
    //     // this.navigateToScreen(Utility.SCREEN.ForRent);
    //     const navigateActionRENT = NavigationActions.navigate({
    //         routeName: Utility.SCREEN.ForRent
    //     });
    //     this.props.navigation.dispatch(navigateActionRENT);
    //     break
    // case Utility.BOTTOM.BID:
    //     // this.navigateToScreen(Utility.SCREEN.Auction);
    //     const navigateActionBID = NavigationActions.navigate({
    //         routeName: Utility.SCREEN.Auction
    //     });
    //     this.props.navigation.dispatch(navigateActionBID);
    //     break
    onBottomBarIconPress(type) {
        switch (type) {
            case Utility.BOTTOM.SALE:
                this.navigateToScreen(Utility.SCREEN.ForSale);
                break
            case Utility.BOTTOM.RENT:
                this.navigateToScreen(Utility.SCREEN.ForRent);
                break
            case Utility.BOTTOM.BID:
                this.navigateToScreen(Utility.SCREEN.Auction);
                break
            default:
                break
        }
    }

    navigateToScreen(route) {
        // const popAction = StackActions.pop(1);
        // this.props.navigation.dispatch(StackActions.popToTop());
        this.props.navigation.dispatch(StackActions.popToTop());
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    }

    itemPressed(item) {
        var params = {
            onNavigateBack: this.handleOnNavigateBack.bind(this),
            from: Utility.SCREEN.Featured,
            to: Utility.SCREEN.PropertyDetails,
            'propertyDetails': item,
        };
        this.props.navigation.navigate(Utility.SCREEN.PropertyDetails, params)
    }

    handleOnNavigateBack = (params) => {
        if (params.isSuccess == true) {
            switch (params.to) {
                case Utility.SCREEN.PropertyDetails:
                    break;
                default:
                    break;
            }

        }
    }

}
export default FeaturedListingController
// export default withNavigationFocus(FeaturedListingController)