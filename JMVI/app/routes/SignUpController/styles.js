import { StyleSheet } from 'react-native';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';
import Utility from '../../config/Utility';

export default StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
  appIconImg: {
    alignSelf: 'center',
    // marginBottom: 10,
    height: 40
  },
  topBG: {
    // position: 'absolute',
    width: Utility.screenWidth
  },
  topBarImage: {
    alignSelf: "center",
    height: 40,
    // paddingVertical: 10,
    // flex: 1,
    // position: 'absolute',
    width: Utility.screenWidth,
  },
  tobBarContainer: {
    flexDirection: 'row',
    // marginHorizontal: 15,
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayBorderColor
  },
  titleTxt: {
    flex: 1,
    width: Utility.screenWidth,
    fontFamily: Fonts.light,
    fontSize: Utility.NormalizeFontSize(16),
    color: Colors.black4848,
    alignItems: 'center',
    textAlign: 'center',
    paddingVertical: 5,
    position: 'absolute',
    fontFamily: Fonts.regular
    // alignContent:'center',
  },
  backbuttonIconImg: {
    padding: 5,
  },
  textInput: {
    fontSize: 15,
    textAlign: 'left',
    backgroundColor: Colors.greyE1,
    // marginHorizontal: 20,
    marginTop: 15,
    paddingHorizontal: 10,
    paddingVertical: 15,
    color: Colors.black,
    fontFamily: Fonts.regular
    // borderRadius: 6
  },
  showhideContainer: {
    // flexWrap: 'wrap',
    alignSelf: 'center',
    // width:100,
    position: 'absolute',
    right: 10,
    paddingHorizontal: 10,
    flex: 1,
    alignItems: 'center',
    // backgroundColor: 'green'
  },
  bottomContainer: {
    marginTop: 30,
  },
  forgotPassTxt: {
    fontSize: 15,
    color: Colors.black
  },
  loginTxt: {
    fontSize: Utility.NormalizeFontSize(15),
    color: Colors.white,
    textAlign: 'center',
    fontFamily: Fonts.regular,
    width: Utility.screenWidth - 30,
    paddingVertical: 15,
  },
  loginBtnContainer: {
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.green,
  },
  appleBtnContainer: {
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.black,
  },
  passwordEye: {
    width: 25,
    height: 25,
    alignItems: 'center',
    marginTop: 15,
    resizeMode: 'contain',
  },
  fbImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    position: 'absolute',
    left: 15,
  },
});