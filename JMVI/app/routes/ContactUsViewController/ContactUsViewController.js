import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    Linking,
    Alert,
    SafeAreaView,
    StatusBar,
    TextInput,
    ScrollView
} from 'react-native';
// import SafeAreaView from '../../component/SafeAreaView';
import Images from '../../config/Images';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import styles from './styles';
import Spinner from 'react-native-loading-spinner-overlay';
import API from '../../config/API'
import API_CHAT from '../../config/API_CHAT'

class ContactUsViewController extends Component {
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
        super(props);
        const { navigation } = this.props;
        this.state = {
            //TODO
            name: '',
            email: '',
            subject: '',
            message: '',
            spinnerVisible: false,
        };
    }
    componentDidMount() {
    }
    onSubmitPress() {
        Utility.hideKeyboard()
        if (this.state.name.trim() == '') {
            Utility.showToast('Please enter name')
        }
        else if (this.state.email.trim() == '') {
            Utility.showToast('Please enter email')
        }
        else if (Utility.validateEmail(this.state.email) == false) {
            Utility.showToast('Please enter valid email');
        }
        else if (this.state.subject.trim() == '') {
            Utility.showToast('Please enter subject')
        }
        else if (this.state.message.trim() == '') {
            Utility.showToast('Please enter message')
        }
        else {
            this.callContactUsAPI()
        }
    }

    callContactUsAPI() {
        Utility.hideKeyboard()
        this.setState({ spinnerVisible: true });
        var params = {
            'api_key': Utility.API_KEY,
            'name': this.state.name,
            'email': this.state.email,
            'subject': this.state.subject,
            'message': this.state.message,
        }
        // https://www.jmviapp.com/rest/post_contact.php
        API.postRequest('post_contact.php', params, (status, data) => {
            this.setState({
                spinnerVisible: false,
            });
            if (status) {
                Utility.showSuccessToast('Thanks for the contacting us. We will get back to you soon.')
                this.setState({ name: '', email: '', subject: '', message: '' })
            } else {
                Utility.showToast('' + data.message)
            }
        }, true, this.props);
        // API_CHAT.postRequest('post_contact.php', params, (status, data) => {
        //     this.setState({
        //         spinnerVisible: false,
        //     });
        //     if (status) {
        //         Utility.showToast('' + data.message)
        //         this.setState({ name: '', email: '', subject: '', message: '' })
        //     } else {
        //         Utility.showToast('' + data.message)
        //     }
        // }, true, this.props);


    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor={Colors.statusBarColor} />
                <ScrollView style={{ flex: 1, marginHorizontal: 10, }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={'handled'}
                    keyboardDismissMode="on-drag">
                    <View style={{ flex: 1 }}>
                        <TextInput
                            style={styles.textInput}
                            placeholderTextColor={Colors.placeholderTextColor}
                            onChangeText={(name) => this.setState({ name })}
                            value={this.state.name}
                            placeholder={'Name'}
                            placeholderTextColor={Colors.grey7F7F}
                            keyboardType={"default"}
                            ref={(input) => { this.name = input; }}
                            autoCapitalize="words"
                            returnKeyType='next'
                            onSubmitEditing={() => { this.email.focus(); }}
                            blurOnSubmit={false}
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholderTextColor={Colors.placeholderTextColor}
                            onChangeText={(email) => this.setState({ email })}
                            value={this.state.email}
                            placeholder={'Email Address'}
                            placeholderTextColor={Colors.grey7F7F}
                            keyboardType={"email-address"}
                            ref={(input) => { this.email = input; }}
                            autoCapitalize="none"
                            returnKeyType='next'
                            onSubmitEditing={() => { this.subject.focus(); }}
                            blurOnSubmit={false}
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholderTextColor={Colors.placeholderTextColor}
                            onChangeText={(subject) => this.setState({ subject })}
                            value={this.state.subject}
                            placeholder={'Subject'}
                            placeholderTextColor={Colors.grey7F7F}
                            keyboardType={"default"}
                            ref={(input) => { this.subject = input; }}
                            autoCapitalize="words"
                            returnKeyType='next'
                            onSubmitEditing={() => { this.message.focus(); }}
                            blurOnSubmit={false}
                        />
                        <TextInput
                            style={[styles.textInput, { textAlignVertical: 'top', height: 120 }]}
                            placeholderTextColor={Colors.placeholderTextColor}
                            onChangeText={(message) => this.setState({ message })}
                            value={this.state.message}
                            placeholder={'Message'}
                            placeholderTextColor={Colors.grey7F7F}
                            keyboardType={"default"}
                            ref={(input) => { this.message = input; }}
                            autoCapitalize="sentences"
                            returnKeyType='done'
                            multiline={true}
                            numberOfLines={4}
                            blurOnSubmit={false}
                        />
                        <TouchableOpacity style={{ marginTop: 20 }} activeOpacity={0.7} onPress={this.onSubmitPress.bind(this)}>
                            <Text style={styles.submitBtn}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <Spinner visible={this.state.spinnerVisible} />
            </View>
        );
    }

    //Navigation
    onBackPressed() {
        this.props.navigation.goBack()
    }
}

export default ContactUsViewController

