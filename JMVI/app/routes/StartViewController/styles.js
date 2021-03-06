import { StyleSheet } from 'react-native'

import Utility, { screenWidth } from '../../config/Utility'
import Colors from '../../config/Colors'
import Fonts from '../../config/Fonts'
export default StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    marginHorizontal: 15,
    marginTop: 18,
  },
  magnnumLogo: {
    alignSelf: "center",
    marginTop: 20,
    // height: 100,
    width: Utility.screenWidth,
    maxHeight: 200
  },
  powerdByImage: {
    alignSelf: "center",
    marginTop: 40,
    height: 100,
    // width: Utility.screenWidth 
  },
  dropDownImage: {
    alignSelf: "center",
    // marginTop: 20,
    height: 20,
    width: 20,
    // marginRight: 10  
    // width: Utility.screenWidth 
  },
  welcomeToTxt: {
    fontSize: Utility.NormalizeFontSize(22),
    color: Colors.black,
    fontFamily: Fonts.light,
    textAlign: "center",
    marginTop: 40,
    marginHorizontal: 15
  },
  selectCountryTxt: {
    flex: 1,
    fontSize: Utility.NormalizeFontSize(18),
    color: Colors.black,
    fontFamily: Fonts.regular,
    textAlign: "center",
    marginHorizontal: 15
  },
  txtOur: {
    fontSize: Utility.NormalizeFontSize(18),
    color: Colors.white,
    fontFamily: Fonts.regular,
  },
  termsOfServiceTxt: {
    fontSize: Utility.NormalizeFontSize(18),
    color: Colors.redColor,
    fontFamily: Fonts.regular,
  },
  tosContainer: {
    flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginHorizontal: 15
  },
  buttonContainer: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15
  },
  confirmTxt: {
    fontSize: 15,
    color: Colors.white
  },
  confirmBtnContainer: {
    paddingVertical: 10,
    marginHorizontal: 4,
    // width: 170,
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.redColor,
    borderRadius: 25
  },
  tobBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signUpTxtContainer: {
  },
  subContainer: {
    flexDirection: 'column',
    marginTop: 60,
  },
  loginFBContainer: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: Colors.fbBlue,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.fbBlue,
  },
  loginGPContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.grey7F7F,
  },
  loginOptionContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: Colors.cyanA9,
  },
  signUpTxt: {
    fontSize: Utility.NormalizeFontSize(16),
    color: Colors.grey6D6D
  },
  loginIconContainer: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  whiteLineSeparator: {
    height: '100%',
    width: 1,
    backgroundColor: Colors.white
  },
  loginTxtContainer: {
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  loginTxt: {
    fontSize: Utility.NormalizeFontSize(16),
    color: Colors.white,
    alignSelf: 'flex-start',
    paddingHorizontal: 2,
    marginLeft: 4,
  },
  loginGPTxt: {
    fontSize: Utility.NormalizeFontSize(16),
    color: Colors.black4848,
    alignSelf: 'flex-start',
    paddingHorizontal: 2,
    marginLeft: 4,
  },
  termsofserviceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 25,
    marginHorizontal: 15,
  },
  termsofserviceTxt: {
    color: Colors.black4848,
    fontSize: Utility.NormalizeFontSize(13),
    lineHeight: 25,
  },
  bottomContainer: {
    marginTop: 25,
    alignItems: 'flex-start',
  },
  loginEmailTxt: {
    color: Colors.cyanA9,
    fontSize: Utility.NormalizeFontSize(15),
  },
  skipTxt: {
    color: Colors.black4848,
    fontSize: Utility.NormalizeFontSize(15),
    textDecorationLine: 'underline'
  },
  skipTextContainer: {
  },
  selectCountryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20,
    backgroundColor: Colors.headerYellow,
    marginHorizontal: 30,
    marginBottom: 30,
    marginTop: 20,
    padding: 10
  },
  pickerContainer: {
    flex: 1,
  },
  pickerItem: {
    flex: 1,
    textAlign: 'center',
    fontSize: Utility.NormalizeFontSize(16),
    paddingHorizontal: 10,
    color: Colors.black,
    fontFamily: Fonts.regular,
  },
  inputContainer: {
    flex: 1,
    borderRadius: 12,
    marginHorizontal: 15,
    // marginTop: 10,
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: Colors.grayBorderColor
  },
})