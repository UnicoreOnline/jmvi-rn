import { StyleSheet } from 'react-native'

import Utility, { screenWidth } from '../../config/Utility'
import Colors from '../../config/Colors'
import Fonts from '../../config/Fonts'
export default StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingBottom: Utility.isPlatformAndroid ? 50 : 40
  },
  auctionItemMainContainer: {
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  favoriteShareContainer: {
    // flex: 1,
    marginVertical: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  txtShare: {
    flexWrap: 'wrap',
    fontSize: Utility.NormalizeFontSize(15),
    color: Colors.black,
    fontFamily: Fonts.regular,
    borderColor: Colors.blue1887C0,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 12,
    letterSpacing: 2
  },
  unfavouriteImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  favouriteImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: Colors.redColor
  },
  txtContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 4,
  },
  imageStyle: {
    height: 200,
    width: Utility.screenWidth,
    flex: 1,
    resizeMode: 'contain',
    // marginTop: 5,
    // width: Utility.screenWidth,
    // resizeMode: 'contain'
  },
  auctionDetailsContainer: {
    // flex: 1,
    // marginTop: 10,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center'
  },
  txtTitle: {
    flex: 0.7,
    flexWrap: 'wrap',
    fontSize: Utility.NormalizeFontSize(16),
    color: Colors.grey85,
    fontFamily: Fonts.regular,
  },
  txtTitleBold: {
    flex: 0.7,
    flexWrap: 'wrap',
    fontSize: Utility.NormalizeFontSize(14),
    color: Colors.grey85,
    fontFamily: Fonts.bold,
  },
  txtValue: {
    flex: 1,
    flexWrap: 'wrap',
    fontSize: Utility.NormalizeFontSize(16),
    color: Colors.black,
    fontFamily: Fonts.regular,
  },
  txtValueBold: {
    flex: 1,
    flexWrap: 'wrap',
    fontSize: Utility.NormalizeFontSize(14),
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
  rentationItemContainer: {
    // backgroundColor: Colors.greenBadgeColor,
    flex: 1
  },
  bidItemContainer: {
    // backgroundColor: Colors.greenBadgeColor,
    flex: 1,
    flexDirection: 'row'
  },
  txtAuctionName: {
    flexWrap: 'wrap',
    fontSize: Utility.NormalizeFontSize(16),
    color: Colors.black,
    marginTop: 10,
    fontFamily: Fonts.regular,
  },
  txtDescriptionTitle: {
    flexWrap: 'wrap',
    fontSize: Utility.NormalizeFontSize(15),
    color: Colors.orangeColor,
    marginTop: 10,
    fontFamily: Fonts.bold,
  },
  toolTip: {
    fontSize: Utility.NormalizeFontSize(16),
    backgroundColor: Colors.white,
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    marginStart: 4,
    borderColor: Colors.grey6D6D,
    borderWidth: 2,
    borderRadius: 15,
    borderStyle: 'dashed',
    marginBottom: 8,
    fontFamily: Fonts.regular,
  },
  txtDescriptionValue: {
    flexWrap: 'wrap',
    fontSize: Utility.NormalizeFontSize(16),
    color: Colors.black,
    marginTop: 10,
    fontFamily: Fonts.regular,
  },
  txtBidTitle: {
    flex: 1,
    flexWrap: 'wrap',
    fontSize: Utility.NormalizeFontSize(18),
    color: Colors.black1E1E,
    marginTop: 10,
    fontFamily: Fonts.regular,
  },
  txtBidValue: {
    flex: 1,
    flexWrap: 'wrap',
    fontSize: Utility.NormalizeFontSize(16),
    color: Colors.black,
    marginTop: 10,
    fontFamily: Fonts.regular,
  },
  placeBid: {
    flex: 1,
    fontSize: Utility.NormalizeFontSize(17),
    color: Colors.white,
    textAlign: 'center',
    marginTop: 10,
    // marginHorizontal: 10,
    padding: 10,
    backgroundColor: Colors.green,
    fontFamily: Fonts.bold,
  },
  emailContactImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    margin: 8
  },
})