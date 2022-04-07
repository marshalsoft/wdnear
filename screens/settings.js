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
    Modal, 
    Alert} from 'react-native';
    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';

const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import Login from '../screens/login';
import * as Animatable from 'react-native-animatable';
import Sound from 'react-native-sound'; 

import {returnAllNumbers,postDATA} from '../includes/func';

class SettingsClass extends PureComponent{
    componentDidMount()
    {
     
     }
    constructor(props)
    {
        super(props);
        this.state = {
        }
    }
 
componentWillUnmount()
{

}

render() 
{
  const Actions = this.props.navigation;
return(<View style={mystyle.window} >
    <View style={{height:60,width:width,backgroundColor:mystyle.active.color,flexDirection:"row"}}>
         <TouchableOpacity 
         onPress={()=>{
           Actions.goBack();
         }}
         style={{width:40,height:60,justifyContent:"center",alignItems:"center"}} >
           <Icon.MaterialIcons name="keyboard-arrow-left"  size={25} color="white" />
         </TouchableOpacity>
         <View style={{flex:1,justifyContent:"center",paddingLeft:10}}>
        <Text style={{fontSize:16,color:"#fff",fontWeight:"bold"}}>Settings</Text>
         </View>
         </View>
 <View style={{width:width,alignItems:"center",padding:10}}>
<View style={{padding:10,backgroundColor:"#f3f3f3",borderRadius:10,borderColor:"#cecece",borderWidth:0.5,flexDirection:"column"}}>
<View style={{width:width-40,flexDirection:"column"}}>
{/* {!this.props.chat?<View style={{width:width-40,flexDirection:"column"}}>
<Text style={{fontSize:14}}>Email notification</Text>
<View style={[{flexDirection:"row",alignItems:"center",height:40,width:width-40,backgroundColor:"#fff",borderRadius:5,borderColor:"#707070",borderWidth:0.5,marginBottom:15}]}>
<View style={{flex:1,paddingHorizontal:10}}>
<Text style={{fontSize:9}}>By switching {this.props.notifications.email?"OFF":"ON"} you {this.props.notifications.email?" will not":" will"} recieve notification by Email.</Text>
</View>
<View style={{width:60}}>
<Switch 
onValueChange={(i)=>{
  Alert.alert("Email notification",`Do you want to switch ${i?"ON":"OFF"} email notification?`,
    [
     {text: 'No', onPress: () => {
     
      }, style: 'cancel'},
  {text: 'Yes', onPress: () => {
this.props.dispatch({type:"update",value:{notifications:{email:i,sms:this.props.notifications.sms}}})
  }, style: 'cancel'}
    ],
    {cancelable:false})
}}
value={this.props.notifications.email}
/>
</View>
</View>
<Text style={{fontSize:14}}>Push notification</Text>
<View style={[{flexDirection:"row",alignItems:"center",height:40,width:width-40,backgroundColor:"#fff",borderRadius:5,borderColor:"#707070",borderWidth:0.5,marginBottom:15}]}>
<View style={{flex:1,paddingHorizontal:10}}>
<Text style={{fontSize:9}}>By switching {this.props.notifications.sms?"OFF":"ON"} you {this.props.notifications.sms?" will not":" will"} recieve Push notification</Text>
</View>
<View style={{width:60}}>
<Switch 
onValueChange={(i)=>{
  Alert.alert("SMS notification",`Do you want to switch ${i?"ON":"OFF"} SMS notification?`,
    [
     {text: 'No', onPress: () => {
     
      }, style: 'cancel'},
  {text: 'Yes', onPress: () => {
postDATA("notification/notificationAgreement",{
  user_id:parseInt(this.props.id_user),
  status:i?1:0,
  image:""
}).then((res)=>{
console.log(res)
if(res.status)
{
this.props.dispatch({type:"update",value:{notifications:{sms:i,email:this.props.notifications.email}}})
}
ToastAndroid.show(res.result,ToastAndroid.LONG);
})
  }, style: 'cancel'}
    ],
    {cancelable:false})
}}
value={this.props.notifications.sms}
/>
</View>
</View>

<Text style={{fontSize:14}}>Impression alert</Text>
<View style={[{flexDirection:"row",alignItems:"center",height:40,width:width-40,backgroundColor:"#fff",borderRadius:5,borderColor:"#707070",borderWidth:0.5,marginBottom:15}]}>
<View style={{flex:1,paddingHorizontal:10}}>
<Text style={{fontSize:9}}>By switching {this.props.notifications_service?"OFF":"ON"} you {this.props.notifications_service?" will not":" will"} recieve notification by for every view on campaign / service(s).</Text>
</View>
<View style={{width:60}}>
<Switch 
onValueChange={(i)=>{
  Alert.alert("Service alert",`Do you want to switch ${i?"ON":"OFF"} service alert?`,
    [
     {text: 'No', onPress: () => {
     
      }, style: 'cancel'},
  {text: 'Yes', onPress: () => {
this.props.dispatch({type:"update",value:{notifications_service:i}})
  }, style: 'cancel'}
    ],
    {cancelable:false})
}}
value={this.props.notifications_service}
/>
</View>
</View> 
</View>:*/}
<View style={{width:width-40,flexDirection:"column"}}>
<Text style={{fontSize:14}}>Play sound</Text>
<View style={[{flexDirection:"row",alignItems:"center",height:40,width:width-40,backgroundColor:"#fff",borderRadius:5,borderColor:"#707070",borderWidth:0.5,marginBottom:15}]}>
<View style={{flex:1,paddingHorizontal:10}}>
<Text style={{fontSize:9}}>By switching {this.props.notifications_sound?"OFF":"ON"} notification / chat sound will {this.props.notifications_sound?"go off":" be ON"}.</Text>
</View>
<View style={{width:60}}>
<Switch 
onValueChange={(i)=>{
  Alert.alert("Sound alert",`Do you want to switch ${i?"ON":"OFF"} sound alert?`,
    [
     {text: 'No', onPress: () => {
     
      }, style: 'cancel'},
  {text: 'Yes', onPress: () => {
this.props.dispatch({type:"update",value:{notifications_sound:i}})
 if(i)
 {
  var sound1 = new Sound(require('../includes/slow.mp3'),
  (error, sound) => {
    if (error) {
      return true; 
    }
    sound1.play(() => {
    sound1.release();
    });
  })
 } 
 AsyncStorage.setItem("alert_sound",i);

}, style: 'cancel'}
    ],
    {cancelable:false})
}}
value={this.props.notifications_sound}
/>
</View>
</View>

{/* <Text style={{fontSize:14}}>Default Billing</Text>
<View style={[{flexDirection:"row",alignItems:"center",height:40,width:width-40,backgroundColor:"#fff",borderRadius:5,borderColor:"#707070",borderWidth:0.5,marginBottom:15}]}>
<View style={{flex:1,paddingHorizontal:10}}>
<Text style={{fontSize:9}}>By turning this ON you will be able to set a billing account.</Text>
</View>
<View style={{width:60}}>
<Switch 
onValueChange={(i)=>{

  Alert.alert("Billing",`Do you want to switch ${i?"ON":"OFF"} your default billing?`,
    [
     {text: 'No', onPress: () => {
       console.log('Cancel Pressed')
      }, style: 'cancel'},
    {text: 'Yes', onPress: () => {
 if(i)
{
  Actions.bank_details({
    settings:true,
    save_payment_endpoint:""     
  });
}
    }, style: 'cancel'}
    ],
    {cancelable:false})
}}
value={this.props.defaultPayment}
/>
</View>
</View> */}
</View>
</View>
</View>
</View>
    </View>)
    }
}
SettingsClass.defaultProps = {
 chat:false
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(SettingsClass);

