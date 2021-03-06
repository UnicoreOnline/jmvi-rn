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
    ActionSheetIOS,
    Picker,
    Platform
} from 'react-native';
// import SafeAreaView from '../../component/SafeAreaView';
import Images from '../../config/Images';
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import styles from './styles';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncData from '../../config/AsyncData'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RangeSlider from 'rn-range-slider';
import Fonts from '../../config/Fonts';
import API from '../../config/API'
import NumberFormat from 'react-number-format';

const searchType = {
    FORSALE: 'FORSALE',
    PROPERTYTYPE: 'PROPERTYTYPE',
    REALESTATEAGENT: 'REALESTATEAGENT',
    BEDROOM: 'BEDROOM',
    BATHROOM: 'BATHROOM',
    COUNTRY: 'COUNTRY',
    PROPERTYVALUE: 'PROPERTYVALUE',
    PRICERANGE: 'PRICERANGE',
}
const MIN_PROPERTY_VALUE = 0
const MAX_PROPERTY_VALUE = 100000
const MIN_PRICE = 0
const MAX_PRICE = 10000000
class SearchViewController extends Component {
    // static navigationOptions = ({ navigation }) => {
    //     return {
    //         headerRight: () => (
    //             <TouchableOpacity onPress={() => {
    //                 navigation.navigate(Utility.SCREEN.Search);
    //             }}><Image style={{ height: 25, width: 25, marginEnd: 15 }} source={Images.search} /></TouchableOpacity>
    //         ),
    //     };
    // };
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            spinnerVisible: false,
            selectedForSale: undefined,
            selectedPropertyType: undefined,
            selectedRealEstateAgent: undefined,
            selectedBedRoom: undefined,
            selectedBathRoom: undefined,
            selectedCountry: undefined,
            selectedForSaleVALUE: 0,
            selectedPropertyTypeVALUE: '',
            selectedRealEstateAgentVALUE: '',
            selectedBedRoomVALUE: '',
            selectedBathRoomVALUE: '',
            selectedCountryVALUE: '',
            propertyValueRangeLow: MIN_PROPERTY_VALUE,
            propertyValueRangeHigh: MAX_PROPERTY_VALUE,
            selectedPropertyValueRange: '',
            priceRangeLow: MIN_PRICE,
            priceRangeHigh: MAX_PRICE,
            selectedPriceRange: '',

            arrRealEstateAgents: [],
            arrRealEstateAgentsValues: [],
            arrRealEstateAgentsAndroid: [],

            arrForSale: ['For Rent', 'For Sale', 'Auction House'],
            arrForSaleValue: [0, 1],
            arrForSaleAndroid: [{ title: 'For Rent', value: 0 }, { title: 'For Sale', value: 1 }, { title: 'Auction House', value: 3 }],

            arrPropertyType: [],
            arrPropertyTypeValue: [],
            arrPropertyTypeAndroid: [],

            arrBedRoom: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            arrBedRoomAndroid: [
                { title: 'Bedroom', value: -1 },
                { title: '1', value: 1 },
                { title: '2', value: 2 },
                { title: '3', value: 3 },
                { title: '4', value: 4 },
                { title: '5', value: 5 },
                { title: '6', value: 6 },
                { title: '7', value: 7 },
                { title: '8', value: 8 },
                { title: '9', value: 9 },
                { title: '10', value: 10 },
            ],
            arrBathRoom: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            arrBathRoomAndroid: [
                { title: 'Bathroom', value: -1 },
                { title: '1', value: 1 },
                { title: '2', value: 2 },
                { title: '3', value: 3 },
                { title: '4', value: 4 },
                { title: '5', value: 5 },
                { title: '6', value: 6 },
                { title: '7', value: 7 },
                { title: '8', value: 8 },
                { title: '9', value: 9 },
                { title: '10', value: 10 },
            ],
            // arrBedRoom : [ 1,2,3,4,5,6,7,8,9,10   ],
            // arrBathRoom : [ 1,2,3,4,5,6,7,8,9,10   ],
            arrCountry: [],
            arrCountryValue: [],
            arrCountryAndroid: [],
            arrPropertyValue: ['$0-$25000', '$25000-$50000', '$50000-$100000'],
            arrPropertyValueAndroid: [
                { title: 'Property Value', value: -1 },
                { title: '$0-$25000', value: '$0-$25000' },
                { title: '$25000-$50000', value: '$25000-$50000' },
                { title: '$50000-$100000', value: '$50000-$100000' },
            ],
            arrPriceRange: ['$0-$1000000', '$1000000-$2500000', '$2500000-$5000000', '$5000000-$10000000'],
            arrPriceRangeAndroid: [
                { title: 'Price Range', value: -1 },
                { title: '$0-$1000000', value: '$0-$1000000' },
                { title: '$1000000-$2500000', value: '$1000000-$2500000' },
                { title: '$2500000-$5000000', value: '$2500000-$5000000' },
                { title: '$5000000-$10000000', value: '$5000000-$10000000' },
            ],
            name_of_property: '',
            address: '',
        };
    }
    componentDidMount() {
        AsyncData.getAgentList((arrValue) => {
            var arrTemp = []
            var arrTempValues = []
            var arrTempAndroid = []
            arrTempAndroid.push(this.dummyData('Real Estate Agent'))
            if (arrValue) {
                arrValue.forEach(element => {
                    arrTemp.push(element.name)
                    arrTempValues.push(element.agent_id)
                    var item = {}
                    item.title = element.name
                    item.value = element.agent_id
                    arrTempAndroid.push(item)
                });
                this.setState({
                    arrRealEstateAgents: arrTemp,
                    arrRealEstateAgentsValues: arrTempValues,
                    arrRealEstateAgentsAndroid: arrTempAndroid
                })
            }
        })
        AsyncData.getPropertyTypeList((arrValue) => {
            var arrTemp = []
            var arrTempValues = []
            var arrTempAndroid = []
            arrTempAndroid.push(this.dummyData('Property Type'))
            if (arrValue) {
                arrValue.forEach(element => {
                    arrTemp.push(element.property_type)
                    arrTempValues.push(element.propertytype_id)
                    var item = {}
                    item.title = element.property_type
                    item.value = element.propertytype_id
                    arrTempAndroid.push(item)
                });
                this.setState({
                    arrPropertyType: arrTemp,
                    arrPropertyTypeValue: arrTempValues,
                    arrPropertyTypeAndroid: arrTempAndroid
                })
            }
        })
        AsyncData.getCountryList((arrValue) => {
            var arrTemp = []
            var arrTempValues = []
            var arrTempAndroid = []
            arrTempAndroid.push(this.dummyData('Country'))
            if (arrValue) {
                arrValue.forEach(element => {
                    arrTemp.push(element.country_name)
                    arrTempValues.push(element.country_name)
                    var item = {}
                    item.title = element.country_name
                    item.value = element.country_name
                    arrTempAndroid.push(item)
                });
                this.setState({
                    arrCountry: arrTemp,
                    arrCountryValue: arrTempValues,
                    arrCountryAndroid: arrTempAndroid,
                })
            }
        })
    }

    dummyData(name) {
        return { title: name, value: -1 }
    }
    onSearchPress() {
        var status = this.state.selectedForSaleVALUE ? this.state.selectedForSaleVALUE != -1 ? this.state.selectedForSaleVALUE : 0 : 0
        var property_type = this.state.selectedPropertyTypeVALUE ? this.state.selectedPropertyTypeVALUE != -1 ? this.state.selectedPropertyTypeVALUE : '' : ''
        var agent_id = this.state.selectedRealEstateAgentVALUE ? this.state.selectedRealEstateAgentVALUE != -1 ? this.state.selectedRealEstateAgentVALUE : '' : ''
        var beds = this.state.selectedBedRoomVALUE ? this.state.selectedBedRoomVALUE != -1 ? this.state.selectedBedRoomVALUE : '' : ''
        var baths = this.state.selectedBathRoomVALUE ? this.state.selectedBathRoomVALUE != -1 ? this.state.selectedBathRoomVALUE : '' : ''
        var country = this.state.selectedCountryVALUE ? this.state.selectedCountryVALUE != -1 ? this.state.selectedCountryVALUE : '' : ''
        var sqft_min = this.state.propertyValueRangeLow
        var sqft_max = this.state.propertyValueRangeHigh
        var price_min = this.state.priceRangeLow
        var price_max = this.state.priceRangeHigh
        var name = this.state.name_of_property
        var address = this.state.address
        // if (Utility.isPlatformAndroid) {
        // } else{
        // }
        this.callSearchAPI(
            status,
            property_type,
            agent_id,
            beds,
            baths,
            country,
            sqft_min,
            sqft_max,
            price_min,
            price_max,
            name,
            address,
        )
    }

    callSearchAPI(
        statusss,
        property_type,
        agent_id,
        beds,
        baths,
        country,
        sqft_min,
        sqft_max,
        price_min,
        price_max,
        name,
        address,
    ) {
        this.setState({ spinnerVisible: true });
        var params = {
            'api_key': Utility.API_KEY,
            'country': Utility.country_name ? Utility.country_name : '',
            'status': statusss,
            'property_type': property_type,
            'agent_id': agent_id,
            'beds': beds,
            'baths': baths,
            'country': country,
            'sqft_min': sqft_min,
            'sqft_max': sqft_max,
            'price_min': price_min,
            'price_max': price_max,
            'name': name,
            'address': address,
        }
        // https://www.jmviapp.com/rest/post_contact.php
        API.postRequest('search.php', params, (status, data) => {
            this.setState({
                spinnerVisible: false,
            });
            if (status) {
                console.log('data.real_estates.length ',data.real_estates.length)
                if (statusss == 0) {
                    var params = {
                        onNavigateBack: this.handleOnNavigateBack.bind(this),
                        to: Utility.SCREEN.ForRent,
                        'arrDATA': data.real_estates,
                        isFromSearch: true,
                    };
                    this.props.navigation.navigate(Utility.SCREEN.ForRent, params)
                } else if (statusss == 1) {
                    var params = {
                        onNavigateBack: this.handleOnNavigateBack.bind(this),
                        to: Utility.SCREEN.ForSale,
                        'arrDATA': data.real_estates,
                        isFromSearch: true,
                    };
                    this.props.navigation.navigate(Utility.SCREEN.ForSale, params)
                } else if (statusss == 3) {
                    var params = {
                        onNavigateBack: this.handleOnNavigateBack.bind(this),
                        to: Utility.SCREEN.Auction,
                        'arrDATA': data.real_estates,
                        isFromSearch: true,
                    };
                    this.props.navigation.navigate(Utility.SCREEN.Auction, params)
                }

            } else {
                Utility.showToast('' + data.message)
            }
        }, true, this.props);
    }

    pickerPressed(type) {
        //    Picker.init({
        //        ...pickerProps,
        //       pickerTitleText: 
        //         type == searchType.FORSALE ? 'For Sale'
        //         :type == searchType.PROPERTYTYPE ? 'Property Type'
        //         :type == searchType.REALESTATEAGENT ? 'Real Estate Agent'
        //         :type == searchType.BEDROOM ? 'Bedroom'
        //         :type == searchType.BATHROOM ? 'Bathroom'
        //         :type == searchType.COUNTRY ? 'Country'
        //         :'',
        //       pickerData: 
        //         type == searchType.FORSALE ? this.state.arrForSale
        //         :type == searchType.PROPERTYTYPE ? this.state.arrPropertyType
        //         : type == searchType.REALESTATEAGENT ? this.state.arrRealEstateAgents
        //         : type == searchType.BEDROOM ? this.state.arrBedRoom
        //         : type == searchType.BATHROOM ? this.state.arrBathRoom
        //         : type == searchType.COUNTRY ? this.state.arrCountry
        //         :[],
        //       selectedValue: [
        //         type == searchType.FORSALE ? (this.state.selectedForSale ? this.state.selectedForSale : this.state.arrForSale[0]) 
        //         : type == searchType.PROPERTYTYPE ? this.state.selectedPropertyType ? this.state.selectedPropertyType : this.state.arrPropertyType[0] 
        //         : type == searchType.REALESTATEAGENT ? this.state.selectedRealEstateAgent ? this.state.selectedRealEstateAgent : this.state.arrRealEstateAgents[0] 
        //         : type == searchType.BEDROOM ? this.state.selectedBedRoom ? this.state.selectedBedRoom : this.state.arrBedRoom[0] 
        //         : type == searchType.BATHROOM ? this.state.selectedBathRoom ? this.state.selectedBathRoom : this.state.arrBathRoom[0] 
        //         : type == searchType.COUNTRY ? this.state.selectedCountry ? this.state.selectedCountry : this.state.arrCountry[0] 
        //         :''
        //         ],
        //       onPickerConfirm: data => { console.log(data); 
        //         type == searchType.FORSALE ? this.setState({ selectedForSale: data.toString() }) 
        //         : type == searchType.PROPERTYTYPE ? this.setState({ selectedPropertyType: data.toString() }) 
        //         : type == searchType.REALESTATEAGENT ? this.setState({ selectedRealEstateAgent: data.toString() }) 
        //         : type == searchType.BEDROOM ? this.setState({ selectedBedRoom: data.toString() }) 
        //         : type == searchType.BATHROOM ? this.setState({ selectedBathRoom: data.toString() }) 
        //         : type == searchType.COUNTRY ? this.setState({ selectedCountry: data.toString() }) 
        //         :''

        //     },
        //       onPickerCancel: data => { console.log(data); },
        //       onPickerSelect: data => { console.log(data); }
        //     });
        //     Picker.show();
        var selectedArray =
            type == searchType.FORSALE ? this.state.arrForSale
                : type == searchType.PROPERTYTYPE ? this.state.arrPropertyType
                    : type == searchType.REALESTATEAGENT ? this.state.arrRealEstateAgents
                        : type == searchType.BEDROOM ? this.state.arrBedRoom
                            : type == searchType.BATHROOM ? this.state.arrBathRoom
                                : type == searchType.COUNTRY ? this.state.arrCountry
                                    : type == searchType.PROPERTYVALUE ? this.state.arrPropertyValue
                                        : type == searchType.PRICERANGE ? this.state.arrPriceRange
                                            : []
        var selectedArrayVALUE =
            type == searchType.FORSALE ? this.state.arrForSaleValue
                : type == searchType.PROPERTYTYPE ? this.state.arrPropertyTypeValue
                    : type == searchType.REALESTATEAGENT ? this.state.arrRealEstateAgentsValues
                        : type == searchType.BEDROOM ? this.state.arrBedRoom
                            : type == searchType.BATHROOM ? this.state.arrBathRoom
                                : type == searchType.COUNTRY ? this.state.arrCountryValue
                                    : type == searchType.PROPERTYVALUE ? this.state.arrPropertyValue
                                        : type == searchType.PRICERANGE ? this.state.arrPriceRange
                                            : []
        var mSelectedArray = [...selectedArray]
        mSelectedArray.push('Cancel')
        ActionSheetIOS.showActionSheetWithOptions({
            options: mSelectedArray,
            // cancelButtonIndex: mSelectedArray.length-1,
            destructiveButtonIndex: mSelectedArray.length - 1,
        },
            (buttonIndex) => {
                // this.setState({ clicked: mSelectedArray[buttonIndex] });
                if (buttonIndex == (mSelectedArray.length - 1)) {
                    type == searchType.FORSALE ? this.setState({ selectedForSale: undefined, selectedForSaleVALUE: '' })
                        : type == searchType.PROPERTYTYPE ? this.setState({ selectedPropertyType: undefined, selectedPropertyTypeVALUE: '' })
                            : type == searchType.REALESTATEAGENT ? this.setState({ selectedRealEstateAgent: undefined, selectedRealEstateAgentVALUE: '' })
                                : type == searchType.BEDROOM ? this.setState({ selectedBedRoom: undefined, selectedBedRoomVALUE: '' })
                                    : type == searchType.BATHROOM ? this.setState({ selectedBathRoom: undefined, selectedBathRoomVALUE: '' })
                                        : type == searchType.COUNTRY ? this.setState({ selectedCountry: undefined, selectedCountryVALUE: '' })
                                            : type == searchType.PROPERTYVALUE ? this.setState({ selectedPropertyValueRange: '', propertyValueRangeLow: MIN_PROPERTY_VALUE, propertyValueRangeHigh: MAX_PROPERTY_VALUE })
                                                : type == searchType.PRICERANGE ? this.setState({ selectedPriceRange: '', priceRangeLow: MIN_PRICE, priceRangeHigh: MAX_PRICE })
                                                    : ''
                } else {
                    type == searchType.FORSALE ? this.setState({ selectedForSale: mSelectedArray[buttonIndex], selectedForSaleVALUE: selectedArrayVALUE[buttonIndex] })
                        : type == searchType.PROPERTYTYPE ? this.setState({ selectedPropertyType: mSelectedArray[buttonIndex], selectedPropertyTypeVALUE: selectedArrayVALUE[buttonIndex] })
                            : type == searchType.REALESTATEAGENT ? this.setState({ selectedRealEstateAgent: mSelectedArray[buttonIndex], selectedRealEstateAgentVALUE: selectedArrayVALUE[buttonIndex] })
                                : type == searchType.BEDROOM ? this.setState({ selectedBedRoom: mSelectedArray[buttonIndex], selectedBedRoomVALUE: selectedArrayVALUE[buttonIndex] })
                                    : type == searchType.BATHROOM ? this.setState({ selectedBathRoom: mSelectedArray[buttonIndex], selectedBathRoomVALUE: selectedArrayVALUE[buttonIndex] })
                                        : type == searchType.COUNTRY ? this.setState({ selectedCountry: mSelectedArray[buttonIndex], selectedCountryVALUE: selectedArrayVALUE[buttonIndex] })
                                            : type == searchType.PROPERTYVALUE ? this.setPropertyValuePrice(mSelectedArray[buttonIndex])
                                                : type == searchType.PRICERANGE ? this.setPriceRange(mSelectedArray[buttonIndex])
                                                    : ''
                }
            });
    }

    setPropertyValuePrice(itemValue) {
        var priceTemp = itemValue.toString().replace('$', '')
        var priceArray = priceTemp.split('-')
        this.setState({ propertyValueRangeLow: priceArray[0], propertyValueRangeHigh: priceArray[1], selectedPropertyValueRange: itemValue })
    }
    setPriceRange(itemValue) {
        var priceTemp = itemValue.toString().replace('$', '')
        var priceArray = priceTemp.split('-')
        this.setState({ priceRangeLow: priceArray[0], priceRangeHigh: priceArray[1], selectedPriceRange: itemValue })
    }

    render() {
        var {
            selectedForSale,
            selectedPropertyType,
            selectedRealEstateAgent,
            selectedBedRoom,
            selectedBathRoom,
            selectedCountry,
            selectedPropertyValueRange,
            selectedPriceRange,
        } = this.state
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor={Colors.statusBarColor} />
                {/* <ScrollView 
                style={{ flex: 1, marginHorizontal: 10, }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={'handled'}
                    keyboardDismissMode="on-drag"
                    > */}
                <KeyboardAwareScrollView
                    style={{ flex: 1, marginHorizontal: 10, }}
                    extraScrollHeight={20}
                    onScroll={this.handleScroll}
                    keyboardShouldPersistTaps={"handled"}
                    automaticallyAdjustContentInsets={true}
                    bounces={true}
                    showsVerticalScrollIndicator={false}
                    keyboardDismissMode="on-drag"
                // contentContainerStyle={{ flex: 1 }}
                >
                    <View style={{ flex: 1 }}>
                        {
                            Utility.isPlatformAndroid ?
                                <View>
                                    <View style={[styles.textInputContainer, { justifyContent: 'center', }]}>
                                        <Picker
                                            mode='dropdown'
                                            itemStyle={styles.pickerItem}
                                            style={[styles.pickerContainer, { height: 45, justifyContent: 'center', }]}
                                            selectedValue={this.state.selectedForSaleVALUE}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ selectedForSaleVALUE: itemValue })} >
                                            {
                                                this.state.arrForSaleAndroid.map((item, index) =>
                                                    <Picker.Item label={`${item.title}`} value={item.value} />
                                                )
                                            }
                                        </Picker>
                                    </View>
                                    <View style={[styles.textInputContainer, { justifyContent: 'center', }]}>
                                        <Picker
                                            mode='dropdown'
                                            itemStyle={styles.pickerItem}
                                            style={[styles.pickerContainer, { height: 45, justifyContent: 'center', }]}
                                            selectedValue={this.state.selectedPropertyTypeVALUE}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ selectedPropertyTypeVALUE: itemValue })} >
                                            {
                                                this.state.arrPropertyTypeAndroid.map((item, index) =>
                                                    <Picker.Item label={`${item.title}`} value={item.value} />
                                                )
                                            }
                                        </Picker>
                                    </View>
                                    <View style={[styles.textInputContainer, { justifyContent: 'center', }]}>
                                        <Picker
                                            mode='dropdown'
                                            itemStyle={styles.pickerItem}
                                            style={[styles.pickerContainer, { height: 45, justifyContent: 'center', }]}
                                            selectedValue={this.state.selectedRealEstateAgentVALUE}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ selectedRealEstateAgentVALUE: itemValue })} >
                                            {
                                                this.state.arrRealEstateAgentsAndroid.map((item, index) =>
                                                    <Picker.Item label={`${item.title}`} value={item.value} />
                                                )
                                            }
                                        </Picker>
                                    </View>
                                    <View style={[styles.textInputContainer, { justifyContent: 'center', }]}>
                                        <Picker
                                            mode='dropdown'
                                            itemStyle={styles.pickerItem}
                                            style={[styles.pickerContainer, { height: 45, justifyContent: 'center', }]}
                                            selectedValue={this.state.selectedBedRoom}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ selectedBedRoomVALUE: itemValue })} >
                                            {
                                                this.state.arrBedRoomAndroid.map((item, index) =>
                                                    <Picker.Item label={`${item.title}`} value={item.value} />
                                                )
                                            }
                                        </Picker>
                                    </View>
                                    <View style={[styles.textInputContainer, { justifyContent: 'center', }]}>
                                        <Picker
                                            mode='dropdown'
                                            itemStyle={styles.pickerItem}
                                            style={[styles.pickerContainer, { height: 45, justifyContent: 'center', }]}
                                            selectedValue={this.state.selectedBathRoomVALUE}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ selectedBathRoomVALUE: itemValue })} >
                                            {
                                                this.state.arrBathRoomAndroid.map((item, index) =>
                                                    <Picker.Item label={`${item.title}`} value={item.value} />
                                                )
                                            }
                                        </Picker>
                                    </View>
                                    <View style={[styles.textInputContainer, { justifyContent: 'center', }]}>
                                        <Picker
                                            mode='dropdown'
                                            itemStyle={styles.pickerItem}
                                            style={[styles.pickerContainer, { height: 45, justifyContent: 'center', }]}
                                            selectedValue={this.state.selectedCountryVALUE}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ selectedCountryVALUE: itemValue })} >
                                            {
                                                this.state.arrCountryAndroid.map((item, index) =>
                                                    <Picker.Item label={`${item.title}`} value={item.value} />
                                                )
                                            }
                                        </Picker>
                                    </View>
                                    <View style={[styles.textInputContainer, { justifyContent: 'center', }]}>
                                        <Picker
                                            mode='dropdown'
                                            itemStyle={styles.pickerItem}
                                            style={[styles.pickerContainer, { height: 45, justifyContent: 'center', }]}
                                            selectedValue={this.state.selectedPropertyValueRange}
                                            onValueChange={(itemValue, itemIndex) => {
                                                itemIndex > 0 ?
                                                    this.setPropertyValuePrice(itemValue)
                                                    : null
                                            }} >
                                            {
                                                this.state.arrPropertyValueAndroid.map((item, index) =>
                                                    <Picker.Item label={`${item.title}`} value={item.value} />
                                                )
                                            }
                                        </Picker>
                                    </View>
                                    <View style={[styles.textInputContainer, { justifyContent: 'center', }]}>
                                        <Picker
                                            mode='dropdown'
                                            itemStyle={styles.pickerItem}
                                            style={[styles.pickerContainer, { height: 45, justifyContent: 'center', }]}
                                            selectedValue={this.state.selectedPriceRange}
                                            onValueChange={(itemValue, itemIndex) => {
                                                itemIndex > 0 ?
                                                    this.setPriceRange(itemValue)
                                                    : null
                                            }} >
                                            {
                                                this.state.arrPriceRangeAndroid.map((item, index) =>
                                                    <Picker.Item label={`${item.title}`} value={item.value} />
                                                )
                                            }
                                        </Picker>
                                    </View>
                                </View>
                                :
                                <View style={{ flex: 1 }}>
                                    <TouchableOpacity style={styles.inputContainer} activeOpacity={0.8} onPress={() => this.pickerPressed(searchType.FORSALE)}>
                                        <Text style={styles.searchItemTxt}>{selectedForSale ? selectedForSale : 'For Sale'}</Text>
                                        <Image style={styles.inputHintImage} source={Images.dorpdown_fill} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.inputContainer} activeOpacity={0.8} onPress={() => this.pickerPressed(searchType.PROPERTYTYPE)}>
                                        <Text style={styles.searchItemTxt}>{selectedPropertyType ? selectedPropertyType : 'Property Type'}</Text>
                                        <Image style={styles.inputHintImage} source={Images.dorpdown_fill} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.inputContainer} activeOpacity={0.8} onPress={() => this.pickerPressed(searchType.REALESTATEAGENT)}>
                                        <Text style={styles.searchItemTxt}>{selectedRealEstateAgent ? selectedRealEstateAgent : 'Real Estate Agent'}</Text>
                                        <Image style={styles.inputHintImage} source={Images.dorpdown_fill} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.inputContainer} activeOpacity={0.8} onPress={() => this.pickerPressed(searchType.BEDROOM)}>
                                        <Text style={styles.searchItemTxt}>{selectedBedRoom ? selectedBedRoom : 'Bedroom'}</Text>
                                        <Image style={styles.inputHintImage} source={Images.dorpdown_fill} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.inputContainer} activeOpacity={0.8} onPress={() => this.pickerPressed(searchType.BATHROOM)}>
                                        <Text style={styles.searchItemTxt}>{selectedBathRoom ? selectedBathRoom : 'Bathroom'}</Text>
                                        <Image style={styles.inputHintImage} source={Images.dorpdown_fill} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.inputContainer} activeOpacity={0.8} onPress={() => this.pickerPressed(searchType.COUNTRY)}>
                                        <Text style={styles.searchItemTxt}>{selectedCountry ? selectedCountry : 'Country'}</Text>
                                        <Image style={styles.inputHintImage} source={Images.dorpdown_fill} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.inputContainer} activeOpacity={0.8} onPress={() => this.pickerPressed(searchType.PROPERTYVALUE)}>
                                        <Text style={styles.searchItemTxt}>{selectedPropertyValueRange ? selectedPropertyValueRange : 'Property Value'}</Text>
                                        <Image style={styles.inputHintImage} source={Images.dorpdown_fill} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.inputContainer} activeOpacity={0.8} onPress={() => this.pickerPressed(searchType.PRICERANGE)}>
                                        <Text style={styles.searchItemTxt}>{selectedPriceRange ? selectedPriceRange : 'Price Range'}</Text>
                                        <Image style={styles.inputHintImage} source={Images.dorpdown_fill} />
                                    </TouchableOpacity>
                                </View>
                        }
                        {/* <TouchableOpacity style={styles.inputContainerRange} activeOpacity={0.8} >
                            <Text style={[styles.searchItemTxt,{alignSelf:'flex-start',flex:1}]}>{'Property Value'}</Text>
                            <RangeSlider
                                style={{ width: Utility.screenWidth - 80, height: 40, }}
                                gravity={'center'}
                                min={MIN_PROPERTY_VALUE}
                                max={MAX_PROPERTY_VALUE}
                                step={1}
                                selectionColor={Colors.headerYellow}
                                thumbColor={Colors.headerYellow}
                                thumbBorderColor={Colors.headerYellow}
                                blankColor={Colors.lightGrayColor}
                                labelStyle='none'
                                textFormat='%d'
                                onValueChanged={(low, high, fromUser) => {
                                    this.setState({ propertyValueRangeLow: low, propertyValueRangeHigh: high })
                                }} />
                            <View styles={styles.mContainer}>
                                    <NumberFormat
                                        value={this.state.propertyValueRangeLow}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'$'}
                                        renderText={value => <Text style={styles.priceTxt}>{value}</Text>}
                                    />
                                    <NumberFormat
                                        value={this.state.propertyValueRangeHigh}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'$'}
                                        renderText={value => <Text style={styles.priceTxt}>{value}</Text>}
                                    />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.inputContainerRange} activeOpacity={0.8} >
                            <Text style={[styles.searchItemTxt,{alignSelf:'flex-start',flex:1}]}>{'Price Range'}</Text>
                            <RangeSlider
                                style={{ width: Utility.screenWidth - 80, height: 40, }}
                                gravity={'center'}
                                min={MIN_PRICE}
                                max={MAX_PRICE}
                                step={1}
                                selectionColor={Colors.headerYellow}
                                thumbColor={Colors.headerYellow}
                                thumbBorderColor={Colors.headerYellow}
                                blankColor={Colors.lightGrayColor}
                                labelStyle='none'
                                textFormat='%d'
                                onValueChanged={(low, high, fromUser) => {
                                    this.setState({ priceRangeLow: low, priceRangeHigh: high })
                                }} />
                            <View styles={styles.mContainer}>
                                    <NumberFormat
                                        value={this.state.priceRangeLow}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'$'}
                                        renderText={value => <Text style={styles.priceTxt}>{value}</Text>}
                                    />
                                    <NumberFormat
                                        value={this.state.priceRangeHigh}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        prefix={'$'}
                                        renderText={value => <Text style={styles.priceTxt}>{value}</Text>}
                                    />
                            </View>
                        </TouchableOpacity> */}
                        <TextInput
                            style={styles.textInput}
                            placeholderTextColor={Colors.placeholderTextColor}
                            onChangeText={(name_of_property) => this.setState({ name_of_property })}
                            value={this.state.name_of_property}
                            placeholder={'Name of Property'}
                            keyboardType={"default"}
                            ref={(input) => { this.name_of_property = input; }}
                            autoCapitalize="words"
                            returnKeyType='next'
                            onSubmitEditing={() => { this.address.focus(); }}
                            blurOnSubmit={false}
                            maxLength={100}
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholderTextColor={Colors.placeholderTextColor}
                            onChangeText={(address) => this.setState({ address })}
                            value={this.state.address}
                            placeholder={'Address'}
                            keyboardType={"default"}
                            ref={(input) => { this.address = input; }}
                            autoCapitalize="words"
                            returnKeyType='done'
                            onSubmitEditing={() => { Utility.hideKeyboard() }}
                            blurOnSubmit={false}
                            maxLength={100}
                        />

                        <TouchableOpacity style={{ marginTop: 20 }} activeOpacity={0.7} onPress={this.onSearchPress.bind(this)}>
                            <Text style={styles.submitBtn}>Search</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
                {/* </ScrollView> */}
                <Spinner visible={this.state.spinnerVisible} />
            </SafeAreaView>
        );
    }

    //Navigation
    onBackPressed() {
        this.props.navigation.goBack()
    }

    handleOnNavigateBack = (params) => {
        if (params.isSuccess == true) {
            switch (params.to) {
                case Utility.SCREEN.Signin:
                    break;
                default:
                    break;
            }

        }
    }
}

export default SearchViewController

