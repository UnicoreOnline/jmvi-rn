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
    RefreshControl
} from 'react-native'

import styles from './styles'
import commonstyles from '../commonstyles'
import Images from '../../config/Images'
import Utility from '../../config/Utility'
import SafeAreaView from '../../component/SafeAreaView'
import Spinner from 'react-native-loading-spinner-overlay'
import API from '../../config/API'
import User from '../../models/User';
import Colors from '../../config/Colors';
import ProgressiveImage from '../../component/ProgressiveImage'
import { NavigationActions, StackActions } from 'react-navigation';
import AsyncData from '../../config/AsyncData';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import AddBidValueController from '../AddBidValueController/AddBidValueController'
import Modal from 'react-native-modalbox';
import moment from 'moment'
import CountDown from 'react-native-countdown-component';
import PopoverTooltip from 'react-native-popover-tooltip';
var UtilityController = NativeModules.UtilityController;
import firebase from 'react-native-firebase';
import NumberFormat from 'react-number-format';
import Fonts from '../../config/Fonts'

// var auctionDetails = {}
class AuctionDetailsController extends Component {
    static navigationOptions = ({ navigation }) => {
        // auctionDetails = navigation.getParam('auctionDetails', {})
        return {
            // title: navigation.getParam('auctionDetails', {}),
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
        console.log('IDDDDDDDD', navigation.getParam('id', -1))
        this.state = {
            spinnerVisible: false,
            // arrDATA: []
            auction_id: navigation.getParam('id', -1),
            auctionDetails: navigation.getParam('auctionDetails', undefined),
            isFavourite: navigation.getParam('auctionDetails', undefined) ? navigation.getParam('auctionDetails', undefined).is_favorite : 0,
            addBidAmountModalVisible: false,
            bid_amount: 0,
            isFetching: false,
            regionSet: false
        }
    }

    componentDidMount() {
        if (this.state.auction_id != -1) {
            this.callAuctionDetails(true)
        } else {
            if (this.state.auctionDetails) {
                this.setState({ auction_id: this.state.auctionDetails.id })
            } else {
                this.onBackPressed(true)
            }
        }
    }

    onRefresh() {
        this.setState({ isFetching: true }, function () {
            this.callAuctionDetails(false)
        });
    }

    callAuctionDetails(isShowLoading) {
        this.setState({ spinnerVisible: isShowLoading });
        var params = {
            api_key: Utility.API_KEY,
            'user_id': Utility.user ? Utility.user.user_id : 0,
            country: Utility.country_name ? Utility.country_name : '',
            'lat': Utility.currentLATITUDE,
            'lon': Utility.currentLONGITUDE,
            'radius': 1,
            'auction_id': this.state.auction_id,
        }
        API.getRequest('get_data.php', params, (status, data) => {
            this.setState({
                spinnerVisible: false,
                isDataReceived: true,
                isFetching: false
            });
            if (status) {
                if (Array.isArray(data.auction)) {
                    Utility.showToast('Details not found')
                    this.onBackPressed()
                } else {
                    this.setState({
                        auctionDetails: data.auction,
                        isFavourite: data.auction.is_favorite
                    });
                    if (Utility.country_name == undefined) {
                        AsyncData.saveAsyncDataString('country_name', data.auction.country + '');
                        Utility.country_name = data.auction.country
                    }
                }
            } else {
                Utility.showToast('Details not found')
                this.onBackPressed()
            }
        }, true, this.props);
    }

    placeBidPress(auctionDetails) {
        if (Utility.user) {
            console.log('auctionDetails.is_start_bid', auctionDetails.is_start_bid)
            if (auctionDetails.is_start_bid == 1) {
                if (moment.duration(moment(auctionDetails.end_time).diff(new Date())).asSeconds() < 0) {
                    Utility.showToast('Bid timing is over.')
                } else {
                    this.setState({ addBidAmountModalVisible: true })
                }
            } else {
                Utility.showToast('Sorry can not bid right now.')
            }
        } else {
            this.props.navigation.navigate(Utility.SCREEN.SignIn);
        }
    }

    placeBidAPI(bidAmount) {
        var { auctionDetails } = this.state
        this.setState({ spinnerVisible: true });
        var params = {
            api_key: Utility.API_KEY,
            'login_hash': Utility.user ? Utility.user.login_hash : '',
            'user_id': Utility.user ? Utility.user.user_id : '',
            'auction_id': this.state.auction_id,
            'name': Utility.user ? Utility.user.full_name : '',
            'bid_amount': bidAmount,
            'currency': auctionDetails.currency,
            'is_deleted': 0,
        }
        API.postRequest('post_bid.php', params, (status, data) => {
            this.setState({
                spinnerVisible: false
            });
            if (status) {
                this.callAuctionDetails(false)
                Utility.showSuccessToast('Bid submitted successfully')
            } else {
                Utility.showToast('' + data.message)
            }
        }, true, this.props);
    }
    //TODO
    deleteBid(item) {
        this.setState({ spinnerVisible: true });
        var params = {
            api_key: Utility.API_KEY,
            'login_hash': Utility.user ? Utility.user.login_hash : '',
            'user_id': Utility.user ? Utility.user.user_id : '',
            'auction_id': item.id,
            'name': item.name,
            'bid_amount': item.bid_amount,
            'currency': item.currency,
            'is_deleted': 1,
        }
        API.postRequest('post_bid.php', params, (status, data) => {
            this.setState({
                spinnerVisible: false
            });
            if (status) {
                this.callAuctionDetails(false)
                Utility.showSuccessToast('Reoved your Bid successfully')
            } else {
                Utility.showToast('' + data.message)
            }
        }, true, this.props);
    }

    reservePropertyPress() {
        if (Utility.user) {
            var { auctionDetails } = this.state
            this.setState({ spinnerVisible: true });
            var params = {
                api_key: Utility.API_KEY,
                'login_hash': Utility.user ? Utility.user.login_hash : '',
                'user_id': Utility.user ? Utility.user.user_id : '',
                'property_id': auctionDetails.property_id,
            }
            API.postRequest('post_reserved_property.php', params, (status, data) => {
                this.setState({
                    spinnerVisible: false
                });
                if (status) {
                    this.callAuctionDetails(false)
                    // Utility.showSuccessToast('Thank you for reserving the property. An Agent will contact you within 1 hour')
                    Utility.showSuccessToast('Thank you for your Request. An Agent will Contact you within 1 hour')
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
            var { auctionDetails } = this.state
            this.setState({ spinnerVisible: true });
            var params = {
                api_key: Utility.API_KEY,
                'login_hash': Utility.user ? Utility.user.login_hash : '',
                'user_id': Utility.user ? Utility.user.user_id : '',
                'property_id': auctionDetails.property_id,
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
            var { auctionDetails } = this.state
            this.setState({ spinnerVisible: true });
            var params = {
                api_key: Utility.API_KEY,
                'login_hash': Utility.user ? Utility.user.login_hash : '',
                'user_id': Utility.user ? Utility.user.user_id : '',
                'property_id': auctionDetails.property_id,
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


    getHeighestBidderName() {
        return this.state.auctionDetails.bids.filter((data) => data.bid_amount == this.state.auctionDetails.highest_bid).map(function ({ bid_amount, name }) {
            return { bid_amount, name };
        });
    }

    renderRowItem(rowData) {
        var item = rowData.item
        var index = rowData.index
        var { auctionDetails } = this.state
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
                <View style={styles.txtContainer}>
                    <Text style={styles.txtTitle}>Status</Text>
                    <Text style={styles.txtValue}>{'Auction'}</Text>
                </View>
                <View style={styles.txtContainer}>
                    <Text style={styles.txtTitle}>Date Added</Text>
                    <Text style={styles.txtValue}>{auctionDetails.created_at ? this.getDate(auctionDetails.created_at) : ''}</Text>
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
                <View style={styles.txtContainer}>
                    <Text style={styles.txtTitle}>Property Value</Text>
                    {/* <Text style={styles.txtValue}>{item.price_per_sqft}</Text> */}
                    <NumberFormat
                        value={item.price_per_sqft}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={''}
                        renderText={value => <Text style={styles.txtValue}>{item.org_currency}{Utility.currency}{value}</Text>}
                    />
                </View>
                {/* <View style={styles.txtContainer}>
                    <Text style={styles.txtTitle}>{item.status == 0 ? 'Price/Month' : 'Price'}</Text>
                    <NumberFormat
                        value={item.price}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={''}
                        renderText={value => <Text style={styles.txtValue}>{item.currency}{Utility.currency}{value}</Text>}
                    />
                </View> */}
                {/* <View style={styles.txtContainer}>
                    <Text style={styles.txtTitle}>Estimate</Text>
                    <Text style={styles.txtValue}>{auctionDetails.currency}{Utility.currency}{auctionDetails.estimate_price}</Text>
                </View> */}
                <View style={styles.txtContainer}>
                    <Text style={styles.txtTitleBold}>Starting Bid</Text>
                    {/* <Text style={styles.txtValue}>{auctionDetails.currency}{Utility.currency}{auctionDetails.starting_bid}</Text> */}
                    <NumberFormat
                        value={auctionDetails.starting_bid}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={''}
                        renderText={value => <Text style={[styles.txtValueBold, { color: Colors.redColor }]}>{auctionDetails.currency ? auctionDetails.currency : item.org_currency}{Utility.currency}{value}</Text>}
                    />
                </View>
                <View style={styles.txtContainer}>
                    <Text style={styles.txtTitle}>Start Time</Text>
                    <Text style={styles.txtValue}>{auctionDetails.auction_start_time}</Text>
                </View>
                <View style={styles.txtContainer}>
                    <Text style={styles.txtTitle}>Number of Bids</Text>
                    <Text style={styles.txtValue}>
                        {Array.isArray(auctionDetails.bids) ? auctionDetails.bids.length : 0}
                    </Text>
                </View>
                <View style={styles.txtContainer}>
                    <Text style={styles.txtTitleBold}>Highest Bid</Text>
                    {/* <Text style={styles.txtValue}>{auctionDetails.currency}{Utility.currency}{auctionDetails.highest_bid}</Text> */}
                    <NumberFormat
                        value={auctionDetails.highest_bid}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={''}
                        renderText={value => <Text style={styles.txtValueBold}>{auctionDetails.currency ? auctionDetails.currency : item.org_currency}{Utility.currency}{value}</Text>}
                    />
                </View>
                <View style={styles.txtContainer}>
                    <Text style={styles.txtTitleBold}>Highest Bidder</Text>
                    <Text style={styles.txtValueBold}>
                        {this.getHeighestBidderName().length > 0 ? this.getHeighestBidderName()[0].name : ''}
                    </Text>
                </View>
                {
                    Utility.user ?
                        <View style={styles.txtContainer}>
                            <Text style={styles.txtTitle}>Your Highest Bid</Text>
                            {/* <Text style={styles.txtValue}>{auctionDetails.currency}{Utility.currency}{auctionDetails.your_highest_bid}</Text> */}
                            <NumberFormat
                                value={auctionDetails.your_highest_bid}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={''}
                                renderText={value => <Text style={styles.txtValue}>{auctionDetails.currency ? auctionDetails.currency : item.org_currency}{Utility.currency}{value}</Text>}
                            />
                        </View>
                        : null
                }
                <View style={styles.txtContainer}>
                    <Text style={styles.txtTitleBold}>Time Left to Bid</Text>
                    {/* <Text style={styles.txtValue}>{this.getDate(auctionDetails.end_time)}</Text>*/
                        //    console.log('DATEEEE', moment.duration(moment(auctionDetails.end_time).diff(new Date())).asSeconds(), new Date(), moment(auctionDetails.end_time))
                    }
                    <CountDown
                        style={{ alignItems: 'flex-start', flex: 1 }}
                        size={8}
                        // until={moment.duration(moment(new Date('03/04/2020')).diff(new Date())).asSeconds()}
                        until={moment.duration(moment(auctionDetails.end_time).diff(new Date())).asSeconds()}
                        onFinish={() => { }}
                        digitStyle={{ backgroundColor: '#FFF', borderWidth: 0, borderColor: Colors.grayTextColor }}
                        digitTxtStyle={styles.txtValueBold}
                        timeLabelStyle={{ color: Colors.black, fontWeight: 'bold' }}
                        separatorStyle={styles.txtValue}
                        timeToShow={moment.duration(moment(auctionDetails.end_time).diff(new Date())).asDays() > 1 ? ['D', 'H', 'M', 'S'] : ['H', 'M', 'S']}
                        timeLabels={{ d: 'Days', h: 'Hours', m: 'Minutes', s: 'Seconds' }}
                        showSeparator
                    />
                </View>
                <Text style={styles.txtDescriptionTitle}>DESCRIPTION</Text>
                <Text style={styles.txtDescriptionValue}>{item.pdes}</Text>
                <View style={{ flex: 1, marginVertical: 4 }}>
                    {/* <Text style={styles.txtDescriptionTitle}>SITE LOCATION</Text> */}
                    {/* <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.txtDescriptionTitle}>SITE LOCATION</Text>
                        <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginStart: 8 }} >
                            <Image style={styles.emailContactImage} source={Images.info} />
                        </View>
                        <Text style={styles.toolTip}>Zoom In or click pin for directions</Text>
                         <PopoverTooltip
                            ref='tooltip4'
                            buttonComponent={
                                <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginStart: 8 }}>
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
                            onPress={() => this.markerClick(item)}
                        />
                    </MapView>*/}
                    <TouchableOpacity activeOpacity={0.7} onPress={this.placeBidPress.bind(this, auctionDetails)}>
                        <Text style={styles.placeBid}>Place Bid</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} onPress={this.reservePropertyPress.bind(this)}>
                        <Text style={[styles.placeBid, { fontFamily: Fonts.bold }]}>{'Register Now To Bid'}</Text>
                    </TouchableOpacity>
                    <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginTop: 10 }}>
                        <TouchableOpacity activeOpacity={0.7} onPress={this.onEmailPressed.bind(this, item)}>
                            <Image style={styles.emailContactImage} source={Images.mail} />
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} onPress={this.onCallPressed.bind(this, item)}>
                            <Image style={styles.emailContactImage} source={Images.call} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 10 }} >
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
                            style={{ height: 160, }}
                            onMapReady={() => {
                                // this.setState({ regionSet: true });//regionSet set becuase when we zoom in then map will re render and set Marker again
                            }}
                            initialRegion={this.state.regionSet == false ? region : null}
                        >
                            <MapView.Marker
                                coordinate={coordinate}
                                title={item.pname}
                                description={item.address
                                    // + ', ' + item.zipcode + ', ' + item.country
                                }
                                onPress={() => this.markerClick(item)}
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
    getDateTime(date) {
        return moment(date).format('MMM DD YYYY hh:mm:ss aa');
    }

    markerClick(item) {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${item.lat ? Number(item.lat) : 0},${item.lon ? Number(item.lon) : 0}`;
        const label = item.pname;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url);
    }

    onCallPressed(item) {
        //TODO For auction what to do onCall press
        let supportContactNumber = item.agent_contact_no
        let phoneNumber = Utility.isPlatformAndroid ? `tel:${supportContactNumber}` : `telprompt:${supportContactNumber}`;
        Linking.openURL(phoneNumber);
    }
    onEmailPressed(item) {
        let email = item.agent_email
        let title = ''
        let body = ''
        Linking.openURL(`mailto:${email}?subject=${title}&body=${body}`)
    }
    renderBidItem(rowData) {
        var item = rowData.item
        var index = rowData.index
        return (
            <TouchableOpacity style={styles.bidItemContainer} activeOpacity={1} >
                <Text style={styles.txtBidTitle}>{item.name}</Text>
                <Text style={styles.txtBidValue}>{item.currency}{Utility.currency}{item.bid_amount}</Text>
                {Utility.user ?
                    Utility.user.user_id == item.user_id ?
                        <TouchableOpacity activeOpacity={0.7} onPress={() => this.deleteBid(item)}>
                            <Image style={styles.emailContactImage} source={Images.trash} />
                        </TouchableOpacity> : null : null}
            </TouchableOpacity>
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
    async onSharePress(auctionDetails) {
        // const link =
        //     new firebase.links.DynamicLink(
        //         encodeURI(`http://www.jmviapp.com?type=1&id=${this.state.auction_id}`),
        //         'www.jmviapp.com')
        //         .android.setPackageName('com.jmvirealty.app')
        //         .ios.setBundleId('com.jmvirealty.app');
        //Create dynamic link
        this.setState({ spinnerVisible: true })
        var realestate = auctionDetails.realestate ? auctionDetails.realestate[0] : {}
        const link =
            new firebase.links.DynamicLink(
                `https://jmvirealty.page.link?type=1&id=${this.state.auction_id}`,
                'https://jmvirealty.page.link')
                .android.setPackageName('com.jmvirealty.app')
                .android.setFallbackUrl(Utility.AndroidLink)
                .ios.setBundleId('com.projects.JMVI')
                .ios.setFallbackUrl(Utility.iOSLink)
                .social.setTitle(realestate.pname)
                .social.setDescriptionText(realestate.pdes)
                .social.setImageUrl(auctionDetails.photos.length > 0 ? auctionDetails.photos[0].thumb_url : '');

        firebase.links()
            .createShortDynamicLink(link, 'UNGUESSABLE')
            // .createDynamicLink(link)
            .then((url) => {
                this.setState({ spinnerVisible: false })
                //TODO Ask to client please provide format
                var shareContent = 'Check out ' + realestate.pname
                shareContent = shareContent + ' that is ' + "in " + realestate.country
                shareContent = shareContent + "\n" + '' + url
                shareContent = shareContent + "\n" + '' + realestate.pdes
                console.log('shareContent', shareContent)
                // shareContent = shareContent + "\n" + `Starting Bid ${realestate.currency ? realestate.currency : '$'}${auctionDetails.starting_bid}`
                // shareContent = shareContent + "\n" + realestate.address + ', ' + realestate.zipcode + ', ' + realestate.country
                // shareContent = shareContent + "\n" + `Start Time: ${auctionDetails.start_time}`
                // shareContent = shareContent + "\n" + realestate.pdes
                // shareContent = shareContent + "\n" + '' + url
                if (shareContent != '') {
                    UtilityController.shareRefLink(shareContent)
                }
            }).catch(err => {
                this.setState({ spinnerVisible: false })
            });

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

    render() {
        var addBidAmountModal = <Modal
            position={"bottom"}
            style={{ backgroundColor: 'transparent', height: Utility.screenHeight / 2 - 50 }}
            transparent={true}
            isOpen={this.state.addBidAmountModalVisible}
            onClosed={() => {
                this.setState({ addBidAmountModalVisible: false });
            }}>
            <AddBidValueController
                closePopUp={(bidAmount) => this.setState({
                    addBidAmountModalVisible: false,
                }, this.placeBidAPI(bidAmount))} />
        </Modal>

        var { auctionDetails } = this.state
        // var realestateArray = Array.isArray(auctionDetails.realestate) ? auctionDetails.realestate : []
        // var item = realestateArray.length > 0 ? realestateArray[0] : {}
        // var coordinate = {
        //     latitude: item.lat ? Number(item.lat) : 0,
        //     longitude: item.lon ? Number(item.lon) : 0,
        // }
        // var region = {
        //     latitude: item.lat ? Number(item.lat) : 0,
        //     longitude: item.lon ? Number(item.lon) : 0,
        //     latitudeDelta: 0.0922,
        //     longitudeDelta: 0.0421,
        // }
        return (
            <SafeAreaView style={styles.mainView}>
                {
                    auctionDetails ?
                        <View style={styles.safeAreaView}>
                            <ScrollView style={{ flex: 1, marginBottom: 4 }}
                                showsVerticalScrollIndicator={false}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isFetching}
                                        onRefresh={this.onRefresh.bind(this)}
                                    />
                                }>
                                <View style={styles.auctionDetailsContainer}>
                                    {/* <ProgressiveImage
                                        style={styles.imageStyle}
                                        uri={auctionDetails.photos.length > 0 ? auctionDetails.photos[0].thumb_url : ''}
                                        // placeholderSource={Images.home}
                                        onLoadEnd={(a) => { console.log('load end >> ' + a); }} /> */}
                                    <FlatList
                                        // style={{ backgroundColor: Colors.redColor }}
                                        data={Array.isArray(auctionDetails.photos) ? auctionDetails.photos : []}
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
                                        {/* <TouchableOpacity onPress={() => this.addToFavouritePress()} activeOpacity={0.7}> */}
                                        <TouchableOpacity onPress={() => this.state.isFavourite == 1 ? this.removeFromFavouritePress() : this.addToFavouritePress()} activeOpacity={0.7}>
                                            <Image style={this.state.isFavourite == 1 ? styles.favouriteImage : styles.unfavouriteImage} source={this.state.isFavourite == 1 ? Images.ic_fill_heart : Images.ic_heart} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.onSharePress(auctionDetails)} activeOpacity={0.7}>
                                            <Text style={styles.txtShare}>Share</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1, marginHorizontal: 10, }}>
                                        <FlatList
                                            data={Array.isArray(auctionDetails.realestate) ? auctionDetails.realestate : []}
                                            extraData={this.state}
                                            renderItem={this.renderRowItem.bind(this)}
                                            keyExtractor={(item, index) => index.toString()}
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                            ItemSeparatorComponent={this.flatListItemSeparator}
                                            keyboardShouldPersistTaps={'handled'}
                                        />
                                    </View>
                                    {/* TODO Removed As per client comment. Might be It has to show in Property screen */}
                                    {/* <View style={{ flex: 1, }}>
                                        <Text style={styles.txtDescriptionTitle}>Bids</Text>
                                        <FlatList
                                            data={auctionDetails.bids}
                                            extraData={this.state}
                                            renderItem={this.renderBidItem.bind(this)}
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
                {addBidAmountModal}
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

    itemPressed(item) {
        // var params = {
        //     onNavigateBack: this.handleOnNavigateBack.bind(this),
        //     from: Utility.SCREEN.News,
        //     to: Utility.SCREEN.NewsDetails,
        //     'newsItem': newsItem,
        // };
        // this.props.navigation.navigate(Utility.SCREEN.NewsDetails, params)
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
        var { auctionDetails } = this.state
        var photoArray = Array.isArray(auctionDetails.photos) ? auctionDetails.photos : []
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
export default AuctionDetailsController