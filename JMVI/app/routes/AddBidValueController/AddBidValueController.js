import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList
} from 'react-native'

import styles from './styles'
import Colors from '../../config/Colors'
import Images from '../../config/Images'
import Utility from '../../config/Utility'

import API from '../../config/API'
import Spinner from 'react-native-loading-spinner-overlay'

class AddBidValueController extends Component {
    static navigationOptions = {
        header: null,
    }
    constructor(props) {
        super(props)
        const { navigation } = this.props;
        this.state = {
            bidValue: '',
            spinnerVisible: false,
            validationTxt: ""
        }
    }


    submitComment() {
        if (this.state.bidValue == '') {
            this.setState({
                validationTxt: "Please enter bid price"
            })
        } 
        // else if (this.state.comment == '') {
        //     this.setState({
        //         validationTxt: "Please add your comment"
        //     })
        // }
         else {
            this.props.closePopUp(this.state.bidValue);
            // this.setState({ spinnerVisible: true, validationTxt: "" });
            // var params = {
            //     'bidValue': this.state.bidValue + '',
            //     'comment': this.state.comment + '',
            //     'model': this.props.model,
            //     "model_id" : this.props.model_id,
            //     "parent_id" : this.props.parent_id
            // }
            // // var APINAME = this.state.from == 'REVIEW' ? 'request-review' : this.state.from == 'CLIENTS' ? 'invite-clients' : '';
            // API.postRequest('videos/comment', params, (status, data) => {
            //     this.setState({ spinnerVisible: false });
            //     if (status) {
            //         Utility.showSuccessToast('Comment added successfully' )
            //         // this.setState({ reviewModalVisible: false })
            //         this.props.closePopUp(data.comment);
            //     } else {
            //         Utility.showToast('' + data.message)
            //     }
            // }, true, this.props);
        }
    }

    render() {
        return (
            <View style={styles.safeAreaView}>
                {/* <KeyboardAwareScrollView
                    style={styles.container}
                    extraScrollHeight={120}
                    onScroll={this.handleScroll}
                    keyboardShouldPersistTaps={"always"}
                    automaticallyAdjustContentInsets={true}
                    bounces={true}
                    showsVerticalScrollIndicator={false}>
                    
                </KeyboardAwareScrollView> */}
                <View style={styles.overviewTxtContainer}>
                        {/* <Text style={styles.anonymousTxt}>Anonymous</Text> */}
                        <Text style={styles.anonymousTxt}>Add Bid Price</Text>
                        <Text style={styles.validationTxt}>{this.state.validationTxt}</Text>
                        <View style={styles.addEmailContainer}>
                            <View style={styles.emailInputTextContainer}>
                                <TextInput
                                    style={styles.inputTxt}
                                    placeholder="Bid Price"
                                    placeholderTextColor={Colors.placeholderTextColor}
                                    onChangeText={(bidValue) => this.setState({ bidValue })}
                                    value={this.state.bidValue}
                                    autoCorrect={false}
                                    maxLength={30}
                                    keyboardType={"number-pad"}
                                    autoCapitalize="words"
                                    underlineColorAndroid='transparent'
                                    // selectionColor={Colors.blue1887C0}
                                    returnKeyType='done'
                                    includeFontPadding={false}
                                />
                            </View>
                            {/* <View style={styles.emailInputTextContainer}>
                                <TextInput
                                    style={styles.inputTxt}
                                    placeholder="Your comment"
                                    onChangeText={(comment) => this.setState({ comment })}
                                    value={this.state.comment}
                                    autoCorrect={false}
                                    maxLength={1500}
                                    autoCapitalize="sentences"
                                    underlineColorAndroid='transparent'
                                    selectionColor={Colors.redff3300}
                                    multiline={true}
                                    includeFontPadding={true}
                                />
                            </View> */}
                            <TouchableOpacity style={styles.addItemBtnImg} onPress={this.submitComment.bind(this)} activeOpacity={0.8}>
                                <Text style={styles.submitTxt} >Place Bid</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                <Spinner visible={this.state.spinnerVisible} />
            </View>
        )
    }
    //Navigation 
    onBackPressed() {
        this.props.closePopUp();
    }

}
export default AddBidValueController