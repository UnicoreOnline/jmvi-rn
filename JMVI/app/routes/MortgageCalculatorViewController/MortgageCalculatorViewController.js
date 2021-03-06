import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    Linking,
    Alert,
    SafeAreaView,
    StatusBar,
    TextInput,
    ScrollView,
    Picker,
    ActionSheetIOS
} from 'react-native';
// import SafeAreaView from '../../component/SafeAreaView';
import Images from '../../config/Images';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import styles from './styles';
import Spinner from 'react-native-loading-spinner-overlay';

class MortgageCalculatorViewController extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerRight: () => (
                <TouchableOpacity onPress={() => {
                    navigation.navigate(Utility.SCREEN.Search);
                }}><Image style={{ height: 25, width: 25, marginEnd: 15 }} source={Images.search} /></TouchableOpacity>
            ),
        };
    };
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            price: '',
            down_payment: '',
            term: '1 Year',
            interest_rate: '',
            monthly_payment: 0,
            spinnerVisible: false,
            arrItems: new Array(50),
        };
    }
    componentDidMount() {
    }

    pickerPressed() {
        var selectedArray = []
        for(var i =1;i<50;i++){
            selectedArray.push(i + (i > 1 ?' Years':' Year'))
        }
        selectedArray.push('Cancel')
        ActionSheetIOS.showActionSheetWithOptions({
            options: selectedArray,
            // cancelButtonIndex: selectedArray.length-1,
            destructiveButtonIndex: selectedArray.length-1,
          },
          (buttonIndex) => {
            // this.setState({ clicked: selectedArray[buttonIndex] });
            if (buttonIndex == selectedArray.length) {
                
            } else {
                this.setState({ term: selectedArray[buttonIndex],monthly_payment:0 })
            }
          });
        }

    onCalculatePress() {
        if (this.state.price === '') {
            Utility.showToast('Please enter property price')
            return
        }
        if (this.state.down_payment === '') {
            Utility.showToast('Please enter down payment')
            return
        }
        if ((Number(this.state.price) - Number(this.state.down_payment)) < 0) {
            Utility.showToast('Down payment should be less than property price')
            return
        }
        if (this.state.interest_rate === '') {
            Utility.showToast('Please enter interest rate')
            return
        }
        Utility.hideKeyboard()
        var M = 0
        var P = Number(this.state.price) - Number(this.state.down_payment)
        var N = Number(this.state.term.toString().replace(' Years','').replace(' Year','')) * 12
        var I = Number(this.state.interest_rate) / 100 / 12;

        M = this.monthlyPayment(P, N, I);
        this.setState({ monthly_payment: Number(M).toFixed(0) })
    }
    monthlyPayment(p, n, i) {
        return p * i * (Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    }

    render() {
        return (
            <View style={styles.container}>
                {/* <StatusBar barStyle="light-content" backgroundColor={Colors.statusBarColor} /> */}
                <ScrollView style={{ flex: 1, marginHorizontal: 10, }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={'handled'}
                    keyboardDismissMode="on-drag">
                    <View style={{ flex: 1 }}>
                        <View >
                            <Text style={styles.titleTextInputStyle}>Price of property</Text>
                            <View style={styles.textInputContainer}>
                                <Text style={styles.dollarStyle}>$</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholderTextColor={Colors.placeholderTextColor}
                                    onChangeText={(price) => this.setState({ price,monthly_payment:0 })}
                                    value={this.state.price}
                                    placeholder={''}
                                    placeholderTextColor={Colors.grey949293}
                                    keyboardType={"number-pad"}
                                    ref={(input) => { this.price = input; }}
                                    autoCapitalize="words"
                                    returnKeyType='next'
                                    onSubmitEditing={() => { this.down_payment.focus(); }}
                                    blurOnSubmit={false}
                                    maxLength={50}
                                />
                            </View>
                        </View>
                        <View >
                            <Text style={styles.titleTextInputStyle}>Down payment</Text>
                            <View style={styles.textInputContainer}>
                                <Text style={styles.dollarStyle}>$</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholderTextColor={Colors.placeholderTextColor}
                                    onChangeText={(down_payment) => this.setState({ down_payment,monthly_payment:0 })}
                                    value={this.state.down_payment}
                                    placeholder={''}
                                    placeholderTextColor={Colors.grey949293}
                                    keyboardType={"number-pad"}
                                    ref={(input) => { this.down_payment = input; }}
                                    autoCapitalize="words"
                                    returnKeyType='next'
                                    onSubmitEditing={() => { this.term.focus(); }}
                                    blurOnSubmit={false}
                                    maxLength={50}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, marginEnd: 2 }}>
                                <Text style={styles.titleTextInputStyle}>Mortgage Term</Text>
                               {Utility.isPlatformAndroid?
                                <View style={[styles.textInputContainer, { justifyContent: 'center', }]}>
                                    <Picker
                                        mode='dropdown'
                                        itemStyle={styles.pickerItem}
                                        style={[styles.pickerContainer, { height: 45, justifyContent: 'center', }]}
                                        selectedValue={this.state.term}
                                        onValueChange={(itemValue, itemIndex) => this.setState({ term: itemValue ,monthly_payment:0})} >
                                        {Array.from(Array(50).keys()).map((key, index) =>
                                            <Picker.Item label={`${key + 1} ${key > 1 ? ' Years':' Year'}`} value={key + 1} />
                                        )}
                                    </Picker>
                                    {/* <Image style={styles.dorpdownArrrow} source={Images.ic_drop_down_arrow}></Image> */}
                                </View>
                                :
                                <TouchableOpacity style={styles.inputContainer} activeOpacity={0.8} onPress={() => this.pickerPressed()}>
                                <Text style={styles.searchItemTxt}>{this.state.term ? this.state.term : '1 Year'}</Text>
                                <Image style={styles.dorpdownArrrow} source={Images.dorpdown_fill} />
                            </TouchableOpacity> 
                                }
                            </View>
                            <View style={{ flex: 1, marginStart: 2 }}>
                                <Text style={styles.titleTextInputStyle}>Interest Rate</Text>
                                <View style={styles.textInputContainer}>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholderTextColor={Colors.placeholderTextColor}
                                        onChangeText={(interest_rate) => this.setState({ interest_rate,monthly_payment:0 })}
                                        value={this.state.interest_rate}
                                        placeholder={''}
                                        placeholderTextColor={Colors.grey949293}
                                        keyboardType={Utility.isPlatformAndroid ? 'numeric' : 'decimal-pad'}
                                        // keyboardType={'number-pad'}
                                        ref={(input) => { this.interest_rate = input; }}
                                        returnKeyType='done'
                                        onSubmitEditing={() => { Utility.hideKeyboard() }}
                                        blurOnSubmit={false}
                                        maxLength={5}
                                    />
                                    <Text style={styles.dollarStyle}>%</Text>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity style={{ marginTop: 20 }} activeOpacity={0.7} onPress={this.onCalculatePress.bind(this)}>
                            <Text style={styles.submitBtn}>Calculate</Text>
                        </TouchableOpacity>
                        <View >
                            <Text style={styles.titleResultTxt}>Your Monthly Payment</Text>
                            <View style={styles.textInputContainer}>
                                <Text style={styles.dollarStyle}>$</Text>
                                <Text style={[styles.textInput, { marginVertical: 5 }]}>{this.state.monthly_payment}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <Spinner visible={this.state.spinnerVisible} />
            </View>
        );
    }

    //Navigation
    onBackPressed() {
        this.props.navigation.goBack()
    }
}

export default MortgageCalculatorViewController

