import { StyleSheet } from 'react-native'

import Utility, { screenWidth } from '../../config/Utility'
import Colors from '../../config/Colors'
import Fonts from '../../config/Fonts'
export default StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  navSectionStyle: {
    marginVertical: 10,
    marginHorizontal: 15,
  },
  sectionHeadingStyle: {
    fontSize: Utility.NormalizeFontSize(18),
    color: Colors.grayTextColor,
    fontFamily: Fonts.regular,
    paddingVertical: 8,
    marginHorizontal: 10,
    // letterSpacing: 4
  },
  navItemTextStyle: {
    fontSize: Utility.NormalizeFontSize(18),
    color: Colors.black,
    fontFamily: Fonts.regular,
    paddingVertical: 8,
    marginStart: 15
    // letterSpacing: 4
  },
  navItemStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  navItemIconStyle: {
    width: 22,
    height: 22,
    resizeMode: 'contain'
  },
  btnContainer: {
    // flex: 1,
    marginTop: 10,
    marginHorizontal: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: Colors.blue1887C0,
    borderRadius: 15
  },
  text: {
    fontSize: Utility.NormalizeFontSize(15),
    color: Colors.white,
    alignSelf: 'center',
    fontFamily: Fonts.regular
  },
  logoJMVI: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    margin: 20
  },
  cancelImage: {
    alignSelf: 'flex-end',
    width: 15,
    height: 15,
    padding: 5,
    marginTop: 20,
    marginRight: 20,
  },
  viewLine: {
    width: Utility.screenWidth,
    height: 1,
    backgroundColor: Colors.greyUnderLineColor
  },
})