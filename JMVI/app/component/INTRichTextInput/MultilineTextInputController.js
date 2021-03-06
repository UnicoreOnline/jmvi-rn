import React, { Component } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    StyleSheet
} from 'react-native'

import Colors from '../../config/Colors'
import Utility from '../../config/Utility'
import Fonts from '../../config/Fonts'
import SafeAreaView from '../../component/SafeAreaView'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const InputAccessoryView = Utility.isPlatformAndroid ? '' : require('InputAccessoryView')

class MultilineTextInputController extends Component {
    static navigationOptions = {
        header: null,
    }
    constructor(props) {
        super(props)
        this.state = {
            text: '',//this.props.text,
            mImages: this.props.mImages,
            title: this.props.title,
            subTitle: this.props.subTitle,
            maxLength: this.props.maxLength,
        }
    }

    render() {
        const inputAccessoryViewID = "inputAccessoryViewIDJuno";
        console.log('CDFDDDDD', this.state.text)
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white, }}>
                <View style={{ flex: 1, marginHorizontal: 10, marginTop: 50, marginBottom: 10 }}>
                    <View style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={() => this.props.closePopUp(false, true, this.state.text)} activeOpacity={0.7}>
                            <Image style={{}} source={this.props.mImages.close} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.closePopUp(false, false, this.state.text)} activeOpacity={0.7}>
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
                            <Text style={[{ marginStart: 10, color: '#484848', fontSize: 30, fontFamily: Fonts.semibold, marginTop: 10 }]} >{this.state.title}</Text>
                            <Text style={[{ marginStart: 10, color: '#6D6D6D', fontSize: 16, fontFamily: Fonts.regular, marginTop: 10 }]}>{this.state.subTitle}</Text>
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
                                    maxLength={this.state.maxLength != undefined ? this.state.maxLength : 100000}
                                    autoCorrect={true}
                                    autoCapitalize="sentences"
                                    onChangeText={(text) => {
                                        this.setState({ text });
                                        this.props.onChangeText && this.props.onChangeText(text);
                                    }} ref="input" value={this.state.text.trim()} {...this.props.props}
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
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    textInput: { flex: 1, fontSize: 16, height: null, textAlignVertical: 'top', color: '#6D6D6D' },
});
export default MultilineTextInputController