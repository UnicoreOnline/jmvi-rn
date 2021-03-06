import React, {Component} from 'react';
import {StyleSheet, Dimensions, Alert, Platform} from 'react-native';
import Settings from './Settings';
import Utility from './Utility';
import User from '../models/User';
var WebClient = module.exports = {};
WebClient.postFormRequest = function(url, param, onCompletion) {    
    WebClient.sendRequest(url, param, onCompletion, 'POST', true);
};
WebClient.putFormRequest = function(url, param, onCompletion) {    
    WebClient.sendRequest(url, param, onCompletion, 'PUT', true);
};
WebClient.postRequest = function(url, param, onCompletion) {
    console.log('***** param *****'+param);
    WebClient.sendRequest(url, param, onCompletion, 'POST');
};
WebClient.getRequest = function(url, param, onCompletion) {
    WebClient.sendRequest(url, param, onCompletion, 'GET');
};
WebClient.putRequest = function(url, param, onCompletion) {
    WebClient.sendRequest(url, param, onCompletion, 'PUT');
};
WebClient.deleteRequest = function(url, param, onCompletion) {
    WebClient.sendRequest(url, param, onCompletion, 'DELETE');
};
WebClient.sendRequest = function(url, param, onCompletion, methodType, isBodyTypeFormData = false) {
    console.log('URL = ' + url);
    console.log('param', Object.keys(param));
    console.log('********AuthorizeToken******** = ' + WebClient.authorizeToken);
    let requestURL = url;
    let bodyData = undefined;
    headersData = {
        'Authorization': WebClient.authorizeToken
    }
    if (isBodyTypeFormData == true) {
        let body = new FormData();        
        if (param) {
            Object.keys(param).map((key) => {
                let value = param[key]
                if (Array.isArray(value)) {
                    value.forEach(element => {
                        body.append(key, element);     
                    });
                }else {
                    body.append(key, param[key]);                
                }
                
                console.log('param', key ,'value ' ,param[key]);
            })
        }
        bodyData = body;
    }else {
        headersData['Content-Type'] = 'application/x-www-form-urlencoded';
        const searchParams = Object.keys(param).map((key) => {
            let value = param[key]
                if (Array.isArray(value)) {
                    return value.map((element => {
                        return encodeURIComponent(key) + '=' + encodeURIComponent(element);  
                    })).join('&')
                }else {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(value);     
                }
           
          }).join('&');
          bodyData = searchParams;
          if (methodType == "GET" || methodType == "DELETE") {
            bodyData = undefined;
            if (searchParams.length > 0) {
                requestURL = requestURL + "?" + searchParams
               
            }
          console.log('********searchParams******** = ' + searchParams);
        }
    }
    
    
   
   
    fetch(requestURL, {        
        method: methodType || 'POST',
        headers : headersData,
        body: bodyData,
        
    }).then((response) => response).then((responseData) => {
      console.log(responseData.status);
      
        if (responseData.status != 200) {
            if (responseData.status == 404) {  
                onCompletion(null, {
                    'code': responseData.status,
                    'message': "URL NOT FOUND"
                });
            }            
            else if (responseData.status == 401) { 
                //Session time out need to login back
                User.delete(() => {
                    WebClient.Utility.resetTo('AgeGateViewController');
                })                
            } else if (responseData.status == 202) {
                //202 means success for update request decision on server
                onCompletion(true, null);
            }
            else {
                var res = JSON.parse(responseData._bodyText);
                onCompletion(null, {
                    'code': responseData.status,
                    'message': res.message
                });
            }
            console.log('******** Error status ******** = ' + responseData.status);
        } else {
            if (responseData._bodyText != "") {
                var res = JSON.parse(responseData._bodyText);
                var parsedResponse = WebClient.createObjectFromResponse(res);
                console.log('******** onCompletion ******** = ' + JSON.stringify(parsedResponse));
                onCompletion(parsedResponse, null);
            }else {
                onCompletion(true, null);
            }           
        }
    }).catch((error) => {
        console.error(error);
        onCompletion(null, error);
    }).done();
};

WebClient.createObjectFromResponse = function (response) {
    console.log(typeof(response));
    if (response.hasOwnProperty('records') == true && response.hasOwnProperty('fields') == true) {
        var arrRecords = response.records
        var arrField = response.fields;
        var arrResponse = []    
        arrRecords.map((arrObject) => {
            if (arrObject.length > 0) {
                var jsonObject = {};
                for (var i = 0; i < arrField.length; i++) {
                    let objField = arrField[i];
                    //jsonObject[objField.name] = arrObject[i] == null ? "" : arrObject[i];
                    if (objField.table != undefined) {
                        jsonObject[objField.table+'_tbl_'+objField.name] = arrObject[i] == null ? "" : arrObject[i];   
                    } else {
                        jsonObject[objField.name] = arrObject[i] == null ? "" : arrObject[i];
                    }
                     
                }
                arrResponse.push(jsonObject);
            }
         })
         return arrResponse
    }else {
        return response;
    }
    
} 
/*********************** */
WebClient.getHTMLResponse = function(url, param, onCompletion, methodType, isBodyTypeFormData = false) {
    console.log('URL = ' + url);
    let requestURL = url;
    let bodyData = undefined;
    fetch(requestURL, {        
        method: 'GET',       
        body: bodyData,
        
    }).then((response) => response).then((responseData) => {
      console.log(responseData.status);
      
      
        if (responseData.status != 200) {            
            console.log('******** Error status ******** = ' + responseData.status);
        } else {
            if (responseData._bodyText != "") {
                
                var parsedResponse = responseData._bodyText;                
                onCompletion(parsedResponse, null);
            }else {
                onCompletion(true, null);
            }           
        }
    }).catch((error) => {
        console.error(error);
        onCompletion(null, error);
    }).done();
};