/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
{/* <StatusBar barStyle="dark-content" /> */ }
import React, { Component } from 'react'
//TODO Disable Yellow Box Warning
console.disableYellowBox = true;
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  DeviceEventEmitter,
  TouchableOpacity,
  StatusBar
} from 'react-native'
import User from './app/models/User';
import Utility from './app/config/Utility';
import AsyncData from './app/config/AsyncData';
// import Router from './app/routes';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import firebase from 'react-native-firebase';
import type { RemoteMessage, Notification, NotificationOpen } from 'react-native-firebase';
import SplashScreen from 'react-native-splash-screen'

import StartViewController from './app/routes/StartViewController'
import SideMenuViewController from './app/routes/SideMenuViewController'
import MyFavouriteListingController from './app/routes/MyFavouriteListingController'
import AuctionListingController from './app/routes/AuctionListingController'
import AuctionDetailsController from './app/routes/AuctionDetailsController'
import AgentListingController from './app/routes/AgentListingController'
import AgentDetailController from './app/routes/AgentDetailController'
import PropertyLawyersListingController from './app/routes/PropertyLawyersListingController'
import PropertyLawyerDetailsController from './app/routes/PropertyLawyerDetailsController'
import MortgageFinancingListingController from './app/routes/MortgageFinancingListingController'
import MortgageFinancingDetailsController from './app/routes/MortgageFinancingDetailsController'
import CMSViewController from './app/routes/CMSViewController'
import ContactUsViewController from './app/routes/ContactUsViewController'
import MortgageCalculatorViewController from './app/routes/MortgageCalculatorViewController'
import FeaturedListingController from './app/routes/FeaturedListingController'
import ForRentListingController from './app/routes/ForRentListingController'
import ForSaleListingController from './app/routes/ForSaleListingController'
import PropertyListingController from './app/routes/PropertyListingController'
import PropertyDetailsController from './app/routes/PropertyDetailsController'
import GallerySwiperViewController from './app/routes/GallerySwiperViewController'
import SignInController from './app/routes/SignInController'
import SignUpController from './app/routes/SignUpController'
import ProfileViewController from './app/routes/ProfileViewController'
import CountryViewController from './app/routes/CountryViewController'
import SearchViewController from './app/routes/SearchViewController'
import ForgotPasswordViewController from './app/routes/ForgotPasswordViewController'
import Images from './app/config/Images';
import Colors from './app/config/Colors';
import Fonts from './app/config/Fonts';
const SCREEN = {
  'Featured': 'FEATURED',
  'Sale': 'FOR SALE',
  'Rent': 'FOR RENT',
  'AuctionHouse': 'AUCTION HOUSE',
  'MyFaovourite': 'MY FAVOURITES',
  'Agents': 'AGENTS',
  'AgentDetails': 'AGENT DETAILS',
  'TNC': 'TERMS & CONDITIONS',
  'AboutUs': 'ABOUT US',
  'ContactUs': 'CONTACT US',
  'MortgageCalculator': 'MORTGAGE CALCULATOR',
  'MortgageFinancing': 'MORTGAGE FINANCING',
  'BankDetails': 'BANK DETAILS',
  'PropertyLawyers': 'PROPERTY LAWYERS',
  'PropertyLawyerDetails': 'LAWYER DETAILS',
  'Login': 'LOGIN',
  'Register': 'REGISTER',
  'ForgotPassword': 'FORGOT PASSWORD',
  'Profile': 'PROFILE',
  'Country': 'SELECT COUNTRY',
  'Search': 'SEARCH',
  'Property': 'PROPERTY',
}
const genericNavigationOption = (navigation, mTitle) => ({
  // header: props => <ImageHeader {...props} />,
  title: mTitle,
  // drawerLabel: mTitle,
  headerLeft: () => <NavigationDrawerStructur navigationProps={navigation} />,
  headerStyle: {
    backgroundColor: Colors.headerYellow,
  },
  headerTintColor: Colors.black,
  headerTitleStyle: {
    fontFamily: Fonts.regular,
    fontSize: Utility.isPlatformAndroid ? Utility.NormalizeFontSize(20) : Utility.NormalizeFontSize(16),

  },
  // headerRight: () => <TouchableOpacity ><Image style={{ height: 25, width: 25, marginEnd: 15 }} source={Images.search} /></TouchableOpacity>,
  // headerRight: () => <NavigationDrawerRight navigationProps={navigation} />,
})
// const Header = props => (
//   <View style={{ justifyContent: 'flex-end', position: 'absolute', left: 10, top: 20 }}>
//     <Text style={{ fontFamily: Fonts.regular, color: Colors.black4848, fontSize: Utility.NormalizeFontSize(22) }}>{props.scene.route.routeName}</Text>
//   </View>
// );
// const ImageHeader = props => {
//   console.log('PROSPSSS ', props)
//   return (<View style={{ backgroundColor: Colors.white }}>
//     <Image
//       style={{ height: 60, width: Utility.screenWidth }}
//       source={Images.top_bg}
//     />
//     <Header {...props} style={{ backgroundColor: 'green', }} />
//   </View>)
// };

// const StartActivityStackNavigator = createStackNavigator({
//   Start: {
//     screen: StartViewController,
//     navigationOptions: null
//   },
//   AuctionDetails: {
//     screen: AuctionDetailsController,
//     navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.AuctionHouse)
//   },
//   PropertyDetails: {
//     screen: PropertyDetailsController,
//     navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Property)
//   },
//   SignIn: {
//     screen: SignInController,
//     navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Login)
//   },
//   SignUp: {
//     screen: SignUpController,
//     navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Register)
//   },
//   ForgotPassword: {
//     screen: ForgotPasswordViewController,
//     navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.ForgotPassword)
//   },
// });
const FeaturedActivityStackNavigator = createStackNavigator({
  Start: {
    screen: StartViewController,
    navigationOptions: null
  },
  Featured: {
    screen: FeaturedListingController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Featured)
  },
  PropertyDetails: {
    screen: PropertyDetailsController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Featured)
  },
  GallerySwiper: {
    screen: GallerySwiperViewController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Featured)
  },
  SignIn: {
    screen: SignInController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Login)
  },
  SignUp: {
    screen: SignUpController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Register)
  },
  ForgotPassword: {
    screen: ForgotPasswordViewController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.ForgotPassword)
  },
  AuctionDetails: {
    screen: AuctionDetailsController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.AuctionHouse)
  },
});
const ForSaleActivityStackNavigator = createStackNavigator({
  ForSale: {
    screen: ForSaleListingController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Sale)
  },
  PropertyDetails: {
    screen: PropertyDetailsController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Sale)
  },
  GallerySwiper: {
    screen: GallerySwiperViewController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Sale)
  },
  SignIn: {
    screen: SignInController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Login)
  },
  SignUp: {
    screen: SignUpController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Register)
  },
  ForgotPassword: {
    screen: ForgotPasswordViewController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.ForgotPassword)
  },
});
const ForRentActivityStackNavigator = createStackNavigator({
  ForRent: {
    screen: ForRentListingController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Rent)
  },
  PropertyDetails: {
    screen: PropertyDetailsController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Rent)
  },
  GallerySwiper: {
    screen: GallerySwiperViewController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Rent)
  },
  SignIn: {
    screen: SignInController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Login)
  },
  SignUp: {
    screen: SignUpController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Register)
  },
  ForgotPassword: {
    screen: ForgotPasswordViewController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.ForgotPassword)
  },
});

const AuctionHouseActivityStackNavigator = createStackNavigator({
  Auction: {
    screen: AuctionListingController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.AuctionHouse)
  },
  AuctionDetails: {
    screen: AuctionDetailsController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.AuctionHouse)
  },
  GallerySwiper: {
    screen: GallerySwiperViewController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.MyFaovourite)
  },
  SignIn: {
    screen: SignInController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Login)
  },
  SignUp: {
    screen: SignUpController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Register)
  },
  ForgotPassword: {
    screen: ForgotPasswordViewController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.ForgotPassword)
  },
});

const MyFavouriteActivityStackNavigator = createStackNavigator({
  MyFavourite: {
    screen: MyFavouriteListingController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.MyFaovourite)
  },
  PropertyDetails: {
    screen: PropertyDetailsController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.MyFaovourite)
  },
  AuctionDetails: {
    screen: AuctionDetailsController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.MyFaovourite)
  },
  GallerySwiper: {
    screen: GallerySwiperViewController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.MyFaovourite)
  },
  SignIn: {
    screen: SignInController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Login)
  },
  SignUp: {
    screen: SignUpController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Register)
  },
  ForgotPassword: {
    screen: ForgotPasswordViewController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.ForgotPassword)
  },
});

const AgentStackNavigator = createStackNavigator({
  FindAnAgent: {
    screen: AgentListingController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Agents)
  },
  AgentDetails: {
    screen: AgentDetailController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.AgentDetails)
  },
  Property: {
    screen: PropertyListingController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Property)
  },
  PropertyDetails: {
    screen: PropertyDetailsController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Property)
  },
  GallerySwiper: {
    screen: GallerySwiperViewController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Property)
  },
});

const MortgageFinancingActivityStackNavigator = createStackNavigator({
  MortgageFinancing: {
    screen: MortgageFinancingListingController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.MortgageFinancing)
  },
  MortgageFinancingDetails: {
    screen: MortgageFinancingDetailsController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.BankDetails)
  },
  MortgageCalculator: {
    screen: MortgageCalculatorViewController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.MortgageCalculator)
  },
});

const PropertyLawyerActivityStackNavigator = createStackNavigator({
  PropertyLawyers: {
    screen: PropertyLawyersListingController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.PropertyLawyers)
  },
  PropertyLawyerDetails: {
    screen: PropertyLawyerDetailsController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.PropertyLawyerDetails)
  },
});

const MortgageCalculatorStackNavigator = createStackNavigator({
  MortgageCalculator: {
    screen: MortgageCalculatorViewController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.MortgageCalculator)
  },
});

const AboutUsStackNavigator = createStackNavigator({
  AboutUs: {
    screen: CMSViewController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.AboutUs)
  },
});
const TNCStackNavigator = createStackNavigator({
  TNC: {
    screen: CMSViewController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.TNC)
  },
});

const ContactUsNavigator = createStackNavigator({
  ContactUs: {
    screen: ContactUsViewController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.ContactUs)
  },
});
const SignInActivityNavigator = createStackNavigator({
  SignIn: {
    screen: SignInController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Login)
  },
  SignUp: {
    screen: SignUpController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Register)
  },
  ForgotPassword: {
    screen: ForgotPasswordViewController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.ForgotPassword)
  },
});
const SignUpActivityNavigator = createStackNavigator({
  SignUp: {
    screen: SignUpController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Register)
  },
});
const ProfileActivityNavigator = createStackNavigator({
  Profile: {
    screen: ProfileViewController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Profile)
  },
});
const CountryActivityNavigator = createStackNavigator({
  Country: {
    screen: CountryViewController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Country)
  },
});
const SearchViewActivityNavigator = createStackNavigator({
  SearchView: {
    screen: SearchViewController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Search)
  },
  ForRent: {
    screen: ForRentListingController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Rent)
  },
  ForSale: {
    screen: ForSaleListingController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Sale)
  },
  PropertyDetails: {
    screen: PropertyDetailsController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Search)
  },
  GallerySwiper: {
    screen: GallerySwiperViewController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Search)
  },
  Auction: {
    screen: AuctionListingController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.AuctionHouse)
  },
  AuctionDetails: {
    screen: AuctionDetailsController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.AuctionHouse)
  },
  SignIn: {
    screen: SignInController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Login)
  },
  SignUp: {
    screen: SignUpController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.Register)
  },
  ForgotPassword: {
    screen: ForgotPasswordViewController,
    navigationOptions: ({ navigation }) => genericNavigationOption(navigation, SCREEN.ForgotPassword)
  },
});


const DrawerNavigator = createDrawerNavigator({
  //Drawer Optons and indexing
  // Start: { screen: StartActivityStackNavigator, /*navigationOptions: { drawerLabel: SCREEN.Featured, },*/ },
  Featured: { screen: FeaturedActivityStackNavigator, /*navigationOptions: { drawerLabel: SCREEN.Featured, },*/ },
  ForSale: { screen: ForSaleActivityStackNavigator, },
  ForRent: { screen: ForRentActivityStackNavigator, },
  Auction: { screen: AuctionHouseActivityStackNavigator, },
  MyFavourite: { screen: MyFavouriteActivityStackNavigator, },
  FindAnAgent: { screen: AgentStackNavigator, },
  MortgageCalculator: { screen: MortgageCalculatorStackNavigator, },
  MortgageFinancing: { screen: MortgageFinancingActivityStackNavigator, },
  PropertyLawyers: { screen: PropertyLawyerActivityStackNavigator, },
  AboutUs: { screen: AboutUsStackNavigator, },
  TNC: { screen: TNCStackNavigator, },
  ContactUs: { screen: ContactUsNavigator, },
  SignIn: { screen: SignInActivityNavigator, },
  SignUp: { screen: SignUpActivityNavigator, },
  Profile: { screen: ProfileActivityNavigator, },
  Country: { screen: CountryActivityNavigator, },
  Search: { screen: SearchViewActivityNavigator, },
}, {
  contentComponent: SideMenuViewController, //Custom Navigation Drawer
  drawerWidth: Utility.screenWidth - 100
});
// const defaultGetStateForAction = DrawerNavigator.router.getStateForAction;
// DrawerNavigator.router.getStateForAction = (action, state) => {
//   if (state && action.type === 'Navigation/NAVIGATE' && action.routeName === 'DrawerClose') {
//     StatusBar.setHidden(false);
//   }

//   if (state && action.type === 'Navigation/NAVIGATE' && action.routeName === 'DrawerOpen') {
//     StatusBar.setHidden(true);
//   }
//   return defaultGetStateForAction(action, state);
// };
class NavigationDrawerStructur extends Component {
  constructor(props) {
    super(props)

  }

  async componentDidMount() {
    firebase.messaging().getToken()
      .then(fcmToken => {
        if (fcmToken) {
          console.log('fcmToken', fcmToken)
          // user has a device token
        } else {
          console.log('fcmToken not found')
          // user doesn't have a device token yet
        }
      });
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      // user has permissions
    } else {
      // user doesn't have permission
      try {
        await firebase.messaging().requestPermission();
        // User has authorised
      } catch (error) {
        // User has rejected permissions
      }
    }
    // this.removeNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
    //   // Process your notification as required
    //   // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    // });
    // this.removeNotificationListener = firebase.notifications().onNotification((notification: Notification) => {
    //   // Process your notification as required
    // });




    SplashScreen.hide();
    User.loggedInUser((user) => {
      Utility.user = user;
    })
  }

  componentWillUnmount() {
    // this.notificationDisplayedListener();
    // this.notificationListener();
    // this.removeNotificationDisplayedListener();
    // this.removeNotificationListener();
  }

  toggleDrawer = () => {
    this.props.navigationProps.toggleDrawer();
  };

  render() {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.statusBarColor} />
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          <Image
            source={Images.ic_drawer}
            style={{ width: 25, height: 25, marginLeft: 20 }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
// export default App
export default createAppContainer(DrawerNavigator);

// class NavigationDrawerRight extends Component {
//   static navigationOptions = {
//     header: null,
//   }
//   constructor(props) {
//     super(props)

//   }

//   async componentDidMount() {
//     SplashScreen.hide();
//     User.loggedInUser((user) => {
//       Utility.user = user;
//     })
//   }

//   toggleDrawer = () => {
//     // this.props.navigationProps.toggleDrawer();
//   };

//   render() {
//     return (
//       <View style={{ flexDirection: 'row' }}>
//         <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
//           <Image
//             source={Images.ic_search}
//             style={{ width: 25, height: 25, marginLeft: 10 }}
//           />
//         </TouchableOpacity>
//       </View>
//     );
//   }
// }
// // export default App
// export default createAppContainer(NavigationDrawerRight);

// TODO CHECK
// POINTS TO BE NOTED
// /Users/vivekcyber/Desktop/Hardik/MagnumTV/magnumtvhubrn/MagnumHubTVApp/node_modules/react-native-fetch-blob/react-native-fetch-blob.podspec
// Change React-Core instead of React/Core
// Check jetifier when AndroidX related issues: https://github.com/mikehardy/jetifier

//ERROR
//Q fatal: unable to look up github.com (port 9418) (Either the application has not called WSAStartup, or WSAStartup failed. )
//A git config --global url."https://github.com/".insteadOf git@github.com:
// git config --global url."https://".insteadOf git:// //REF: https://gist.github.com/taoyuan/bfa3ff87e4b5611b5cbe

// Generate KeyHash
// keytool -exportcert -alias jmvirealty -keystore /Users/hardik/Documents/Projects/ReactNative/JMVI/Source/jmvi/JMVI/android/app/jmvirealty.jks | openssl sha1 -binary | openssl base64