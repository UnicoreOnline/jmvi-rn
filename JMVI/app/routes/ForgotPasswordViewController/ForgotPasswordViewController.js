import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    SafeAreaView,
    TextInput
} from 'react-native'

import styles from './styles'
import Colors from '../../config/Colors'
import Images from '../../config/Images'
import Utility from '../../config/Utility'
// import SafeAreaView from '../../component/SafeAreaView'
import INTRichTextInput from '../../component/INTRichTextInput'
import API from '../../config/API'
import Spinner from 'react-native-loading-spinner-overlay'

class ForgotPasswordViewController extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            spinnerVisible: false,
            emailAddress: "",
        }
    }

    componentDidMount() {
    }


    submitBtnPressed() {
        Utility.hideKeyboard();
        if (this.state.emailAddress.toString().length == 0) {
            Utility.showToast('Please enter email address');
        } else if (Utility.validateEmail(this.state.emailAddress) == false) {
            Utility.showToast('Please enter valid email');
        } else {
            this.setState({ spinnerVisible: true });
            var params = {
                "email": this.state.emailAddress.toLowerCase(),
            }
            API.postRequest('forgot-password.php', params, (status, data) => {
                this.setState({ spinnerVisible: false });
                if (status) {
                    // Utility.showSuccessToast('Password reset instruction sent successfully into yout registered email.')
                    Utility.showSuccessToast('Your password reset instructions sent successfully to your registered email address')
                    setTimeout(() => {
                        this.onBackPressed();
                    }, 100);
                } else {
                    Utility.showToast('' + data.message)
                }
            }, true, this.props);
        }
    }

    render() {
        return (
            <View style={styles.safeAreaView}>
                {/* <View style={styles.tobBarContainer}>
                    <TouchableOpacity style={styles.backBtnImg} onPress={this.onBackPressed.bind(this, false)} activeOpacity={1}>
                        <Image source={Images.backbuttonIcon} />
                    </TouchableOpacity>
                </View> */}
                <View style={styles.subContainer}>

                    {/* <Text style={styles.headerTxt}>Forgot password</Text> */}
                    <View style={styles.textInputContainer}>
                        <INTRichTextInput
                            inputStyle={styles.inputTxt}
                            wrapperStyle={{}}
                            placeholderTextColor={Colors.placeholderTextColor}
                            autoCorrect={false}
                            placeholder={"Email Address"}
                            maxLength={255}
                            selectionColor={Colors.selectionColor}
                            onChangeText={(emailAddress) => this.setState({ emailAddress })}
                            value={this.state.emailAddress}
                            clearTapped={() => this.setState({ emailAddress: "" })}
                            borderWidth={0}
                            title={""}
                            titleStyle={styles.titleNameTxt}
                            showErrorIcon={false}
                            autoCapitalize="none"
                            keyboardType={'email-address'}
                            editType={0}//For Singleline                                
                        />
                         {/* <TextInput
              style={styles.inputTxt}
              onChangeText={(emailAddress) => this.setState({ emailAddress })}
              value={this.state.emailAddress}
              placeholder={'Email Address'}
              placeholderTextColor={Colors.black}
              keyboardType={"email-address"}
              ref="email"
              autoCapitalize="sentences"
              returnKeyType='done'
              onSubmitEditing={() => { Utility.hideKeyboard() }}
              blurOnSubmit={false}
            /> */}
                    </View>
                    <Text style={styles.infoTxt} >Enter the email address associated with your account, and we’ll email you a link to reset your password.</Text>
                    <TouchableOpacity style={styles.submitContainer} onPress={this.submitBtnPressed.bind(this)} activeOpacity={1}>
                        <Text style={styles.submitTxt}>Send Reset Link</Text>
                    </TouchableOpacity>
                </View>
                <Spinner visible={this.state.spinnerVisible} />
            </View>
        )
    }

    //Navigation
    onBackPressed(isSuccess) {
        // var params = {
        //     'isSuccess': isSuccess,
        //     to: this.props.navigation.state.params.to,
        // }
        // this.props.navigation.state.params.onNavigateBack(params);
        this.props.navigation.goBack();
    }

    onEmailSent() {
        var params = {
            onNavigateBack: this.handleOnNavigateBack.bind(this),
            'email': this.state.emailAddress,
            to: Utility.SCREEN.EmailSent
        }
        this.props.navigation.navigate(Utility.SCREEN.EmailSent, params)
    }

    handleOnNavigateBack = (params) => {
        if (params.isSuccess == true)
            switch (params.to) {
                case Utility.SCREEN.EmailSent:
                    this.onBackPressed(true);
                    break;
                default:
                    break;
            }
    }
}
export default ForgotPasswordViewController