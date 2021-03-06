var API_CHAT = module.exports = {};


import { create, ApisauceInstance } from 'apisauce'
import R from 'ramda'
import Utility from './Utility'
import User from '../models/User'
import { NavigationActions, StackActions } from 'react-navigation';
// import RS from 'ramdasauce'
// define the api
//var https = require(https);
var POST = 'POST';
var GET = 'GET';

//TODO change url in <data android:host="192.168.10.217" android:scheme="http"/> in AndroidManifest.xml
// var SERVER_BASE_URL = 'http://clientveb.net/clients/2018/junobabywp/wp-json/api/v1/';
// var SERVER_BASE_URL = 'http://192.168.10.217/junobaby/wp-json/api/v1/';
// var SERVER_BASE_URL = 'http://180.211.110.253:4444/junobaby/wp-json/api/v1/';
// var SERVER_BASE_URL = 'http://100.24.165.108/wp-json/api/v1/';
// var SERVER_BASE_URL = 'http://192.168.10.217:8000/api/chat/';
// var SERVER_BASE_URL = 'https://staging.juno-baby.com/wp-json/api/v1/';
// var SERVER_BASE_URL = 'http://100.24.165.108:8000/api/chat/';
//TODO
// var SERVER_BASE_URL = 'https://staging.juno-baby.com/chatjs/api/chat/';
var SERVER_BASE_URL = 'https://www.jmviapp.com/rest/';

const api = create({
    baseURL: SERVER_BASE_URL,
    // baseURL: 'http://192.168.10.217/junobaby/wp-json/api/v1/',
    // headers: { 'Accept': 'application/json' },
    timeout: 100000,
})

API_CHAT.postRequest = function (name, param, onCompletion, isConsole, props) {
    API_CHAT.sendRequest(name, param, onCompletion, POST, isConsole, undefined, props);
};
API_CHAT.getRequest = function (name, param, onCompletion, isConsole) {
    API_CHAT.sendRequest(name, param, onCompletion, GET, isConsole, undefined, undefined);
};
API_CHAT.getPlaces = function (name, param, onCompletion, isConsole) {
    // API_CHAT.setBaseURL(GOOGLE_BASE_URL);
    API_CHAT.sendRequest(name, param, onCompletion, GET, isConsole, undefined, undefined);
};
API_CHAT.uploadMedia = function (name, param, onCompletion, isConsole) {
    let bodyData = undefined;
    let body = new FormData();
    const headers = {
        'Content-Type': 'multipart/form-data'
    }
    if (param) {
        Object.keys(param).map((key) => {
            let value = param[key]
            if (Array.isArray(value)) {
                value.forEach(element => {
                    body.append(key, element);
                });
            } else {
                body.append(key, param[key]);
            }
            // console.log(key, ' ===>>>> ', param[key]);
        })
    }
    bodyData = body;
    API_CHAT.sendRequest(name, bodyData, onCompletion, POST, isConsole, headers, undefined);
};

API_CHAT.sendRequest = function (name, param, onCompletion, methodType, isConsole, headers, prop) {
    if (isConsole) {
        console.log('<<<<<<=============' + ' <<START>> ' + 'API_CHAT ' + name + ' =============>>>>>>')
        console.log(`<<<<<<<<<<URL>>>>>>>>>>  ${api.getBaseURL()}` + name)
        console.log('param', Object.keys(param));
        Object.keys(param).map((key) => {
            console.log(key, ' : ', param[key]);
        })
        console.log('<<<<<<=============' + '  <<END>> ' + 'API ' + name + ' =============>>>>>>')
    }
    if (param.hasOwnProperty('token')) {
        console.log('TOKENNNNN : ', param['token']);
        // if (param['token'] == undefined || param['token'] == '') {
        param['token'] = 'dummy'
        // }
        console.log('TOKENNNNN AF : ', param['token']);
    }
    switch (methodType) {
        case POST:
            if (headers != undefined) {
                api.post(name, param, { headers })
                    .then((response) => API_CHAT.fetchResponse(response, onCompletion, isConsole, name, prop))
                // .then(R.props(['ok', 'status', 'problem','data']))
                // .then(console.log)
            } else {
                api.post(name, param)
                    .then((response) => API_CHAT.fetchResponse(response, onCompletion, isConsole, name, prop))
                // .then(R.props(['ok', 'status', 'problem','data']))
                // .then(console.log)
            }
            break;
        case GET:
            api.get(name)
                .then((response) => API_CHAT.fetchResponse(response, onCompletion, isConsole, name, undefined))
            // .then(R.props(['ok', 'status', 'problem']))
            // .then((response) => console.log(response))
            // .then(console.log)
            break;
        default:
            break;
    }
};

API_CHAT.fetchResponse = function (response, onCompletion, isConsole, name, props) {
    // console.log('THISPROPS 5 this.props ', props)
    if (isConsole) {
        console.log('<<<<<<=============' + ' <<START RESPONSE>> ' + 'of API_CHAT ' + name + ' =============>>>>>>')
        console.log(response)
        console.log('<<<<<<=============' + '  <<END RESPONSE>> ' + 'of API_CHAT ' + name + ' =============>>>>>>')
    }

    if (response.status == 200) {
        // console.log('\nRESPONSE SUCCESSSS : ', response.data.data)
        if (response.data.status == 1 || response.data.status == 3) { //For social login, we used status == 3
            onCompletion(true, response.data);
        } else if (response.data.status == -5) {
            // onCompletion(false, response.data);
            if (props) {
                // Utility.logout(props);
                User.delete(() => {
                    Utility.user = undefined;
                    onCompletion(false, {
                        'status': response.data.status,
                        'message': response.data.message
                    });
                    const resetAction = StackActions.reset({
                        index: 0,
                        key: null,
                        actions: [NavigationActions.navigate({ routeName: 'Auth' })],
                    });
                    props.navigation.dispatch(resetAction);
                });
            }
        } else {
            onCompletion(false, {
                'status': response.data.status,
                'message': response.data.message
            });
        }
    } else {
        if (response.status == 404) {
            onCompletion(false, {
                'status': response.status,
                'message': "URL NOT FOUND"
            });
        } else if (response.status == 401) {
            onCompletion(false, {
                'status': response.status,
                'message': "Unauthorized"
            });
        } else {
            onCompletion(false, {
                'status': 0,
                'message': response.problem
            });
        }
    }
}