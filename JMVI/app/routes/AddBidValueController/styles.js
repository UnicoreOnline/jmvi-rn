import { StyleSheet } from 'react-native'

import Utility from '../../config/Utility'
import Colors from '../../config/Colors'
import Fonts from '../../config/Fonts'
export default StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  topBarContainer: {
    marginTop: 10,
    marginHorizontal: 10
  },
  container: {
    backgroundColor: Colors.white,
    marginVertical: 10,
    marginHorizontal: 15,
  },
  overviewTxtContainer: {
    marginTop: 10,
    flex: 1,
    alignItems: 'center'
  },
  overviewHeaderTxt: {
    fontSize: Utility.NormalizeFontSize(25),
    fontFamily: Fonts.extrabold,
    color: Colors.black4848,
  },
  paraTxt: {
    marginVertical: 15,
    fontSize: Utility.NormalizeFontSize(15),
    fontFamily: Fonts.extrabold,
    color: Colors.black4848,
    // textAlign: 'center'
  },
  addEmailContainer: {
    // flexDirection: 'row',
    // flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  emailInputTextContainer: {
    // flex: 1,
    width: Utility.screenWidth - 50,
    borderColor: Colors.grayBorderColor,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 6,
    paddingHorizontal: Utility.isPlatformAndroid ? 2 : 10,
    paddingVertical: Utility.isPlatformAndroid ? 2 : 10,
  },
  addItemBtnImg: {
    // flex: 0.1,
    width:Utility.screenWidth-45,
    marginTop: 10,
    alignSelf: 'flex-end',
    backgroundColor: Colors.green,
    padding: 8,
    // borderRadius: 6
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 10,
    elevation: 1.5,
  },
  requestReviewsContainer: {
    backgroundColor: Colors.cyanA9,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  requestReviewsTxt: {
    fontSize: Utility.NormalizeFontSize(15),
    fontFamily: Fonts.regular,
    color: Colors.white,
  },
  inputTxt: {
    // flex: 1,
    fontFamily: Fonts.regular,
    fontSize: Utility.NormalizeFontSize(16),
    color: Colors.black4848,
    letterSpacing: 1
  },
  flatlistContainer: {
    marginVertical: 30,
  },
  subFlatlistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  emailTxt: {
    flex: 0.9,
    fontFamily: Fonts.regular,
    fontSize: Utility.NormalizeFontSize(16),
    color: Colors.black4848,
  },
  validationTxt: {
    // flex: 1,
    fontFamily: Fonts.regular,
    fontSize: Utility.NormalizeFontSize(16),
    color: Colors.redff3300,
    marginBottom: 5,
    textAlign: 'center',
    letterSpacing: 1
  },
  anonymousTxt: {
    // flex: 1,
    fontFamily: Fonts.regular,
    fontSize: Utility.NormalizeFontSize(16),
    color: Colors.black,
    marginBottom: 5,
    textAlign: 'center',
  },
  submitTxt: {
    fontFamily: Fonts.bold,
    fontSize: Utility.NormalizeFontSize(15),
    color: Colors.white,
    textAlign: 'center',
    includeFontPadding: false
  },
  cancelImg: {
    flex: 0.1,
    alignItems: 'center'
  }
})
