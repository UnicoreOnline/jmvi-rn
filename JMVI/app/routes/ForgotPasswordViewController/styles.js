import { StyleSheet } from 'react-native'

import Utility, { screenWidth } from '../../config/Utility'
import Colors from '../../config/Colors'
import Fonts from '../../config/Fonts'
export default StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  tobBarContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 10,
  },
  backBtnImg: {
      height: 30,
      width: 30
  },
  subContainer: {
    marginTop: 30,
    marginHorizontal: 15,
  },
  headerTxt: {
    fontFamily: Fonts.semibold,
    fontSize: Utility.NormalizeFontSize(30),
    color: Colors.black4848,
  },
  textInputContainer: {
    marginTop: 40,
  },
  inputTxt: {
    flex: 1,
    paddingVertical: 6,
    fontFamily: Fonts.regular,
    fontSize: Utility.NormalizeFontSize(16),
    color: Colors.black4848,
  },
  infoTxt: {
    marginVertical: 10,
    fontFamily: Fonts.regular,
    fontSize: Utility.NormalizeFontSize(16),
    color: Colors.black4848,
  },
  titleNameTxt: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    fontFamily: Fonts.semibold,
    fontSize: Utility.NormalizeFontSize(14),
    color: Colors.regular,
  },
  submitContainer: {
    marginVertical: 50,
    backgroundColor: Colors.green,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitTxt: {
    fontSize: Utility.NormalizeFontSize(17),
    fontFamily: Fonts.regular,
    color: Colors.white,
  },
})