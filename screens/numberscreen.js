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
    PermissionsAndroid,
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
    import auth from '@react-native-firebase/auth';
const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import Loader from '../components/loader';
import * as Animatable from 'react-native-animatable';
import {returnAllNumbers,returnMobile} from '../includes/func';
import Country from '../includes/countries';
import SmsRetriever from 'react-native-sms-retriever';

class FlashScreenClass extends PureComponent{
  async getNumber()
  {
      try {
          SmsRetriever.requestPhoneNumber().then((phoneNumber)=>{
          console.log(phoneNumber);
          this.setState({phoneNumber:String(phoneNumber).replace("+","")})
        }).catch((e)=>{

        });
        } catch (error) {
          console.log(JSON.stringify(error));
        }
   }
    componentDidMount()
    {
      const Actions = this.props.navigation;
        this.unsubscribe = auth().onAuthStateChanged((user) => {
          console.log(user);
          if (user) {
            auth().signOut().then(() => console.log('User signed out!'));
          //  return;
            // if(user.phoneNumber == null)
            // {
            //   this.setState({
            //     user: null,
            //     message: '',
            //     codeInput: '',
            //     phoneNumber: '',
            //     defaultphoneNumber:"",
            //     confirmResult: null,
            //   });
            //   return ;
            // }
            //     var code = "";
            //     if(String(user.phoneNumber).includes("+"))  
            //     {
            //         if(String(user.phoneNumber).length == 12)
            //         {
            //         code = String(user.phoneNumber).substring(0,2).replace("+","");
            //         }else if(String(user.phoneNumber).length == 13)
            //         {
            //          code = String(user.phoneNumber).substring(0,3);
            //         }else if(String(user.phoneNumber).length == 14)
            //         {
            //          code = String(user.phoneNumber).substring(0,4);
            //         }else if(String(user.phoneNumber).length == 15)
            //         {
            //          code = String(user.phoneNumber).substring(0,5);
            //         }else if(String(user.phoneNumber).length == 16)
            //         {
            //         code = String(user.phoneNumber).substring(0,6);
            //         }else{
           
            //         }
            //         var countryData = ListCountries.filter((a,i)=>a.calling_code == code);
            //         // alert(JSON.stringify(countryData[0]));
            //        if(countryData.length != 0)
            //        {
            //            this.setState({selectedCountry:countryData[0]});
            //        }
            //     }
            //   this.setState({ user: user.toJSON(),
            //     phoneNumber:String(user.phoneNumber).replace("+234",""),
            //     defaultphoneNumber:String(user.phoneNumber).replace(" ","") });
            this.setState({codeRecieved:true},()=>{
              if(this.state.firebaseSend)
              {
            setTimeout(()=>{
              Actions.replace("register",{mobile:user.phoneNumber,country:this.state.selectedCountry});
            },3000)
            }
            })
              } else {
              // User has been signed out, reset the state
              this.setState({
                user: null,
                message: '',
                codeInput: '',
                phoneNumber: '',
                defaultphoneNumber:"",
                confirmResult: null,
              });
            }
        });
        
     }
     validatePhoneNumber = () => {
        var regexp = /^\+[0-9]?()[0-9](\s|\S)(\d[0-9]{8,16})$/
        return regexp.test(String(this.state.selectedCountry.calling_code+this.state.phoneNumber).replace(/[+]/g,''));
      }
      handleSendCode(){
        // Request to send OTP
        const Actions = this.props.navigation;
        this.setState({showLoader:true,isProcessing:true,success:false,errorInfo:"Please wait...."});
        var m = "+"+String(this.state.phoneNumber).replace(/[+]/g,'');
        console.log(m);
          auth().signInWithPhoneNumber(m).then((confirmResult)=>{
            this.setState({firebaseSend:true,showLoader:false,isProcessing:false,success:false,confirmResult,codeInput:""})
            console.log(confirmResult);
            // Actions.replace("codeverify",{mobile:m,confirmResult:confirmResult});
        }).catch(error => {

        this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:error.message.replace("[auth/app-not-authorized] ","").replace("[ App validation failed ]","")});
            //   alert(error.message)
              console.log(error)
            })
      }
      handleVerifyCode(){
        // Request for OTP verification
        const Actions = this.props.navigation;
        this.setState({showLoader:true,isProcessing:true,success:false,errorInfo:""})
        const { codeInput, confirmResult } = this.state;
        if (confirmResult && codeInput.length) {
        confirmResult.confirm(codeInput).then((user) => {
        this.setState({showLoader:false,isProcessing:false,success:false})
        Actions.replace("register",{phoneNumber:String(this.state.selectedCountry.calling_code+this.state.phoneNumber).replace(/[+]/g,''),goback:"numberscreen",country:this.state.selectedCountry});
        }).catch(error => {
        this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:error.message})
        })
        } else {
        this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:'Please enter a 6 digit OTP code.'})
        }
        }
      autoVerify()
      {
      }
    constructor(props)
    {
        super(props);
        this.state = {
            user: null,
            message: '',
            codeInput: '',
            phoneNumber: '',
            defaultphoneNumber: '',
            confirmResult: null,
            showLoader:false,
            isProcessing:true,
            errorInfo:"Please wait...",
            success:false,
            country:"",
            selectedCountry:{
            flag:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUCAIAAAAVyRqTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0RjI4OEFDMTE3ODQxMUUyQTcxNDlDNEFCRkNENzc2NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0RjI4OEFDMjE3ODQxMUUyQTcxNDlDNEFCRkNENzc2NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjRGMjg4QUJGMTc4NDExRTJBNzE0OUM0QUJGQ0Q3NzY2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjRGMjg4QUMwMTc4NDExRTJBNzE0OUM0QUJGQ0Q3NzY2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+qCpo0QAAADBJREFUeNpiZGgPZMAN/leswyPL2BGER5aJgWZg1OhRo0eNHjV61OhRo2lnNECAAQBu1gQALTkVbAAAAABJRU5ErkJggg==",
            name:"Nigeria",calling_code:"234"},
            showCountryList:false,
            firebaseSend:false,
            uid:"",
            codeRecieved:false
        }
        this.unsubscribe = null;
    }
 
componentWillUnmount()
{
if (this.unsubscribe) this.unsubscribe();
}

render() 
{
const {phoneNumber,firebaseSend} = this.state;
const Actions = this.props.navigation;
return(<View style={[mystyle.window,{backgroundColor:"#c4403c"}]} >
 
<Image source={require("../images/back3.png")} style={{width:width,height:height,position:"absolute"}} resizeMode="cover" />
    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
 {!firebaseSend?
 <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
    <TouchableOpacity onPress={()=>{
      this.setState({codeInput:""});
      Actions.goBack();  
    }} style={[{width:60,height:60,justifyContent:"center",alignItems:"center",position:"absolute",top:0,left:0,zIndex:99}]}>
    <Icon.MaterialIcons color="white" name="keyboard-arrow-left" size={30} />
    </TouchableOpacity>
    <View style={{width:width,marginTop:30,justifyContent:"center",alignItems:"center",flexDirection:"row"}} >
</View>
<View style={{padding:10}}>
    <Text style={{color:"white"}}>{this.state.user != null?"Mobile number already verified":`Your country is ${this.state.selectedCountry.name}`}</Text>
</View>
<View style={[mystyle.inputwrp,{width:width-90,height:50,justifyContent:"center"}]}>
{this.state.defaultphoneNumber != "" ?<View style={[{width:70,height:50,backgroundColor:"white",justifyContent:"center",alignItems:"center"}]}>
<Image source={{uri:String(this.state.selectedCountry.flag).includes("data:image/png;base64,")?this.state.selectedCountry.flag:"data:image/png;base64,"+this.state.selectedCountry.flag}} style={{width:25,height:15}} resizeMode="cover"/>
</View>:<TouchableOpacity
onPress={()=>{
  this.setState({showCountryList:true})
}}
style={[{width:80,height:50,backgroundColor:"white",justifyContent:"center",alignItems:"center"}]}>
<Image source={{uri:String(this.state.selectedCountry.flag).includes("data:image/png;base64,")?this.state.selectedCountry.flag:"data:image/png;base64,"+this.state.selectedCountry.flag}} style={{width:25,height:15}} resizeMode="cover"/>
<Icon.SimpleLineIcons name="arrow-down" size={10} color="black"  style={{position:"absolute",right:10}} />
</TouchableOpacity>}
<View style={{height:50,width:2,backgroundColor:"#ccc"}}></View>
<View style={{flex:1,justifyContent:"center"}} >
{this.state.defaultphoneNumber == ""?<TextInput placeholder="2348000000000" 
keyboardType="phone-pad"
maxLength={16}
onChangeText={(d)=>{
  this.setState({phoneNumber:returnAllNumbers(d)})
}}
value={this.state.phoneNumber}
style={{fontSize:18,textAlignVertical:"center",height:45}}
/>:
<Text style={{fontSize:20,paddingLeft:15}}>{this.state.phoneNumber}</Text>}
{this.state.user != null?<Icon.Entypo name="block" style={{position:"absolute",right:15,top:6,color:"red"}} />:null}
</View>
</View>
<View style={{width:width,marginTop:30,justifyContent:"center",alignItems:"center",flexDirection:"row"}} >
<TouchableOpacity onPress={()=>{
        // Actions.reset("signup_login");
        if(this.state.defaultphoneNumber == "")
        {
        if(phoneNumber == "")
       {
       this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter mobile number, thanks."})
       }else if(phoneNumber.length < 11)
       {
        this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter a valid mobile number, thanks."})
       }else{
         if(this.state.user != null)
         {
          Actions.replace("register",{mobile:this.state.user.phoneNumber,goback:"numberscreen",country:this.state.selectedCountry});
         }else{
          this.handleSendCode();
         }
        }
        return ;
        } 
        if(this.state.phoneNumber == String(this.state.defaultphoneNumber).replace("+",""))
        {
            Actions.replace("register",{mobile:this.state.user.phoneNumber,goback:"numberscreen"});
            return true;
        }else{
        this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Oops! sorry your mobile must be the one in this phone, thanks."})
        }
    
    }} style={[{width:70,height:70,backgroundColor:"white",justifyContent:"center",alignItems:"center",borderRadius:60,elevation:5}]}>
    <Icon.MaterialIcons name="keyboard-arrow-right" color={mystyle.active.color} size={30} />
    </TouchableOpacity>
</View>
</View>:<View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"#e53934"}}>
<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
    <TouchableOpacity onPress={()=>{
        this.setState({firebaseSend:false,codeRecieved:false},()=>{
          if(this.state.user != null)
          {
            auth().signOut();
          }
        });
    }} style={[{width:60,height:60,justifyContent:"center",alignItems:"center",position:"absolute",top:0,left:0,zIndex:99}]}>
    <Icon.MaterialIcons color="white" name="keyboard-arrow-left" size={30} />
    </TouchableOpacity>
    <View style={{width:width,marginTop:30,justifyContent:"center",alignItems:"center",flexDirection:"row"}} >
</View>
<View >
<Text style={{color:"white",fontSize:18,marginBottom:20}}>Please wait for verification code</Text>
</View>
{this.state.user == null?<View style={[mystyle.codewrp,{marginTop:15,width:width-90}]}>
        <TextInput 
        maxLength={8} 
        value={this.state.codeInput} 
        editable={this.state.codeRecieved}
        onChangeText={(text)=>{
        this.setState({codeInput:returnAllNumbers(text)})
        }}
      keyboardType="phone-pad" 
      placeholder="000000"
      style={[mystyle.codeInner,{}]} 
 underlineColorAndroid="transparent" />
{this.state.codeRecieved?<ActivityIndicator size="small" style={{position:"absolute",left:20,top:15}} />:null}
</View>:<View style={{width:"100%",padding:20,backgroundColor:"rgba(255,255,255,0.5)"}}>
<Text style={{color:"white",textAlign:"center"}}>
  Mobile number verification successful tap the button below to continue.
</Text>
</View>} 
<View style={{width:width,marginTop:60,justifyContent:"center",alignItems:"center",flexDirection:"row"}} >
<TouchableOpacity 
disabled={this.state.codeRecieved}
onPress={()=>{
  if(this.state.codeRecieved){
ToastAndroid.show("Please wait...",ToastAndroid.LONG);
  }else{
  if(this.state.user != null)
  {
   Actions.replace("register",{mobile:this.state.user.phoneNumber,goback:"numberscreen"});
  }else{
        if(this.state.codeInput == "")
       {
       this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter verification code, thanks."})
       }else{
       
          this.handleVerifyCode();
         }
      }
    }
    }} style={[{width:70,height:70,backgroundColor:"white",justifyContent:"center",alignItems:"center",borderRadius:60,elevation:5}]}>
    <Icon.MaterialIcons name="keyboard-arrow-right" color={mystyle.active.color} size={30} />
    </TouchableOpacity>
</View>
</View>
 </View>}
</View>
<Country {...this.state}
returnData={(d)=>{
this.setState(d);
}}/>
<Loader 
{...this.state}
returnData={(d)=>{
this.setState(d);
}}
    />
    <Animatable.View animation="slideOutDown" 
  duration={500}
  onAnimationEnd={()=>{
    this.getNumber();
  }}
  >

  </Animatable.View>
</View>)
    }
}
FlashScreenClass.defaultProps = {
    goback:""
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(FlashScreenClass);

