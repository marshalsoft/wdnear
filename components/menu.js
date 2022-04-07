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
    Alert,
    DatePickerAndroid,
    BackAndroid,
    WebView,
    Switch,
    AsyncStorage,
    ViewPagerAndroid,
    BackHandler,
    Image,
    DeviceEventEmitter,
    Modal } from 'react-native';
    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';
import Icon from '../includes/icons';
import Loader from '../components/loader';
import VerifyBusinessView from '../components/business_verification';
class menuScreen  extends PureComponent{
componentDidMount(){
   
}
constructor(props)
{
    super(props);
    this.state = {
        showLoader:false,
        isProcessing:true,
        errorInfo:"Please wait...",
        success:false
    }
}
render()
{
const {address,firstname,lastname,email} = this.props;
const Actions = this.props.navigation;

return(<View style={{backgroundColor:"white",flex:1,flexDirection:"column"}}>
<View style={{backgroundColor:"red",paddingTop:20,minHeight:100,justifyContent:"center",alignItems:"center"}}>
    <View style={{width:80,backgroundColor:"#444",height:80,borderRadius:80,overflow:"hidden",borderColor:"white",borderWidth:3}}>
        <Image source={this.props.avatar.uri == null?require("../images/avatar.png"):this.props.avatar} style={{width:80,backgroundColor:"#444",height:80}} resizeMode="cover" />
    </View>
<Text style={{fontSize:String(this.props.lastname).length > 15?12:16,color:"#fff",fontWeight:"bold",marginBottom:10,paddingHorizontal:10,textAlign:"center"}}>Welcome {this.props.lastname}</Text>
</View>
<ScrollView 
keyboardShouldPersistTaps="always"style={{flex:1}}>
<View style={{flex:1,flexDirection:"column"}}>
<TouchableOpacity 
onPress={()=>{
    Actions.aboutus();
}}
style={{height:60,borderBottomWidth:0.2,flexDirection:"row",alignItems:"center",paddingHorizontal:10}}
>
<Icon.Ionicons name="ios-information-circle-outline" style={{color:"#444",fontSize:15,marginHorizontal:5}} />
<Text style={{fontSize:14,color:"#000"}}>About Us</Text>
</TouchableOpacity> 
<TouchableOpacity 
onPress={()=>{
Actions.settings();
}}
style={{height:60,borderBottomWidth:0.2,flexDirection:"row",alignItems:"center",paddingHorizontal:10}}
>
<Icon.Octicons name="settings" style={{color:"#444",fontSize:15,marginHorizontal:5}} />
<Text style={{fontSize:14,color:"#000"}}>Settings</Text>
</TouchableOpacity>
<TouchableOpacity 
onPress={()=>{
Actions.terms();
}}
style={{height:60,borderBottomWidth:0.2,flexDirection:"row",alignItems:"center",paddingHorizontal:10}}
>
<Icon.Octicons name="book" style={{color:"#444",fontSize:15,marginHorizontal:5}} />
<Text style={{fontSize:14,color:"#000"}}>Terms</Text>
</TouchableOpacity>
<TouchableOpacity 
onPress={()=>{
    Actions.notify();
}}
style={{height:60,borderBottomWidth:0.2,flexDirection:"row",alignItems:"center",paddingHorizontal:5}}
>
<Icon.Evilicons name="bell" style={{color:"#444",fontSize:20,marginHorizontal:5}} />
<Text style={{fontSize:14,color:"#000"}}>Messages</Text>
</TouchableOpacity>
<TouchableOpacity 
onPress={()=>{
// Actions.chat();
Alert.alert("Contact us",`You can reach us by the following mediums below: Mobile Number (${this.props.support_phone}) and Email (support@wedeynear.com)`,
    [
    {text: 'Cancel', onPress: () => {
    //  Actions.drawerClose();
    }},
    {text: 'Call', onPress: () => {
        Linking.openURL("tel:"+this.props.support_phone);
    }},
    {text: 'Email', onPress: () => {
        Linking.openURL("mailto:support@wedeynear.com");
    }}
    ],
    {cancelable:false})  
}}
style={{height:60,borderBottomWidth:0.2,flexDirection:"row",alignItems:"center",paddingHorizontal:5}}
>
<Icon.MaterialIcons name="chat-bubble-outline" style={{color:"#444",fontSize:15,marginHorizontal:5}} />
<Text style={{fontSize:14,color:"#000"}}>Contact us</Text>
</TouchableOpacity>
<VerifyBusinessView 
showBtn={true}
/>
<TouchableOpacity 
onPress={()=>{
Actions.whatsnew();
}}
style={{height:60,borderBottomWidth:0.2,flexDirection:"row",alignItems:"center",paddingHorizontal:5}}
>
<Icon.Entypo name="news" style={{color:"#444",fontSize:15,marginHorizontal:5}} />
<Text style={{fontSize:14,color:"#000"}}>What's new</Text>
</TouchableOpacity>
<TouchableOpacity 
onPress={()=>{
    Alert.alert("Alert",`Are you sure you want to logout?`,
    [
    {text: 'No', onPress: () => {
    //  Actions.drawerClose();
    }, style: 'cancel'},
    {text: 'Yes', onPress: () => {
    AsyncStorage.clear();
    Actions.reset("login");
    }, style: 'cancel'}
    ],
    {cancelable:false})  
}}
style={{height:60,borderBottomWidth:0.2,flexDirection:"row",alignItems:"center",paddingHorizontal:5}}
>
<Icon.AntDesign name="lock" style={{color:"#444",fontSize:20,marginHorizontal:5}} />
<Text style={{fontSize:14,color:"#000"}}>Logout</Text>
</TouchableOpacity>
<TouchableOpacity 
onPress={()=>{
    Alert.alert("Alert",`Are you sure you want to exit the app?`,
    [
    {text: 'No', onPress: () => {
    //  Actions.drawerClose();
    }, style: 'cancel'},
    {text: 'Yes', onPress: () => {
    BackHandler.exitApp();
    }, style: 'cancel'}
    ],
    {cancelable:false})  
}}
style={{height:60,borderBottomWidth:0.2,flexDirection:"row",alignItems:"center",paddingHorizontal:5}}
>
<Icon.AntDesign name="logout" style={{color:"#444",fontSize:15,marginHorizontal:5}} />
<Text style={{fontSize:14,color:"#000"}}>Exit app</Text>
</TouchableOpacity>
{/* <TouchableOpacity 
onPress={()=>{
Actions.paypal({amount:266});
}}
style={{height:60,borderBottomWidth:0.5,flexDirection:"row",alignItems:"center",paddingHorizontal:5}}
>
<Icon.Entypo name="news" style={{color:"#444",fontSize:15,marginHorizontal:5}} />
<Text style={{fontSize:14,color:"#000"}}>PayPal</Text>
</TouchableOpacity> */}
</View>
</ScrollView>
{/* <TouchableOpacity 
onPress={()=>{
Linking.openURL("http://www.marshalsoft.net");
}}
style={{width:"100%",alignItems:"center",justifyContent:"center"}}
>
<Text style={{padding:10,fontSize:10,color:"#ccc"}}>Developed by Marshalsoft</Text>
</TouchableOpacity> */}
{this.state.showVerifyBusiness?<BusinessV
show={this.state.showVerifyBusiness}
/>:null}
<Loader 
{...this.state}
returnData={(d)=>{
this.setState(d);
}} />
</View>);
}
}

menuScreen.defaultProps = {
 
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(menuScreen);