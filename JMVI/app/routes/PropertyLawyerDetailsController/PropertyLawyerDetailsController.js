import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    FlatList,
    ScrollView,
    Linking,
    RefreshControl
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

class PropertyLawyerDetailsController extends Component {
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
            lawyerDetails: navigation.getParam('lawyerDetails', {}),
            spinnerVisible: false,
            isFetching: false,
        }
    }
    componentDidMount() {
    }

    onRefresh() {
        this.setState({ isFetching: true }, function () {
            this.callGetAgentDetail(false)
        });
    }

    callGetAgentDetail() {
        setTimeout(() => {
            this.setState({
                spinnerVisible: false,
                isDataReceived: true,
                isFetching: false
            });
        }, 2000);
    }

    onListingTapped() {

    }

    render() {
        var { lawyerDetails } = this.state
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <ScrollView style={styles.container}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isFetching}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }>
                    <ProgressiveImage
                        style={styles.serviceImage}
                        uri={lawyerDetails.photo_url}
                        // image={Images.agent_placeholder}
                        placeholderSource={Images.agent_placeholder}
                        placeholderStyle={styles.serviceImage}
                        onLoadEnd={(a) => { console.log('load end >> ' + a); }} />
                    <View style={styles.textMainContainer}>
                        <Text style={styles.txtTitle}>Lawyer Name</Text>
                        <Text style={styles.txtValue}>{lawyerDetails.name}</Text>
                    </View>
                    <View style={styles.textMainContainer}>
                        <Text style={styles.txtTitle}>Company Name</Text>
                        <Text style={styles.txtValue}>{lawyerDetails.company_name}</Text>
                    </View>
                    <View style={styles.textMainContainer}>
                        <Text style={styles.txtTitle}>Company Address</Text>
                        <Text style={styles.txtValue}>{lawyerDetails.address}</Text>
                    </View>
                    <TouchableOpacity style={styles.textMainContainer} onPress={this.onWebsitePressed.bind(this, lawyerDetails.website)} activeOpacity={0.7}>
                        <Text style={styles.txtTitle}>Website</Text>
                        <Text style={styles.txtValueLink}>{lawyerDetails.website}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.textMainContainer} onPress={this.onCallPressed.bind(this, lawyerDetails.contact_no)} activeOpacity={0.7}>
                        <Text style={styles.txtTitle}>Company Number</Text>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={styles.txtValue}>{lawyerDetails.contact_no}</Text>
                            <Image style={styles.callImage} source={Images.phone} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.textMainContainer} onPress={this.onEmailPressed.bind(this, lawyerDetails.email)} activeOpacity={0.7}>
                        <Text style={styles.txtTitle}>Email Address</Text>
                        <Text style={styles.txtValueLink}>{lawyerDetails.email}</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.textMainContainer} onPress={this.onWhatsAppPressed.bind(this, lawyerDetails.whatsapp_no)} activeOpacity={0.7}>
                        <Text style={styles.txtTitle}>Whatsapp Number</Text>
                        <Text style={styles.txtValue}>{lawyerDetails.whatsapp_no}</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={styles.listingBtnContainer} onPress={this.onCallPressed.bind(this, lawyerDetails.contact_no)} activeOpacity={0.5}>
                        <Text style={styles.txtListing}>Call</Text>
                    </TouchableOpacity>
                </ScrollView>
                <Spinner visible={this.state.spinnerVisible} />
            </SafeAreaView>
        )
    }

    //Navigation
    onBackPressed(isSuccess) {
        this.props.navigation.goBack();
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
export default PropertyLawyerDetailsController