import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    Linking,
    Alert,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { WebView } from 'react-native-webview';
// import SafeAreaView from '../../component/SafeAreaView';
import Images from '../../config/Images';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import styles from './styles';
import Spinner from 'react-native-loading-spinner-overlay';

var isFirstShow = false
class CMSViewController extends Component {
    // static navigationOptions = ({ navigation }) => {
    //     return {
    //         headerRight: () => (
    //             <TouchableOpacity onPress={() => {
    //                 navigation.navigate(Utility.SCREEN.Search);
    //             }}><Image style={{ height: 25, width: 25, marginEnd: 15 }} source={Images.search} /></TouchableOpacity>
    //         ),
    //     };
    // };
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            cmsURL: navigation.state.routeName === Utility.SCREEN.AboutUs ? Utility.URLS.AboutUs : navigation.state.routeName === Utility.SCREEN.TNC ? Utility.URLS.TNC : '',
            spinnerVisible: false,
        };
    }
    componentDidMount() {
        // this.getCMS();
    }
    // getCMS() {
    //     this.setState({ spinnerVisible: true });
    //     var params = {
    //         "page_slug": this.state.cmsType + '',
    //     }
    //     API.postRequest('cms', params, (status, data) => {
    //         this.setState({ spinnerVisible: false });
    //         if (status) {
    //             this.setState({ cmsTitle: data.data.title, cmsContent: data.data.content })
    //         }
    //     }, true, this.props);
    // }

    render() {
        // var cmsTitle = ""
        // if (this.state.cmsType == Utility.cmsType.TermsOfService) {
        //     cmsTitle = "Terms of Service"
        // }
        // else if (this.state.cmsType == Utility.cmsType.PaymentTermsOfService) {
        //     cmsTitle = "Payments Terms of Service"
        // }
        // else if (this.state.cmsType == Utility.cmsType.PrivacyPolicy) {
        //     cmsTitle = "Privacy policy"
        // }

        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor={Colors.statusBarColor} />
                <WebView
                    ref={ref => (this.WebView = ref)}
                    source={{ uri: this.state.cmsURL }}
                    // source={{ html: this.state.cmsURL }}
                    // style={{ marginTop: 5 }}
                    renderLoading={this.renderLoading}
                // onNavigationStateChange={this.navigationStateChangedHandler}
                />
                <Spinner visible={this.state.spinnerVisible} />
            </View>
        );
    }
    navigationStateChangedHandler = ({ url }) => {
        if (url != 'about:blank') {
            this.WebView.stopLoading();
            if (isFirstShow == false) {
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    isFirstShow = true
                    Alert.alert(
                        'External URL',
                        'Do you want to open this URL in your browser?',
                        [
                            {
                                text: 'Cancel', style: 'cancel', onPress: () => {
                                    isFirstShow = false
                                }
                            },
                            {
                                text: 'OK', onPress: () => {
                                    Linking.openURL(url)
                                    isFirstShow = false
                                }
                            },
                        ],
                        { cancelable: false }
                    );
                } else {

                }
            }
        }
    };

    //Navigation
    onBackPressed() {
        this.props.navigation.goBack()
    }
}

export default CMSViewController

