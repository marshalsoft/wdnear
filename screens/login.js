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
    TextInput ,
    RefreshControl,
    ScrollView,
    Animated,
    Easing,
    NativeModules,
    Keyboard,
    Image,
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
    Modal } from 'react-native';
    import Icon from '../includes/icons';
    import mystyle from '../includes/mystyle';
    import {postDATA} from '../includes/func';
const {width,height} = Dimensions.get("window");
// import { LoginButton, AccessToken, LoginManager } from 'react-native-fbsdk';
import { connect } from 'react-redux';
import Loader from '../components/loader';
import fbs  from '@react-native-firebase/auth';
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
import {
        GoogleSignin,
        GoogleSigninButton,
        statusCodes,
      } from '@react-native-community/google-signin';

      const Constants = {
        //Dev Parse keys
        TWITTER_COMSUMER_KEY: "qWPj1TXbreMX1SsDvdiQTaF7Y",
        TWITTER_CONSUMER_SECRET: "4t0cRfGWXZvySIa5sS0M38AnT8a8B8hwcX2lZiaStSWStD4B4Z"
      }
const { RNTwitterSignIn } = NativeModules;

class LoginClass extends PureComponent{

createStoreToken(id_user){
  AsyncStorage.getItem("fcmToken").then((e)=>{
    this.db.child(id_user).update({fcmToken:e});
  })
}
    componentDidMount()
    { 
      this.db = firebase.database().ref(`fcmToken`);
      GoogleSignin.configure({
            scopes:['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
            webClientId: '568520040394-0cfhbheglj4gleor8bncfvq4c3m5otli.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
            offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
            // hostedDomain: '', // specifies a hosted domain restriction
            // loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
            forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
            // accountName: '', // [Android] specifies an account name on the device that should be used
            // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
      });  
      this.getSettings();  
     }
     getSettings()
     {
         postDATA("payment/getPaymentSettings",{ }).then((res)=>{
         if(res.status)
         {
           this.props.dispatch({type:"update",value:res.result})
         }
         })
     }
     GoogleSignMe = async () => {
      const { idToken } = await GoogleSignin.signIn();
      console.log("error 1",idToken);
        try {
          await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true }).then((e)=>{
            console.log(e);
          }).catch((e)=>{
            console.log(e);
          });
          const userInfo = await GoogleSignin.signIn();
          console.log(userInfo.user);
          if(userInfo.user)
          {
            AsyncStorage.getItem("fcmToken").then((e)=>{
      var u = {
            username:String(userInfo.user.email).replace("@gmail.com",'').replace(/[.-_]/g,''),
            email:userInfo.user.email,
            first_name:String(userInfo.user.givenName).replace(/[.]/g,''),
            last_name:userInfo.user.familyName,
            password:String(userInfo.user.givenName).replace(/[.]/g,''),
            country:"Nigeria",
            auth_type:"client",
            phone:"",
            social_sign_up:"yes",
            fcm:e,
            platform:Platform.OS
            }   
            if(userInfo.user.phone)
            {
            u.phone = userInfo.user.phone;
            }
          console.log(u);
          // return ;
          this.setState({showLoader:true,isProcessing:true,success:false,errorInfo:"Please wait..."})
          postDATA("user/api_signUp",u).then((res)=>{
           console.log(res);
          if(res.status)
          {
          this.setState({showLoader:false,isProcessing:false})
            res.result.avatar = {uri:u.avatar};
            res.result.typeAuth = "client";
            res.result.lat = this.props.latitude;
            res.result.lng = this.longitude;
            if(String(res.result.name).includes(" "))
            {
              var nm = String(res.result.name).split(" ");
              res.result.firstname = nm[0];
              res.result.lastname = nm[1] != undefined?nm[1]:"";
            }
          console.log(res.result);
          res.result.fcm = this.props.fcmToken;
          res.result.user_verified = "no";
          
          AsyncStorage.setItem("userid",`${res.result.id_user}`);
          AsyncStorage.setItem("userdata",JSON.stringify(res.result)).then(()=>{
          this.props.dispatch({type:"update",value:res.result});
          this.createStoreToken(res.result.id_user);
          this.getSettings();  
          AsyncStorage.setItem("token",res.result.token);
          this.props.navigation.reset({
            index:0,
            routes:[{name:'dashboard'}],
          })
          })
          }else{
          if(res.message.includes("already existing"))
          {
            AsyncStorage.getItem("fcmToken").then((e)=>{
            var data = {
              login:u.email,
              social_sign_up:"yes",
              fcm:e,
              platform:Platform.OS
            }
              console.log(data);
              postDATA("user/api_signIn",data).then((res)=>{
                console.log(res);
                    if(res.status)
                    {
                    var u = res.result;
                    console.log(u);
                    var uu = String(u.name).split(" ");
                    u.firstname  = uu[0];
                    u.lastname  = uu[1] == undefined?"":uu[1];
                    u.fcm = this.props.fcmToken;
                    delete u.name;
                    console.log(u.token);

                    try{
                      u.avatar = {uri:u.images[0]["100_100"].url};
                    }catch(e)
                    {
                    }
                    console.log(u.typeAuth);
                    AsyncStorage.setItem("userid",`${u.id_user}`);
                    AsyncStorage.setItem("userdata",JSON.stringify(u)).then(()=>{
                    this.props.dispatch({type:"update",value:u});
                    this.getSettings();  
                    this.createStoreToken(u.id_user);
                    AsyncStorage.setItem("token",u.token);
                    this.props.navigation.reset({
                      index:0,
                      routes:[{name:'dashboard'}],
                    })
                    })
                    }else{
                    this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"login or password are not valid"})
                    }
                })
              })
          }else{
            this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:res.message})
          }
          }
          })
        })
          }else{
            alert("Oops something went wrong, try again later.")
          }
        } catch (error) {
          console.log(error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              // user cancelled the login flow
              this.setState({showInnerLoader:true,isProcessing:false,errorInfo:"Oops! login was not successful, please login with email and password, thanks."})
            } else if (error.code === statusCodes.IN_PROGRESS) {
              // operation (e.g. sign in) is in progress already
              this.setState({showInnerLoader:true,isProcessing:false,errorInfo:"Oops! login was not successful, please login with email and password, thanks."})
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // play services not available or outdated
              this.setState({showInnerLoader:true,isProcessing:false,errorInfo:"Oops! login was not successful, please login with email and password, thanks."})
            } else {
              // some other error happened
              this.setState({showInnerLoader:true,isProcessing:false,errorInfo:"Oops! login was not successful, please login with email and password, thanks."})
            }
          }
      }
    
    constructor(props)
    {
        super(props);
        this.state = {
            username:"",//"marshalgfx@gmail.com",
            password:"",//"Mekene$83",
            showLoader:false,
            isProcessing:true,
            errorInfo:"Please wait...",
            success:false,
            showEye:true,
            kyUp:false
        }
     this.GoogleSignMe.bind();
    }
componentWillUnmount()
{

}

render() 
{
const {username,password,showEye} = this.state;
return(<View style={mystyle.window} >
<Image source={require("../images/back4.png")} style={{width:width,height:height,position:"absolute"}} resizeMode="cover" />
<View style={{flex:1,flexDirection:"column",alignItems:"center",justifyContent:"center",backgroundColor:"rgba(255,255,255,0.5)"}}>
<ScrollView 
keyboardShouldPersistTaps="always"
style={{width:width}} >
<View style={{height:60,width:width,flexDirection:"row"}}>
         <TouchableOpacity 
         onPress={()=>{
          this.props.navigation.goBack();
         }}
         style={{width:40,height:60,justifyContent:"center",alignItems:"center"}} >
         </TouchableOpacity>
         <View style={{flex:1,justifyContent:"center",paddingLeft:10}}>
        {/* <Text style={{fontSize:16,color:mystyle.active.color,fontWeight:"bold"}}>User Login</Text> */}
         </View>
         </View>
<View 
style={{width:width,
    justifyContent:"center",
    alignItems:"center",
    flexDirection:"column",height:height-140}} 
    >
<View style={{width:width,flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
<Image source={require("../images/flashcrop.png")} style={{width:150,height:80}} resizeMode="stretch" />
</View>
<View style={[mystyle.regInput,{width:width-90,borderRadius:60,elevation:3,height:50,justifyContent:"center"}]}>
<Icon.AntDesign name="user" size={15} style={{position:"absolute",top:18,left:15}} />
<Text style={{position:"absolute",top:15,left:32}}>/</Text>
<Icon.Evilicons name="envelope" size={20} style={{position:"absolute",top:18,left:40}} />
<TextInput 
    keyboardType="default"
    placeholder="Username or Email..."
    onChangeText={(d)=>this.setState({username:String(d).trim()})}
    value={this.state.username}
    onFocus={()=>this.setState({kyUp:true})}
    onBlur={()=>this.setState({kyUp:false})}
    style={{fontSize:16,flex:1,textAlignVertical:"center",textAlign:"left",marginLeft:60,height:50}}
    />
</View>
<View style={[mystyle.regInput,{width:width-90,borderRadius:60,elevation:3,height:50,justifyContent:"center"}]}>
<Icon.AntDesign name="lock" size={20} style={{position:"absolute",top:13,left:20}} />
<TextInput 
    keyboardType="default"
    placeholder="Password..."
    secureTextEntry={showEye}
    onChangeText={(d)=>this.setState({password:String(d).trim()})}
    value={this.state.password}
    onFocus={()=>this.setState({kyUp:true})}
    onBlur={()=>this.setState({kyUp:false})}
    style={{fontSize:16,flex:1,textAlignVertical:"center",textAlign:"left",marginLeft:60,height:50}}
    />
    <TouchableOpacity
    onPress={()=>{
        this.setState({showEye:!showEye});
    }}
    style={{position:"absolute",right:0,top:0,padding:15}}>
<Icon.FontAwesome name={showEye?"eye":"eye-slash"} size={20}/>
    </TouchableOpacity>
</View>
<TouchableOpacity 
         onPress={()=>{
          this.props.navigation.navigate("forgot_pass");     
         }}
style={{height:20,width:220,alignSelf:"flex-end",justifyContent:"center",alignItems:"center"}} >
<Text style={mystyle.active}>Forgot password?</Text>
</TouchableOpacity>
<TouchableOpacity 
  onPress={()=>{
      if(username == "")
      {
      this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter username, thanks."})
      }else if(password == "")
      {
      this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter password, thanks."})
      }else{
      this.setState({showLoader:true,isProcessing:true,success:false,errorInfo:"Please wait..."})
      AsyncStorage.getItem("fcmToken").then((e)=>{
      var data = {
        login:this.state.username,
        password:this.state.password,
        fcm:e,
        platform:Platform.OS
      }
        console.log(data);
      postDATA("user/api_signIn",data).then((res)=>{
        console.log(res);
        // alert(JSON.stringify(res));
        // return ;
            if(res.status)
            {
            var u = res.result;
            console.log(u);
            var uu = String(u.name).split(" ");
            u.firstname  = uu[0];
            u.lastname  = uu[1] == undefined?"":uu[1];
            u.fcm = this.props.fcmToken;
            delete u.name;
            console.log(u.token);
            try{
              u.avatar = {uri:u.images[0]["100_100"].url};
            }catch(e)
            {
            }
            console.log(u.typeAuth);
            if(String(u.token) == "null")
            {
            this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Oops!,\nWe are having a server issue\nSorry for the inconvenience, please contact customer service or the administrator for immediate resolution. \n\nThanks for your understanding\nWedeynear Team."})
            return ;
            }
            AsyncStorage.setItem("userdata",JSON.stringify(u)).then(()=>{
            this.props.dispatch({type:"update",value:u});
             this.getSettings(); 
             AsyncStorage.setItem("userid",`${u.id_user}`); 
              this.createStoreToken(u.id_user);
              AsyncStorage.setItem("token",`${u.token}`);
              this.props.navigation.reset({
                index:0,
                routes:[{name:'dashboard'}],
              })
            });
            }else{
            this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:res.message})
            }
        })
      })
      }
    }} style={[{width:width-90,height:50,marginTop:10,backgroundColor:mystyle.active.color,justifyContent:"center",alignItems:"center",borderRadius:60,elevation:5}]}>
    <Text style={{color:"white",fontWeight:"bold",fontSize:18}}>Log in</Text>
    </TouchableOpacity>
    <Text style={{paddingVertical:10}}>Or</Text>
<View style={{width:width,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
{/* <TouchableOpacity
 onPress={()=>{
    this.facebookLogin();
   }}
style={[{width:130,marginHorizontal:10,height:50,backgroundColor:"#3b5697",flexDirection:"row",justifyContent:"center",alignItems:"center",borderRadius:60,elevation:5}]}>
<Icon.FontAwesome name="facebook" size={20} style={{marginRight:5,color:"white"}} />
 <Text style={{color:"white",fontWeight:"bold",fontSize:14}}>facebook</Text>
    </TouchableOpacity> */}
    <TouchableOpacity
    onPress={()=>{
     this.GoogleSignMe();
    //  this.loginTwitter();
    }}
style={[{width:width-90,marginHorizontal:10,flexDirection:"row",height:50,backgroundColor:"white",justifyContent:"center",alignItems:"center",borderRadius:60,elevation:5}]}>
<Icon.FontAwesome name="google" size={20} style={{marginRight:5,color:"red"}} />
    <Text style={{color:"black",fontWeight:"bold",fontSize:14}}>Continue with Google</Text>
    </TouchableOpacity>
</View>
<TouchableOpacity onPress={()=>{
    this.props.navigation.navigate("numberscreen",{goback:"login"});
}}  style={[{width:width-90,height:50,marginTop:18,backgroundColor:"white",justifyContent:"center",alignItems:"center",borderRadius:60,elevation:5}]}>
    <Text style={{color:"black",fontWeight:"bold",fontSize:18}}>Sign Up here</Text>
    </TouchableOpacity>
{this.state.kyUp?<View style={{height:210,width:width-50}}></View>:null}
</View>
</ScrollView>
</View>
<Loader 
{...this.state}
returnData={(d)=>{
this.setState(d);
}} />
</View>
)
    }
}
LoginClass.defaultProps = {
  screen_route:""
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(LoginClass);

