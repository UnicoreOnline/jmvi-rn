import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList
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

class AgentListingController extends Component {
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
            country: Utility.country_name ? Utility.country_name : '',
            'get_agents': 1,
        }
        API.getRequest('get_data.php', params, (status, data) => {
            this.setState({
                spinnerVisible: false,
                isDataReceived: true,
                isFetching: false
            });
            if (status) {
                this.setState({
                    arrDATA: data.agents,
                });
                AsyncData.saveAsyncData('agents', data.agents);
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


    renderRowData(rowData) {
        var item = rowData.item
        var index = rowData.index
        return (
            <TouchableOpacity style={styles.agentMainContainer} onPress={this.itemPressed.bind(this, item)} activeOpacity={0.5}>
                <ProgressiveImage
                    style={styles.serviceImage}
                    uri={item.thumb_url}
                    // image={Images.agent_placeholder}
                    placeholderSource={Images.agent_placeholder}
                    placeholderStyle={styles.serviceImage}
                    onLoadEnd={(a) => { console.log('load end >> ' + a); }} />
                <View style={styles.agentDetailContainer}>
                    <View style={styles.txtContainer}>
                        <Text style={styles.txtAgentName}>{item.name}</Text>
                        <Text style={styles.txtCompanyName}>{item.company}</Text>
                    </View>
                    <Image style={styles.arrowImage} source={Images.backbuttonIcon} />
                </View>
            </TouchableOpacity>
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
                {
                    this.state.arrDATA.length > 0 ?
                        <FlatList
                            data={this.state.arrDATA}
                            extraData={this.state}
                            onRefresh={() => this.onRefresh()}
                            refreshing={this.state.isFetching}
                            renderItem={this.renderRowData.bind(this)}
                            keyExtractor={(item, index) => index.toString()}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
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
            from: Utility.SCREEN.News,
            to: Utility.SCREEN.AgentDetails,
            'agentDetails': item,
        };
        this.props.navigation.navigate(Utility.SCREEN.AgentDetails, params)
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
export default AgentListingController