import React, {PureComponent} from 'react';
import {Platform,
     StyleSheet,
     Text, 
     View,
     Clipboard,
     SafeAreaView,
     FlatList,
     ToastAndroid,
     TouchableOpacity,
    TextInput ,
    ScrollView,
    Animated,
    Easing,
    Keyboard,
    Picker,
    ActivityIndicator,
    Linking,
    TouchableWithoutFeedback,
    Dimensions,
    DatePickerAndroid,
    BackAndroid,
    WebView,
    Switch,
    AsyncStorage,
    ViewPagerAndroid,
    BackHandler,
    Image,
    PermissionsAndroid,
    Modal } from 'react-native';
    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';
    
const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import * as Animatable from 'react-native-animatable';
import messaging from '@react-native-firebase/messaging';
import Geolocation from '@react-native-community/geolocation';
import {postDATA,getDATA,returnComma,calculateDistance} from '../includes/func';
import firebase from 'firebase'; 
    if(!firebase.apps.length){
      firebase.initializeApp({
        apiKey:"AIzaSyAxk6-y3UFwM0pP1deA_FDtxOjvwqXFmBg",
        authDomain:"wedeynear-dcf63.firebaseapp.com",
        databaseURL:"https://wedeynear-dcf63.firebaseio.com",
        projectId:"wedeynear-dcf63",
        storageBucket:"wedeynear-dcf63.appspot.com",
        messagingSenderId:"568520040394",
        appId:"1:568520040394:web:f1d90e467ba1aaca773933",
        measurementId: "G-9PHHQVN26E"
      });
    } 
class FlashScreenClass extends PureComponent{
   
  componentDidMount()
    {
      // AsyncStorage.clear();
      this.db = firebase.database().ref(`fcmToken`);
      this.getCategory().then((res)=>{
        console.log(res)
      this.props.dispatch({type:"update",value:{categoryList:res}});
      this.getCurrentLocation();
      })
    AsyncStorage.getItem("alert_sound").then((e)=>{
    if(e != null)
    {
      this.props.dispatch({type:"update",value:{notifications_sound:Boolean(e)}})
    }
    });
    }
    constructor(props)
    {
        super(props);
        this.state = {
            switchScreen:false,
            errorInfo:""
        }
    }
    getCategory()
    {
      return new Promise((resolve,reject)=>{
      postDATA("category/getAllCategory",{}).then((res)=>{
      var x = [];
      try {
      if(res.success == 1)
      {
       for(var o in res.result)
       {
         x.push(res.result[o]);
       }
      }
      resolve(x)
    } catch (error) {
      Alert.alert("Oops!","We cannot connect to server, please check your internet and try again.",
      [
        {text: 'Try again', onPress: () => {
          this.getCategory().then(()=>{
            this.getCurrentLocation();
            })
         }, style: 'cancel'},
     {text: 'Cancel', onPress: () => {
     
    }, style: 'cancel'}
       ],
       {cancelable:false})
    }})
  })
    }
    getCurrentLocation()
    { 
      const Actions = this.props.navigation;
      this.setState({switchScreen:false});
      console.log("App Permission");
       PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'App Permission',
         'message': `WeDeyNear app needs access to location.`
        }).then((granted)=>{
       if(granted === "granted"){
        console.log("granted");
        Geolocation.getCurrentPosition((position) => {
        console.log("coords:",position);
      if(position.coords) 
     {
     var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${this.props.Reducer.googleKey}`;
       console.log("url:",url);
     fetch(url).then((res)=>res.json()).then((res)=>{
     console.log(res);
    //  alert(JSON.stringify(res))
     if(res.status == "OK")
     {
     if(position.coords != undefined)
     {
       try {
      position.coords.address = res.results[0].formatted_address;
      position.coords.lat = position.coords.latitude;
      position.coords.long = position.coords.longitude;
      var spl = res.results[0].address_components;
      position.coords.city = spl[spl.length-2].long_name;
      position.coords.country = spl[spl.length-1].long_name;
      }catch (error){
       
      }
     }
     console.log(position.coords);
    this.props.dispatch({type:"update",value:position.coords})
    messaging().getToken().then((fcmToken)=>{
      console.log("gen fcmToken",fcmToken);
      AsyncStorage.setItem("fcmToken",fcmToken);
     AsyncStorage.getItem("userdata").then((u)=>{
          if(u != null)
          {
          u = JSON.parse(u);
          console.log(u.id_user)
          this.db.child(u.id_user).update({fcmToken:fcmToken});
          this.props.dispatch({type:"update",value:u});
          this.props.navigation.reset({
            index:0,
            routes:[{name:'dashboard'}],
          })
          }else{
            this.props.navigation.reset({
              index:0,
              routes:[{name:'welcome'}],
            })
          }
        }); 
    })
    }else{
        this.setState({errorInfo:res.error_message,switchScreen:true})
       }
     }).catch(()=>{
      this.setState({errorInfo:"We cannot detect your location, check your network on and try again",switchScreen:true})
     })
    }else{
      this.setState({errorInfo:"We cannot detect your location, turn your gps on and try again",switchScreen:true})
     }
  },(error) =>{
      this.setState({errorInfo:"We cannot detect your location, ensure that your gps is turned on and try again",switchScreen:true})
      //  this.getCurrentLocation();
    },{ enableHighAccuracy: false, timeout: 20000, distanceFilter: 10 });
  }
   })
  //  Actions.reset("welcome");
   }
componentWillUnmount()
{

}

render() 
{
return(<View style={[mystyle.window,{backgroundColor:"#ff7076"}]} >
{!this.state.switchScreen?<Animatable.View animation="fadeIn" duration={1000} style={[mystyle.window,{position:"absolute",justifyContent:"center",alignItems:"center",backgroundColor:"#ff7076"}]}>
<View  style={{position:"absolute",top:0,left:0,height:height,width:width,zIndex:1,alignItems:"center",justifyContent:"center"}}>
<Animatable.Image
        animation="zoomIn" duration={2000} iterationCount="infinite" source={require('../images/ellipse1.png')} resizeMode="stretch" style={{width:width+60,height:width+60}} />
         </View>
         <View style={{position:"absolute",top:0,left:0,height:height,width:width,zIndex:1,alignItems:"center",justifyContent:"center"}}>
          <Animatable.Image  animation="zoomIn" duration={2500} iterationCount="infinite" source={require('../images/ellipse2.png')} resizeMode="stretch" style={{width:width-20,height:width-20}} useNativeDriver/>
         </View>
         <View style={{position:"absolute",top:0,left:0,height:height,width:width,zIndex:1,alignItems:"center",justifyContent:"center"}}>
          <Animatable.Image animation="zoomIn" duration={3000} iterationCount="infinite" source={require('../images/ellipse3.png')} resizeMode="stretch" style={{width:width-80,height:width-80}} useNativeDriver/>
         </View>

<View 
style={[mystyle.card,{justifyContent:"center",alignItems:"center",width:120,height:120}]}>
    <Image source={require("../images/flashcrop.png")} style={{width:100,height:100}} resizeMode="stretch"/> 
</View>
<Text style={{color:"white",fontSize:16}}>WeDeyNear</Text>
{/* <Text style={{color:"white",fontSize:10,position:"absolute",bottom:40,opacity:0.4}}>Developed by Marshalsoft</Text> */}
</Animatable.View>:<Animatable.View animation="fadeIn" duration={1000} style={[mystyle.window,{position:"absolute",justifyContent:"center",alignItems:"center",backgroundColor:"#ff7076",paddingHorizontal:20}]}>
<Icon.Entypo name="network" size={50} style={{color:"white",marginBottom:10}} />
<Text style={{color:"white",textAlign:"center",fontSize:14}}>{this.state.errorInfo}</Text>
<TouchableOpacity
onPress={()=>{
    this.getCurrentLocation();
}}
style={[mystyle.btn,{backgroundColor:"white",width:150,marginTop:15}]}>
    <Text style={{}}>Try again</Text>
</TouchableOpacity>
</Animatable.View>}
</View>)
    }
}
FlashScreenClass.defaultProps = {
 
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(FlashScreenClass);

