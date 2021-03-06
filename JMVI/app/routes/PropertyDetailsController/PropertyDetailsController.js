import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList,
    ScrollView,
    Linking,
    NativeModules,
    TouchableHighlight,
    RefreshControl
} from 'react-native'

import styles from './styles'
import commonstyles from '../commonstyles'
import Images from '../../config/Images'
import Utility from '../../config/Utility'
import SafeAreaView from '../../component/SafeAreaView'
import Spinner from 'react-native-loading-spinner-overlay'
import API from '../../config/API'
import Fonts from '../../config/Fonts'
import API_FIREBASE from '../../config/API_FIREBASE'
import User from '../../models/User';
import Colors from '../../config/Colors';
import ProgressiveImage from '../../component/ProgressiveImage'
import { NavigationActions, StackActions } from 'react-navigation';
import AsyncData from '../../config/AsyncData';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import PopoverTooltip from 'react-native-popover-tooltip';
import firebase from 'react-native-firebase';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment'
import NumberFormat from 'react-number-format';
var UtilityController = NativeModules.UtilityController;

class PropertyDetailsController extends Component {
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
            spinnerVisible: false,
            property_id: navigation.getParam('id', -1),
            propertyDetails: navigation.getParam('propertyDetails', undefined),
            isFavourite: navigation.getParam('propertyDetails', {}) ? navigation.getParam('propertyDetails', {}).is_favorite : 0,
            sliderIndex: 0,
            maxSlider: navigation.getParam('propertyDetails', undefined) ? navigation.getParam('propertyDetails', {}).photos.length : 0,
            isFromFeatured: navigation.getParam('from', '') === Utility.SCREEN.Featured,
            intervalID: 0,
            isFetching: false,
            regionSet: false
        }
    }

    componentDidMount() {
        if (this.state.property_id != -1) {
            this.callPropertyDetails(true)
        } else {
            this.setState({ property_id: this.state.propertyDetails.realestate_id })
            this.autoScrollPHOTO()
        }
    }

    onRefresh() {
        this.setState({ isFetching: true }, function () {
            this.callPropertyDetails(false)
        });
    }

    callPropertyDetails(isShowLoading) {
        this.setState({ spinnerVisible: isShowLoading });
        var params = {
            api_key: Utility.API_KEY,
            'user_id': Utility.user ? Utility.user.user_id : '',
            country: Utility.country_name ? Utility.country_name : '',
            'lat': Utility.currentLATITUDE,
            'lon': Utility.currentLONGITUDE,
            'radius': 1,
            'property_id': this.state.property_id,
        }
        API.getRequest('get_data.php', params, (status, data) => {
            this.setState({
                spinnerVisible: false,
                isDataReceived: true,
                isFetching: false
            });
            if (status) {
                if (Array.isArray(data.real_estates)) {
                    Utility.showToast('Details not found')
                    this.onBackPressed()
                } else {
                    this.setState({
                        propertyDetails: data.real_estates,
                        isFavourite: data.real_estates.is_favorite,
                        maxSlider: data.real_estates.photos.length,
                    },
                        // setTimeout(() => {
                        this.autoScrollPHOTO()
                        // }, 1000)
                    );
                    if (Utility.country_name == undefined) {
                        AsyncData.saveAsyncDataString('country_name', data.real_estates.country + '');
                        Utility.country_name = data.real_estates.country
                    }
                }
            } else {
                Utility.showToast('Details not found')
                this.onBackPressed()
            }
        }, true, this.props);
    }

    autoScrollPHOTO() {
        const { propertyDetails } = this.state
        if (propertyDetails) {
            if (propertyDetails.photos.length > 0) {
                let intervalID = setInterval(function () {
                    const { sliderIndex, maxSlider } = this.state
                    let nextIndex = 0

                    if (sliderIndex < maxSlider - 1) {
                        nextIndex = sliderIndex + 1
                    } else {
                        nextIndex = 0
                    }
                    // console.log('nextIndex ', nextIndex, 'sliderIndex ', sliderIndex, 'maxSlider ', maxSlider)
                    this.scrollToIndex(nextIndex, true)
                    this.setState({ sliderIndex: nextIndex })
                }.bind(this), 3000)
                this.setState({ intervalID: intervalID })
            }
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalID);
    }

    renderPhotoItem(rowData) {
        var item = rowData.item
        return (
            <TouchableOpacity
                // style={styles.imageStyle}
                onPress={() => this.onGalleryItemPressed(rowData.index)} activeOpacity={1}>
                <ProgressiveImage
                    style={styles.imageStyle}
                    uri={item.photo_url}
                    // placeholderSource={Images.home}
                    onLoadEnd={(a) => { console.log('load end >> ' + a); }}
                />
            </TouchableOpacity>
        )
    }

    reservePropertyPress() {
        if (Utility.user) {
            var { propertyDetails } = this.state
            this.setState({ spinnerVisible: true });
            var params = {
                api_key: Utility.API_KEY,
                'login_hash': Utility.user ? Utility.user.login_hash : '',
                'user_id': Utility.user ? Utility.user.user_id : '',
                'property_id': propertyDetails.realestate_id,
            }
            API.postRequest('post_reserved_property.php', params, (status, data) => {
                this.setState({
                    spinnerVisible: false
                });
                if (status) {
                    this.callPropertyDetails(false)
                    Utility.showSuccessToast('Thank you for reserving the property. An Agent will contact you within 1 hour')
                } else {
                    Utility.showToast('' + data.message)
                }
            }, true, this.props);
        } else {
            this.props.navigation.navigate(Utility.SCREEN.SignIn);
        }
    }

    addToFavouritePress() {
        if (Utility.user) {
            var { propertyDetails } = this.state
            this.setState({ spinnerVisible: true });
            var params = {
                api_key: Utility.API_KEY,
                'login_hash': Utility.user ? Utility.user.login_hash : '',
                'user_id': Utility.user ? Utility.user.user_id : '',
                'property_id': propertyDetails.realestate_id,
            }
            API.postRequest('post_favorite_property.php', params, (status, data) => {
                this.setState({
                    spinnerVisible: false
                });
                if (status) {
                    this.setState({ isFavourite: 1 })
                    Utility.showSuccessToast('Property added to your favourite list.')
                } else {
                    Utility.showToast('' + data.message)
                }
            }, true, this.props);
        } else {
            this.props.navigation.navigate(Utility.SCREEN.SignIn);
        }
    }

    removeFromFavouritePress() {
        if (Utility.user) {
            var { propertyDetails } = this.state
            // this.setState({ spinnerVisible: true });
            var params = {
                api_key: Utility.API_KEY,
                'login_hash': Utility.user ? Utility.user.login_hash : '',
                'user_id': Utility.user ? Utility.user.user_id : '',
                'property_id': propertyDetails.realestate_id,
            }
            API.postRequest('post_remove_favorite_property.php', params, (status, data) => {
                this.setState({
                    spinnerVisible: false
                });
                if (status) {
                    this.setState({ isFavourite: 0 })
                    Utility.showSuccessToast('Property removed from your favourite list.')
                } else {
                    Utility.showToast('' + data.message)
                }
            }, true, this.props);
        } else {
            this.props.navigation.navigate(Utility.SCREEN.SignIn);
        }
    }


    renderRowItem(item) {
        var coordinate = {
            latitude: item.lat ? Number(item.lat) : 0,
            longitude: item.lon ? Number(item.lon) : 0,
        }
        var region = {
            latitude: item.lat ? Number(item.lat) : 0,
            longitude: item.lon ? Number(item.lon) : 0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }
        return (
            <TouchableOpacity style={styles.rentationItemContainer} activeOpacity={1} >
                <Text style={styles.txtDescriptionTitle}>FEATURES</Text>
                {/* {
                    this.state.isFromFeatured ? */}
                <View style={styles.txtContainer}>
                    <Text style={styles.txtTitle}>Status</Text>
                    <Text style={styles.txtValue}>{item.status == 0 ? 'For Rent' : 'For Sale'}</Text>
                </View>
                {/* : null
                } */}
                <View style={styles.txtContainer}>
                    <Text style={styles.txtTitle}>Date Added</Text>
                    <Text style={styles.txtValue}>{item.created_at ? this.getDate(item.created_at) : ''}</Text>
                </View>
                <View style={styles.txtContainer}>
                    <Text style={styles.txtTitle}>Name Of Property</Text>
                    <Text style={styles.txtValue}>{item.pname}</Text>
                </View>
                <View style={styles.txtContainer}>
                    <Text style={styles.txtTitle}>Address</Text>
                    <Text style={styles.txtValue}>{item.address}
                        {/* , {item.zipcode}, {item.country} */}
                    </Text>
                </View>
                <View style={styles.txtContainer}>
                    <Text style={styles.txtTitle}>Property Type</Text>
                    <Text style={styles.txtValue}>{item.property_type_str}</Text>
                </View>
                <View style={styles.txtContainer}>
                    <Text style={styles.txtTitle}>Bedrooms</Text>
                    <Text style={styles.txtValue}>{item.beds}</Text>
                </View>
                <View style={styles.txtContainer}>
                    <Text style={styles.txtTitle}>Bathrooms</Text>
                    <Text style={styles.txtValue}>{item.baths}</Text>
                </View>
                <View style={styles.txtContainer}>
                    <Text style={styles.txtTitle}>Rooms</Text>
                    <Text style={styles.txtValue}>{item.rooms}</Text>
                </View>
                <View style={styles.txtContainer}>
                    <Text style={styles.txtTitle}>Property Size (Sq. Ft.)</Text>
                    <Text style={styles.txtValue}>{item.sqft}</Text>
                </View>
                <View style={styles.txtContainer}>
                    <Text style={styles.txtTitle}>Lot Size (Sq. Ft.)</Text>
                    <Text style={styles.txtValue}>{item.lot_size}</Text>
                </View>
                <View style={styles.txtContainer}>
                    <Text style={styles.txtTitle}>Built In</Text>
                    <Text style={styles.txtValue}>{item.built_in}</Text>
                </View>
                {/* <View style={styles.txtContainer}>
                    <Text style={styles.txtTitle}>Property Value</Text>
                    <NumberFormat
                        value={item.price_per_sqft}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={''}
                        renderText={value => <Text style={styles.txtValue}>{value}</Text>}
                    />
                </View> */}
                <View style={styles.txtContainer}>
                    <Text style={[styles.txtTitle, { color: Colors.black, fontFamily: Fonts.bold, }]}>{item.status == 0 ? 'Price/Month' : 'Price'}</Text>
                    <NumberFormat
                        value={item.price}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={''}
                        renderText={value => <Text style={[styles.txtValue, { color: Colors.green, fontFamily: Fonts.bold, }]}>{item.currency}{Utility.currency}{value}</Text>}
                    />
                </View>
                <Text style={styles.txtDescriptionTitle}>DESCRIPTION</Text>
                <Text style={styles.txtDescriptionValue}>{item.pdes}</Text>
                <View style={{ flex: 1, marginVertical: 4 }}>
                    {/*   <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.txtDescriptionTitle}>SITE LOCATION</Text>
                        <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginStart: 8 }} >
                            <Image style={styles.emailContactImage} source={Images.info} />
                        </View>
                        <Text style={styles.toolTip}>Zoom In or click pin for directions</Text>
                        <PopoverTooltip
                            ref='tooltip4'
                            buttonComponent={
                                <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginStart: 8 }} onPress={}>
                                    <Image style={styles.emailContactImage} source={Images.info} />
                                </View>
                            }
                            items={[
                                {
                                    label: 'Zoom In or click pin for directions',
                                    onPress: () => { }
                                }
                            ]}
                            animationType='spring'
                            overlayStyle={{ backgroundColor: 'transparent' }} // set the overlay invisible
                            tooltipContainerStyle={{ borderRadius: 0 }}
                            labelContainerStyle={{ backgroundColor: Colors.white, width: 250, alignItems: 'center', borderColor: Colors.grey6D6D, borderWidth: 2, borderRadius: 15, borderStyle: 'dashed', }}
                            labelSeparatorColor='#1BD1A5' /> 

                    </View>
                    <MapView
                        provider={Utility.isPlatformAndroid ? PROVIDER_GOOGLE : null}
                        mapType='satellite'
                        region={region}
                        // showsMyLocationButton={true}
                        toolbarEnabled={true}
                        style={{ height: 180, flex: 1 }}
                        initialRegion={{
                            latitude: item.lat ? Number(item.lat) : 0,
                            longitude: item.log ? Number(item.log) : 0,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >
                        <MapView.Marker
                            coordinate={coordinate}
                            title={item.pname}
                            description={item.address + ', ' + item.zipcode + ', ' + item.country}
                            onPress={this.markerClick.bind(this, item)}
                        />
                    </MapView>
                    */}
                    <TouchableOpacity activeOpacity={0.7} onPress={this.reservePropertyPress.bind(this)}>
                        {/* Register Now To Bid */}
                        <Text style={[styles.placeBid, { fontFamily: Fonts.bold, fontSize: Utility.NormalizeFontSize(15) }]}>{'Request showing'}</Text>
                    </TouchableOpacity>
                    <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginTop: 10 }}>
                        <TouchableOpacity activeOpacity={0.7} onPress={this.onEmailPressed.bind(this, item.agent)}>
                            <Image style={styles.emailContactImage} source={Images.mail} />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} onPress={this.onCallPressed.bind(this, item.agent)}>
                            <Image style={styles.emailContactImage} source={Images.call} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.txtDescriptionTitle}>SITE LOCATION</Text>
                            <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginStart: 8 }} >
                                <Image style={styles.emailContactImage} source={Images.info} />
                            </View>
                            <Text style={styles.toolTip}>Zoom In or click pin for directions</Text>
                        </View>
                        <MapView
                            // provider={Utility.isPlatformAndroid ? PROVIDER_GOOGLE : null}
                            provider={PROVIDER_GOOGLE}
                            mapType='satellite'
                            // region={this.state.regionSet == false ? region : null}
                            // showsMyLocationButton={true}
                            toolbarEnabled={true}
                            // style={{ height: 160 }}
                            style={{ height: 160 }}
                            onMapReady={() => {
                                // this.setState({ regionSet: true });//regionSet set becuase when we zoom in then map will re render and set Marker again
                            }}
                            initialRegion={region}
                        // initialRegion={this.state.regionSet == false ? {
                        //     latitude: item.lat ? Number(item.lat) : 0,
                        //     longitude: item.log ? Number(item.log) : 0,
                        //     latitudeDelta: 0.0922,
                        //     longitudeDelta: 0.0421,
                        // } : null}
                        >
                            <MapView.Marker
                                coordinate={coordinate}
                                title={item.pname}
                                description={item.address
                                    // + ', ' + item.zipcode + ', ' + item.country
                                }
                                onPress={this.markerClick.bind(this, item)}
                            />
                        </MapView>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    getDate(timesamp) {
        return moment.unix(timesamp).format('MMM DD, YYYY');
    }

    markerClick(item) {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${item.lat ? Number(item.lat) : 0},${item.lon ? Number(item.lon) : 0}`;
        const label = item.pname;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        console.log('scheme', url)
        Linking.openURL(url);
    }

    onCallPressed(item) {
        let supportContactNumber = item.sms
        let phoneNumber = Utility.isPlatformAndroid ? `tel:${supportContactNumber}` : `telprompt:${supportContactNumber}`;
        Linking.openURL(phoneNumber);
    }
    onEmailPressed(item) {
        // TODO Email content
        let email = item.email
        let title = ''
        let body = ''
        Linking.openURL(`mailto:${email}?subject=${title}&body=${body}`)
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
    async onSharePress(propertyDetails) {
        // const link = await firebase.dynamicLinks().buildLink({
        //     link: `http://www.jmviapp.com?type=2&id=${this.state.property_id}`,
        //     domainUriPrefix: 'http://jmviapp.page.link',
        //     android: {
        //         packageName: 'com.jmvirealty.app',
        //         minimumVersion: '21',
        //         fallbackUrl: Utility.AppLink
        //     }
        // });
        // const link =
        // new firebase.links.DynamicLink(
        //     encodeURI(`http://www.jmviapp.com?type=2&id=${this.state.property_id}`),
        //     'http://www.jmviapp.com')
        //     .android.setPackageName('com.jmvirealty.app')
        //     .ios.setBundleId('com.jmvirealty.app');
        this.setState({ spinnerVisible: true })
        const link =
            new firebase.links.DynamicLink(
                // encodeURI(`http://www.jmvirealty.page.link?type=2&id=${this.state.property_id}`),
                `https://jmvirealty.page.link?type=2&id=${this.state.property_id}`,
                // `https://com.projects.JMVI?type=2&id=${this.state.property_id}`,
                // `https://jmvirealtyapp://property/2/${this.state.property_id}`,
                'https://jmvirealty.page.link'
            )
                .android.setPackageName('com.jmvirealty.app')
                .android.setFallbackUrl(Utility.AndroidLink)
                .ios.setBundleId('com.projects.JMVI')
                .ios.setFallbackUrl(Utility.iOSLink)
                .social.setTitle(propertyDetails.pname)
                .social.setDescriptionText(propertyDetails.pdes)
                .social.setImageUrl(Array.isArray(propertyDetails.photos) ? propertyDetails.photos.length > 0 ? propertyDetails.photos[0].photo_url : '' : '')
        // .catch(err => {
        //     console.log('err',err)
        //     this.setState({ spinnerVisible: false })
        // });
        // const link = `https://www.jmviapp.com.page.link/?link=http://www.jmviapp.com?type=2&id=${this.state.property_id}&apn=com.jmvirealty.app&amv=21&ibi=com.jmvirealty.app&isi=1234567&afl=${Utility.AppLink}`

        firebase.links()
            .createShortDynamicLink(link, 'UNGUESSABLE')
            // .createDynamicLink(link)
            .then((url) => {
                // ...
                this.setState({ spinnerVisible: false })
                //TODO Ask to client please provide format
                var shareContent = 'Check out ' + propertyDetails.pname
                shareContent = shareContent + ' that is ' + (propertyDetails.status == 0 ? 'For Rent' : 'For Sale') + " in " + propertyDetails.country
                shareContent = shareContent + "\n" + '' + url
                shareContent = shareContent + "\n" + '' + propertyDetails.pdes
                console.log('shareContent', shareContent)
                if (shareContent != '') {
                    UtilityController.shareRefLink(shareContent)
                }
                // var shareContent = '' + propertyDetails.pname
                // shareContent = shareContent + "\n" + `${propertyDetails.currency ? propertyDetails.currency : '$'} ${propertyDetails.price}`
                // shareContent = shareContent + "\n" + propertyDetails.address + ', ' + propertyDetails.zipcode + ', ' + propertyDetails.country
                // shareContent = shareContent + "\n" + (propertyDetails.status == 0 ? 'For Rent' : 'For Sale')
                // shareContent = shareContent + "\n" + '' + propertyDetails.pdes
                // shareContent = shareContent + "\n" + '' + url
                // console.log('shareContent', shareContent)
                // if (shareContent != '') {
                //     UtilityController.shareRefLink(shareContent)
                // }
            }).catch(err => {
                this.setState({ spinnerVisible: false })
            });
    }
    // async onSharePress(propertyDetails) {
    //     // const link =
    //     //     new firebase.links.DynamicLink(
    //     //         // encodeURI(`http://www.jmvirealty.page.link?type=2&id=${this.state.property_id}`),
    //     //         `http://www.jmvirealty.page.link?type=2&id=${this.state.property_id}`,
    //     //         'jmvirealty.page.link')
    //     //         .android.setPackageName('com.jmvirealty.app')
    //     //         .ios.setBundleId('com.jmvirealty.app');
    //     // // const link = `https://www.jmviapp.com.page.link/?link=http://www.jmviapp.com?type=2&id=${this.state.property_id}&apn=com.jmvirealty.app&amv=21&ibi=com.jmvirealty.app&isi=1234567&afl=${Utility.AppLink}`

    //     // firebase.links()
    //     //     // .createShortDynamicLink(link, 'UNGUESSABLE')
    //     //     .createDynamicLink(link)
    //     //     .then((url) => {
    //     //         // ...
    //     //         //TODO Ask to client please provide format
    //     //         var shareContent = 'Check out ' + propertyDetails.pname
    //     //         shareContent = shareContent + ' that is ' + (propertyDetails.status == 0 ? 'For Rent' : 'For Sale') + " in " + propertyDetails.country
    //     //         shareContent = shareContent + "\n" + '' + url
    //     //         shareContent = shareContent + "\n" + '' + propertyDetails.pdes
    //     //         console.log('shareContent', shareContent)
    //     //         if (shareContent != '') {
    //     //             UtilityController.shareRefLink(shareContent)
    //     //         }
    //     //     });

    //     this.setState({ spinnerVisible: true });
    //     var params = {
    //         "dynamicLinkInfo": {
    //             "domainUriPrefix": `http://www.jmvirealty.page.link`,
    //             "link": `http://www.jmvirealty.page.link?type=2&id=${this.state.property_id}`,
    //             "androidInfo": {
    //                 "androidPackageName": "com.jmvirealty.app"
    //             },
    //             "iosInfo": {
    //                 "iosBundleId": "com.jmvirealty.app"
    //             },
    //         },
    //     }
    //     console.log('PARAMS', params)
    //     API_FIREBASE.postRequest('shortLinks?key=' + Utility.WEB_API_KEY, params, (status, data) => {
    //         this.setState({
    //             spinnerVisible: false,
    //         });
    //         console.log('shortLinks', data)
    //         if (status) {
    //         } else {
    //             Utility.showToast('Details not found')
    //         }
    //     }, true, this.props);
    // }

    scrollToIndex = (index, animated) => {
        this.flatlist && this.flatlist.scrollToIndex({ index, animated })
    }
    render() {
        var { propertyDetails } = this.state
        // console.log('propertyDetails', propertyDetails.photos.length)
        return (
            <SafeAreaView style={styles.mainView}>
                {
                    propertyDetails ?
                        <View style={styles.safeAreaView}>
                            <ScrollView style={{ flex: 1, marginBottom: 4 }}
                                showsVerticalScrollIndicator={false}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isFetching}
                                        onRefresh={this.onRefresh.bind(this)}
                                    //   title="Loading..."
                                    />
                                }>
                                <FlatList
                                    // style={{ backgroundColor: Colors.redColor }}
                                    data={Array.isArray(propertyDetails.photos) ? propertyDetails.photos : []}
                                    horizontal={true}
                                    extraData={this.state}
                                    renderItem={this.renderPhotoItem.bind(this)}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    ref={el => this.flatlist = el}
                                    initialScrollIndex={0}// Because if initialPage is 0 or 1 then not loading all data.
                                    // initialNumToRender={(Array.isArray(propertyDetails.photos) ? propertyDetails.photos : []).length}
                                    // onViewableItemsChanged={this.onViewableItemsChanged }
                                    // viewabilityConfig={{
                                    //     itemVisiblePercentThreshold: 150
                                    // }}
                                    // ItemSeparatorComponent={this.flatListItemSeparator}
                                    snapToInterval={Utility.screenWidth}
                                    snapToAlignment={'center'}
                                />
                                <View style={styles.favoriteShareContainer}>
                                    <TouchableOpacity onPress={() => this.state.isFavourite == 1 ? this.removeFromFavouritePress() : this.addToFavouritePress()} activeOpacity={0.7}>
                                        <Image style={this.state.isFavourite == 1 ? styles.favouriteImage : styles.unfavouriteImage} source={this.state.isFavourite == 1 ? Images.ic_fill_heart : Images.ic_heart} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.onSharePress(propertyDetails)} activeOpacity={0.7}>
                                        <Text style={styles.txtShare}>Share</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.auctionDetailsContainer}>
                                    {this.renderRowItem(propertyDetails)}
                                    {/* <View style={{ flex: 1, }}>
                                <FlatList
                                    data={propertyDetails.realestate}
                                    extraData={this.state}
                                    renderItem={this.renderRowItem.bind(this)}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    ItemSeparatorComponent={this.flatListItemSeparator}
                                />
                            </View> */}
                                </View>
                            </ScrollView>
                        </View>
                        : null
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
                <Spinner visible={this.state.spinnerVisible} />
            </SafeAreaView>
        )
    }

    //Navigation
    onBackPressed(isSuccess) {
        var params = {
            'isSuccess': isSuccess,
            to: this.props.navigation.state.params.to,
        }
        this.props.navigation.state.params.onNavigateBack(params);
        // this.props.navigation.goBack();
    }

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
        // this.props.navigation.dispatch(popAction);
        this.props.navigation.dispatch(StackActions.popToTop());
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.dispatch(navigateAction);
    }

    onGalleryItemPressed(index) {
        // var arrImages = []
        // for (let index = 0; index < this.state.arrGallery.length; index++) {
        //     const element = this.state.arrGallery[index];
        //     var source = {
        //         source: { uri: element.url, dimensions: { width: 1080, height: 1920 } }
        //     }
        //     arrImages[index] = source
        // }
        var { propertyDetails } = this.state
        var photoArray = Array.isArray(propertyDetails.photos) ? propertyDetails.photos : []
        var params = {
            onNavigateBack: this.handleOnNavigateBack.bind(this),
            from: Utility.SCREEN.GalleryDetails,
            to: Utility.SCREEN.GallerySwiper,
            // 'arrImages': arrImages,
            'arrGallery': photoArray,
            'initialPage': index
        };
        if (photoArray.length > 0) {
            this.props.navigation.navigate(Utility.SCREEN.GallerySwiper, params)
        }
    }

    itemPressed(item) {
        // var params = {
        //     onNavigateBack: this.handleOnNavigateBack.bind(this),
        //     from: Utility.SCREEN.News,
        //     to: Utility.SCREEN.NewsDetails,
        //     'newsItem': newsItem,
        // };
        // this.props.navigation.navigate(Utility.SCREEN.NewsDetails, params)
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
export default PropertyDetailsController