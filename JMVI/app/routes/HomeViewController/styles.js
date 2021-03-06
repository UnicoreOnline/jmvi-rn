import { StyleSheet } from 'react-native'

import Utility, { screenWidth } from '../../config/Utility'
import Colors from '../../config/Colors'
import Fonts from '../../config/Fonts'
export default StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  titleTxt: {
    fontSize: Utility.NormalizeFontSize(24),
    color: Colors.black,
    fontFamily: Fonts.regular,
    paddingVertical: 6,
    marginHorizontal: 10,
    letterSpacing: 4
  },
  categoryBannerImg: {
    // flex: 1,
    width: Utility.screenWidth,
    height: Utility.screenHeight / 2 - 40,
  },
  topBG: {
    position: 'absolute',
    width: Utility.screenWidth
  },
  topBarImage: {
    alignSelf: "center",
    height: 40,
    paddingVertical: 10,
    flex: 1,
    position: 'absolute',
    width: Utility.screenWidth,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontFamily: Fonts.regular,
    fontSize: Utility.NormalizeFontSize(16),
    color: Colors.black,
    textAlign: 'center',
    padding: 10,
    // textDecorationLine:'underline'
  },
})