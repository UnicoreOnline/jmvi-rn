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

class ProfileViewController extends Component {
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
      username: Utility.user ? Utility.user.username : '',
      full_name: Utility.user ? Utility.user.full_name : '',
      address: Utility.user ? Utility.user.address : '',
      country: Utility.user ? Utility.user.country : '',
      phone: Utility.user ? Utility.user.mobile : '',
      email: Utility.user ? Utility.user.email : '',
    };
  }

  componentDidMount() {
  }

  callUpdateProfilePress() {
    Utility.hideKeyboard()
    // if (this.state.username.trim() == '') {
    //   Utility.showToast('Please enter user name')
    // }
    // if (this.state.full_name.trim() == '') {
    //   Utility.showToast('Please enter first name')
    // }
    // if (this.state.address.trim() == '') {
    //   Utility.showToast('Please enter last name')
    // }
    // if (this.state.email.trim() == '') {
    //   Utility.showToast('Please enter email address')
    // }
    // else {
    this.callUpdateProfile()
    // this.uploadImage(this.state.photoImageUri);
    // }
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

  callUpdateProfile() {
    // const resetAction = StackActions.reset({
    //   index: 0,
    //   key: null,
    //   actions: [NavigationActions.navigate({ routeName: 'SideMenuContainer' })],
    // });
    // this.props.navigation.dispatch(resetAction);
    this.setState({ spinnerVisible: true });
    var params = {
      'api_key': Utility.API_KEY,
      'login_hash': Utility.user ? Utility.user.login_hash : '',
      'user_id': Utility.user ? Utility.user.user_id : '',
      'username': this.state.username,
      'full_name': this.state.full_name,
      'email': this.state.email,
      'mobile': this.state.phone,
      'address': this.state.address,
      'country': this.state.country,
    }
    API.postRequest('update_profile.php', params, (status, data) => {
      this.setState({
        spinnerVisible: false
      });
      if (status) {
        //TODO check after api implementation
        Utility.showSuccessToast('Profile updated successfully.')
        Utility.user = data.user_info
        User.save(data.user_info);
      } else {
        Utility.showToast('' + data.message)
      }
    }, true, this.props);
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
        placeholderTextColor={Colors.placeholderTextColor}
        onChangeText={(username) => this.setState({ username })}
        value={this.state.username}
        placeholder={'User Name'}
        placeholderTextColor={Colors.black}
        keyboardType={"default"}
        ref={(input) => { this.username = input; }}
        autoCapitalize="words"
        returnKeyType='next'
        maxLength={100}
        onSubmitEditing={() => { this.fname.focus(); }}
        blurOnSubmit={false}
        editable={(Utility.user ? Utility.user.username : '') == '' ? true : false}
      />
      <TextInput
        style={styles.textInput}
        placeholderTextColor={Colors.placeholderTextColor}
        onChangeText={(full_name) => this.setState({ full_name })}
        value={this.state.full_name}
        placeholder={'Full Name'}
        placeholderTextColor={Colors.black}
        keyboardType={"default"}
        ref={(input) => { this.fname = input; }}
        autoCapitalize="words"
        returnKeyType='next'
        maxLength={100}
        onSubmitEditing={() => { this.address.focus(); }}
        blurOnSubmit={false}
      // editable={false}
      />
      <TextInput
        style={styles.textInput}
        placeholderTextColor={Colors.placeholderTextColor}
        onChangeText={(address) => this.setState({ address })}
        value={this.state.address}
        placeholder={'Address'}
        placeholderTextColor={Colors.black}
        keyboardType={"default"}
        ref={(input) => { this.address = input; }}
        autoCapitalize="words"
        maxLength={100}
        returnKeyType='next'
        onSubmitEditing={() => { this.country.focus(); }}
        blurOnSubmit={false}
      // editable={false}
      />
      <TextInput
        style={styles.textInput}
        placeholderTextColor={Colors.placeholderTextColor}
        onChangeText={(country) => this.setState({ country })}
        value={this.state.country}
        placeholder={'Country'}
        placeholderTextColor={Colors.black}
        keyboardType={"default"}
        ref={(input) => { this.country = input; }}
        autoCapitalize="words"
        returnKeyType='next'
        maxLength={30}
        onSubmitEditing={() => { this.email.focus(); }}
        blurOnSubmit={false}
      // editable={false}
      />
      <TextInput
        style={styles.textInput}
        placeholderTextColor={Colors.placeholderTextColor}
        onChangeText={(email) => this.setState({ email })}
        value={this.state.email}
        placeholder={'Email Address'}
        placeholderTextColor={Colors.black}
        keyboardType={"email-address"}
        ref={(input) => { this.email = input; }}
        autoCapitalize="sentences"
        returnKeyType='next'
        maxLength={50}
        onSubmitEditing={() => { this.phone.focus(); }}
        blurOnSubmit={false}
        editable={(Utility.user ? Utility.user.username : '') == '' ? true : false}
      />
      <TextInput
        style={styles.textInput}
        placeholderTextColor={Colors.placeholderTextColor}
        onChangeText={(phone) => this.setState({ phone })}
        value={this.state.phone}
        placeholder={'Contact Number'}
        placeholderTextColor={Colors.black}
        keyboardType={"phone-pad"}
        ref={(input) => { this.phone = input; }}
        autoCapitalize="sentences"
        returnKeyType='next'
        maxLength={15}
        onSubmitEditing={() => { this.password.focus(); }}
        blurOnSubmit={false}
      // editable={false}
      />
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.loginBtnContainer} onPress={this.callUpdateProfilePress.bind(this)} activeOpacity={0.8} >
          <Text style={styles.loginTxt}>UPDATE</Text>
        </TouchableOpacity>
      </View>
    </View>
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          // contentContainerStyle={{ flex: 1, paddingBottom: 80 }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps={"handled"}
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

export default ProfileViewController