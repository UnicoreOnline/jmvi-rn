import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList,
    TextInput
} from 'react-native'

import commonstyles from '../commonstyles'
import styles from './styles'
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

class MortgageFinancingListingController extends Component {
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
            arrFilteredResult: [],
            arrDATA: [],
            searchText: "",
            isDataReceived: false,
            isFetching: false,
        }
    }

    componentDidMount() {
        this.callGetData(true)
    }

    onRefresh() {
        this.setState({ isFetching: true, searchText: '' }, function () {
            this.callGetData(false)
        });
    }
    callGetData(isShowLoading) {
        this.setState({ spinnerVisible: isShowLoading });
        var params = {
            api_key: Utility.API_KEY,
            'get_bank': 1,
        }
        API.getRequest('get_data.php', params, (status, data) => {
            this.setState({
                spinnerVisible: false,
                isDataReceived: true,
                isFetching: false
            });
            if (status) {
                this.setState({
                    arrDATA: data.bank,
                    arrFilteredResult: data.bank,
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
    searchFilterFunction(searchText) {
        var arrTemp = []
        if (searchText.length > 0) {
            for (let i = 0; i < this.state.arrDATA.length; i++) {
                if (searchText) {
                    if (this.state.arrDATA[i].bank_name.toLowerCase().includes(searchText.toLowerCase())) {
                        arrTemp.push(this.state.arrDATA[i])
                    }
                }
            }
        } else {
            // for (let i = 0; i < this.state.arrSearchList.length; i++) {
            //     var temp = this.state.arrSearchList[i]
            //     if (temp.status == 1) {
            //         arrTemp.push(temp)
            //     }
            // }
            arrTemp = this.state.arrDATA;
        }
        this.setState({ arrFilteredResult: arrTemp, searchText: searchText.trim() })
        // this.setState({ searchText: searchText.trim() })
    }

    renderRowData(rowData) {
        var item = rowData.item
        var index = rowData.index
        return (
            <TouchableOpacity style={styles.agentMainContainer} onPress={this.itemPressed.bind(this, item)} activeOpacity={0.5}>
                {/* <ProgressiveImage
                    style={styles.serviceImage}
                    uri={item.thumb_url}
                    // image={Images.agent_placeholder}
                    placeholderSource={Images.agent_placeholder}
                    placeholderStyle={styles.serviceImage}
                    onLoadEnd={(a) => { console.log('load end >> ' + a); }} /> */}
                <View style={styles.agentDetailContainer}>
                    <View style={styles.txtContainer}>
                        <Text style={styles.txtAgentName}>{item.bank_name}</Text>
                        {/* <Text style={styles.txtCompanyName}>{item.company}</Text> */}
                    </View>
                    <Image style={styles.arrowImage} source={Images.backbuttonIcon} />
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
            <View style={styles.safeAreaView}>
                <TextInput
                    style={styles.inputSearchTxt}
                    placeholderTextColor={Colors.placeholderTextColor}
                    onChangeText={(searchText) => this.searchFilterFunction(searchText)}
                    value={this.state.searchText}
                    placeholder={'Bank Name'}
                    placeholderTextColor={Colors.grey7F7F}
                    autoCapitalize="none"
                    maxLength={255}
                    underlineColorAndroid='transparent'
                    selectionColor={Colors.selectionColor}
                />
                {
                    this.state.arrDATA.length > 0 ?
                        <FlatList
                            data={this.state.arrFilteredResult}
                            extraData={this.state}
                            onRefresh={() => this.onRefresh()}
                            refreshing={this.state.isFetching}
                            renderItem={this.renderRowData.bind(this)}
                            keyExtractor={(item, index) => index.toString()}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={this.flatListItemSeparator}
                            keyboardShouldPersistTaps={'handled'}
                        />
                        : this.state.isDataReceived ? emptyView : null
                }

                <Spinner visible={this.state.spinnerVisible} />
            </View>
        )
    }

    //Navigation
    onBackPressed(isSuccess) {
        this.props.navigation.goBack();
    }

    itemPressed(item) {
        var params = {
            onNavigateBack: this.handleOnNavigateBack.bind(this),
            to: Utility.SCREEN.MortgageFinancingDetails,
            'bankDetails': item,
        };
        this.props.navigation.navigate(Utility.SCREEN.MortgageFinancingDetails, params)
    }

    handleOnNavigateBack = (params) => {
        if (params.isSuccess == true) {
            switch (params.to) {
                case Utility.SCREEN.MortgageFinancingDetails:
                    this.callGetData(false)
                    break;
                default:
                    break;
            }

        }
    }

}
export default MortgageFinancingListingController