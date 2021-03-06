import { StyleSheet } from 'react-native'

import Utility, { screenWidth } from '../../config/Utility'
import Colors from '../../config/Colors'
import Fonts from '../../config/Fonts'
export default StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  agentMainContainer: {
    flexDirection: 'row',
    marginVertical: 15,
    marginHorizontal: 15
  },
  agentDetailContainer: {
    flex: 1,
    marginStart: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  txtContainer: {
    flex: 1,
  },
  serviceImage: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    // backgroundColor: '#e9eef1'
  },
  placeHolderStyle: {
    height: 100,
    width: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    backgroundColor: '#e9eef1'
  },
  txtAgentName: {
    flexWrap: 'wrap',
    fontSize: Utility.NormalizeFontSize(15),
    color: Colors.black,
    fontFamily: Fonts.regular,
  },
  txtCompanyName: {
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
  arrowImage: {
    transform: [{ rotate: '180deg' }],
    tintColor: Colors.black
  }
})