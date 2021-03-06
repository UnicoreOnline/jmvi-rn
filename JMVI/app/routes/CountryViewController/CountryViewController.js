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

class CountryViewController extends Component {
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
            selectedCountryId: 0,
            isDataReceived: false,
            isFetching: false,
        }
    }

    componentDidMount() {
        AsyncData.getAsyncData((country_name) => {
            if (country_name) {
                Utility.country_name = country_name
            }
        }, 'country_name');
        AsyncData.getAsyncData((country_id) => {
            console.log('country_id', typeof (country_id), ' ', country_id, parseInt(country_id))
            if (country_id != null) {
                Utility.country_id = country_id
                this.setState({ selectedCountryId: parseInt(country_id) }, this.callGetData(true))
            } else {
                this.callGetData(true)
            }
        }, 'country_id');

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
            'get_country': 1,
        }
        API.getRequest('get_data.php', params, (status, data) => {
            this.setState({
                spinnerVisible: false,
                isDataReceived: true,
                isFetching: false
            });
            if (status) {
                if (Array.isArray(data.country)) {
                    if (data.country.length > 0) {
                        if (this.state.selectedCountryId == 0) {
                            this.setState({ selectedCountryId: data.country[0].country_id })
                            Utility.country_id = data.country[0].country_id
                            AsyncData.saveAsyncDataString('country_id', data.country[0].country_id + '');
                            AsyncData.saveAsyncDataString('country_name', data.country[0].country_name + '');
                        }
                    }
                }
                this.setState({
                    arrDATA: data.country,
                    arrFilteredResult: data.country,
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

    checkPropertyData(item) {
        this.setState({ spinnerVisible: true });
        var params = {
            api_key: Utility.API_KEY,
            country: item.country_name,
        }
        API.postRequest('check_property.php', params, (status, data) => {
            this.setState({
                spinnerVisible: false,
                isDataReceived: true
            });
            if (status) {
                if (data.result_count > 0) {
                    this.setState({ selectedCountryId: item.country_id })
                    AsyncData.saveAsyncDataString('country_id', item.country_id + '');
                    AsyncData.saveAsyncDataString('country_name', item.country_name + '');
                    Utility.country_id = item.country_id
                    Utility.country_name = item.country_name
                } else {
                    Utility.showToast('No Results')
                }

            } else {
                // Utility.showToast('' + data.message)
            }
        }, true, this.props);
    }
    searchFilterFunction(searchText) {
        var arrTemp = []
        if (searchText.length > 0) {
            for (let i = 0; i < this.state.arrDATA.length; i++) {
                if (searchText) {
                    if (this.state.arrDATA[i].country_name.toLowerCase().includes(searchText.toLowerCase())) {
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
                <View style={styles.agentDetailContainer}>
                    <Image style={styles.dotImage} source={this.state.selectedCountryId == item.country_id ? Images.fill_circle : Images.circle} />
                    <View style={styles.txtContainer}>
                        <Text style={styles.txtAgentName}>{item.country_name}</Text>
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
            <View style={styles.safeAreaView}>
                <TextInput
                    style={styles.inputSearchTxt}
                    placeholderTextColor={Colors.placeholderTextColor}
                    onChangeText={(searchText) => this.searchFilterFunction(searchText)}
                    value={this.state.searchText}
                    placeholder={'Country Name'}
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
        this.checkPropertyData(item)
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
export default CountryViewController