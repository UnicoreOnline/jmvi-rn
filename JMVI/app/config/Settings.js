import Utility from './Utility';
// import RNAccountKit, {Color, StatusBarStyle} from 'react-native-facebook-account-kit'

export const Settings = {

  topBarHeight: Utility.isPlatformAndroid
    ? 50
    : 70,
  topBarTopPadding: Utility.isPlatformAndroid
    ? 0
    : 0,
  topBarHorizontalPadding: 10,
  titleFontSize: 18,

  /** for parsed text */
  dataDetectorStyle: {
    url: {
      color: 'blue',
      textDecorationLine: 'underline',
    },

    email: {
      textDecorationLine: 'underline',
    },
    phone: {
      color: 'blue',
    },
    taggedUser: {
      //color: 'blue',
      fontWeight: 'bold'
    },
  }
};

export default Settings;
