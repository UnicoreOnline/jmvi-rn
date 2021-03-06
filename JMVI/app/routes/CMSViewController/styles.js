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
  headerTxt: {
    // fontFamily: Fonts.semibold,
    // marginHorizontal: 5,
    // fontSize: Utility.NormalizeFontSize(20),
    // color: Colors.black4848,
    flex: 1,
    width: Utility.screenWidth,
    fontSize: Utility.NormalizeFontSize(20),
    color: Colors.black4848,
    alignItems: 'center',
    textAlign: 'center',
    paddingVertical: 5,
    position: 'absolute',
    fontFamily: Fonts.regular
  },
  tobBarContainer: {
    flexDirection: 'row',
    // marginHorizontal: 15,
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayBorderColor
  },
  backbuttonIconImg: {
    padding: 5,
  },
});
