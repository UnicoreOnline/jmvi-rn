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
    // marginHorizontal: 15,
    marginTop: 18,
  },
  topBG: {
    alignSelf: "center",
    // alignItems:'center',
    height: 70,
    // backgroundColor: Colors.redff3300,
    width: Utility.screenWidth
  },
  magnnumLogo: {
    alignSelf: "center",
    // alignItems:'center',
    // alignContent:'center',
    // marginVertical: 5,
    marginTop: 15,
    height: 40,
    position: 'absolute',
    width: Utility.screenWidth - 50
  },

  tobBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  whiteLineSeparator: {
    height: '100%',
    width: 1,
    backgroundColor: Colors.white
  },
  bottomContainer: {
    marginTop: 25,
    alignItems: 'flex-start',
  },
  imgProfile: {
    width: Utility.screenWidth - 8,
    height: Utility.screenHeight,
    // borderRadius: 25,
    // borderWidth: 1,
    // borderColor: Colors.grayBorderColor,
    // padding: 2,
  },
  flatlistContainer: {
    // marginVertical: 20,
    // paddingHorizontal: 10,
    // marginHorizontal: 2,
    // marginVertical: 2
    width: Utility.screenWidth,
    alignItems: 'center'
  },
  albumContainer: {
    // flexDirection: 'row',
    flex: 1
  },
  profileTxtContainer: {
    marginHorizontal: 16,
    alignContent: 'center'
  },
  txtAlbumTitle: {
    fontFamily: Fonts.regular,
    fontSize: Utility.NormalizeFontSize(16),
    color: Colors.black,
    textAlign: 'center',
    marginTop: 8
  },
  txtAlbumItemCount: {
    fontFamily: Fonts.semibold,
    fontSize: Utility.NormalizeFontSize(14),
    color: Colors.black4848,
    marginTop: 4,
    textAlign: 'center'
  },
  readMoreTxt: {
    fontFamily: Fonts.semibold,
    fontSize: Utility.NormalizeFontSize(15),
    color: Colors.white,
    textAlign: 'center',
    padding: 4
  },
  headerTitle: {
    fontFamily: Fonts.regular,
    fontSize: Utility.NormalizeFontSize(16),
    color: Colors.black,
    textAlign: 'center',
    padding: 10,
    // textDecorationLine:'underline'
  }
})