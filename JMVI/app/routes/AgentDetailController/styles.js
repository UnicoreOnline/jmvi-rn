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
    marginHorizontal: 15,
    paddingBottom: 20
  },
  serviceImage: {
    height: 120,
    width: 120,
    marginVertical: 20,
    resizeMode: 'contain'
  },
  textMainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  txtTitle: {
    flexWrap: 'wrap',
    fontSize: Utility.NormalizeFontSize(14),
    color: Colors.grayTextColor,
    fontFamily: Fonts.regular,
    flex: 0.8,
  },
  txtValue: {
    flexWrap: 'wrap',
    fontSize: Utility.NormalizeFontSize(15),
    color: Colors.grey949293,
    fontFamily: Fonts.regular,
    flex: 1,
    marginStart: 4,
    // textAlign: 'right'
  },
  txtValueLink: {
    flexWrap: 'wrap',
    fontSize: Utility.NormalizeFontSize(15),
    color: Colors.blue589CF8,
    fontFamily: Fonts.regular,
    flex: 1,
    marginStart: 4,
    textDecorationLine: 'underline',
    // textAlign: 'right'
  },
  listingBtnContainer: {
    marginTop: 40,
    backgroundColor: Colors.green,
    alignItems: 'center',
    paddingVertical: 10,
  },
  txtListing: {
    flexWrap: 'wrap',
    fontSize: Utility.NormalizeFontSize(14),
    color: Colors.white,
    fontFamily: Fonts.regular,
    flex: 0.8,
    textAlign: 'center'
  },
  callImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
})