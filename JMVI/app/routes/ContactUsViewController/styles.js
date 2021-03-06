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
  textInput: {
    fontSize: 15,
    textAlign: 'left',
    fontSize: Utility.NormalizeFontSize(18),
    backgroundColor: Colors.greyE1,
    // marginHorizontal: 20,
    marginTop: 15,
    paddingHorizontal: 10,
    paddingVertical: 15,
    color: Colors.black,
    fontFamily: Fonts.regular
    // borderRadius: 6
  },
  submitBtn: {
    // flex: 1,
    fontSize: Utility.NormalizeFontSize(18),
    color: Colors.white,
    textAlign: 'center',
    paddingVertical: 10,
    // marginHorizontal: 10,
    padding: 10,
    backgroundColor: Colors.green,
    fontFamily: Fonts.regular,
  },
});
