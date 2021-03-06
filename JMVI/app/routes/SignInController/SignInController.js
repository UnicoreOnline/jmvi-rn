import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  NativeModules
} from 'react-native';

import styles from './styles'
import Images from '../../config/Images'
import Utility from '../../config/Utility'
// import SafeAreaView from '../../component/SafeAreaView'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Spinner from 'react-native-loading-spinner-overlay';
import Colors from '../../config/Colors';
import API from '../../config/API'
import User from '../../models/User'
import Fonts from '../../config/Fonts'
import { NavigationActions, StackActions } from 'react-navigation';
const FBSDK = require('react-native-fbsdk');
const { RNTwitterSignIn } = NativeModules
import appleAuth, {
  AppleButton,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState,
  AppleAuthError
} from '@invertase/react-native-apple-authentication';

const {
  LoginManager,
  AccessToken,
  // GraphRequest,
  // GraphRequestManager
} = FBSDK;
const FACEBOOK = 1;
const TWITTER = 2;
const APPLE = 3;

class SignInController extends Component {
  // static navigationOptions = {
  //   header: null,
  // }
  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     headerRight: () => (
  //       <TouchableOpacity onPress={() => {
  //         navigation.navigate(Utility.SCREEN.Search);
  //       }}><Image style={{ height: 25, width: 25, marginEnd: 15 }} source={Images.search} /></TouchableOpacity>
  //     ),
  //   };
  // };
  constructor(props) {
    super(props);
    this.state = {
      spinnerVisible: false,
      username: '',
      password: '',
      full_name: '',
      email: '',
      showPassword: true,
      isClickLoginOption: false,
    };
  }

  componentDidMount() {
  }

  onForgorPasswordPress() {
    this.props.navigation.navigate(Utility.SCREEN.ForgotPassword);
  }

  onFacebookPress() {
    if (this.state.isClickLoginOption == false) {
      var context = this;
      this.setState({ isClickLoginOption: true })
      LoginManager.logInWithPermissions(['public_profile']).then(
        function (result) {
          if (result.isCancelled) {
            context.setState({ isClickLoginOption: false })
            // Utility.showToast('Login cancelled!');
          } else {
            AccessToken.getCurrentAccessToken().then((data) => {
              // console.log("data.accessToken.toString()==== ",data.accessToken.toString())
              fetch('https://graph.facebook.com/v2.5/me?fields=picture,email,name,friends&access_token=' + data.accessToken.toString())
                .then((response) => response.json())
                .then((user) => {
                  console.log('FACEBOOK LOGIN USER: ', user)
                  if (user) {
                    // context.setState({facebook_id:user.id},)
                    context.callLogin(user.id, user.name, FACEBOOK)
                  } else {
                    Utility.showToast('Something wrong to fetch data from Facebook');
                  }
                })
                .catch((error) => {
                  //reject('ERROR GETTING DATA FROM FACEBOOK')
                  // console.error(error);
                  context.setState({ isClickLoginOption: false })
                }).done();
            })
          }
        },
        function (error) {
          context.setState({ spinnerVisible: false, isClickLoginOption: false });
          Utility.showToast('Login fail with error:' + error);
        }
      )
    }
  }
  onTwitterPress() {
    // Utility.showToast('Under construction')
    var context = this;
    RNTwitterSignIn.init(Utility.TWITTER_COMSUMER_KEY, Utility.TWITTER_CONSUMER_SECRET)
    RNTwitterSignIn.logIn()
      .then(loginData => {
        console.log(loginData)
        context.callLogin(loginData.userID, loginData.userName, TWITTER)
        const { authToken, authTokenSecret } = loginData
        if (authToken && authTokenSecret) {
          this.setState({
            isLoggedIn: true
          })
        }
      })
      .catch(error => {
        console.log(error)
      }
      )
  }

  async onAppleButtonPress() {
    try {
      // performs login request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });

      if (appleAuthRequestResponse['realUserStatus']) {
        console.log('appleAuthRequestResponse', appleAuthRequestResponse.user)
        // this.callLogin(appleAuthRequestResponse.user, APPLE)

        var name = appleAuthRequestResponse.fullName.givenName ? appleAuthRequestResponse.fullName.givenName : ''
        name = name + (appleAuthRequestResponse.fullName.middleName ? ' ' + appleAuthRequestResponse.fullName.middleName : '')
        name = name + (appleAuthRequestResponse.fullName.familyName ? ' ' + appleAuthRequestResponse.fullName.familyName : '')
        name = (name == null ? '' : name)
        console.log('appleAuthRequestResponse', name, appleAuthRequestResponse.email)
        if (appleAuthRequestResponse.email) {
          this.setState({ email: appleAuthRequestResponse.email })
          setTimeout(() => {
            this.callLogin(appleAuthRequestResponse.user, name.toString().trim(), APPLE)
          }, 500)
        } else {
          this.callLogin(appleAuthRequestResponse.user, name.toString().trim(), APPLE)
        }
        // var identity = appleAuthRequestResponse.identityToken.split['.']
        // var identityTokenNew = identity.length > 0 ? identity[0] : ''
        // console.log('identityTokenNew', identity)

      }
    } catch (error) {
      if (error.code === AppleAuthError.CANCELED) {
      }
      if (error.code === AppleAuthError.FAILED) {
        console.log('Touch ID wrong');
      }
      if (error.code === AppleAuthError.INVALID_RESPONSE) {
        console.log('Touch ID wrong');
      }
      if (error.code === AppleAuthError.NOT_HANDLED) {
      }
      if (error.code === AppleAuthError.UNKNOWN) {
        console.log('Touch ID wrong');
      }
    }
  }

  onLoginPress() {
    Utility.hideKeyboard()
    if (this.state.username.trim() == '') {
      Utility.showToast('Please enter email address')
    }
    else if (this.state.password.trim() == '') {
      Utility.showToast('Please enter password')
    }
    else {
      this.callLogin()
    }
  }

  callLogin(id, fname, type) {
    this.setState({ spinnerVisible: true });
    var facebook_id = ''
    var twitter_id = ''
    var apple_id = ''
    var full_name = this.state.full_name
    if (type == FACEBOOK) {
      facebook_id = id
    } else if (type == TWITTER) {
      twitter_id = id
    } else if (type == APPLE) {
      apple_id = id
      full_name = fname
    }
    var params = {
      api_key: Utility.API_KEY,
      'username': this.state.username,
      'password': this.state.password,
      'facebook_id': facebook_id,
      'twitter_id': twitter_id,
      'apple_id': apple_id,
      'full_name': full_name,
      'email': this.state.email,
    }
    API.postRequest('login.php', params, (status, data) => {
      this.setState({
        spinnerVisible: false
      });
      if (status) {
        Utility.showSuccessToast('You have successfully logged in')
        Utility.user = data.user_info
        User.save(data.user_info);
        const navigateAction = NavigationActions.navigate({
          routeName: Utility.SCREEN.Featured
        });
        this.props.navigation.dispatch(navigateAction);
      } else {
        Utility.showToast('' + data.message)
      }
    }, true, this.props);
  }
  onShowHideBtnPressed() {
    this.setState({ showPassword: !this.state.showPassword });
    if (this.state.showPassword == true) {
      this.setState({ showhideTxt: "Hide" })
    }
    else {
      this.setState({ showhideTxt: "Show" })
    }
  }
  render() {
    // var contentView = 

    return (
      <SafeAreaView style={styles.container}>
        {/* <ScrollView
          contentContainerStyle={{ flex: 1, paddingBottom: 20 }}
        >
          {contentView}
        </ScrollView> */}
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          extraScrollHeight={20}
          onScroll={this.handleScroll}
          keyboardShouldPersistTaps={"handled"}
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        // contentContainerStyle={{ flex: 1 }}
        >
          <View style={{ flex: 1, justifyContent: 'center', paddingTop: 60 }}>
            {/* <View style={{ flex: 1, marginBottom: 50, justifyContent: 'center' }}> */}
            <TextInput
              style={styles.textInput}
              placeholderTextColor={Colors.placeholderTextColor}
              onChangeText={(username) => this.setState({ username })}
              value={this.state.username}
              placeholder={'Email Address'}
              keyboardType={"email-address"}
              ref="email"
              autoCapitalize="sentences"
              returnKeyType='next'
              onSubmitEditing={() => { this.password.focus(); }}
              blurOnSubmit={false}
            />
            <View style={styles.textInput, [{ flexDirection: 'row' }]}>
              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                placeholderTextColor={Colors.placeholderTextColor}
                onChangeText={(password) => this.setState({ password })}
                value={this.state.password}
                placeholder={'Password'}
                secureTextEntry={this.state.showPassword}
                returnKeyType='done'
                ref={(input) => { this.password = input; }}
                onSubmitEditing={() => { Utility.hideKeyboard() }}
                blurOnSubmit={false} //to prevent keyboard flickering.
              />
              <TouchableOpacity style={styles.showhideContainer} onPress={this.onShowHideBtnPressed.bind(this)} activeOpacity={0.5}>
                <Image style={styles.passwordEye} source={this.state.showPassword ? Images.eyeVisible : Images.eyeInvisible} />
              </TouchableOpacity>
            </View>
            <View style={styles.bottomContainer}>
              <TouchableOpacity style={styles.loginBtnContainer} onPress={this.onLoginPress.bind(this)} activeOpacity={0.8} >
                <Text style={styles.loginTxt}>LOGIN</Text>
              </TouchableOpacity>
              {
                Utility.isPlatformAndroid ?
                  null
                  :
                  <TouchableOpacity style={styles.appleBtnContainer} activeOpacity={0.8} >
                    <AppleButton
                      buttonStyle={AppleButton.Style.BLACK}
                      buttonType={AppleButton.Type.SIGN_IN}
                      style={{
                        flex: 1,
                        // width: 160,
                        height: 45,
                        alignSelf: 'center',
                        fontFamily: Fonts.regular,
                      }}
                      onPress={() => this.onAppleButtonPress()}
                    />
                  </TouchableOpacity>
              }
              <TouchableOpacity style={[styles.loginBtnContainer, { backgroundColor: Colors.fbBlue }]} onPress={this.onFacebookPress.bind(this)} activeOpacity={0.8} >
                <Image style={styles.fbImage} source={Images.ic_fb} />
                <Text style={styles.loginTxt}>LOGIN WITH FACEBOOK</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.loginBtnContainer, { backgroundColor: Colors.twitterBlue }]} onPress={this.onTwitterPress.bind(this)} activeOpacity={0.8} >
                <Image style={styles.fbImage} source={Images.ic_twitter} />
                <Text style={styles.loginTxt}>LOGIN WITH TWITTER</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={{ marginTop: 30 }} activeOpacity={0.8} onPress={this.onForgorPasswordPress.bind(this)}>
              <Text style={styles.forgotPasswordTxt}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 15 }} activeOpacity={0.8} onPress={this.onRegisterPress.bind(this)}>
              <Text style={styles.forgotPasswordTxt}>Have you registered?</Text>
            </TouchableOpacity>
            {/* </View> */}
          </View>
        </KeyboardAwareScrollView>
        <Spinner visible={this.state.spinnerVisible} />
      </SafeAreaView>
    );
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

  onRegisterPress() {
    const navigateAction = NavigationActions.navigate({
      routeName: Utility.SCREEN.SignUp
    });
    this.props.navigation.dispatch(navigateAction);
  }
}

export default SignInController