// Copyright (C) 2018 INTUZ. 

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to
// the following conditions:

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR
// ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
// THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
'use strict';
import React, { Component } from "react";
import PropTypes from 'prop-types';

import { View, TextInput, StyleSheet, Image, TouchableOpacity, Text,InputAccessoryView } from "react-native";
import RadioCheckBox from './INTRadioCheckbox/RadioCheckBox';
import ModalBox from 'react-native-modalbox';
import Fonts from '../../config/Fonts'
import Colors from "../../config/Colors";
import Utility from "../../config/Utility";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// const InputAccessoryView = Utility.isPlatformAndroid ? '' : require('InputAccessoryView')
var mImages = {
    check: require('../INTRichTextInput/images/ic_check.png'),
    clear: require('../INTRichTextInput/images/ic_clear.png'),
    dot: require('../INTRichTextInput/images/ic_dot.png'),
    close: require('../INTRichTextInput/images/ic_backbutton_top.png'),
}
var mEditType = {
    mSINGLELINE: 0,
    mMULTILINE: 1,
    mSELECTIONS: 2,
    mNOTHING: 3,
    mShowEditButDoNOTHING: 4,
}
export default class INTRichTextInput extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isFocused: false,
            text: props.value + '',
            height: 0,
            //Selections
            // message: '',
            selectionModalVisible: false,
            arrSelections: props.arrSelections ? props.arrSelections : [],
            //Multiline
            multiLineTextInputModalVisible: false,
        };
    }
    focus() {
        this.refs.input.focus();
    }
    blur() {
        this.refs.input.blur();
    }
    isFocused() {
        return this.state.isFocused;
    }
    rightIconTapped() {
        if (this.props.onRightIconAction != undefined) {
            this.props.onRightIconAction()
        }
    }
    /* 
    * Clear Single TextInput 
    * */
    clearTapped(showErrorIcon) {
        if (showErrorIcon && this.state.text.length > 0 && this.isFocused()) {
            if (this.props.clearTapped != undefined) {
                this.props.clearTapped()
            }
            // this.setState({ text: "" }, console.log('clearTapped', this.state.text))
        }

    }

    measureLayout(...args) {
        this.refs.wrapper.measureLayout(...args)
    }
    componentWillReceiveProps(nextProps) {
        // if (this.props.arrSelection !== nextProps.arrSelection) {
        this.setState({ arrSelection: nextProps.arrSelection });
        // }
        this.setState({ title: nextProps.title });
        //if (nextProps.value != undefined) {
        // console.log("componentWillReceiveProps", nextProps.value)
        this.setState({ text: nextProps.value });
        // }
    }

    render() {
        let {
            label,
            highlightColor,
            duration,
            labelColor,
            borderColor,
            textColor,
            textFocusColor,
            textBlurColor,
            onFocus,
            onBlur,
            onChangeText,
            onChange,
            value,
            inputStyle,
            wrapperStyle,
            labelStyle,
            autoGrow,
            leftIcon,
            rightIcon,
            title,
            titleStyle,
            subTitle,
            showErrorIcon,//focus + text vailabe = clear and Not focus = dot
            //Selections
            arrSelections,
            isSingleSelection,
            //Multiline TextInput
            editType,
            maxLength,
            ...props
        } = this.props;
        return (

            <View style={styles.wrapperOuter}>
                {
                    (editType == mEditType.mMULTILINE && this.state.text == '') ?
                        <View style={{ paddingVertical: 8 }}>
                            {/* Title */}
                            <View style={[
                                styles.wrapperTitle,
                                { flexDirection: 'column' }
                            ]} >
                                {
                                    <Text style={[
                                        styles.textTitle,
                                        titleStyle,
                                    ]}{...props}
                                    >{title} </Text>
                                }
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={
                                    styles.textEdit
                                } onPress={() => (editType == mEditType.mNOTHING || editType == mEditType.mShowEditButDoNOTHING) ? null : ((editType == mEditType.mMULTILINE) ? this.openMultilineTextIntup(editType == mEditType.mMULTILINE) : null)}>Edit</Text>
                                {/* this.openCloseSelections(editType == mEditType.mSELECTIONS) */}
                            </View>
                        </View>
                        :
                        <View style={styles.wrapperOuter}>
                            {/* Title */}
                            <View style={styles.wrapperOuter}>
                                <View style={[
                                    styles.wrapperTitle
                                ]} >
                                    {
                                        <Text style={[
                                            styles.textTitle,
                                            titleStyle,
                                        ]}{...props} onPress={() => (editType == mEditType.mNOTHING || editType == mEditType.mShowEditButDoNOTHING) ? null : ((editType == mEditType.mMULTILINE) ? this.openMultilineTextIntup(editType == mEditType.mMULTILINE) : null)}>{title}</Text>
                                        // this.openCloseSelections(editType == mEditType.mSELECTIONS)
                                    }

                                </View>
                                {
                                    (editType == mEditType.mMULTILINE || editType == mEditType.mShowEditButDoNOTHING) ?
                                        <View style={{ flex: 1 }}>
                                            <Text style={
                                                styles.textEdit
                                            }{...props} onPress={() => (editType == mEditType.mShowEditButDoNOTHING) ? null : ((editType == mEditType.mMULTILINE) ? this.openMultilineTextIntup(editType == mEditType.mMULTILINE) : null)}>Edit</Text>
                                            {/* this.openCloseSelections(editType == mEditType.mSELECTIONS) */}
                                        </View> : null
                                }
                            </View>
                            {/* TextField */}
                            {
                                editType == mEditType.mSINGLELINE ?
                                    this.geRichInputView(this.props, false) :
                                    <TouchableOpacity style={{ flex: 1 }} onPress={() => (editType == mEditType.mNOTHING || editType == mEditType.mShowEditButDoNOTHING) ? null : ((editType == mEditType.mSELECTIONS) ? this.openCloseSelections(true) : null)} activeOpacity={1}>
                                        {this.geRichInputView(this.props, true)}
                                    </TouchableOpacity>
                            }
                        </View>
                }
                <View style={[
                    styles.bottomLine,
                ]} >
                </View>
                {/* Selection */}
                {this.selectionModal(title, isSingleSelection)}
                {/* Multiline */}
                {this.multilineTextIntutModal(title, subTitle, maxLength)}
            </View>
        );
    }

    geRichInputView(tempPROPS, isCLICKABLE) {
        //TODO M2 BUGS
        let {
            name,
            highlightColor,
            duration,
            labelColor,
            borderColor,
            textColor,
            textFocusColor,
            textBlurColor,
            onFocus,
            onBlur,
            onChangeText,
            onChange,
            value,
            inputStyle,
            wrapperStyle,
            labelStyle,
            autoGrow,
            leftIcon,
            rightIcon,
            title,
            titleStyle,
            subTitle,
            showErrorIcon,//focus + text vailabe = clear and Not focus = dot
            //Selections
            arrSelections,
            isSingleSelection,
            //Multiline TextInput
            editType,
            maxLength,
            ...props
        } = tempPROPS;
        return <View style={[
            styles.wrapper,
            wrapperStyle
        ]} ref="wrapper">
            {leftIcon
                ? <Image style={styles.leftIcon} source={leftIcon} />
                : null}
            {
                isCLICKABLE ?
                    <Text style={[
                        styles.textInput, {
                            color: textColor,
                        },
                        (this.state.isFocused && textFocusColor)
                            ? {
                                color: textFocusColor
                            }
                            : {},
                        (!this.state.isFocused && textBlurColor)
                            ? {
                                color: textBlurColor
                            }
                            : {},
                        inputStyle,
                    ]}
                        {...props}>
                        {this.state.text}
                    </Text>
                    :
                    <TextInput style={[
                        styles.textInput, {
                            color: textColor,
                            height: Math.max(35, this.state.height + (Utility.isPlatformAndroid ? 0 : 10)),
                        },
                        (this.state.isFocused && textFocusColor)
                            ? {
                                color: textFocusColor
                            }
                            : {},
                        (!this.state.isFocused && textBlurColor)
                            ? {
                                color: textBlurColor
                            }
                            : {},
                        inputStyle,
                    ]}
                        //Dynamic Height
                        onContentSizeChange={(event) => {
                            this.setState({ height: event.nativeEvent.contentSize.height })
                        }}
                        multiline={(editType == mEditType.mSINGLELINE) ? false : true}
                        maxLength={maxLength ? maxLength : 100000}
                        onFocus={() => {
                            this.setState({ isFocused: true });
                            onFocus && onFocus();
                        }}
                        onBlur={() => {
                            this.setState({ isFocused: false });
                            onBlur && onBlur();
                        }}
                        onChangeText={(text) => {
                            this.setState({ text });
                            onChangeText && onChangeText(text);
                        }}
                        onChange={(event) => {
                            onChange && onChange(event);
                        }}
                        selectionColor={Colors.selectionColor}
                        editable={(editType != mEditType.mSINGLELINE) ? false : true}
                        onTouchStart={() => (editType == mEditType.mNOTHING || editType == mEditType.mShowEditButDoNOTHING) ? null : ((editType == mEditType.mSELECTIONS) ? this.openCloseSelections(true) : null)}
                        ref="input" value={this.state.text} {...props}>
                    </TextInput>
            }
            {
                (showErrorIcon == true) && (editType == mEditType.mSINGLELINE || editType == mEditType.mSELECTIONS) ?
                    <TouchableOpacity style={styles.rightIcon} onPress={() => this.clearTapped(showErrorIcon)} activeOpacity={0.7}>
                        <Image source={showErrorIcon == true
                            ?
                            this.isFocused() == true
                                ?
                                mImages.clear
                                :
                                (this.isFocused() == false && this.state.text.length == 0)
                                    ? mImages.dot
                                    : this.state.text.length > 0 ?
                                        (editType == mEditType.mSELECTIONS ? mImages.dot : mImages.check)
                                        : null
                            : mImages.dot} />
                    </TouchableOpacity> : null
            }
            {this.props.onPress
                ? <TouchableOpacity style={{
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                    backgroundColor: 'rgba(0,0,0,0)'
                }} onPress={this.props.onPress} />
                : null}
        </View>
    }
    /*
    *Open/Close Selections
    * */
    openCloseSelections(isVisible) {
        this.setState({ selectionModalVisible: isVisible });
    }
    /*
   *Get Selected Items
   * */
    getSelectedItemList(isVisible, isSelectionCancel) {
        if (!isSelectionCancel)
            this.refs.radioCheckboxSelection.getSelectedOptions((options) => {
                var message = '';
                for (let i = 0; i < options.length; i++) {
                    if (options[i] != undefined) {
                        if (message == '') {
                            message = options[i].name;
                        } else {
                            message = message + ', ' + options[i].name;
                        }
                    }
                }
                this.setState({ text: message });
                //this.props.onSaveClick(options);
                this.props.onChangeText && this.props.onChangeText(message);
            });
        this.openCloseSelections(isVisible);
    }
    /*
   *Selection View
   * */
    selectionModal(title, isSingleSelection) {
        var selectionModalBox = <ModalBox
            coverScreen={true}
            swipeToClose={false}
            backdropPressToClose={false}
            backButtonClose={true}
            onClosed={() => this.setState({ isSingleSelectionModalVisible: false })}
            style={{ backgroundColor: '#ffffff', }}
            isOpen={this.state.selectionModalVisible}
            position='bottom'>
            <View style={{ flex: 1, paddingHorizontal: 15, marginTop: Utility.isPlatformAndroid ? 10 : 30 }}>
                <View style={{ marginLeft: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => this.getSelectedItemList(false, true)} activeOpacity={0.7}>
                        <Image style={{}} source={mImages.close} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.getSelectedItemList(false, false)} activeOpacity={0.7}>
                        <Text style={{ color: '#6D6D6D', fontSize: 16, fontFamily: Fonts.regular, padding: 6, }}>Save</Text>
                    </TouchableOpacity>
                </View>
                <Text style={[{ marginStart: 10, color: '#484848', fontSize: 30, fontFamily: Fonts.semibold, marginTop: 20, marginBottom: 8 }]}>{title}</Text>
                <KeyboardAwareScrollView
                    extraScrollHeight={30}
                    onScroll={this.handleScroll}
                    keyboardShouldPersistTaps={"always"}
                    automaticallyAdjustContentInsets={true}
                    bounces={true}
                    showsVerticalScrollIndicator={false}>
                    <View style={{ marginStart: 10, backgroundColor: 'white' }}>
                        <RadioCheckBox checkOptions={this.state.arrSelections}
                            ref={"radioCheckboxSelection"}
                            maxSelected={isSingleSelection == true ? 1 : this.state.arrSelections.length}
                            onSelectionChange={(option) => this.onSelectionChange(option)}></RadioCheckBox>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </ModalBox >
        return selectionModalBox;
    }
    onSelectionChange(option) {
        // this.setState({
        //     message: option.name + " value change"
        // });
    }
    onSelectAllClick() {
        this.refs.radioCheckboxSelection.selectAllOptions();
    }
    /*
    *END Selections
    * */

    /*
     *Open/Close Multiline TextInput
    * */
    openMultilineTextIntup(isVisible) {
        this.setState({ multiLineTextInputModalVisible: isVisible });
    }
    /*
    *Get Multiline TextInput Text
    * */
    getSelectedTextFromMultiline(isVisible) {
        this.openMultilineTextIntup(isVisible);
    }

    /*
      *Multiline TextInput View
    * */
    multilineTextIntutModal(title, subTitle, maxLength) {
        const inputAccessoryViewID = "inputAccessoryViewIDJuno";
        var multilineInputModelbox = <ModalBox
            coverScreen={true}
            swipeToClose={false}
            backdropPressToClose={false}
            backButtonClose={true}
            onClosed={() => this.setState({ multiLineTextInputModalVisible: false })}
            style={{ backgroundColor: 'white', }}
            isOpen={this.state.multiLineTextInputModalVisible}
            position='bottom'>
            <View style={{ flex: 1, marginHorizontal: 10, marginTop: Utility.isPlatformAndroid ? 10 : 30 , marginBottom: 10 }}>
                <View style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => this.getSelectedTextFromMultiline(false)} activeOpacity={0.7}>
                        <Image style={{}} source={mImages.close} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.getSelectedTextFromMultiline(false)} activeOpacity={0.7}>
                        <Text style={{ color: '#6D6D6D', fontSize: 16, fontFamily: Fonts.regular, padding: 6, }}>Save</Text>
                    </TouchableOpacity>
                </View>
                <KeyboardAwareScrollView
                    extraScrollHeight={30}
                    onScroll={this.handleScroll}
                    keyboardShouldPersistTaps={"always"}
                    automaticallyAdjustContentInsets={true}
                    bounces={true}
                    showsVerticalScrollIndicator={false}>
                    <View >
                        <Text style={[{ marginStart: 10, color: '#484848', fontSize: 30, fontFamily: Fonts.semibold, marginTop: 10 }]} >{title}</Text>
                        <Text style={[{ marginStart: 10, color: '#6D6D6D', fontSize: 16, fontFamily: Fonts.regular, marginTop: 10 }]}>{subTitle}</Text>
                        <View style={{ backgroundColor: 'white', marginTop: 20 }}>
                            <TextInput style={[
                                styles.textInput, {
                                    color: this.props.textColor,
                                    flex: 1,
                                    minHeight: 200,
                                    marginStart: 10
                                },
                                (this.state.isFocused && this.props.extFocusColor)
                                    ? {
                                        color: this.props.textFocusColor
                                    }
                                    : {},
                                (!this.state.isFocused && this.props.textBlurColor)
                                    ? {
                                        color: this.props.textBlurColor
                                    }
                                    : {},
                                this.props.inputStyle,
                            ]}
                                selectionColor={Colors.selectionColor}
                                multiline={true}
                                maxLength={maxLength != undefined ? maxLength : 100000}
                                autoCorrect={true}
                                autoCapitalize="sentences"
                                onChangeText={(text) => {
                                    this.setState({ text });
                                    this.props.onChangeText && this.props.onChangeText(text);
                                }} ref="input" value={this.state.text} {...this.props.props}
                                inputAccessoryViewID={inputAccessoryViewID} />
                        </View>
                        {
                            Utility.isPlatformAndroid ? null :
                                <InputAccessoryView nativeID={inputAccessoryViewID} >
                                    <View style={{ backgroundColor: 'white', alignSelf: 'center', flex: 1, marginLeft: Utility.screenWidth - 50 }}>
                                        <Text style={{ width: 80, padding: 10 }} onPress={() => Utility.hideKeyboard()}>Done</Text>
                                    </View>
                                </InputAccessoryView>
                        }
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </ModalBox >
        return multilineInputModelbox;
    }
}
INTRichTextInput.propTypes = {
    duration: PropTypes.number,
    label: PropTypes.string,
    highlightColor: PropTypes.string,
    labelColor: PropTypes.string,
    borderColor: PropTypes.string,
    textColor: PropTypes.string,
    textFocusColor: PropTypes.string,
    textBlurColor: PropTypes.string,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChangeText: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.string,
    inputStyle: PropTypes.object,
    wrapperStyle: PropTypes.object,
    labelStyle: PropTypes.object,
    autoGrow: PropTypes.bool,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    titleStyle: PropTypes.object,
    showErrorIcon: PropTypes.bool,
    images: PropTypes.object,
    //Selections
    arrSelections: PropTypes.array,
    isSingleSelection: PropTypes.bool,
    editType: PropTypes.number,
    maxLength: PropTypes.number,
};

INTRichTextInput.defaultProps = {
    duration: 200,
    labelColor: '#9E9E9E',
    borderColor: '#e5e5e5',
    textColor: '#000000',
    value: '',
    underlineColorAndroid: 'rgba(0,0,0,0)',
    autoGrow: false,
    borderWidth: 0,
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
    },

    textInput: { flex: 1, fontSize: 16, height: null, textAlignVertical: 'top', color: '#6D6D6D' },
    leftIcon: {
        marginRight: 15,
        marginLeft: 15,
    },
    rightIcon: {
        marginLeft: 0,
        justifyContent: 'center'
    },
    //New
    wrapperOuter: {
    },
    wrapperTitle: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textTitle: {
        flex: 1,
        fontSize: 14,
        color: '#484848',
        paddingVertical: 2,
        position: 'absolute',
        bottom: 0,
        alignSelf: 'flex-start',
        textAlign: "left",
    },
    textEdit: {
        flex: 1,
        fontSize: 15,
        color: '#01B1A9',
        paddingVertical: 2,
        position: 'absolute',
        bottom: 0,
        alignSelf: 'flex-end',
        textAlign: "right",
    },
    bottomLine: {
        backgroundColor: '#F3F3F3',
        height: 1,
    }

});
