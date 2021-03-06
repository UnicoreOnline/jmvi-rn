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
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import styles from './styles'
// import PropTypes from 'prop-types';

const propTypes = {
    // arrOptions: PropTypes.array.isRequired,
    // disabled: PropTypes.bool,
    // // listStyle: ViewPropTypes ? ViewPropTypes.style : View.propTypes.style,
    // optionLabel: Text.propTypes.style,
    // optionStyle: Text.propTypes.style,
    // maxSelected: PropTypes.number,
    // onSelectionChange: PropTypes.func,
    // isHorizontal: PropTypes.bool,
    // // optionIndicator: ViewPropTypes ? ViewPropTypes.style : View.propTypes.style,
    // checkIcon: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    // unCheckIcon: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
};

const defaultProps = {
    arrOptions: [],
    disabled: false,
    listStyle: {},
    optionStyle: {},
    onSelectionChange(option) { },
    isHorizontal: false,
    optionLabel: {},
    optionIndicator: {},
    checkIcon: require('../INTRadioCheckbox/images/ic_check.png'),
    unCheckIcon: require('../INTRadioCheckbox/images/ic_uncheck.png'),
};

export default class RadioCheckBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrOptions: this.props.checkOptions || [],
        };
    }

    /**
     * To manage selected list
     */
    setSelectedList() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.checkOptions) {
            this.setState({ arrOptions: nextProps.checkOptions })
        }

    }

    /**
     * To clear all selected options
     */
    clearAllSelection() {

    }

    /**
     * To select all options
     */
    selectAllOptions() {

    }

    /**
     * To check selected number of items  should be less than provided maxSelected
     */
    checkMaxSelection() {
        const maxSelected = this.props.maxSelected;

    }

    componentDidMount() {
    }


    /**
     * Handle click event of option
     * @param {*} option 
     */
    _selectOption(rowdata) {
        let item = rowdata.item
        if (this.props.maxSelected == 1) {
            this.state.arrOptions.forEach(element => {
                if (item.id == element.id) {
                    element.selected = true
                } else {
                    element.selected = false
                }
            });
        } else {
            if (item.selected == true) {
                item.selected = false
            } else {
                item.selected = true
            }
        }
        this.setState({})

    }


    getSelectedOptions = function (completion) {
        completion(this.state.arrOptions.filter((item) => {
            return item.selected == true
        }))
    }

    getAllOptionWithSelectionStatus = function (completion) {
        completion(this.state.arrOptions)
    };
    /*
    * render icons 
    * */
    _renderCheckIcon(rowdata) {
        let item = rowdata.item
        return (<Image source={item.selected == true ? this.props.checkIcon : this.props.unCheckIcon} style={[styles.optionIndicator, this.props.optionIndicator]} />);
    }

    /*
    * render text
    * */
    _renderText(rowdata) {
        return (
            <Text style={[styles.optionLabel, this.props.optionLabel, {
                fontSize: 15,
                color: '#484848'
            }]}>{rowdata.item.name}</Text>
        );
    }

    /*
    * render Seprater
    * */
    renderSeparator = () => {
        return (<View
            style={{
                height: 1,
                backgroundColor: '#F3F3F3'
            }} />);
    };

    renderListItem(rowData) {
        //item contain name and selected
        //{name : "", selected : false}
        let item = rowData.item
        return (
            <TouchableOpacity
                style={[styles.optionStyle, this.props.optionStyle]}
                activeOpacity={this.props.disabled
                    ? 1
                    : 0.7}
                onPress={!this.props.disabled
                    ? () => {
                        this._selectOption(rowData)
                    }
                    : null}>

                <View style={{ flex: 1 }}>{this._renderText(rowData)}</View>
                <View >{this._renderCheckIcon(rowData)}</View>
            </TouchableOpacity>
        );
    }


    render() {

        return (
            <View>
                <FlatList
                    horizontal={this.props.isHorizontal}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={[styles.listStyle, this.props.listStyle]}
                    data={this.state.arrOptions}
                    renderItem={this
                        .renderListItem
                        .bind(this)}
                    extraData={this.state}
                    keyExtractor={(item, index) => index.toString()} ItemSeparatorComponent={this.renderSeparator} />
            </View>
        );
    }
}

// RadioCheckBox.propTypes = propTypes;
RadioCheckBox.defaultProps = defaultProps;
module.exports = RadioCheckBox;
