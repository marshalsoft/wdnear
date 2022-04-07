//keytool -genkey -v -keystore wedeynear.keystore -alias wedeynear -keyalg RSA -keysize 2048 -validity 10000
import React, {PureComponent} from 'react';
import {BackHandler,Alert} from 'react-native';
import FlashScreen from './screens/flash';
// import HomeScreen from './screens/home';
// import HistoryScreen from './screens/history';
// import PaymentScreen from './screens/payment';
import SignupLoginScreen from './screens/signup_login';
import WelcomeScreen from './screens/welcome';
import LoginScreen from './screens/login';
import ProductScreen from './screens/viewproduct';
import SearchScreen from './screens/product_search';
import CategoryScreen from './screens/categories';
import WhatsNewScreen from './screens/whatsnew';
import NotificationScreen from './screens/notification';
import RegScreen2 from './screens/register_two';
import NewServiceScreen from './screens/newservice';
import MyServicesScreen from './screens/myservices';
import EditService from './screens/edit_service';
import CreateScreen from './screens/eventscreen';
import EventTypeScreen from './screens/eventscreen_type';

// import TabIcons from './components/homebar';
// import MenuScreen from './components/menu';
// import MobileNumberScreen from './screens/numberscreen';
// import RegisterScreen from './screens/register';
// import TermsScreen from './screens/terms';
// import SettingsScreen from './screens/settings';
// import VerifyScreen from './screens/verifyCode';
// import RegScreen3 from './screens/register_three';
// import MapScreen from './screens/map';
// import ForgotPassScreen from './screens/forgotpassword';
// import EditProfileScreen from './screens/editprofile';
// import DeleteAccountScreen from './screens/deleteaccount';
// import AboutScreen from './screens/aboutus';
// import AdvertScreen from './screens/advert';
// import ViewEventScreen from './screens/ViewEventScreen';
// import VerifyCodeScreen from './screens/editMobile';
// import ChatScreen from './screens/chatscreen';
// import ChatClientScreen from './screens/chatscreen2';
// import EventMoreScreen from './screens/eventscreen_more';
// import BankDetailsScreen from './screens/bank_details';
// import OrderScreen from './screens/order';
// import SuccessScreen from './screens/success';
// import TestScreen from './screens/test';
import MyEventsScreen from './screens/myevents';
// import MyAdvertScreen from './screens/myadverts';
// import MessagingScreen from './screens/messaging';
// import SubscribeScreen from './screens/payment_subscription';
// import ReceiptScreen from './screens/receipt';
// import EditProductScreen from './screens/edit_product';
import MyTabBar from './components/TopBarTabs';

import HomeScreenTab from './screens/Tabs/home';
import OfferScreenTab from './screens/Tabs/offer';
import EventsScreenTab from './screens/Tabs/events';
import ProfileScreenTab from './screens/Tabs/profile';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator,CardStyleInterpolators} from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'; 
// const Drawer = createDrawerNavigator();

const routeNameRef = React.createRef();
const navigationRef = React.createRef();
const Stack = createStackNavigator();
const TopTabs = createMaterialTopTabNavigator();
var cutRouteName = null;
var ret = null;
const TabScreens = ()=>{
  return  <TopTabs.Navigator
  screenOptions={{
    swipeEnabled:true
  }}
  tabBar={props => <MyTabBar {...props} />}
  >
  <TopTabs.Screen name="Home" component={HomeScreenTab} />
  <TopTabs.Screen name="Offer" component={OfferScreenTab} />
  <TopTabs.Screen name="Events" component={EventsScreenTab} />
  <TopTabs.Screen name="Profile" component={ProfileScreenTab} />
</TopTabs.Navigator>
}

// const DrawerScreens = ()=>{
//   return <Drawer.Navigator
//   drawerContent={(props) => <MenuScreen {...props} />}
//   >
//   <Drawer.Screen name="Home" component={TabScreens} />
// </Drawer.Navigator>
// }

export default AppStack = () =>{
  React.useEffect(()=>{
    BackHandler.addEventListener("hardwareBackPress",()=>{
      cutRouteName = navigationRef.current.getCurrentRoute().name;
      if(cutRouteName == "Dashboard" || cutRouteName == "login" || cutRouteName == "intro_screen")
      {
        Alert.alert("Oops!","Are you sure you want to exit?",[
          {text:"Yes",onPress:()=>{
            BackHandler.exitApp();
          }},
          {text:"No",onPress:()=>{
            
          }}
        ],{style:"cancel"})
        return true;
      }
      // alert(cutRouteName)
    })
  },[ret])
    return<NavigationContainer 
    ref={navigationRef}
    onReady={() => routeNameRef.current = navigationRef.current.getCurrentRoute().name}
    onStateChange={() => {
      const previousRouteName = routeNameRef.current
      const currentRouteName = navigationRef.current.getCurrentRoute().name
      if (previousRouteName !== currentRouteName) {
        // Do something here with it
      }
      // Save the current route name for later comparision
      // routeNameRef.current = currentRouteName
    }}
    >
      <Stack.Navigator
      headerMode="none"
      >
       <Stack.Screen
          name="splash"
          component={FlashScreen}
          options={{
            headerShown: false,
            headerTintColor:'orange',
            headerStyle:{
              backgroundColor:'black'
            },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
          }}
        />
        
        <Stack.Screen
          name="dashboard"
          component={TabScreens}
          options={{
            headerShown: false,
            headerTintColor:'orange',
            headerStyle:{
              backgroundColor:'black'
            },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
          }}
        />
         <Stack.Screen
          name="welcome"
          component={WelcomeScreen}
          options={{
            headerShown:false,
            headerTintColor:'orange',
            headerStyle:{
              backgroundColor:'black'
            },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
          }}
        />
        <Stack.Screen
          name="login"
          component={LoginScreen}
          options={{
            headerShown:false,
            headerTintColor:'orange',
            headerStyle:{
              backgroundColor:'black'
            },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
          }}
        />
         <Stack.Screen
          name="signup_login"
          component={SignupLoginScreen}
          options={{
            headerShown:false,
            headerTintColor:'orange',
            headerStyle:{
              backgroundColor:'black'
            },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
          }}
        />
        <Stack.Screen
          name="view_product"
          component={ProductScreen}
          options={{
            headerShown:false,
            headerTintColor:'orange',
            headerStyle:{
              backgroundColor:'black'
            },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
          }}
        />
        <Stack.Screen
          name="search"
          component={SearchScreen}
          options={{
            headerShown:false,
            headerTintColor:'orange',
            headerStyle:{
              backgroundColor:'black'
            },
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
          }}
        />
        <Stack.Screen
          name="category"
          component={CategoryScreen}
          options={{
            headerShown:false,
            headerTintColor:'orange',
            headerStyle:{
              backgroundColor:'black'
            },
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
          }}
        />
        <Stack.Screen
          name="whatsnew"
          component={WhatsNewScreen}
          options={{
            headerShown:false,
            headerTintColor:'orange',
            headerStyle:{
              backgroundColor:'black'
            },
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
          }}
        />
         <Stack.Screen
          name="notify"
          component={NotificationScreen}
          options={{
            headerShown:false,
            headerTintColor:'orange',
            headerStyle:{
              backgroundColor:'black'
            },
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
          }}
        />
        
        <Stack.Screen
          name="reg2"
          component={RegScreen2}
          options={{
            headerShown:false,
            headerTintColor:'orange',
            headerStyle:{
              backgroundColor:'black'
            },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
          }}
        />
        
        <Stack.Screen
          name="new_service"
          component={NewServiceScreen}
          options={{
            headerShown:false,
            headerTintColor:'orange',
            headerStyle:{
              backgroundColor:'black'
            },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
          }}
        />
          <Stack.Screen
          name="myservices"
          component={MyServicesScreen}
          options={{
            headerShown:false,
            headerTintColor:'orange',
            headerStyle:{
              backgroundColor:'black'
            },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
          }}
        />
        <Stack.Screen
          name="edit_product"
          component={EditService}
          options={{
            headerShown:false,
            headerTintColor:'orange',
            headerStyle:{
              backgroundColor:'black'
            },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
          }}
        />
        
        <Stack.Screen
          name="my_events"
          component={MyEventsScreen}
          options={{
            headerShown:false,
            headerTintColor:'orange',
            headerStyle:{
              backgroundColor:'black'
            },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
          }}
        />
        <Stack.Screen
          name="create_events"
          component={CreateScreen}
          options={{
            headerShown:false,
            headerTintColor:'orange',
            headerStyle:{
              backgroundColor:'black'
            },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
          }}
        />
        
        <Stack.Screen
          name="event_type"
          component={EventTypeScreen}
          options={{
            headerShown:false,
            headerTintColor:'orange',
            headerStyle:{
              backgroundColor:'black'
            },
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
          }}
        />
        </Stack.Navigator>
    </NavigationContainer>}

