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
    import Country from '../includes/countries';
    import auth from '@react-native-firebase/auth';

class EditMobileClass extends PureComponent{
    componentDidMount()
    {
        this.unsubscribe = auth().onAuthStateChanged((user) => {
        console.log("user");
        console.log(user);
        if(user)
        {
        this.setState({showLoader:true,isProcessing:false,success:true,errorInfo:"Mobile number already verified on this platform.",verifiedNum:true})
        }else{
        this.setState({verifiedNum:false})
            if(!this.state.send)
            {
            this.SendverifyCode();
            }
        }
        });
     }
    constructor(props)
    {
        super(props);
        this.state = {
            user:{},
            send:false,
            verifiedNum:false,
            confirmResult:null,
            showLoader:false,
            isProcessing:true,
            errorInfo:"Please wait...",
            success:false,
            kyUp:false,
            vcode:""
        }
    }
 
componentWillUnmount()
{
    if(this.unsubscribe)
    {
        this.unsubscribe();
    }
}
SendverifyCode()
{
    this.setState({showLoader:true,isProcessing:true,success:false})
        auth().signInWithPhoneNumber(this.props.mobile).then((confirmResult)=>{
            this.setState({showLoader:true,send:true,isProcessing:false,success:false,confirmResult:confirmResult,errorInfo:`Verification code sent`})
            console.log(confirmResult);
            // Actions.replace("codeverify",{mobile:m,confirmResult:confirmResult});
        }).catch(error => {
        if(String(error.message).includes("incorrect"))
        {
         error.message = "SMS not sent please enter a invalid mobile number.";
        }
        if(String(error.message).includes("not sent"))
        {
         error.message = "SMS not sent please enter a valid mobile number.";
        }
        this.setState({showLoader:true,send:false,isProcessing:false,success:false,errorInfo:error.message});
        //   alert(error.message)
        // Actions.goBack();
        console.log(error)
      })
}
handleVerifyCode(){
    // Request for OTP verification
    this.setState({showLoader:true,isProcessing:true,success:false,errorInfo:""})
    const {vcode,confirmResult} = this.state;
    if(confirmResult){
    confirmResult.confirm(vcode).then((user) => {
    console.log(user);
    this.setState({showLoader:true,isProcessing:false,success:true,errorInfo:"Mobile number verified.",vcode:""},()=>{
    this.props.dispatch({type:"update",value:{editMobile:false}})  
    })
    }).catch(error => {
    this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:error.message})
    })
    }else{
    this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Invalid verification code, try again."})
    }
    }
render() 
{
const {vcode} = this.state;
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
    <Text style={{color:"white",fontSize:18}}>Mobile number verification</Text>
</View>
</View>
{this.state.verifiedNum?<View  style={{flex:1,padding:20}}>
    <Text>{this.state.errorInfo}</Text>
</View>:<ScrollView 
keyboardShouldPersistTaps="always"style={{flex:1}} >
<View style={{width:width,minHeight:height-250,alignItems:"center",flexDirection:"column",justifyContent:"center"}} >
<View style={{justifyContent:"center",paddingLeft:50,width:"100%",paddingTop:50}}>
<Text style={[{fontSize:16,width:"90%"}]}>Enter code sent to {this.props.mobile}</Text>
</View>
<View style={[mystyle.regInput,{width:width-90}]}>
<TextInput 
    keyboardType="phone-pad"
    placeholder="000000"
    maxLength={6}
    onChangeText={(d)=>this.setState({vcode:d})}
    value={this.state.vcode}
    onFocus={()=>this.setState({kyUp:true})}
    onBlur={()=>this.setState({kyUp:false})}
    style={{fontSize:18,flex:1,textAlignVertical:"top",textAlign:"center",paddingHorizontal:10}}
    />
</View>
<TouchableOpacity onPress={()=>{
        // Actions.reset("signup_login");
    if(vcode == "")
    {
    this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter verification code, thanks."})
    }else{
    this.handleVerifyCode();
    }
    }} style={[{width:170,height:50,backgroundColor:mystyle.active.color,justifyContent:"center",alignItems:"center",borderRadius:60,elevation:5}]}>
    <Text style={{color:"white",fontSize:18}} >Submit</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={()=>{
        // Actions.reset("signup_login");
    this.SendverifyCode();
    }} style={{marginTop:10,height:50,justifyContent:"center",alignItems:"center"}}>
    <Text style={{color:mystyle.active.color,fontSize:12}} >Resend code if not received</Text>
    </TouchableOpacity>   
</View>
{this.state.kyUp?<View style={{height:210,width:width-50}}></View>:null}
</ScrollView>}
</View>
<Country 
{...this.state}
returnData={(d)=>{
this.setState(d);
}} />
<Loader 
{...this.state}
returnData={(d)=>{
    if(this.state.success)
    {
        Actions.goBack();
    }
this.setState(d);
}} />
</View>)
    }
}
EditMobileClass.defaultProps = {
    mobile:""
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(EditMobileClass);

