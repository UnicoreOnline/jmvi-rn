import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList,
    ScrollView,
    Linking,
    RefreshControl,
    BackHandler
} from 'react-native'

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

class MortgageFinancingDetailsController extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: () => (
                <TouchableOpacity onPress={() => {
                    navigation.navigate(Utility.SCREEN.Search);
                }}><Image style={{ height: 25, width: 25, marginEnd: 15 }} source={Images.search} />
                </TouchableOpacity>
            ),
        };
    };
    constructor(props) {
        super(props)
        const { navigation } = this.props
        this.state = {
            bankDetails: navigation.getParam('bankDetails', {}),
            spinnerVisible: false,
            isFetching: false,
            isDataChanged: false
        }
        this.handleBackButtonClick = this.onBackPressed.bind(this);
    }
    componentWillMount() {
        // this._sub21 = this.props.navigation.addListener('willBlur', this._handleFocusChanged.bind(this));
        // this._sub22 = this.props.navigation.addListener('willFocus', this._handleFocusChanged.bind(this));
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        // this._sub21.remove()
        // this._sub22.remove()
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentDidMount() {
        // this.callGetAgentDetail(false)
    }

    onRefresh() {
        this.setState({ isFetching: true }, function () {
            this.callGetAgentDetail(false)
        });
    }

    callGetAgentDetail(isShowLoading) {
        this.setState({ spinnerVisible: isShowLoading });
        var params = {
            api_key: Utility.API_KEY,
            'get_bank': 1,
        }
        API.getRequest('get_data.php', params, (status, data) => {
            this.setState({
                spinnerVisible: false,
                isFetching: false
            });
            if (status) {
                if (Array.isArray(data.bank)) {
                    if (data.bank.length > 0) {
                        for (let i = 0; i < data.bank.length; i++) {
                            const element = data.bank[i];
                            if (element.id == this.state.bankDetails.id) {
                                this.setState({ bankDetails: element, isDataChanged: true })
                            }
                        }
                    }
                }

            } else {
                // Utility.showToast('' + data.message)
            }
        }, true, this.props);
    }

    // _handleFocusChanged(event) {
    //     if (event.type) {
    //         if (event.type == 'willBlur') {
    //         } else {

    //         }
    //     }

    // }

    onListingTapped() {

    }

    render() {
        var { bankDetails } = this.state
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <ScrollView style={styles.container}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isFetching}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                >
                    <ProgressiveImage
                        style={styles.serviceImage}
                        uri={bankDetails.image}
                        resizeMode={'contain'}
                        // image={Images.agent_placeholder}
                        placeholderSource={Images.agent_placeholder}
                        placeholderStyle={styles.placeHolderStyle}
                        onLoadEnd={(a) => { console.log('load end >> ' + a); }} />
                    <View style={styles.textMainContainer}>
                        <Text style={styles.txtTitle}>Bank Name</Text>
                        <Text style={styles.txtValue}>{bankDetails.bank_name}</Text>
                    </View>
                    <View style={styles.textMainContainer}>
                        <Text style={styles.txtTitle}>Address</Text>
                        <Text style={styles.txtValue}>{bankDetails.address}</Text>
                    </View>
                    <View style={styles.textMainContainer}>
                        <Text style={styles.txtTitle}>Branch Location</Text>
                        <Text style={styles.txtValue}>{bankDetails.branch_location}</Text>
                    </View>
                    <View style={styles.textMainContainer}>
                        <Text style={styles.txtTitle}>Hours of Operations</Text>
                        <Text style={styles.txtValue}>{bankDetails.operation_hours}</Text>
                    </View>
                    <TouchableOpacity style={styles.textMainContainer} onPress={this.onCallPressed.bind(this, bankDetails.mortgage_dep_number)} activeOpacity={0.7}>
                        <Text style={styles.txtTitle}>Contact Number</Text>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={styles.txtValue}>{bankDetails.contact_number}</Text>
                            <Image style={styles.callImage} source={Images.phone} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.textMainContainer} onPress={this.onCallPressed.bind(this, bankDetails.mortgage_dep_number)} activeOpacity={0.7}>
                        <Text style={styles.txtTitle}>Mortgage Dept. Number</Text>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={styles.txtValue}>{bankDetails.mortgage_dep_number}</Text>
                            <Image style={styles.callImage} source={Images.phone} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.listingBtnContainer} onPress={this.onMortgageCalculatorPress.bind(this)} activeOpacity={1}>
                        <Text style={styles.txtListing}>Mortgage Calculator</Text>
                    </TouchableOpacity>
                </ScrollView>
                <Spinner visible={this.state.spinnerVisible} />
            </SafeAreaView>
        )
    }

    //Navigation
    onBackPressed() {
        var params = {
            'isSuccess': this.state.isDataChanged,
            to: this.props.navigation.state.params.to,
        }
        this.props.navigation.state.params.onNavigateBack(params);
        this.props.navigation.goBack();
        return true;
    }
    onMortgageCalculatorPress() {
        // const navigateAction = NavigationActions.navigate({
        //     routeName: Utility.SCREEN.MortgageCalculator
        // });
        // this.props.navigation.dispatch(navigateAction);
        this.props.navigation.navigate(Utility.SCREEN.MortgageCalculator)
    }
    onWebsitePressed(item) {
        if (Utility.isUrl(item)) {
            Linking.openURL(item);
        }
    }
    onCallPressed(item) {
        let supportContactNumber = item
        let phoneNumber = '';
        if (Platform.OS === 'android') {
            phoneNumber = `tel:${supportContactNumber}`;
        } else {
            phoneNumber = `telprompt:${supportContactNumber}`;
        }
        Linking.openURL(phoneNumber);
    }
    onWhatsAppPressed(item) {
        let supportContactNumber = item
        // let phoneNumber = '';
        // if (Platform.OS === 'android') {
        //     phoneNumber = `tel:${supportContactNumber}`;
        // }
        // else {
        //     phoneNumber = `telprompt:${supportContactNumber}`;
        // }
        // Linking.openURL(phoneNumber);
        Linking.openURL(`whatsapp://send?text=Hello&phone=${supportContactNumber}`)
    }
    onEmailPressed(item) {
        let email = item
        let title = ''
        let body = ''
        Linking.openURL(`mailto:${email}?subject=${title}&body=${body}`)
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
export default MortgageFinancingDetailsController