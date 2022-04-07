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
    TextInput,
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
    Modal } from 'react-native';
    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';

const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import Loader from '../components/loader';
import * as Animatable from 'react-native-animatable';
import Country from '../includes/countries';
import { postDATA,PasswordStrength,getDATA} from '../includes/func';

class EditProfileClass extends PureComponent{
    componentDidMount()
    {
        
     }
    constructor(props)
    {
        super(props);
        this.state = {
            showLoader:false,
            isProcessing:true,
            errorInfo:"Please wait...",
            success:false,
            kyUp:false,
            password:"",
            typeAuth:""
        }
    }
 
componentWillUnmount()
{

}

render() 
{
const {firstname,
lastname,
email,
typeAuth,
password} = this.state;
const Actions = this.props.navigation;
return(<View style={[mystyle.window,{backgroundColor:"white"}]} >
<View style={{flex:1,justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
<View style={{width:width,height:70,justifyContent:"center",alignItems:"center",backgroundColor:mystyle.active.color}}>
<TouchableOpacity onPress={()=>{
Actions.goBack();
}} style={[{width:60,height:70,justifyContent:"center",alignItems:"center",position:"absolute",top:0,left:0,zIndex:99}]}>
<Icon.MaterialIcons color={"white"} name="keyboard-arrow-left" size={30} />
</TouchableOpacity>
<View >
    <Text style={{color:"white",fontSize:18}}>Delete Account</Text>
</View>
</View>
<ScrollView 
keyboardShouldPersistTaps="always"style={{flex:1}} >
<View style={{width:width,minHeight:height,alignItems:"center",flexDirection:"column"}} >
<View style={{justifyContent:"center",paddingLeft:50,width:"100%",paddingTop:50}}>
</View>
<View style={{flexDirection:"row",paddingVertical:10,marginTop:20,width:width-60}}>
<Text style={[{fontSize:18,textAlign:"center"}]}>Are you sure you want to delete your account?</Text>
</View>
<View style={[mystyle.regInput,{width:width-90}]}>
<TextInput 
    keyboardType="default"
    secureTextEntry
    placeholder="Current Password"
    onChangeText={(d)=>this.setState({password:d})}
    value={this.state.password}
    onFocus={()=>this.setState({kyUp:true})}
    onBlur={()=>this.setState({kyUp:false})}
    style={{fontSize:18,flex:1,textAlignVertical:"top",textAlign:"center",paddingHorizontal:10}}
    />
    <Icon.Evilicons name="pencil" size={20} style={{color:"green",position:"absolute",right:10,top:15}} />

</View>


<View style={{width:width,marginTop:30,justifyContent:"center",alignItems:"center",flexDirection:"row"}} >
<TouchableOpacity onPress={()=>{
 this.setState({showLoader:true,isProcessing:true,success:false,errorInfo:"Please wait..."})
 if(password == "")
    {
    this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter your current password, thanks."})
  return ; 
}
 var data = {
  user_id:parseInt(this.props.id_user),
  image:""
};
  postDATA("user/deleteRequest",data).then((res)=>{
  this.setState({showLoader:true,isProcessing:false,success:res.status,errorInfo:res.message})
 if(res.status)
 {
    Actions.reset("login");
 }
})
  
    }} style={[{width:70,height:40,backgroundColor:mystyle.active.color,justifyContent:"center",alignItems:"center",borderRadius:15,elevation:5}]}>
    <Text style={{color:"white",fontSize:18}} >Yes</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={()=>{
   Actions.replace("editprofile");
    }} style={[{marginLeft:15,width:70,height:40,backgroundColor:mystyle.inputwrp.backgroundColor,justifyContent:"center",alignItems:"center",borderRadius:15,elevation:5}]}>
    <Text style={{color:"rgba(0,0,0,0.3)",fontSize:18}} >No</Text>
    </TouchableOpacity>
</View>

{this.state.kyUp?<View style={{height:210,width:width-50}}></View>:null}
</View>
</ScrollView>
</View>
<Country 
{...this.state}
returnData={(d)=>{
this.setState(d);
}} />
<Loader 
{...this.state}
returnData={(d)=>{
this.setState(d);
}} />
</View>)
    }
}
EditProfileClass.defaultProps = {
   
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(EditProfileClass);

