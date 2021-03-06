var API = module.exports = {};


import { create, ApisauceInstance } from 'apisauce'
import R from 'ramda'
// import RS from 'ramdasauce'
// define the api
//var https = require(https);
var POST = 'post';
var GET = 'get';
var SERVER_BASE_URL = 'https://www.jmviapp.com/rest/';
const api = create({
    baseURL: SERVER_BASE_URL,
    // headers: { 'Accept': 'application/json' },
    timeout: 100000,
})

API.postRequest = function (name, param, onCompletion, isConsole) {
    API.sendRequest(name, param, onCompletion, POST, isConsole);
};
API.getRequest = function (name, param, onCompletion, isConsole) {
    API.sendRequest(name, param, onCompletion, GET, isConsole);
};
API.getPlaces = function (name, param, onCompletion, isConsole) {
    // api.setBaseURL(GOOGLE_BASE_URL);
    API.sendRequest(name, param, onCompletion, GET, isConsole);
};
API.uploadMedia = function (name, param, onCompletion, isConsole) {
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
    // API.sendRequest(name, bodyData, onCompletion, POST, isConsole, headers);
    // Close console in Release mode
    API.sendRequest(name, bodyData, onCompletion, POST, false, headers);
};

API.sendRequest = function (name, param, onCompletion, methodType, isConsole, headers) {
    if (isConsole) {
        console.log('<<<<<<=============' + ' <<START>> ' + 'API ' + methodType+' '+ name + ' =============>>>>>>')
        console.log(`<<<<<<<<<<URL>>>>>>>>>>  ${api.getBaseURL()}` + name)
        // console.log('param', Object.keys(param));
        Object.keys(param).map((key) => {
            console.log(key, ' : ', param[key]);
        })
        console.log('<<<<<<=============' + '  <<END>> ' + 'API ' + name + ' =============>>>>>>')
    }
    //  headers = {
    //     'Content-Type': 'multipart/form-data'
    // }

    let axiosConfig = {
        headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded',
            // 'Content-Type': 'multipart/form-data',
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
        }
      };

    switch (methodType) {
        case POST:
            // console.log('PPPPPPPPRRAAAMMM ',param)
            api.post(name, param, axiosConfig)
                    .then((response) => API.fetchResponse(response, onCompletion, isConsole, name))
                    .catch(err => console.log('API Call : ', err));
            // if (headers != undefined) {
            //     api.post(name, param, { headers })
            //         .then((response) => API.fetchResponse(response, onCompletion, isConsole, name))
            //     // .then(R.props(['ok', 'status', 'problem','data']))
            //     // .then(console.log)
            // } else {
            //     api.post(name, param)
            //         .then((response) => API.fetchResponse(response, onCompletion, isConsole, name))
            //     // .then(R.props(['ok', 'status', 'problem','data']))
            //     // .then(console.log)
            // }
            break;
        case GET:
            api.get(name, param, axiosConfig)
                .then((response) => API.fetchResponse(response, onCompletion, isConsole, name))
            // .then(R.props(['ok', 'status', 'problem']))
            // .then((response) => console.log(response))
            // .then(console.log)
            break;
        default:
            break;
    }
};

API.fetchResponse = function (response, onCompletion, isConsole, name) {
    if (isConsole) {
        console.log('<<<<<<=============' + ' <<START RESPONSE>> ' + 'of API ' + name + ' =============>>>>>>')
        console.log(response)
        console.log('<<<<<<=============' + '  <<END RESPONSE>> ' + 'of API ' + name + ' =============>>>>>>')
    }

    if (response.status == 200) {
        // console.log('\nRESPONSE SUCCESSSS : ', response.data.data)
        if (response.data.status.status_code == -1) { //For social login, we used status == 3
            onCompletion(true, response.data);
        } else {
            onCompletion(false, {
                'status': response.data.status.status_code,
                'message': response.data.status.status_text
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