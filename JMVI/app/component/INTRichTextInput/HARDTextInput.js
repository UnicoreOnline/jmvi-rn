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

import { View, TextInput, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import Colors from "../../config/Colors";
import Utility from "../../config/Utility";
var mImages = {
    check: require('../INTRichTextInput/images/ic_check.png'),
    clear: require('../INTRichTextInput/images/ic_clear.png'),
    dot: require('../INTRichTextInput/images/ic_dot.png'),
    close: require('../INTRichTextInput/images/ic_backbutton_top.png'),
}
var mEditType = {
    mSINGLELINE: 0,
    mShowEditButDoNOTHING: 4,
}
export default class HARDTextInput extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isFocused: false,
            text: props.value + '',
            currentLength: props.value ? props.value.length : 0,
            height: 0,
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
        this.setState({ text: nextProps.value, currentLength: nextProps.value.length });
        // }
    }

    render() {
        let {
            title,
            titleStyle,
            subTitle,
            subTitleStyle,
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
            autoGrow,
            showErrorIcon,//focus + text vailabe = clear and Not focus = dot
            clickable,
            maxLength,
            ...props
        } = this.props;
        return (

            <View style={styles.wrapperOuter}>
                {
                    <View style={{ paddingVertical: 2 }}>
                        {/* Title */}
                        <View style={[
                            styles.wrapperTitle,
                        ]} >
                            {
                                <Text style={[
                                    styles.textTitle,
                                    titleStyle,
                                ]}{...props}
                                >{title} </Text>
                            }
                            {subTitle ?
                                subTitle == '' ? null :
                                    <Text style={[
                                        styles.textSubTitle,
                                        subTitleStyle
                                    ]}{...props}
                                    >{subTitle} </Text>
                                : null
                            }
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <TextInput style={[
                                    styles.textInput, {
                                        color: textColor,
                                        height: Math.max(25, this.state.height + (Utility.isPlatformAndroid ? 0 : 10)),
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
                                    // multiline={(editType == mEditType.mSINGLELINE) ? false : true}
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
                                        this.setState({ text: text, currentLength: text ? text.length : 0 });
                                        onChangeText && onChangeText(text);
                                    }}
                                    onChange={(event) => {
                                        onChange && onChange(event);
                                    }}
                                    selectionColor={Colors.selectionColor}
                                    editable={clickable ? false : true}
                                    onTouchStart={() => clickable ? null : null}
                                    ref="input"
                                    value={this.state.text} {...props}
                                    underlineColorAndroid="#00000000">
                                </TextInput>
                            </View>
                            <View style={[
                                styles.bottomLine,
                            ]} >
                            </View>
                            <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginTop: 4 }}>
                                <Text style={{ color: Colors.greyCACACA }}>{this.state.currentLength} /  {maxLength}</Text>
                            </View>
                        </View>
                    </View>
                }

            </View>
        );
    }
}
HARDTextInput.propTypes = {
    highlightColor: PropTypes.string,
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
    autoGrow: PropTypes.bool,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    titleStyle: PropTypes.object,
    subTitleStyle: PropTypes.object,
    showErrorIcon: PropTypes.bool,
    clickable: PropTypes.bool,
    images: PropTypes.object,
    maxLength: PropTypes.number,
};

HARDTextInput.defaultProps = {
    textColor: '#000000',
    textFocusColor: '#000000',
    textBlurColor: '#CFCFCF',
    value: '',
    underlineColorAndroid: 'rgba(0,0,0,0)',
    autoGrow: false,
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
    },

    textInput: { flex: 1, fontSize: 18, height: null, textAlignVertical: 'top', color: '#6D6D6D' },
    //New
    wrapperOuter: {
    },
    wrapperTitle: {
        // height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapperTitleWithHeight: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textTitle: {
        flex: 1,
        fontSize: 14,
        color: Colors.greyTITLE,
        paddingVertical: 2,
        bottom: 0,
        alignSelf: 'flex-start',
        textAlign: "left",
    },
    textSubTitle: {
        flex: 1,
        fontSize: 14,
        color: Colors.greyTITLE,
        paddingVertical: 2,
        bottom: 0,
        alignSelf: 'flex-start',
        textAlign: "left",
    },
    bottomLine: {
        backgroundColor: Colors.purple,
        height: 2,
    }

});
