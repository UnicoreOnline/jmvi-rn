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
import NumberFormat from 'react-number-format';

class PropertyListingController extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Property',
            drawerLabel: 'Property',
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
            arrDATA: navigation.getParam('arrDATA', []),
            isFromSearch: navigation.getParam('isFromSearch', false),
            isDataReceived: false,
            isFetching: false,
        }
    }
    // componentDidUpdate(prevProps) {
    //     const { isDrawerOpen } = this.props.navigation.state;
    //     if (!isDrawerOpen) {
    //         this.callGetAuctionList()
    //     }
    // }
    componentDidMount() {
    }

    onRefresh() {
        console.log('refreshing')
        this.setState({ isFetching: true }, function () {
            setTimeout(() => {
                this.setState({ isFetching: false })
            }, 2500);
        });
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
                            value={item.price}
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={''}
                            renderText={value => <Text style={commonstyles.txtAuctionName}>{item.currency}{Utility.currency}{value}</Text>}
                        />
                        <Text style={commonstyles.txtAuctionName}>{item.address
                            //  + ', ' + item.zipcode + ', ' + item.country
                        }</Text>
                        <Text style={commonstyles.txtAuctionDate}>{item.status == 0 ? 'For Rent' : 'For Sale'}</Text>
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
        var emptyView = <Text style={commonstyles.noRecordsFoundTextStyle}>No records available</Text>;
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
export default PropertyListingController