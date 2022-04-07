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
import { postDATA,PasswordStrength,getDATA,returnMobile} from '../includes/func';
const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import Loader from '../components/loader';
import Country from '../includes/countries';
import SuccessPage from '../screens/success';
const ListCountries = require("../json/country-by-flag");
import * as Animatable from 'react-native-animatable';
import auth from '@react-native-firebase/auth';

class EditProfileClass extends PureComponent{
    componentDidMount()
    {
        const Actions = this.props.navigation;
        console.log(this.props)
        var code = "";
        if(String(this.props.telephone).includes("+"))  
        {
            if(String(this.props.telephone).length == 12)
            {
            code = String(this.props.telephone).substring(0,2).replace("+","");
            }else if(String(this.props.telephone).length == 13)
            {
             code = String(this.props.telephone).substring(0,3);
            }else if(String(this.props.telephone).length == 14)
            {
             code = String(this.props.telephone).substring(0,4);
            }else if(String(this.props.telephone).length == 15)
            {
             code = String(this.props.telephone).substring(0,5);
            }else if(String(this.props.telephone).length == 16)
            {
            code = String(this.props.telephone).substring(0,6);
            }else{
   
            }
            
            var countryData = ListCountries.filter((a,i)=>a.calling_code == String(code).replace(/[+]/g,''));
            // alert(JSON.stringify(countryData[0]));
           if(countryData.length != 0)
           {
               this.setState({selectedCountry:countryData[0]});
           }
        }else{
            var countryData = ListCountries.filter((a,i)=>a.calling_code == "234");
            // alert(JSON.stringify(countryData[0]));
           if(countryData.length != 0)
           {
               this.setState({selectedCountry:countryData[0]});
           }  
        }
     this.setState({mobile:returnMobile(String(this.props.telephone).replace(code,'')),username:this.props.username},()=>{
    this.props.dispatch({type:"update",value:{editMobile:false}});
     })  
     this.bhk = BackHandler.addEventListener("hardwareBackPress",()=>{
         if(this.state.showVerifyNumber)
         {
             this.setState({showVerifyNumber:false});
             return ;
         }
         Actions.goBack();
         return true;
     }) 
     this.unsubscribe = auth().onAuthStateChanged((user) => {
        console.log(user);
        if (user && this.state.showVerifyNumber) {
            this.setState({showVerifyNumber:true});
    this.props.dispatch({type:"update",value:{editMobile:false}});
            setInterval(()=>{
            this.setState({showVerifyNumber:true,codeRecieved:true});
            },2000)
        }
         })
     }

    constructor(props)
    {
        super(props);
        this.state = {
            username:"",
            mobile:"",
            showLoader:false,
            codeRecieved:false,
            showPass:true,
            isProcessing:true,
            errorInfo:"Please wait...",
            success:false,
            kyUp:false,
            password:"",
            newpassword1:"",
            newpassword2:"",
            selectedCountry:{flag:null,name:""},
            province:"",
            showCountryList:false,
            scrollY:new Animated.Value(0),
            showVerifyNumber:false,
            code1:""
        }
    }
 
componentWillUnmount()
{
if(this.bhk)
{
    this.bhk.remove();
}
}

render() 
{
const {
username,
mobile,
newpassword1,
newpassword2,
codeRecieved,
password} = this.state;
const slideTab = this.state.scrollY.interpolate({
    inputRange: [0,(width)/2],
    outputRange: [0,(width/2)],
    extrapolate: 'clamp',
  });
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
    <Text style={{color:"white",fontSize:18}}>EDIT PROFILE</Text>
</View>
</View>
<View style={{width:width,height:50,flexDirection:"row"}}>
<TouchableOpacity onPress={()=>{
this.scrolV.scrollTo({x:0,y:0,animated:true});

}} style={{flex:1,justifyContent:"center",alignItems:"center"}}>
<Text style={{color:mystyle.active.color}} >Profile</Text>
</TouchableOpacity>
<TouchableOpacity onPress={()=>{
this.scrolV.scrollTo({x:width,y:0,animated:true});
}} style={{flex:1,justifyContent:"center",alignItems:"center"}}>
<Text style={{color:mystyle.active.color}} >Change Password</Text>
</TouchableOpacity>
</View>
<View style={{width:width,height:2}}>
<Animated.View 
style={{transform: [
    { translateX: slideTab },
    ],position:"absolute",top:0,left:0,width:(width/2),height:2,backgroundColor:mystyle.active.color}}>
</Animated.View>
</View>
<ScrollView 
keyboardShouldPersistTaps="always"
ref={e=>this.scrolV=e}
horizontal
pagingEnabled
scrollEnabled={true}
onScroll={Animated.event(
    [{nativeEvent: {contentOffset: {x: this.state.scrollY}}}]
  )}
  scrollEventThrottle={16}
  showsHorizontalScrollIndicator={false}
  showsVerticalScrollIndicator={false}
style={{width:width,height:height-70}} >
<View style={{width:width,height:height-70}} >
<ScrollView
ref={e=>this.scrolV2=e}
onContentSizeChange={()=>{
    if(this.state.kyUp)
    {
        this.scrolV2.scrollToEnd({animated:true})
    }
}}
style={{flex:1}} >
<View style={{width:width,alignItems:"center",flexDirection:"column"}} >
<View style={{justifyContent:"center",paddingLeft:50,width:"100%",paddingTop:50}}>
</View>
{/* <View style={[mystyle.regInput,{width:width-90}]}>
<TextInput 
    keyboardType="default"
    placeholder="username"
   onChangeText={(d)=>this.setState({username:d})}
    value={this.state.username}
    style={{color:"#000",fontSize:18,flex:1,textAlignVertical:"top",textAlign:"center",paddingHorizontal:10}}
    />
    <Icon.Evilicons name="pencil" size={20} style={{color:"green",position:"absolute",right:10,top:15}} />
</View> */}
<View style={[mystyle.regInput,{width:width-90}]}>
<TextInput 
    keyboardType="default"
    placeholder="first name and last name"
    editable={false}
    value={this.props.firstname+" "+this.props.lastname}
    style={{color:"#000",fontSize:18,flex:1,textAlignVertical:"top",textAlign:"center",paddingHorizontal:10}}
    />
    <Icon.Entypo name="block" style={{color:"red",position:"absolute",right:10,top:15}} />
</View>
<View style={[mystyle.regInput,{height:50,width:width-90,flexDirection:"row",borderColor:mystyle.regInput.backgroundColor,borderWidth:1,overflow:"hidden"}]}>
<TouchableOpacity onPress={()=>{
this.setState({showCountryList:true},()=>{
this.props.dispatch({type:"update",value:{editMobile:true}});
});
    }} style={[{width:70,height:50,backgroundColor:"white",justifyContent:"center",alignItems:"center"}]}>
<Image source={{uri:this.state.selectedCountry.flag}} style={{width:25,height:15}} />
<Icon.MaterialIcons name="keyboard-arrow-down" size={15} style={{position:"absolute",top:15,right:5}} />
</TouchableOpacity>
<TextInput 
    keyboardType="phone-pad"
    placeholder="Mobile"
    maxLength={10}
    onChangeText={(d)=>this.setState({mobile:returnMobile(d)},()=>{
    this.props.dispatch({type:"update",value:{editMobile:true}});
    })}
    value={this.state.mobile}
    onFocus={()=>this.setState({kyUp:true})}
    onBlur={()=>this.setState({kyUp:false})}
    style={{color:"#000",fontSize:18,flex:1,textAlignVertical:"top",textAlign:"left",paddingHorizontal:10}}
    />
    <Icon.Evilicons name="pencil" size={20} style={{color:"green",position:"absolute",right:10,top:15}} />
</View>
<View style={[mystyle.regInput,{width:width-90}]}>
<TextInput 
    keyboardType="default"
    placeholder="Email"
    editable={false}
    onChangeText={(d)=>this.setState({email:d})}
    value={this.props.email}
    onFocus={()=>this.setState({kyUp:true})}
    onBlur={()=>this.setState({kyUp:false})}
    style={{color:"#000",fontSize:18,flex:1,textAlignVertical:"top",textAlign:"center",paddingHorizontal:10}}
    />
    <Icon.Entypo name="block" style={{color:"red",position:"absolute",right:10,top:15}} />
</View>
<View style={[mystyle.regInput,{width:width-90}]}>
<TextInput 
    keyboardType="default"
    placeholder="Account Type"
    editable={false}
    value={this.props.typeAuth}
    onFocus={()=>this.setState({kyUp:true})}
    onBlur={()=>this.setState({kyUp:false})}
    style={{color:"#000",fontSize:18,flex:1,textAlignVertical:"top",textAlign:"center",paddingHorizontal:10}}
    />
<Icon.Entypo name="block" style={{color:"red",position:"absolute",right:10,top:15}} />

</View>
<View style={[mystyle.regInput,{width:width-90,flexDirection:"row",alignItems:"center"}]}>
<TouchableOpacity
    onPress={()=>{
        this.setState({showPass:!this.state.showPass});
    }}
    style={{width:40,height:40,justifyContent:"center",alignItems:"center"}}>
<Icon.FontAwesome name={this.state.showPass?"eye":"eye-slash"} size={20}/>
    </TouchableOpacity>
<View style={{flex:1}}>
<TextInput 
    keyboardType="default"
    secureTextEntry={this.state.showPass}
    placeholder="Current Password"
    onChangeText={(d)=>this.setState({password:d})}
    value={this.state.password}
    onFocus={()=>this.setState({kyUp:true})}
    onBlur={()=>this.setState({kyUp:false})}
    style={{width:"100%",fontSize:18,textAlignVertical:"top",textAlign:"left",paddingHorizontal:10}}
    
    />
   </View> 
    <View  style={{width:40,height:40,justifyContent:"center",alignItems:"center"}}>
    <Icon.Evilicons name="pencil" size={20} style={{color:"green"}} />
</View>
</View>
<View style={{width:width,marginTop:20,marginBottom:120,justifyContent:"center",alignItems:"center",flexDirection:"column"}} >
<TouchableOpacity onPress={()=>{
    
    if(username == "")
    {
    this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter username, thanks."})
    }else if(mobile == "")
     {
     this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter mobile, thanks."})
    }else if(mobile.length <= 9)
    {
    this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter a valid mobile, thanks."})
   }else if(this.props.editMobile)
   {
    // alert("+"+this.state.selectedCountry.calling_code+num);
    this.setState({showVerifyNumber:true});
    var m = "+"+String(this.state.selectedCountry.calling_code+this.state.mobile).replace(/[+]/g,'');
    auth().signInWithPhoneNumber(m);
   }else if(password == "")
    {
    this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter password, thanks."})
    }else{
    this.setState({showLoader:true,isProcessing:true,success:false,errorInfo:"Please wait..."})
   var data = {
    username:this.state.username,
    oldUsername:this.props.username,
    name:this.props.firstname+" "+this.props.lastname,
    mobile:this.state.selectedCountry.calling_code+this.state.mobile,
    user_id:parseInt(this.props.id_user),
    password:this.state.password
 };

//  alert(JSON.stringify(data));
//  return ;
postDATA("user/getUserInformationByPassword",{
user_id:parseInt(this.props.id_user),
password:this.state.password,
image:""
}).then((res)=>{
if(!res.status)
{
  this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:res.message})
  return ;  
}
    postDATA("user/api_updateAccount",data).then((res)=>{
    //   alert(JSON.stringify(res));
    this.setState({showLoader:true,isProcessing:false,success:res.status,errorInfo:res.status?"Profile update was successful":res.message})
        if(String(res.success).includes("1"))
        {
            this.props.dispatch({type:"update",value:{
             username:data.username,
             telephone:data.mobile   
            }}) 
           
        }
    })
    })
    }
    }} style={[{width:170,height:50,backgroundColor:mystyle.active.color,justifyContent:"center",alignItems:"center",borderRadius:60,elevation:5}]}>
    <Text style={{color:"white",fontSize:18}} >{this.props.editMobile?"Verify Number":"Update Profile"}</Text>
    </TouchableOpacity>
    {/* <View style={{width:width,marginVertical:20,alignItems:"center",flexDirection:"row",justifyContent:"center"}}>
    <Text style={[{fontSize:16}]}>To delete account,</Text>
<TouchableOpacity onPress={()=>{
    Actions.delete_account({screen_route:""});
}} style={{}}>
<Text style={[{fontSize:16,marginLeft:5,...mystyle.active}]}>tap here</Text>
</TouchableOpacity>
</View>  */}
</View>
{this.state.kyUp?<View style={{height:150,width:width-50}}></View>:null}
</View>
</ScrollView>
</View>
<View style={{width:width,height:height-70,flexDirection:"column"}} >
<ScrollView 
keyboardShouldPersistTaps="always"
ref={e=>this.ScrT=e}
style={{flex:1}}
onContentSizeChange={()=>{
    this.ScrT.scrollToEnd({animated:true});
}}
>
<View style={{paddingTop:20,width:width,height:height-270,flexDirection:"column",justifyContent:"center",alignItems:"center"}} >
<View >
    <Text>Current Password</Text>
</View>
<View style={[mystyle.regInput,{width:width-90,height:50}]}>
<TextInput 
    keyboardType="default"
    secureTextEntry={this.state.showPass}
    placeholder="New Password"
    onChangeText={(d)=>this.setState({password:d})}
    value={this.state.password}
    style={{fontSize:18,width:width-90,textAlignVertical:"top",textAlign:"center",paddingHorizontal:10}}
    />
 <TouchableOpacity
    onPress={()=>{
        this.setState({showPass:!this.state.showPass});
    }}
    style={{position:"absolute",right:0,top:0,padding:15}}>
<Icon.FontAwesome name={this.state.showPass?"eye":"eye-slash"} size={20}/>
    </TouchableOpacity>
</View>
<View >
    <Text>New Password</Text>
</View>
<View style={[mystyle.regInput,{width:width-90,height:50}]}>
<TextInput 
    keyboardType="default"
    secureTextEntry={this.state.showPass}
    placeholder="New Password"
    onChangeText={(d)=>this.setState({newpassword1:d})}
    value={this.state.newpassword1}
    onFocus={()=>this.setState({kyUp:true})}
    onBlur={()=>this.setState({kyUp:false})}
    style={{fontSize:18,width:width-90,textAlignVertical:"top",textAlign:"center",paddingHorizontal:10}}
    />
 <TouchableOpacity
    onPress={()=>{
        this.setState({showPass:!this.state.showPass});
    }}
    style={{position:"absolute",right:0,top:0,padding:15}}>
<Icon.FontAwesome name={this.state.showPass?"eye":"eye-slash"} size={20}/>
    </TouchableOpacity>
</View>
<View >
    <Text>Confirm Password</Text>
</View>
<View style={[mystyle.regInput,{width:width-90,height:50}]}>
<TextInput 
    keyboardType="default"
    secureTextEntry={this.state.showPass}
    placeholder="Confirm Password"
    onChangeText={(d)=>this.setState({newpassword2:d})}
    value={this.state.newpassword2}
    onFocus={()=>this.setState({kyUp:true})}
    onBlur={()=>this.setState({kyUp:false})}
    style={{fontSize:18,width:width-90,textAlignVertical:"top",textAlign:"center",paddingHorizontal:10}}
    />
   <TouchableOpacity
    onPress={()=>{
        this.setState({showPass:!this.state.showPass});
    }}
    style={{position:"absolute",right:0,top:0,padding:15}}>
<Icon.FontAwesome name={this.state.showPass?"eye":"eye-slash"} size={20}/>
    </TouchableOpacity>
</View>
<View style={{width:width,marginTop:30,justifyContent:"center",alignItems:"center",flexDirection:"row"}} >
<TouchableOpacity onPress={()=>{
    if(newpassword1 == "")
    {
    this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter password, thanks."})
    }else if(newpassword2 == "")
    {
    this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter confirm your pasword, thanks."})
    }else if(newpassword1 != newpassword2)
    {
    this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Password not match!, thanks."})
    }else if(!PasswordStrength(newpassword2))
    {
    this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Your password must include at least one symbol and be 8 or more characters long."})
    }else{
    this.setState({showLoader:true,isProcessing:true,success:false,errorInfo:"Please wait..."})
   var data = {
    username:this.state.username,
    current_password:this.state.password,
    new_password:this.state.newpassword2,
    confirm_password:this.state.newpassword2,
    user_id:parseInt(this.props.id_user),
    image:""
 };
console.log(data);
//  alert(JSON.stringify(data));
//  return ;
    postDATA("user/updateAccountPassword",data).then((res)=>{
    //   alert(JSON.stringify(res));
    this.setState({showLoader:true,isProcessing:false,success:String(res.success).includes("1"),errorInfo:String(res.success).includes("1")?"Password update was successful":res.message})
        if(String(res.success).includes("1"))
        {
            this.setState({newpassword1:"",newpassword2:"",password:""})
            this.scrolV.scrollTo({x:0,y:0,animated:true});
            Actions.login();
        }
    })
    }
    }} style={[{width:170,height:50,backgroundColor:mystyle.active.color,justifyContent:"center",alignItems:"center",borderRadius:60,elevation:5}]}>
    <Text style={{color:"white",fontSize:18}} >Update</Text>
    </TouchableOpacity>
</View>
</View>
{this.state.kyUp?<View style={{height:280,width:width-50}}></View>:null}
</ScrollView>
</View>
</ScrollView>
</View>
{this.state.showVerifyNumber?<Animatable.View 
style={{...StyleSheet.absoluteFill,backgroundColor:"white"}}
>
{!codeRecieved?<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
<View style={{width:width,height:70,justifyContent:"center",alignItems:"center",backgroundColor:mystyle.active.color}}>
<TouchableOpacity onPress={()=>{
this.setState({showVerifyNumber:false})
}} style={[{width:60,height:70,justifyContent:"center",alignItems:"center",position:"absolute",top:0,left:0,zIndex:99}]}>
<Icon.MaterialIcons color={"white"} name="keyboard-arrow-left" size={30} />
</TouchableOpacity>
<View >
    <Text style={{color:"white",fontSize:18}}>EDIT PROFILE</Text>
</View>
</View>
<View style={{flex:1,justifyContent:"center",alignItems:"center",flexDirection:"column"}} >

<View style={{width:"80%"}}>
    <Text style={{color:"black",fontSize:18,textAlign:"center"}}>Please wait while we verify your number.</Text>
</View>
<View style={[mystyle.codewrp,{marginTop:15,width:width-90}]}>
        <TextInput 
        maxLength={1} 
        value={this.state.code1} 
        editable={false}
        ref={code=>this.code1 = code}
          keyboardType="phone-pad" 
           placeholder="00-00"
           style={[mystyle.codeInner,{}]} 
           underlineColorAndroid="transparent" />
<ActivityIndicator size="small" style={{position: "absolute",left:20,top:15}} />
  </View>    
<View style={{width:width,marginTop:60,justifyContent:"center",alignItems:"center",flexDirection:"row"}} >
</View>
</View>
</View>:<SuccessPage 
errorInfo={"Mobile number verified successful"}
success={true}
innerPage={true}
returnData={()=>{
    this.setState({showVerifyNumber:false,});
}}
/>}
</Animatable.View>:null}
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

