import { StyleSheet } from 'react-native'

import Utility, { screenWidth } from '../config/Utility'
import Colors from '../config/Colors'
import Fonts from '../config/Fonts'
export default StyleSheet.create({
  bottomBarContainer: {
    position: 'absolute',
    width: Utility.screenWidth,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: Utility.isiPhoneX ? 30 : 15,
    backgroundColor: Colors.headerYellow,
    paddingHorizontal: 20
  },
  bottomImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },

  //Listing Style
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingBottom: 55,
  },
  auctionItemMainContainer: {
    // flexDirection: 'row',
    marginBottom: 15,
    // marginHorizontal: 15
  },
  auctionItemContainer: {
    flex: 1,
    // marginStart: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.greyE1,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  txtContainer: {
    flex: 1,
  },
  txtBedBathContainer: {
    flex: 0.3,
  },
  imageStyle: {
    height: 230,
    width: Utility.screenWidth,
    // marginHorizontal: 10,
    // flex: 1,
    // width: Utility.screenWidth,
    resizeMode: 'contain'
  },
  imageStyleBanner: {
    height: 250,
    width: Utility.screenWidth,
    // marginHorizontal: 10,
    // flex: 1,
    // width: Utility.screenWidth,

  },
  txtAuctionName: {
    flexWrap: 'wrap',
    fontSize: Utility.NormalizeFontSize(15),
    color: Colors.black,
    fontFamily: Fonts.bold,
    paddingEnd: 4,
  },
  txtAuctionDate: {
    flexWrap: 'wrap',
    fontSize: Utility.NormalizeFontSize(15),
    color: Colors.black,
    fontFamily: Fonts.bold,
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
  textLoading: {
    fontSize: Utility.NormalizeFontSize(15),
    color: Colors.black4848,
    alignSelf: 'center',
    fontFamily: Fonts.bold
  },
  bedsImage: {
    width: 20,
    height: 20,
    marginHorizontal: 6,
    resizeMode: 'contain',
  },
  noRecordsFoundTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: Utility.NormalizeFontSize(16),
    color: Colors.grey6D6D,
    textAlign: 'center',
  },
  retryTextStyle: {
    fontFamily: Fonts.regular,
    fontSize: Utility.NormalizeFontSize(16),
    color: Colors.black,
    textAlign: 'center',
    marginTop: 20
  },
  noRecordsFoundContainerStyle: {
    marginTop: (Utility.screenHeight / 2) - 100,
  },
})