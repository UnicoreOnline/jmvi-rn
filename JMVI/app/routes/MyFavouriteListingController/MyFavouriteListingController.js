import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList
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
import NumberFormat from 'react-number-format';

class MyFavouriteListingController extends Component {
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
            arrDATA: [],
            isDataReceived: false,
            isFetching: false,
            isFocusSecondTime: false,
        }
    }

    componentDidMount() {
        this.callGetData(true)
    }


    onRefresh() {
        this.setState({ isFetching: true }, function () {
            this.callGetData(false)
        });
    }

    callGetData(isShowLoading) {
        this.setState({ spinnerVisible: isShowLoading });
        var params = {
            api_key: Utility.API_KEY,
            // 'lat': Utility.currentLATITUDE,
            // 'lon': Utility.currentLONGITUDE,
            'favorite': 1,
            'user_id': Utility.user ? Utility.user.user_id : 0,
            // 'for_rent': 1,
        }
        API.getRequest('get_data.php', params, (status, data) => {
            this.setState({
                spinnerVisible: false,
                isDataReceived: true,
                isFetching: false
            });
            if (status) {
                this.setState({
                    arrDATA: data.real_estates,
                });

            } else {
                Utility.showToast('' + data.message)
            }
        }, true, this.props);
    }

    renderRowItem(rowData) {
        var item = rowData.item
        var index = rowData.index
        return (
            <TouchableOpacity onPress={this.itemPressed.bind(this, item)} style={commonstyles.auctionItemMainContainer} activeOpacity={1}>
                <ProgressiveImage
                    style={commonstyles.imageStyle}
                    uri={Array.isArray(item.photos) ? item.photos.length > 0 ? item.photos[0].thumb_url : '' : ''}
                    // placeholderSource={Images.home}
                    onLoadEnd={(a) => { console.log('load end >> ' + a); }} />
                <View style={commonstyles.auctionItemContainer}>
                    <View style={commonstyles.txtContainer}>
                        {/* <Text style={commonstyles.txtAuctionName}>{item.currency}{Utility.currency}{item.price}</Text> */}
                        <NumberFormat
                            value={item.auction_id ? item.starting_bid : item.price}
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={''}
                            renderText={value => <Text style={commonstyles.txtAuctionName}>{item.auction_id ? 'Starting Bid ' : ''}{item.currency}{Utility.currency}{value}</Text>}
                        />
                        <Text style={commonstyles.txtAuctionName}>{item.address
                            // + ', ' + item.zipcode + ', ' + item.country
                        }</Text>
                        <Text style={commonstyles.txtAuctionDate}>{item.auction_id ? 'Auction' : (item.status == 0 ? 'For Rent' : 'For Sale')}</Text>
                    </View>
                    <View style={commonstyles.txtBedBathContainer}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image style={commonstyles.bedsImage} source={Images.bed} />
                            <Text style={commonstyles.txtAuctionName} numberOfLines={1}>{item.beds}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 4 }}>
                            <Image style={commonstyles.bedsImage} source={Images.bath} />
                            <Text style={commonstyles.txtAuctionName} numberOfLines={1}>{item.baths}</Text>
                        </View>
                    </View>
                </View>
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
    render() {
        var emptyView = <View style={commonstyles.noRecordsFoundContainerStyle}>
            <Text style={commonstyles.noRecordsFoundTextStyle}>No records available</Text>
            <TouchableOpacity onPress={() => this.callGetData(true)} activeOpacity={0.5}>
                <Text style={commonstyles.retryTextStyle}>Try Again</Text>
            </TouchableOpacity>
        </View>
        return (
            <View style={commonstyles.safeAreaView}>
                {/*  */}
                <NavigationEvents
                    onWillFocus={payload => {
                        this.callGetData(true)
                        // console.log('AAAAAAAAA will focus', payload)
                    }
                    }
                    onDidFocus={payload => console.log('AAAAAAAAA did focus', payload)}
                    onWillBlur={payload => {
                        // console.log('AAAAAAAAA will blur', payload)
                    }}
                    onDidBlur={payload => {
                        this.setState({ isFocusSecondTime: true }); console.log('AAAAAAAAA did blur', payload)
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
                <Spinner visible={this.state.spinnerVisible} />
            </View>
        )
    }

    //Navigation
    onBackPressed(isSuccess) {
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
        var params = {
            onNavigateBack: this.handleOnNavigateBack.bind(this),
            from: Utility.SCREEN.News,
            to: Utility.SCREEN.PropertyDetails,
            'propertyDetails': item,
            'id': item.auction_id ? item.auction_id : item.realestate_id
        };
        if (item.auction_id) {
            this.props.navigation.navigate(Utility.SCREEN.AuctionDetails, params)
        } else {
            this.props.navigation.navigate(Utility.SCREEN.PropertyDetails, params)
        }
    }

    handleOnNavigateBack = (params) => {
        console.log('handleOnNavigateBack MyFavouriteDDDDDD')
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
export default MyFavouriteListingController