import React, { Component } from 'react'

import {
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
  DeviceEventEmitter,
  PixelRatio,
  PermissionsAndroid,
  NativeModules,
  AlertIOS,
  LinkingIOS,
  AppState,
  Keyboard,
} from 'react-native';
//import SnackBar from 'react-native-snackbar-dialog';
import SnackBar from '../component/SnackBar';
import Colors from './Colors';
import { NavigationActions, StackActions } from 'react-navigation';
var Utility = module.exports = {};

/*********************************************************************************************************/
/******************************************@@ Common Functions @@*****************************************/
/*********************************************************************************************************/
Utility.API_KEY = '450908816KGdcae2aYMK';
Utility.WEB_API_KEY = 'AIzaSyBtXbDgHIU3aPq6F-I7zS8-AyiKGfczY_8';
Utility.user = undefined;
Utility.currency = '';
Utility.country_name = undefined;
Utility.country_id = -1;
Utility.TWITTER_COMSUMER_KEY = "qdpeJkUa3xHND9PiK9HyAI2sC"
Utility.TWITTER_CONSUMER_SECRET = "5qu2DNsWmFMt1ZOiCYJwVVckrCnCrlqgedSs6e8WZQgbjXo6VL"
Utility.UnreadNotificationCount = 0;
// Utility.currentLATITUDE = undefined
// Utility.currentLONGITUDE = undefined
Utility.currentLATITUDE = 36.706377
Utility.currentLONGITUDE = -119.787813

Utility.screenWidth = Dimensions.get('window').width;
Utility.screenHeight = Dimensions.get('window').height;

Utility.PLACE_API_KEY = 'AIzaSyBZmyOKSUdIQzp_6bGn41HUOKxSYw-PvA8';

Utility.isPlatformAndroid = Platform.OS !== 'ios';
Utility.device_type = Platform.OS;

Utility.AndroidLink = "https://play.google.com/store/apps/details?id=com.jmvirealty.app"
Utility.iOSLink = "https://apps.apple.com/ag/app/jmvi-realty/id1418679788?ls=1&mt=8"
Utility.AppLink = Utility.isPlatformAndroid ? Utility.AndroidLink : Utility.iOSLink

Utility.TaggedUserRegex = /(\[\{\@(.*?)\}\:[A-Z0-9a-z]{8}-[A-Z0-9a-z]{4}-[A-Z0-9a-z]{4}-[A-Z0-9a-z]{4}-[A-Z0-9a-z]{12})\]/;
Utility.UUIDRegex = /([A-Z0-9a-z]{8}-[A-Z0-9a-z]{4}-[A-Z0-9a-z]{4}-[A-Z0-9a-z]{4}-[A-Z0-9a-z]{12})/;
//sample [{@Nyasdas a asfa2la hell}:6e330148-caa4-4689-aa6e-d2176a248166]
Utility.TaggedUserNameRegex = /\{\@(.*?)\}/ // sample :  {@Nyasdas a asfa2la hell}

Utility.isiPhoneX = (
  Platform.OS === 'ios' &&
  !Platform.isPad &&
  !Platform.isTVOS &&
  (Utility.screenHeight === 812 || Utility.screenWidth === 812 || Utility.screenHeight === 896 || Utility.screenWidth === 896)
);

Utility.hideKeyboard = function () {
  Keyboard.dismiss()
}

Utility.NormalizeFontSize = function (size) {
  // console.log(PixelRatio.get());
  if (Platform.OS === 'ios') {
    return size - 1;
  } else {
    var font_size = size - 1
    if (PixelRatio.get() == 1) {
      font_size = size - 4;
    } else if (PixelRatio.get() == 1.5) {
      font_size = size - 3;
    } else if (PixelRatio.get() == 2) {
      font_size = size - 2;
    } else if (PixelRatio.get() == 3) {
      font_size = size - 1;
    }
    // if (PixelRatio.get() == 1) {
    //   font_size = size - 5;
    // } else if (PixelRatio.get() == 1.5) {
    //   font_size = size - 4;
    // } else if (PixelRatio.get() == 2) {
    //   font_size = size - 2;
    // } else if (PixelRatio.get() == 3) {
    //   font_size = size;
    // }
    return font_size;
  }

}

Utility._checkLocationPermission = function () {
  if (Platform.OS !== 'android') {
    return Promise.resolve(true);
  }

  const rationale = {
    'title': 'Location Permission',
    'message': 'JMVI Realty needs access to your location.'
  }
  return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, rationale)
    .then((result) => {
      // console.log('Permission result:', result);
      return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
    });
}

Utility.requestImagePermissionfunction = function () {
  if (Platform.OS == 'ios') {
    return Promise.resolve(true);
  } else {
    return PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.CAMERA,
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE])
      .then((result) => {
        if (result['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          return false;
        }
      });
  }
}
Utility.requestAudioPermissionfunction = function () {
  if (Platform.OS == 'ios') {
    return Promise.resolve(true);
  } else {
    return PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.RECORD_AUDIO])
      .then((result) => {
        if (result['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          return false;
        }
      });
  }
}

Utility.requestLocationPermissionfunction = function () {
  if (Platform.OS == 'ios') {
    return Promise.resolve(true);
  } else {
    return PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION])
      .then((result) => {
        if (result['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
          result['android.permission.ACCESS_COARSE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          return false;
        }
      });
  }
}

Utility.requestSMSPermissionfunction = function () {
  if (Platform.OS == 'ios') {
    return Promise.resolve(true);
  } else {
    return PermissionsAndroid.requestMultiple([PermissionsAndroid.PERMISSIONS.SEND_SMS])
      .then((result) => {
        if (result['android.permission.SEND_SMS'] === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          return false;
        }
      });
  }
}

Utility.showToast = function (msg) {
  SnackBar.dismiss()
  SnackBar.show(msg, {
    style: {
      marginHorizontal: 10,
      marginTop: 30,
      width: Utility.screenWidth - 20,
      borderRadius: 5,
      overflow: 'hidden',

    },
    duration: 2000,
    backgroundColor: Colors.tomato,
    buttonColor: 'blue',
    textColor: Colors.white,
    position: 'top',

    id: '123456'
  })
}

Utility.showSuccessToast = function (msg) {
  SnackBar.dismiss()
  SnackBar.show(msg, {
    style: {
      marginHorizontal: 10,
      marginTop: 30,
      width: Utility.screenWidth - 20,
      borderRadius: 5,
      overflow: 'hidden',

    },
    duration: 2000,
    backgroundColor: Colors.green,
    buttonColor: 'blue',
    textColor: Colors.white,
    position: 'top',
    id: '123456'
  })
}

Utility.showAlert = function (title, message, onTap) {
  Alert.alert(title, message, [
    {
      text: 'OK',
      onPress: () => {
        onTap()
      }
    }
  ], { cancelable: false })
}

Utility.showConfirmationAlert = function (yes, no, title, message, onYesTap) {
  Alert.alert(title, message, [
    {
      text: no
    }, {
      text: yes,
      onPress: () => {
        onYesTap()
      }
    }
  ], { cancelable: false })
}


Utility.handleUrlPress = function (url) {
  LinkingIOS.openURL(url);
}

Utility.handlePhonePress = function (phone) {
  AlertIOS.alert(`${phone} has been pressed!`);
}


Utility.handleEmailPress = function (email) {
  AlertIOS.alert(`send email to ${email}`);
}

Utility.getParameterByNameFromQueryStringURL = function (url, name) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Utility.AppStoreURL = function () {
//   if (Platform.OS === 'ios') {
//     return Settings.APP_STORE_URL;
//   } else {
//     return Settings.PLAY_STORE_URL;
//   }
// }

Utility.getChatFormmatedDate = function chatFormattedDate(mili) {

  var date = new Date(mili)
  var hh = date.getHours();

  if (hh > 12) {
    hh = hh - 12;
  }

  if (hh == 0) {
    hh = 12;
  }

  var mm = date.getMinutes();

  var timeType = Utility.getTimeType(mili)

  hh = Utility.prefixZero(hh)
  mm = Utility.prefixZero(mm)

  var formattedDate = hh + ":" + mm + " " + timeType
  return formattedDate
}

/*********************************************************************************************************/
/*******************************************@@ App Functions @@*******************************************/
/*********************************************************************************************************/
/*  */

/* xxxxxxxxxxxxxxxxxxxx=======xxxxxxxxxxxxxxxxxx */

Utility.TABS = {
  TRIP: 'TRIP',
  SEARCH: 'SEARCH',
  ACCOUNT: 'ACCOUNT',
}
Utility.BOTTOM = {
  SALE: 'SALE',
  RENT: 'RENT',
  BID: 'BID',
}
Utility.SCREEN = {
  Tabbar: 'Tabbar',
  Start: 'Start',
  SignUp: 'SignUp',
  SignIn: 'SignIn',
  ForgotPassword: 'ForgotPassword',
  Featured: 'Featured',
  ForSale: 'ForSale',
  ForRent: 'ForRent',
  Auction: 'Auction',
  AuctionDetails: 'AuctionDetails',
  MyFavourite: 'MyFavourite',
  FindAnAgent: 'FindAnAgent',
  AgentDetails: 'AgentDetails',
  MortgageCalculator: 'MortgageCalculator',
  MortgageFinancing: 'MortgageFinancing',
  MortgageFinancingDetails: 'MortgageFinancingDetails',
  PropertyLawyers: 'PropertyLawyers',
  Country: 'Country',
  AboutUs: 'AboutUs',
  ContactUs: 'ContactUs',
  TNC: 'TNC',
  Search: 'Search',
  SearchResult: 'SearchResult',
  PropertyDetails: 'PropertyDetails',
  Profile: 'Profile',
  PropertyLawyerDetails: 'PropertyLawyerDetails',
  Property: 'Property',
  GallerySwiper: 'GallerySwiper',
}
Utility.cmsType = {
  TermsOfService: 'terms-of-service',
  PaymentTermsOfService: 'payment-terms-of-service',
  PrivacyPolicy: 'privacy-policy',
}
//TODO 
Utility.URLS = {
  TNC: 'https://www.jmviapp.com/terms_and_condition.php',
  AboutUs: 'https://www.jmviapp.com/about_us.php',
  PP: 'https://www.jmviapp.com/terms_and_condition.php',
}

Utility.isUrl = function isUrl(s) {
  var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  return regexp.test(s);
}
// Utility.hideLoader = function() {
//   DeviceEventEmitter.emit('changeLoadingEffect', {isVisible: false});
// }
// Utility.showLoader = function(title) {
//   DeviceEventEmitter.emit('changeLoadingEffect', {title, isVisible: true});
// }
Utility.validateEmail = function (email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
Utility.validatePassword = function (password) {
  // var re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/; //with digit
  // var re = /^(?=.*[A-Za-z])(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
  // var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d_$@$!%*?&]{8,}/; //1 Special Char, 1 Digit, 1 Upper case, 1 Lower case 
  // var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d_$@$!%*?&]{8,}/; //1 Special Char, 1 Digit, 1 Upper case, 1 Lower case 
  var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_.!@#\$%\^&\*])(?=.{8,})/; //1 Special Char, 1 Digit, 1 Upper case, 1 Lower case 
  return re.test(password);
}

/** for Array helper */
Utility.unique = function (arr) {
  return arr.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
}

/** Use only for Array of object with value type string */
Utility.sortArray = function (array, key) {
  array.sort(function (a, b) {
    var nameA = a[key].toUpperCase(); // ignore upper and lowercase
    var nameB = b[key].toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be equal
    return 0;
  });
}

Utility.getSelectedItemsFromArray = function (array, type) {
  let strSelectedValue = '';
  let strSelectedIds = '';
  array.forEach(element => {
    if (element.selected == true) {
      if (strSelectedValue == '') {
        strSelectedValue = element.name;
        strSelectedIds = element.id;
      } else {
        strSelectedValue = strSelectedValue + ',' + element.name;
        strSelectedIds = strSelectedIds + ',' + element.id;
      }
    }
  });
  console.log("strSelectedValue>", strSelectedValue)
  return type != undefined ? type == 'NAME' ? strSelectedValue : strSelectedIds : strSelectedValue;
}

/*********************************************************************************************************/
/***************************************@@ Notification Handling @@***************************************/
/*********************************************************************************************************/

//FCM.on(FCMEvent.Notification, async (typeOfNotification) => {
// FCM.on(FCMEvent.Notification, (typeOfNotification) => {
//   if (Utility.user != undefined) {
//     console.log('in condition')
//     this.props.navigation.navigate('Invoice');
//   }
//   if (Platform.OS === 'ios') {
//     switch (typeOfNotification._notificationType) {
//       case NotificationType.Remote:
//         typeOfNotification.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
//         break;
//       case NotificationType.NotificationResponse:
//         typeOfNotification.finish();
//         break;
//       case NotificationType.WillPresent:
//         typeOfNotification.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
//         break;
//     }
//   }
// });

// FCM.getInitialNotification(FCMEvent.Notification, (typeOfNotification) => {
//   console.log('in condition', typeOfNotification)
//   User.loggedInUser((user) => {
//     console.log('FCM user ', user)
//     if (user != undefined) {
//       this.props.navigation.navigate('Invoice');
//     }
//   });
//   if (Platform.OS === 'ios') {
//     switch (typeOfNotification._notificationType) {
//       case NotificationType.Remote:
//         typeOfNotification.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
//         break;
//       case NotificationType.NotificationResponse:
//         typeOfNotification.finish();
//         break;
//       case NotificationType.WillPresent:
//         typeOfNotification.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
//         break;
//     }
//   }
// });

// FCM.on(FCMEvent.RefreshToken, (token) => {
//   console.log("FCM>>>Utilitytoken", token)
//   AsyncData.saveAsyncData('fcm_token', token);
//   if (Utility.user != undefined) {
//     Utility.updateToken(token);
//   }
//   // fcm token may not be available on first load, catch it here
// });

// Utility.isUpdateToken = false;

// Utility.updateToken = function (token) {
//   if (token == undefined) {
//     return;
//   }
//   console.log('Utility.updateToken', token.replace('"', ""))
//   if (Utility.user != undefined && Utility.isUpdateToken == false) {
//     Utility.isUpdateToken = true;
//     var params = {
//       'user_id': Utility.user.id + '',
//       'device_type': Utility.device_type + '',
//       'device_token': (token.replace('"', '').replace('"', '')) + '',
//     };
//     API.postRequest('update-token', params, (status, data) => {
//       if (status) {
//         // Utility.showSuccessToast('' + data.message)
//       } else {
//         Utility.isUpdateToken = false;
//       }
//     }, true);
//   }
// }


/*
FCM.on(FCMEvent.Notification, async (notif) => {
  console.log("FCM Notification Received in Utility : ", notif);
  console.log("Notification Payload in Utility : ", JSON.stringify(notif.payload));

  // if (notif.user_id != undefined && Utility.user != undefined && notif.title != null) {
    if(notif.opened_from_tray && Utility.user != undefined){
      setTimeout(()=>{
        // if(notif['activity-tag'] === 'post_like'){
          if(AppState.currentState !== 'background'){
            // console.log('User replied '+ JSON.stringify(notif._userText))
            // alert('User replied '+ JSON.stringify(notif._userText));
            Utility.redirectFromNotification(notif['activity-tag'], notif['community-id'], notif['topic-id'], notif['discussion-id'], notif['responder-id'])
          } else {
            AsyncStorage.setItem('lastMessage', JSON.stringify(notif._userText));
          }
        // }
        if(notif._notificationType === 'will_present_notification'){
          alert("User clicked View in App");
        }
        if(notif._notificationType === 'dismiss'){
          alert("User clicked Dismiss");
        }
      }, 1000)
    }
  // }

  if (Platform.OS === 'ios') {
    //optional
    //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
    //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
    //notif._notificationType is available for iOS platfrom
    switch (notif._notificationType) {
      case NotificationType.Remote:
        notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
        break;
      case NotificationType.NotificationResponse:
        notif.finish();
        break;
      case NotificationType.WillPresent:
        notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
        break;
    }
  }
});


FCM.on(FCMEvent.RefreshToken, (token) => {
  console.log("FCM>>>Utilitytoken", token)
  // fcm token may not be available on first load, catch it here
});
*/

/**
 * AIzaSyANM8G63fv8QINPkVwkUJRpZu-Ovp9blNc
 * Sample payload we need to send to FCM
 *
 *
 {
  "to": "e9yw9bhw1r0:APA91bFmq8CoGfldWy8grVOjnXDrO3QFhZKpfMbCNia2M5PIRhyR0qqg3ntP3Rm9snclqXqUDMm_oYHRmpuY6LfWYhs0Z_4C1JprZ6o2xS4of3wvHIVRv34Rep4N3hh9gCoOcUPubXFJ",
  "notification": {
    "title": "Notification Title",
    "body": "Test Message for push notification"
    "sound": "default",
  },
  "data": {
    "payload": {
        "user_id": 1,
        "type": 1,
    }
  },
  "priority": "high"
}

 *
 *
 */



