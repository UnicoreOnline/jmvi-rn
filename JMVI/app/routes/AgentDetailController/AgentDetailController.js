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

class AgentDetailController extends Component {
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
            agentDetails: navigation.getParam('agentDetails', {}),
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

    _handleFocusChanged(event) {
        if (event.type) {
            if (event.type == 'willBlur') {
            } else {

            }
        }

    }

    onListingTapped() {

    }

    render() {
        var { agentDetails } = this.state
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
                        // uri={agentDetails.photo_url}
                        uri={agentDetails.thumb_url}
                        // image={Images.agent_placeholder}
                        placeholderSource={Images.agent_placeholder}
                        placeholderStyle={styles.serviceImage}
                        onLoadEnd={(a) => { console.log('load end >> ' + a); }} />
                    <View style={styles.textMainContainer}>
                        <Text style={styles.txtTitle}>Agent Full Name</Text>
                        <Text style={styles.txtValue}>{agentDetails.name}</Text>
                    </View>
                    <View style={styles.textMainContainer}>
                        <Text style={styles.txtTitle}>Company Name</Text>
                        <Text style={styles.txtValue}>{agentDetails.company}</Text>
                    </View>
                    <View style={styles.textMainContainer}>
                        <Text style={styles.txtTitle}>Company Address</Text>
                        <Text style={styles.txtValue}>{agentDetails.address}, {agentDetails.country}</Text>
                    </View>
                    <TouchableOpacity style={styles.textMainContainer} onPress={this.onWebsitePressed.bind(this, agentDetails.website)} activeOpacity={0.7}>
                        <Text style={styles.txtTitle}>Website</Text>
                        <Text style={styles.txtValueLink}>{agentDetails.website}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.textMainContainer} onPress={this.onCallPressed.bind(this, agentDetails.contact_no)} activeOpacity={0.7}>
                        <Text style={styles.txtTitle}>Company Number</Text>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={styles.txtValue}>{agentDetails.contact_no}</Text>
                            <Image style={styles.callImage} source={Images.phone} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.textMainContainer} onPress={this.onEmailPressed.bind(this, agentDetails.email)} activeOpacity={0.7}>
                        <Text style={styles.txtTitle}>Email Address</Text>
                        <Text style={styles.txtValueLink}>{agentDetails.email}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.textMainContainer} onPress={this.onWhatsAppPressed.bind(this, agentDetails.sms)} activeOpacity={0.7}>
                        <Text style={styles.txtTitle}>Whatsapp Number</Text>
                        <Text style={styles.txtValue}>{agentDetails.sms}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.listingBtnContainer} onPress={this.onViewPropertyListPress.bind(this, agentDetails)} activeOpacity={0.5}>
                        <Text style={styles.txtListing}>View Listings</Text>
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
    onViewPropertyListPress(agentDetails) {
        if (agentDetails.realestate.length > 0) {
            var params = {
                onNavigateBack: this.handleOnNavigateBack.bind(this),
                to: Utility.SCREEN.Property,
                'arrDATA': agentDetails.realestate,
            };
            this.props.navigation.navigate(Utility.SCREEN.Property, params)
        } else {
            Utility.showToast('No Results')
        }
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
export default AgentDetailController