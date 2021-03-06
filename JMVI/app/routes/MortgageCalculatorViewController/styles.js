import { StyleSheet } from 'react-native';
;
import Utility from '../../config/Utility';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  tobBarContainer: {
    marginHorizontal: 15,
    marginVertical: 10,
    flexDirection: 'row',
  },
  backBtnImg: {
    height: 30,
    width: 30,
    // marginTop: 5,
  },
  titleTextInputStyle: {
    textAlign: 'left',
    fontSize: Utility.NormalizeFontSize(20),
    color: Colors.grey949293,
    fontFamily: Fonts.regular,
    textAlignVertical: 'center',
    marginTop: 15,
    // borderRadius: 6
  },
  titleResultTxt: {
    flex: 1,
    textAlign: 'center',
    fontSize: Utility.NormalizeFontSize(20),
    color: Colors.black,
    fontFamily: Fonts.regular,
    textAlignVertical: 'center',
    marginTop: 30,
    // borderRadius: 6
  },
  textInputContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.greyE1,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  textInput: {
    flex: 1,
    textAlign: 'left',
    fontSize: Utility.NormalizeFontSize(18),
    // marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: Colors.black,
    fontFamily: Fonts.regular
    // borderRadius: 6
  },
  pickerContainer: {
    flex: 1,
    // marginHorizontal: 20,
    // borderRadius: 6
  },
  pickerItem: {
    flex: 1,
    textAlign: 'left',
    fontSize: Utility.NormalizeFontSize(18),
    // marginHorizontal: 20,
    paddingHorizontal: 10,
    // paddingVertical: 10,
    color: Colors.black,
    fontFamily: Fonts.regular
    // borderRadius: 6
  },
  dollarStyle: {
    textAlign: 'left',
    fontSize: Utility.NormalizeFontSize(20),
    paddingHorizontal: 4,
    color: Colors.grey949293,
    fontFamily: Fonts.regular,
    textAlignVertical: 'center'
    // borderRadius: 6
  },
  submitBtn: {
    // flex: 1,
    fontSize: Utility.NormalizeFontSize(18),
    color: Colors.white,
    textAlign: 'center',
    paddingVertical: 10,
    // marginHorizontal: 10,
    padding: 10,
    backgroundColor: Colors.green,
    fontFamily: Fonts.regular,
  },
  dorpdownArrrow: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
    tintColor: Colors.grey949293
  },
  inputContainer: {
    // borderRadius: 12,
    // marginHorizontal: 10,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.greyE1,
    paddingVertical: 13,
    paddingHorizontal: 10,
    backgroundColor: Colors.grayBorderColor
  },
  searchItemTxt: {
    fontSize: Utility.NormalizeFontSize(16),
    color: Colors.black,
    fontFamily: Fonts.light,
    marginHorizontal: 10,
    flex:1
  },
});
