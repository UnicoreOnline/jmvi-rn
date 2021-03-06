import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
} from 'react-native';

import TagSelectItem from './TagSelectItem';

class TagSelect extends React.Component {
  static propTypes = {
    value: PropTypes.array,
    labelAttr: PropTypes.string,
    keyAttr: PropTypes.string,
    data: PropTypes.array,
    max: PropTypes.number,
    onMaxError: PropTypes.func,
    onItemPress: PropTypes.func,
    itemStyle: PropTypes.any,
    itemStyleSelected: PropTypes.any,
    itemLabelStyle: PropTypes.any,
    itemLabelStyleSelected: PropTypes.any,
  };

  static defaultProps = {
    value: [],
    labelAttr: 'label',
    keyAttr: 'id',
    data: [],
    max: null,
    onMaxError: null,
    onItemPress: null,
    itemStyle: {},
    itemStyleSelected: {},
    itemLabelStyle: {},
    itemLabelStyleSelected: {},
  };

  state = {
    value: {},
    tempMinArray: [],
    isValGreater: false
  };
  componentWillReceiveProps(nextProps) {
    // if (this.props.arrSelection !== nextProps.arrSelection) {
    // this.setState({ tempMinArray: [] });
    // }
    // this.setState({ title: nextProps.title });
    //if (nextProps.value != undefined) {
    // this.setState({ text: nextProps.value });
    // }
    this.renderArrayData(nextProps);
  }
  // componentWillMount() {
  //   if (this.props.value && this.props.value.length > 0) {
  //     // Pre-render values selected by default
  //     const value = {};
  //     this.props.value.forEach((v) => {
  //       value[v[[this.props.keyAttr]]] = v;
  //     });

  //     this.setState({ value });
  //   }
  // }

  componentDidMount() {
    if (this.props.value && this.props.value.length > 0) {
      // Pre-render values selected by default
      const value = {};
      this.props.value.forEach((v) => {
        value[v[[this.props.keyAttr]]] = v;
      });

      this.setState({ value });
    }
    this.renderArrayData(this.props);
  }

  /**
   * @description return total of itens selected
   * @return {Number}
   */
  get totalSelected() {
    return Object.keys(this.state.value).length;
  }

  /**
   * @description return itens selected
   * @return {Array}
   */
  get itemsSelected() {
    const items = [];

    Object.entries(this.state.value).forEach(([key]) => {
      items.push(this.state.value[key]);
    });

    return items;
  }

  onReset() {
    this.state.value = []
    this.setState({ value: this.state.value })
  }

  /**
   * @description callback after select an item
   * @param {Object} item
   * @param {int} pos
   * @return {Void}
   */
  handleSelectItem(pos, item) {
    this.props.onItemPress(item, pos);
    // const value = { ...this.state.value };
    // const found = this.state.value[item[this.props.keyAttr]];

    // // Item is on array, so user is removing the selection
    // if (found) {
    //   delete value[item[this.props.keyAttr]];
    // } else {
    //   // User is adding but has reached the max number permitted
    //   if (this.props.max && this.totalSelected >= this.props.max) {
    //     return this.props.onMaxError();
    //   }

    //   value[item[this.props.keyAttr]] = item;
    // }

    // return this.setState({ value }, () => {
    //   if (this.props.onItemPress) {
    //     this.props.onItemPress(item);
    //   }
    // });
  };

  renderArrayData(newProps) {
    var tempArr = []
    if (newProps.max != null) {
      for (var i = 0; i < newProps.max; i++) {
        tempArr.push(newProps.data[i])
      }
      if (newProps.data.length - newProps.max > 1) {
        tempArr.push({ id: newProps.max, name: '+' + (newProps.data.length - newProps.max > 1 ? (newProps.data.length - newProps.max) + ' ' : '') + 'more' })
      }
      this.setState({ tempMinArray: tempArr })
      if (newProps.data.length > newProps.max) {
        this.setState({ isValGreater: true })
      }
    }
  }

  render() {
    return (
      <View>
        {this.props.max !== null
          ? <View style={styles.list}>
            {this.state.tempMinArray.map((i, pos) => {
              return (
                <TagSelectItem
                  {...this.props}
                  label={i[this.props.labelAttr]}
                  key={i[this.props.keyAttr]}
                  onPress={this.handleSelectItem.bind(this, pos, i)}
                  selected={this.state.value[i[this.props.keyAttr]] && true}
                />
              );
            })}
          </View>
          : <View style={styles.list}>
            {this.props.data.map((i, pos) => {
              return (
                <TagSelectItem
                  {...this.props}
                  label={i[this.props.labelAttr]}
                  key={i[this.props.keyAttr]}
                  onPress={this.handleSelectItem.bind(this, pos, i)}
                  selected={this.state.value[i[this.props.keyAttr]] && true}
                />
              );
            })}
          </View>
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
});

export default TagSelect;
