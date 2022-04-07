import React, {PureComponent} from 'react';
import {
    Platform,
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
    KeyboardAvoidingView,
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
    import * as EvalEmail from 'email-validator';
  
const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import Loader from '../components/loader';
import Country from '../includes/countries';
const ListCountries = require("../json/country-by-flag");

import { postDATA,PasswordStrength,UniqueID,returnUsername} from '../includes/func';

class RegisterCLass extends PureComponent{
    componentDidMount()
    {
        var code = "";
     if(String(this.props.mobile).includes("+"))  
     {
         if(String(this.props.mobile).length == 14)
         {
         code = String(this.props.mobile).substring(0,4).replace("+","");
         }else if(String(this.props.mobile).length == 15)
         {
          code = String(this.props.mobile).substring(0,5);
         }else if(String(this.props.mobile).length == 16)
         {
         code = String(this.props.mobile).substring(0,6);
         }else{

         }
         var countryData = ListCountries.filter((a,i)=>a.calling_code == code);
        if(countryData.length != 0)
        {
        //  alert(JSON.stringify(countryData[0]));
            this.setState({selectedCountry:countryData[0]});
        }
     }
    //  this.setState({username:String(UniqueID(8)).toUpperCase()});
     this.bkh = Keyboard.addListener("keyboardDidHide",()=>{
        this.setState({kyUp:false});
     })
     this.bkh2 = Keyboard.addListener("keyboardDidShow",()=>{
        this.setState({kyUp:true});
     })
}
    constructor(props)
    {
        super(props);
        this.state = {
            username:"",
            mobile:"",
            showLoader:false,
            isProcessing:true,
            errorInfo:"Please wait...",
            success:false,
            kyUp:false,
            firstname:"",
            lastname:"",
            email:"",
            password:"",
            account_type:"",
            bussines_name:"",
            bussines_address:"",
            bussines_email:"",
            bussines_website:"",
            confirmpassword:"",
            selectedCountry:{
                flag:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUCAIAAAAVyRqTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0RjI4OEFDMTE3ODQxMUUyQTcxNDlDNEFCRkNENzc2NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0RjI4OEFDMjE3ODQxMUUyQTcxNDlDNEFCRkNENzc2NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjRGMjg4QUJGMTc4NDExRTJBNzE0OUM0QUJGQ0Q3NzY2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjRGMjg4QUMwMTc4NDExRTJBNzE0OUM0QUJGQ0Q3NzY2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+qCpo0QAAADBJREFUeNpiZGgPZMAN/leswyPL2BGER5aJgWZg1OhRo0eNHjV61OhRo2lnNECAAQBu1gQALTkVbAAAAABJRU5ErkJggg==",
                name:"Nigeria",calling_code:"+234"},
            province:"",
            showCountryList:false,
            showPass:true,
            defaultValues:{},
            submited:false
        }
    }
 
componentWillUnmount()
{
if(this.bkh)
{
    this.bkh.remove();
}
if(this.bkh2)
{
    this.bkh2.remove();
}
}

render() 
{
 const Actions = this.props.navigation;
const {username,firstname,lastname,email,account_type,showPass,selectedCountry,province,password,confirmpassword} = this.state;
return(<KeyboardAvoidingView 
behavior="padding"
keyboardVerticalOffset={40}
style={[mystyle.window,{backgroundColor:"white"}]} >
<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
 <TouchableOpacity onPress={()=>{
    //  if(this.props.goback != "")
    //  {
    //  alert(this.props.goback);

    //      Actions.replace(this.props.goback);
    //      return ;
    //  }
    //     
    Actions.goBack();
    }} style={[{width:60,height:60,justifyContent:"center",alignItems:"center",position:"absolute",top:0,left:0,zIndex:99}]}>
    <Icon.MaterialIcons color={mystyle.active.color} name="keyboard-arrow-left" size={30} />
    </TouchableOpacity>
<ScrollView 
keyboardShouldPersistTaps="always"
ref={e=>this.SlideView=e}
style={{flex:1,paddingTop:30}} >
<View style={{width:width,minHeight:height,justifyContent:"center",alignItems:"center",flexDirection:"column"}} >
<Text style={{width:"100%",paddingLeft:50,marginTop:30}}>Username</Text>
<View style={[mystyle.regInput,{width:width-90}]}>
<TextInput 
    keyboardType="default"
    placeholder="username"
    onChangeText={(d)=>this.setState({username:String(d).replace(/[^\w\s]/gi, '').replace(/[ ]/gi, '')})}
    value={this.state.username}
    style={{fontSize:16,flex:1,textAlignVertical:"center",textAlign:"center"}}
    />
</View>
<Text style={{width:"100%",paddingLeft:50,marginTop:10}}>Firstname</Text>
<View style={[mystyle.regInput,{width:width-90}]}>
<TextInput 
    keyboardType="default"
    placeholder="First Name"
    onChangeText={(d)=>this.setState({firstname:d})}
    value={this.state.firstname}
    style={{fontSize:16,flex:1,textAlignVertical:"center",textAlign:"center"}}
    />
</View>
<Text style={{width:"100%",paddingLeft:50,marginTop:10}}>Lastname</Text>
<View style={[mystyle.regInput,{width:width-90}]}>
<TextInput 
    keyboardType="default"
    placeholder="Last Name"
    onChangeText={(d)=>this.setState({lastname:d})}
    value={this.state.lastname}
    style={{fontSize:16,flex:1,textAlignVertical:"center",textAlign:"center"}}
    />
</View>
<Text style={{width:"100%",paddingLeft:50,marginTop:10}}>Email</Text>
<View style={[mystyle.regInput,{width:width-90}]}>
<TextInput 
    keyboardType="default"
    autoCapitalize="none"
    placeholder="Email"
    onChangeText={(d)=>this.setState({email:String(d).replace(/[ ]/g,'')})}
    value={this.state.email}
    style={{fontSize:16,flex:1,textAlignVertical:"center",textAlign:"center"}}
    />
</View>
<Text style={{width:"100%",paddingLeft:50,marginTop:10}}>Province</Text>
<View style={[mystyle.regInput,{height:50,width:width-90,flexDirection:"row",borderColor:mystyle.regInput.backgroundColor,borderWidth:1,overflow:"hidden"}]}>
<View style={[{width:70,height:50,backgroundColor:"white",justifyContent:"center",alignItems:"center"}]}>
<Image source={{uri:String(this.state.selectedCountry.flag).includes("data:image/png;base64,")?this.state.selectedCountry.flag:"data:image/png;base64,"+this.state.selectedCountry.flag}} style={{width:25,height:15}} />
</View>
<TextInput 
    keyboardType="default"
    placeholder="State/Province/Region"
    onChangeText={(d)=>this.setState({province:d})}
    value={this.state.province}
    style={{fontSize:16,flex:1,textAlignVertical:"center",textAlign:"center"}}
    />
</View>
<Text style={{width:"100%",paddingLeft:50,marginTop:10}}>Password</Text>
<View style={[mystyle.regInput,{width:width-90}]}>
<TextInput 
    keyboardType="default"
    secureTextEntry={showPass}
    placeholder="Password"
    onChangeText={(d)=>this.setState({password:String(d).replace(/[ ]/g,'')})}
    value={this.state.password}
    style={{fontSize:16,flex:1,textAlignVertical:"center",textAlign:"left",paddingLeft:15}}
    />
     <TouchableOpacity
    onPress={()=>{
        this.setState({showPass:!showPass});
    }}
    style={{position:"absolute",right:0,top:0,padding:15}}>
<Icon.FontAwesome name={showPass?"eye":"eye-slash"} size={20}/>
    </TouchableOpacity>
</View>
<Text style={{width:"100%",paddingLeft:50,marginTop:10}}>Confirm password</Text>
<View style={[mystyle.regInput,{width:width-90}]}>
<TextInput 
    keyboardType="default"
    secureTextEntry={showPass}
    placeholder="Confirm Password"
    onChangeText={(d)=>this.setState({confirmpassword:String(d).replace(/[ ]/g,'')})}
    value={this.state.confirmpassword}
    style={{fontSize:16,flex:1,textAlignVertical:"center",textAlign:"left",paddingLeft:15}}
    />
     <TouchableOpacity
    onPress={()=>{
        this.setState({showPass:!showPass});
    }}
    style={{position:"absolute",right:0,top:0,padding:15}}>
<Icon.FontAwesome name={showPass?"eye":"eye-slash"} size={20}/>
    </TouchableOpacity>
</View>
<Text style={{width:"100%",paddingLeft:50,marginTop:10}}>Mobile</Text>
<View style={[mystyle.regInput,{width:width-90}]}>
<TextInput 
    keyboardType="default"
    autoCapitalize="none"
    editable={false}
    value={this.props.mobile}
    style={{fontSize:16,flex:1,textAlignVertical:"center",textAlign:"center",color:"black"}}
    />
<Icon.Entypo name="block" style={{position:"absolute",right:15,top:15,color:"red"}} />
</View>
<View style={{height:150,width:width-50,alignItems:"center"}}>
    <TouchableOpacity onPress={()=>{
    if(username == "")
    {
    this.setState({submited:false,showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter username, thanks."})
    }else if(firstname == "")
      {
      this.setState({submited:false,showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter first name, thanks."})
      }else if(lastname == "")
      {
      this.setState({submited:false,showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter last name, thanks."})
      }else if(email == "")
      {
      this.setState({submited:false,showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter email, thanks."})
      }else if(!EvalEmail.validate(String(email).replace(/[ ]/g,'')))
      {
      this.setState({submited:false,showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter a valid email, thanks."})
      }else if(province == "")
      {
      this.setState({submited:false,showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter state/province, thanks."})
      }else if(selectedCountry.name == "")
       {
       this.setState({submited:false,showLoader:true,isProcessing:false,success:false,errorInfo:"Please select your country, thanks."})
       }else if(province == "")
       {
       this.setState({submited:false,showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter province, thanks."})
       }else if(password == "")
       {
       this.setState({submited:false,showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter password, thanks."})
       }else if(confirmpassword == "")
       {
       this.setState({submited:false,showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter confirm password, thanks."})
       }else if(confirmpassword != password)
       {
       this.setState({submited:false,showLoader:true,isProcessing:false,success:false,errorInfo:"Password not match!, thanks."})
       }else if(!PasswordStrength(confirmpassword))
       {
       this.setState({submited:false,showLoader:true,isProcessing:false,success:false,errorInfo:"Your password must include at least one symbol and be 8 or more characters long."})
       }else{
        AsyncStorage.getItem("fcmToken").then((e)=>{     
       var data = {
                username:String(this.state.username).trim(),
                email:String(this.state.email).toLowerCase().trim(),
                first_name:String(this.state.firstname).trim(),
                last_name:String(this.state.lastname).trim(),
                password:this.state.confirmpassword,
                country:this.state.selectedCountry.name,
                auth_type:"client",
                confirmed:1,
                phone:String(this.props.mobile).trim(),
                fcm:e,
                platform:Platform.OS
            }
        // alert(JSON.stringify(data))
        // return;
        this.setState({submited:false,showLoader:true,isProcessing:true,success:false,errorInfo:"Please wait..."})
        postDATA("user/api_signUp",data).then((res)=>{
        // alert(JSON.stringify(res))
            console.log(res)
            var e = "";
            if(res.errors && e == "")
            {
            for(var x in res.errors)
            {
            e = res.errors[x];
            }
            }
        this.setState({showLoader:!res.status,isProcessing:false,success:res.status,errorInfo:res.status?res.message:e})
        if(res.status)
        {
         Actions.replace("success",{errorInfo:`Thanks you for sigining up in our platform, your registration process was successful and we have sent you an activation link to your email (${data.email})`,success:true,screen_route:"login"})
        }
        })
    })
    }
    }} style={[{width:width-60,height:50,marginTop:10,backgroundColor:mystyle.active.color,justifyContent:"center",alignItems:"center",borderRadius:60,elevation:5}]}>
    <Text style={{color:"white",fontWeight:"bold",fontSize:18}}>{this.state.account_type == "Seller"?"Next":"Register"}</Text>
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
</KeyboardAvoidingView>)
    }
}
RegisterCLass.defaultProps = {
    mobile:"",
    goback:""
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(RegisterCLass);

