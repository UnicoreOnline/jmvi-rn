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
  Linking,
  Keyboard,
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

class SignUpController extends Component {
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
      full_name: '',
      address: '',
      country: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: true,
      showReEnterPassword: true,
      isClickLoginOption: false,
    };
  }

  componentDidMount() {
  }

  onCreateAccountPress() {
    Utility.hideKeyboard()
    if (this.state.username.trim() == '') {
      Utility.showToast('Please enter user name')
    }
    else if (this.state.full_name.trim() == '') {
      Utility.showToast('Please enter full name')
    }
    // else if (this.state.address.trim() == '') {
    //   Utility.showToast('Please enter your address')
    // }
    else if (this.state.email.trim() == '') {
      Utility.showToast('Please enter email address')
    }
    else if (Utility.validateEmail(this.state.email) == false) {
      Utility.showToast('Please enter valid email');
    }
    else if (this.state.password.trim() == '') {
      Utility.showToast('Please enter password')
    }
    else if (this.state.confirmPassword.trim() == '') {
      Utility.showToast('Please enter confirm password')
    }
    else if (this.state.password.trim() != this.state.confirmPassword.trim()) {
      Utility.showToast('Entered password does not match')
    }
    else {
      this.callRegister()
      // this.uploadImage(this.state.photoImageUri);
    }
  }

  // uploadImage(selecteduri) {
  //   var photo = {
  //     uri: selecteduri,
  //     type: 'image/*',
  //     name: 'photo.jpg'
  //   };

  //   this.setState({ spinnerVisible: true });
  //   var params = {
  //     'media_type': 'profile_photo',
  //     'media_file': photo,
  //   };
  //   API.uploadMedia('media-upload', params, (status, data) => {
  //     if (status) {
  //       // this.signUp(data.name)
  //       // this.setState({ photo: data.data.path }, this.signUp(data.data.path))
  //     }
  //   });
  // }

  callRegister(id, fname, type) {
    this.setState({ spinnerVisible: true });
    var facebook_id = ''
    var twitter_id = ''
    var apple_id = ''
    var full_name = this.state.full_name
    if (type == FACEBOOK) {
      facebook_id = id
      full_name = fname
    } else if (type == TWITTER) {
      twitter_id = id
      full_name = fname
    } else if (type == APPLE) {
      apple_id = id
      full_name = fname
    }
    var params = {
      api_key: Utility.API_KEY,
      'username': this.state.username,
      'password': this.state.password,
      'full_name': full_name,
      'email': this.state.email,
      'mobile': this.state.phone,
      'address': this.state.address,
      'country': this.state.country,
      'facebook_id': facebook_id,
      'twitter_id': twitter_id,
      'apple_id': apple_id,
    }
    API.postRequest('register.php', params, (status, data) => {
      this.setState({
        spinnerVisible: false
      });
      if (status) {
        Utility.showSuccessToast('You have successfully registered')
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
                  // console.log("JSON MMMM: " + JSON.stringify(user))
                  // fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + data.accessToken.toString())
                  // .then((response) => response.json())
                  // .then((user) => {
                  //     console.log("JSON MMMM: " + JSON.stringify(user))
                  //     context.socialLogin(user, FACEBOOK);
                  //     // context.isEmailExist(user, FACEBOOK);
                  // })
                  // .catch((error) => {
                  //     //reject('ERROR GETTING DATA FROM FACEBOOK')
                  //     // console.error(error);
                  //     context.setState({ isClickLoginOption: false })
                  // }).done();
                  console.log('FACEBOOK LOGIN USER: ', user)
                  if (user) {
                    context.callRegister(user.id, user.name, FACEBOOK)
                  } else {
                    Utility.showToast('Something wrong to fetch data from Facebook');
                  }
                  // context.socialLogin(user, FACEBOOK);
                  // context.isEmailExist(user, FACEBOOK);
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
    var context = this
    RNTwitterSignIn.init(Utility.TWITTER_COMSUMER_KEY, Utility.TWITTER_CONSUMER_SECRET)
    RNTwitterSignIn.logIn()
      .then(loginData => {
        console.log(loginData)
        context.callRegister(loginData.userID, loginData.userName, TWITTER)
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
        // console.log('appleAuthRequestResponse.fullName ',appleAuthRequestResponse.fullName)
        var name = appleAuthRequestResponse.fullName.givenName ? appleAuthRequestResponse.fullName.givenName : ''
        name = name + (appleAuthRequestResponse.fullName.middleName ? ' ' + appleAuthRequestResponse.fullName.middleName : '')
        name = name + (appleAuthRequestResponse.fullName.familyName ? ' ' + appleAuthRequestResponse.fullName.familyName : '')
        name = (name == null ? '' : name)
        console.log('appleAuthRequestResponse', name, appleAuthRequestResponse.email)
        if (appleAuthRequestResponse.email) {
          this.setState({ email: appleAuthRequestResponse.email })
          setTimeout(() => {
            this.callRegister(appleAuthRequestResponse.user, name.toString().trim(), APPLE)
          }, 500)
        } else {
          this.callRegister(appleAuthRequestResponse.user, name.toString().trim(), APPLE)
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

  async appleLogout() {
    try {
      // performs login request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGOUT,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });
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


  onShowHideBtnPressed() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  onShowHideReenterPassword() {
    this.setState({ showReEnterPassword: !this.state.showReEnterPassword });
  }

  render() {
    var contentView = <View style={{ flex: 1, paddingBottom: 20 }}>
      <TextInput
        style={styles.textInput}
        onChangeText={(username) => this.setState({ username })}
        value={this.state.username}
        placeholder={'User Name'}
        placeholderTextColor={Colors.placeholderTextColor}
        keyboardType={"default"}
        ref={(input) => { this.username = input; }}
        autoCapitalize="characters"
        returnKeyType='next'
        maxLength={100}
        onSubmitEditing={() => { this.fname.focus(); }}
        blurOnSubmit={false}
      />
      <TextInput
        style={styles.textInput}
        onChangeText={(full_name) => this.setState({ full_name })}
        value={this.state.full_name}
        placeholder={'Full Name'}
        placeholderTextColor={Colors.placeholderTextColor}
        keyboardType={"default"}
        ref={(input) => { this.fname = input; }}
        autoCapitalize="words"
        returnKeyType='next'
        maxLength={100}
        onSubmitEditing={() => { this.address.focus(); }}
        blurOnSubmit={false}
      />
      <TextInput
        style={styles.textInput}
        onChangeText={(address) => this.setState({ address })}
        value={this.state.address}
        placeholder={'Address'}
        placeholderTextColor={Colors.placeholderTextColor}
        keyboardType={"default"}
        ref={(input) => { this.address = input; }}
        autoCapitalize="words"
        maxLength={100}
        returnKeyType='next'
        onSubmitEditing={() => { this.country.focus(); }}
        blurOnSubmit={false}
      />
      <TextInput
        style={styles.textInput}
        onChangeText={(country) => this.setState({ country })}
        value={this.state.country}
        placeholder={'Country'}
        placeholderTextColor={Colors.placeholderTextColor}
        keyboardType={"default"}
        ref={(input) => { this.country = input; }}
        autoCapitalize="words"
        returnKeyType='next'
        maxLength={30}
        onSubmitEditing={() => { this.email.focus(); }}
        blurOnSubmit={false}
      />
      <TextInput
        style={styles.textInput}
        onChangeText={(email) => this.setState({ email })}
        value={this.state.email}
        placeholder={'Email Address'}
        placeholderTextColor={Colors.placeholderTextColor}
        keyboardType={"email-address"}
        ref={(input) => { this.email = input; }}
        autoCapitalize="sentences"
        returnKeyType='next'
        maxLength={50}
        onSubmitEditing={() => { this.phone.focus(); }}
        blurOnSubmit={false}
      />
      <TextInput
        style={styles.textInput}
        onChangeText={(phone) => this.setState({ phone })}
        value={this.state.phone}
        placeholder={'Contact Number'}
        placeholderTextColor={Colors.placeholderTextColor}
        keyboardType={"phone-pad"}
        ref={(input) => { this.phone = input; }}
        autoCapitalize="sentences"
        returnKeyType='next'
        maxLength={15}
        onSubmitEditing={() => { this.password.focus(); }}
        blurOnSubmit={false}
      />
      <View style={styles.textInput, [{ flexDirection: 'row' }]}>
        <TextInput
          style={[styles.textInput, { flex: 1 }]}
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
          placeholder={'Password'}
          placeholderTextColor={Colors.placeholderTextColor}
          secureTextEntry={this.state.showPassword}
          returnKeyType='next'
          maxLength={30}
          ref={(input) => { this.password = input; }}
          onSubmitEditing={() => { this.reenterpassword.focus(); }}
          blurOnSubmit={false} //to prevent keyboard flickering.
        />
        <TouchableOpacity style={styles.showhideContainer} onPress={this.onShowHideBtnPressed.bind(this)} activeOpacity={0.5}>
          <Image style={styles.passwordEye} source={this.state.showPassword ? Images.eyeVisible : Images.eyeInvisible} />
        </TouchableOpacity>
      </View>
      <View style={styles.textInput, [{ flexDirection: 'row' }]}>
        <TextInput
          style={[styles.textInput, { flex: 1 }]}
          onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
          value={this.state.confirmPassword}
          placeholder={'Confirm Password'}
          placeholderTextColor={Colors.placeholderTextColor}
          secureTextEntry={this.state.showReEnterPassword}
          returnKeyType='done'
          maxLength={30}
          ref={(input) => { this.reenterpassword = input; }}
          onSubmitEditing={() => { Utility.hideKeyboard() }}
          blurOnSubmit={false} //to prevent keyboard flickering.
        />
        <TouchableOpacity style={styles.showhideContainer} onPress={this.onShowHideReenterPassword.bind(this)} activeOpacity={0.5}>
          <Image style={styles.passwordEye} source={this.state.showReEnterPassword ? Images.eyeVisible : Images.eyeInvisible} />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.loginBtnContainer} onPress={this.onCreateAccountPress.bind(this)} activeOpacity={0.8} >
          <Text style={styles.loginTxt}>REGISTER</Text>
        </TouchableOpacity>
        {
          Utility.isPlatformAndroid ?
            null
            :
            <TouchableOpacity style={styles.appleBtnContainer} activeOpacity={0.8} >
              <AppleButton
                buttonStyle={AppleButton.Style.BLACK}
                buttonType={AppleButton.Type.CONTINUE}
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
          <Text style={styles.loginTxt}>REGISTER WITH FACEBOOK</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.loginBtnContainer, { backgroundColor: Colors.twitterBlue }]} onPress={this.onTwitterPress.bind(this)} activeOpacity={0.8} >
          <Image style={styles.fbImage} source={Images.ic_twitter} />
          <Text style={styles.loginTxt}>REGISTER WITH TWITTER</Text>
        </TouchableOpacity>
      </View>
    </View>
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          // contentContainerStyle={{ flex: 1, paddingBottom: 80 }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps={"handled"}
          showsVerticalScrollIndicator={false}
        >
          {contentView}
        </ScrollView>
        {/* <KeyboardAwareScrollView
          style={{ flex: 1 }}
          extraScrollHeight={50}
          onScroll={this.handleScroll}
          keyboardShouldPersistTaps={"always"}
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ flex: 1 }}>
          {contentView}
        </KeyboardAwareScrollView> */}

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
}

export default SignUpController