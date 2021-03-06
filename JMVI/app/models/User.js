import {  Platform, } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Utility from '../config/Utility';
import WebClient from '../config/WebClient';
import Settings from '../config/Settings';

//import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';


export default class User {
    //authorizeToken
    constructor(userData) {
        if (userData) {
            //account_tbl_privacy: 'public_',
            this.user_id = userData.user_id
            this.full_name = userData.full_name
            this.username = userData.username
            this.login_hash = userData.login_hash
            this.facebook_id = userData.facebook_id
            this.twitter_id = userData.twitter_id
            this.mobile = userData.mobile
            this.address = userData.address
            this.email = userData.email
            this.country = userData.country ? userData.country : ''
            this.country_id = userData.country_id ? userData.country_id : ''
        }
    }
}


//Convert response dictionary to User model and save
User.save = function (userData) {
    // the 'this' keyword refers to the object instance
    // you can access only 'privileged' and 'public' members
    let user = new User(userData)
    User.saveUserModel(user);
};

//Save user model
User.saveUserModel = function (user) {
    Utility.user = user;
    let userJson = JSON.stringify(user)
    AsyncStorage.setItem("loggedInUser", userJson);
};

User.loggedInUser = function (completion) {
    AsyncStorage.getItem("loggedInUser").then((userData) => {
        let user = JSON.parse(userData)
        Utility.user = user;
        completion(user)
    }).done();
}

User.delete = function (completion) {
    // the 'this' keyword refers to the object instance
    // you can access only 'privileged' and 'public' members
    // Utility.user = undefined;
    AsyncStorage.removeItem("loggedInUser", () => {
        completion();
    });
};


