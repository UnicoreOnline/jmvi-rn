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
import { NavigationActions, StackActions } from 'react-navigation';
import AsyncData from '../../config/AsyncData';
import moment from 'moment'
import NumberFormat from 'react-number-format';

class AuctionListingController extends Component {
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
        // console.log('arrDATA For Auction',navigation.getParam('arrDATA', []))
        this.state = {
            spinnerVisible: false,
            arrDATA: navigation.getParam('arrDATA', []),
            isFromSearch: navigation.getParam('isFromSearch', false),
            isDataReceived: false,
            isFetching: false,
        }
    }

    componentDidMount() {
        if (!this.state.isFromSearch) {
            this.callGetData(true)
        }
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
            country: Utility.country_name ? Utility.country_name : '',
            'user_id': Utility.user ? Utility.user.user_id : '',
            'get_auction': 1,
        }
        API.getRequest('get_data.php', params, (status, data) => {
            this.setState({
                spinnerVisible: false,
                isDataReceived: true,
                isFetching: false
            });
            if (status) {
                this.setState({
                    arrDATA: data.auction,
                });

            } else {
                // Utility.showToast('' + data.message)
            }
        }, true, this.props);
    }

    _handleFocusChanged(event) {
        if (event.type) {
            if (event.type == 'willBlur') {
            } else {

            }
        }

    }

    renderRowItem(rowData) {
        var item = rowData.item
        var index = rowData.index
        var realestate = item.realestate ? item.realestate[0] : {}
        return (
            <TouchableOpacity onPress={this.itemPressed.bind(this, item)} style={commonstyles.auctionItemMainContainer} activeOpacity={1}>
                <ProgressiveImage
                    style={commonstyles.imageStyle}
                    uri={Array.isArray(item.photos) ? item.photos.length > 0 ? item.photos[0].thumb_url : '' : ''}
                    // placeholderSource={Images.home}
                    onLoadEnd={(a) => { console.log('load end >> ' + a); }} />
                <View style={commonstyles.auctionItemContainer}>
                    <View style={commonstyles.txtContainer}>
                        {/* <Text style={commonstyles.txtAuctionName}>Starting Bid {item.currency}{Utility.currency}{item.starting_bid}</Text> */}
                        <NumberFormat
                            value={item.starting_bid}
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={''}
                            renderText={value => <Text style={commonstyles.txtAuctionName}>Starting Bid {item.currency}{Utility.currency}{value}</Text>}
                        />
                        {
                            realestate ?
                                <Text style={commonstyles.txtAuctionName}>{realestate.address
                                    // + ', ' + realestate.zipcode + ', ' + realestate.country
                                }</Text> : null
                        }
                        <Text style={commonstyles.txtAuctionDate}>{this.getDate(item.start_time)}</Text>
                        {/* <Text style={commonstyles.txtCompanyName}>{item.companyName}</Text> */}
                    </View>
                    {
                        realestate ?
                            <View style={commonstyles.txtBedBathContainer}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image style={commonstyles.bedsImage} source={Images.bed} />
                                    <Text style={commonstyles.txtAuctionName}>{realestate.beds}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginTop: 4 }}>
                                    <Image style={commonstyles.bedsImage} source={Images.bath} />
                                    <Text style={commonstyles.txtAuctionName}>{realestate.baths}</Text>
                                </View>
                            </View> : null
                    }
                </View>
            </TouchableOpacity>
        )
    }

    getDate(date) {
        return moment(date).format('MMM DD YYYY');
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
                            keyboardShouldPersistTaps={'handled'}
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
            to: Utility.SCREEN.AuctionDetails,
            'auctionDetails': item,
            'id': item.id,
        };
        this.props.navigation.navigate(Utility.SCREEN.AuctionDetails, params)
    }

    handleOnNavigateBack = (params) => {
        if (params.isSuccess == true) {
            switch (params.to) {
                case Utility.SCREEN.AuctionDetails:
                    // this.callGetData(false);
                    break;
                default:
                    break;
            }

        }
    }

}
export default AuctionListingController