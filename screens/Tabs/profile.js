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
    DeviceEventEmitter,
    PermissionsAndroid,
    Image,
    Modal, 
    Alert} from 'react-native';
    import { connect } from 'react-redux';
    import mystyle  from '../../includes/mystyle';
  import * as Animatable  from 'react-native-animatable';
const {width,height} = Dimensions.get("window");
import Icon from '../../includes/icons';
import Camera from '../../includes/camera';
import {returnAllNumbers,postDATA,postTEST} from '../../includes/func';
import {Collapse,CollapseBody,CollapseHeader} from 'accordion-collapse-react-native';
import ReturnADS  from '../../components/showADS';


class ProfileCalss extends PureComponent{
  
  getVerify()
  {
    this.setState({loading:true})
    postDATA("verification/getVerificationDetails",{
      user_id:parseInt(this.props.Reducer.id_user)
    }).then((res)=>{
      // alert(JSON.stringify(res))
      console.log("getVerificationDetails:",res);
      if(res?.status)
      {
        if(res?.result != undefined)
        {
       if(res?.result?.verified != undefined)
      {
        this.props.dispatch({type:"update",value:{verifyBusiness:res?.result?.verified,verifiedSetting:res?.result?.verified == "no"}})
      }
      }else{
          this.props.dispatch({type:"update",value:{verifiedSetting:true}});
        }
      }else{
        this.props.dispatch({type:"update",value:{verifiedSetting:true}});

      }
      this.setState({loading:false})
    }) 
  }
    componentDidMount()
    {
      this.getVerify();
      this.getSettings();
        setTimeout(()=>{
          DeviceEventEmitter.emit("ads",{});
         },6000)
         this.setState({subloading:true})
         postDATA("payment/getUserSubscription",{
          user_id:parseInt(this.props.Reducer.id_user),
          image:""
        }).then((res)=>{
          console.log("payment/getUserSubscription:",res)
          this.setState({subloading:false});
          if(res.status)
        {
          try {
            if(res.result[0])
          {
            var x = res.result[0];
            x = {
              _amount:x._amount,
              _duration:x._duration,
              _name:x._name
            }
            console.log("get subscription:",x);
            this.props.dispatch({type:"update",value:x})
          }
          } catch (error) {
            
          }
        }
        })
     }
 getSettings()
 {
  postDATA("payment/getPaymentSettings",{}).then((res)=>{
  if(res.status)
  {
   this.props.dispatch({type:"update",value:res.result})
  }
   })
      }
    constructor(props)
    {
        super(props);
        this.state = {
            showLogin:false,
            showLoader:false,
            isProcessing:false,
            errorTxt:"Please wait...",
            success:false,
            firstname:"Quest",
            showCamera:false,
            isCollapsed:false
        }
        this.getSettings.bind();
    }
 
componentWillUnmount()
{

}

render() 
{
  const {firstname,isCollapsed} = this.state;
  const banner_150 = this.props.Reducer.adsList.filter((a,i)=>String(a.banner_size) == "150")
  const banner_320 = this.props.Reducer.adsList.filter((a,i)=>String(a.banner_size) == "320")
  const banner_350 = this.props.Reducer.adsList.filter((a,i)=>String(a.banner_size) == "350")

 return(<View style={[mystyle.window,{backgroundColor:"white"}]} >
<ScrollView 
keyboardShouldPersistTaps="always"
  nestedScrollEnabled
 ref={e=>this.eventScrol=e}
 onContentSizeChange={()=>{
  //  this.eventScrol.scrollToEnd({animated:true});
 }}
style={{flex:1,backgroundColor:"white"}}>
 <View style={{overflow:"hidden",width:width,flexDirection:"column",paddingBottom:70,overlay:"hidden"}}>
<Image source={require("../../images/back3.png")} style={{width:width,height:300,position:"absolute"}} resizeMode="cover" />
<View style={{paddingVertical:15,width:width,flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
<View style={{width:120,height:120,borderRadius:120,borderColor:"white",borderWidth:3,justifyContent:"center",alignItems:"center"}}>
         <TouchableOpacity
onPress={()=>{
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    {
      'title': 'App Permission',
     'message': `WeDeyNear app needs access to write file.`
    }).then((granted)=>{
   if(granted === "granted"){ 
  this.props.dispatch({type:"update",value:{showCamera:true}});
   }
   })
}}  style={{overflow:"hidden",width:130,height:130,justifyContent:"center",alignItems:"center"}} >
         <View style={{overflow:"hidden",width:100,height:100,borderRadius:100,borderColor:"white",borderWidth:3,justifyContent:"center",alignItems:"center",backgroundColor:"#444"}}>
            <Image source={this.props.Reducer.avatar.uri == null?{uri:this.props.Reducer.placeholder}:this.props.Reducer.avatar}  style={{width:100,height:100}} resizeMode="cover" />
          </View>
    <Icon.Evilicons name="pencil" size={30} style={{color:"white",position:"absolute",right:0,top:0}} />
          </TouchableOpacity>
         </View>
<Text style={{color:"white",fontSize:20,fontWeight:"bold",position:"absolute",left:20,top:10}}>Hello</Text>
<TouchableOpacity
onPress={()=>{
  this.props.navigation.navigate("notify");
}} style={{color:"white",fontSize:30,position:"absolute",right:40,top:15}}>     
        <Icon.Entypo name="chat" style={{color:"white",fontSize:30}} />
        </TouchableOpacity>   
          <Text style={{color:"white",fontSize:20,fontWeight:"bold"}}>{this.props.Reducer.firstname} {this.props.Reducer.lastname}</Text>
         <Animatable.Text animation={this.props.Reducer.telephone == null || this.props.Reducer.telephone == ""?{
           from:{
             transform:[
               {opacity:1}
             ]
           },
           to:{
            transform:[
              {opacity:0}
            ]
          }
         }:null} iterationCount="infinite" useNativeDriver duration={1000} iterationDelay={500} style={{color:this.props.Reducer.telephone == null || this.props.Reducer.telephone == ""?"red":"white"}}>{this.props.Reducer.telephone == null || this.props.Reducer.telephone == ""?"Mobile number not available":"("+this.props.Reducer.country+") "+this.props.Reducer.telephone}</Animatable.Text>
</View>
<View style={{flex:1,paddingBottom:50,flexDirection:"column",backgroundColor:"white",justifyContent:"center",alignItems:"center",padding:20}}>
{String(this.props.Reducer.typeAuth).toLowerCase()  == "vendor"?<View style={{width:width-20,alignItems:"center"}}>
{this.props.Reducer.user_verified == "no"?<View style={[mystyle.myalert,{margin:0}]}>
<Text style={{fontSize:10}}>Your business verification is pending!</Text>
</View>:this.props.Reducer.user_verified == "yes"?<View style={[mystyle.myalert,{margin:0,alignItems:"center",backgroundColor:"#caffdb"}]}>
  <Icon.Feather name="check-circle" style={{paddingHorizontal:10,fontSize:20}} />
<Text style={{fontSize:12}}>Your business is verified!</Text>
</View>:null}</View>:null}
<TouchableOpacity
onPress={()=>{
  this.props.navigation.navigate("whatsnew");
  // this.props.navigation.navigate("register",{mobile:"08000000000"});
}}
style={[mystyle.regInput,{height:40,width:width-40,borderRadius:20,borderBottomLeftRadius:0,borderBottomRightRadius:0,justifyContent:"center",paddingHorizontal:50}]}>
<Icon.FontAwesome name="question" style={{position:"absolute",left:20,top:10}} size={25} />
<Text>What's new</Text>
</TouchableOpacity>
<TouchableOpacity onPress={()=>{
  this.props.navigation.navigate("editprofile");
}} style={[mystyle.regInput,{height:40,width:width-40,borderRadius:20,borderBottomLeftRadius:0,borderBottomRightRadius:0,justifyContent:"center",paddingHorizontal:50}]}>
<Icon.Feather name="user" style={{position:"absolute",left:20,top:10}} size={25} />
<Text>Edit Profile</Text>
</TouchableOpacity>
<Collapse
onToggle={(isCollapsed)=>this.setState({isCollapsed:isCollapsed})}
>
<CollapseHeader
style={[mystyle.regInput,{height:40,width:width-40,borderRadius:20,borderBottomLeftRadius:0,borderBottomRightRadius:0,justifyContent:"center",paddingHorizontal:50}]}>
<Icon.Entypo name="flat-brush" style={{position:"absolute",left:20,top:10}} size={25} />
<Text>{String(this.props.Reducer.typeAuth).toLowerCase() == "client"?"Become a vendor":"My Services"}</Text>
<Icon.MaterialIcons name={isCollapsed?"keyboard-arrow-down":"keyboard-arrow-right"} size={20} style={{position:"absolute",right:20}} />
</CollapseHeader>
<CollapseBody >
{String(this.props.Reducer.typeAuth).toLowerCase() != "vendor"?<View style={{margin:10,padding:10,marginTop:-10,backgroundColor:"#fff3f3",flexDirection:"row"}}>
<View style={{width:20}}>
  <Icon.Ionicons name="ios-information-circle-outline" size={20} />
</View>
<View style={{flexDirection:"column"}}>
  <Text style={{flex:1,fontSize:12}}>Do you know you can also place your business on this platform?</Text>
  <TouchableOpacity 
 onPress={()=>{
  this.props.navigation.navigate("reg2");
 }}
 style={{height:30,marginVertical:10,justifyContent:"center",alignItems:"center",width:150,backgroundColor:mystyle.active.color,borderRadius:40,elevation:3}}>
  <Text style={[mystyle.whitetxt]}>Upgrade to Vendor</Text>
  </TouchableOpacity>
</View>
</View>
:<View style={{margin:10,padding:10,marginTop:-10,backgroundColor:"#fff3f3",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
{parseInt(this.props.Reducer._amount) == 0?<Text style={{fontSize:10}}>You do not have a valid subscription, please subscribe to be able to post any service, thanks.</Text>:null}
<TouchableOpacity 
 onPress={()=>{
  this.props.navigation.navigate("new_service");
 }}
 style={{height:30,marginVertical:10,justifyContent:"center",alignItems:"center",width:200,backgroundColor:mystyle.active.color,borderRadius:40,elevation:3}}>
  <Text style={[mystyle.whitetxt]}>Add new service</Text>
  </TouchableOpacity>
 <TouchableOpacity 
 onPress={()=>{
  this.props.navigation.navigate("myservices",{createvent:false});
 }}
 style={{height:30,marginVertical:10,justifyContent:"center",alignItems:"center",width:200,backgroundColor:mystyle.active.color,borderRadius:40,elevation:3}}>
  <Text style={[mystyle.whitetxt]}>My Service</Text>
  </TouchableOpacity>
</View>}
</CollapseBody>
</Collapse>
{String(this.props.Reducer.typeAuth).toLowerCase() == "client"?<View style={{flexDirection:"column"}}>
<TouchableOpacity  onPress={()=>{
  Alert.alert("Oops!","Upgrade your account from CLIENT to VENDOR, this will give you the opportunity to create campaign, events and Tickets for your business(s).",
    [
      {text: 'Not now', onPress: () => {
      
       }, style: 'cancel'},
   {text: 'Upgrade', onPress: () => {
    this.props.navigation.navigate("reg2");
  }, style: 'cancel'}
     ],
     {cancelable:false})
}} style={[mystyle.regInput,{height:40,width:width-40,borderRadius:20,borderBottomLeftRadius:0,borderBottomRightRadius:0,justifyContent:"center",paddingHorizontal:50}]}>
<Icon.Evilicons name="tag" style={{position:"absolute",left:20,top:10}} size={25} />
<Text>Events / Tickets</Text>
</TouchableOpacity>
</View>:
<Collapse
onToggle={(isCollapsed)=>this.setState({isCollapsed:isCollapsed})}
>
<CollapseHeader
style={[mystyle.regInput,{height:40,width:width-40,borderRadius:20,borderBottomLeftRadius:0,borderBottomRightRadius:0,justifyContent:"center",paddingHorizontal:50}]}>
<Icon.Evilicons name="tag" style={{position:"absolute",left:20,top:10}} size={25} />
<Text>Events / Tickets</Text>
<Icon.MaterialIcons name={isCollapsed?"keyboard-arrow-down":"keyboard-arrow-right"} size={20} style={{position:"absolute",right:20}} />
</CollapseHeader>
<CollapseBody >
<View style={{margin:10,backgroundColor:"#fff3f3",marginTop:-10,padding:10,flexDirection:"column"}}>
<View style={{margin:10,backgroundColor:"#fff3f3",marginTop:-10,padding:10,flexDirection:"column"}}>
<View style={{padding:10,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
<Text style={{fontSize:12}}>Sell your events ticket to targeted audience.</Text>
</View>
<View style={{flexDirection:"column",alignItems:"center",width:"100%"}}>
  <View style={{flexDirection:"column",alignItems:"center",width:"100%"}}>
  <TouchableOpacity 
 onPress={()=>{
  this.props.navigation.navigate("my_events");
 }}
 style={{height:30,marginVertical:10,justifyContent:"center",alignItems:"center",width:230,backgroundColor:mystyle.active.color,borderRadius:40,elevation:3}}>
  <Text style={[mystyle.whitetxt]}>Event</Text>
  </TouchableOpacity>
  <TouchableOpacity 
 onPress={()=>{
  // this.props.navigation.navigate("events");
  this.props.navigation.navigate("myservices",{createvent:true});
 }}
 style={{height:30,marginVertical:10,justifyContent:"center",alignItems:"center",width:230,backgroundColor:mystyle.active.color,borderRadius:40,elevation:3}}>
  <Text style={[mystyle.whitetxt]}>Post new event</Text>
  </TouchableOpacity>
</View>
</View>
</View>
</View>
</CollapseBody>
</Collapse>}<Collapse
onToggle={(isCollapsed)=>this.setState({isCollapsed:isCollapsed})}
>
<CollapseHeader
style={[mystyle.regInput,{height:40,width:width-40,borderRadius:20,borderBottomLeftRadius:0,borderBottomRightRadius:0,justifyContent:"center",paddingHorizontal:50}]}>
<Icon.AntDesign name="notification" style={{position:"absolute",left:20,top:10}} size={25} />
<Text>Adverts</Text>
<Icon.MaterialIcons name={isCollapsed?"keyboard-arrow-down":"keyboard-arrow-right"} size={20} style={{position:"absolute",right:20}} />
</CollapseHeader>
<CollapseBody >
<View style={{margin:10,backgroundColor:"#fff3f3",marginTop:-10,padding:10,flexDirection:"column"}}>
<View style={{padding:10,flexDirection:"row",alignItems:"center",justifyContent:"center",width:"100%"}}>
<Text style={{fontSize:12}}>Reach out to more customers for your business or services.</Text>
</View>
<View style={{flexDirection:"column",alignItems:"center",width:"100%"}}>
  <View style={{flexDirection:"column",alignItems:"center",width:"100%"}}>
  <TouchableOpacity 
 onPress={()=>{
  if(this.props.Reducer.typeAuth == "client")
  {
     Alert.alert("Oops!","Upgrade your account from CLIENT to VENDOR, this will give you the opportunity to create campaign, events and Tickets for your business(s).",
    [
      {text: 'Not now', onPress: () => {
      
       }, style: 'cancel'},
   {text: 'Upgrade', onPress: () => {
    this.props.navigation.navigate("reg2");
  }, style: 'cancel'}
     ],
     {cancelable:false})
     return ;
  }
  this.props.navigation.navigate("myadverts");
 }}
 style={{height:30,marginVertical:10,justifyContent:"center",alignItems:"center",width:230,backgroundColor:mystyle.active.color,borderRadius:40,elevation:3}}>
  <Text style={[mystyle.whitetxt]}>Advert</Text>
  </TouchableOpacity>
  <TouchableOpacity 
 onPress={()=>{
  if(this.props.Reducer.typeAuth == "client")
  {
     Alert.alert("Oops!","Upgrade your account from CLIENT to VENDOR, this will give you the opportunity to create campaign, events and Tickets for your business(s).",
    [
      {text: 'Not now', onPress: () => {
      
       }, style: 'cancel'},
   {text: 'Upgrade', onPress: () => {
    this.props.navigation.navigate("reg2");
  }, style: 'cancel'}
     ],
     {cancelable:false})
     return ;
  }
  this.props.navigation.navigate("myservices",{createadvert:true});
 }}
 style={{height:30,marginVertical:10,justifyContent:"center",alignItems:"center",width:230,backgroundColor:mystyle.active.color,borderRadius:40,elevation:3}}>
  <Text style={[mystyle.whitetxt]}>Create new Advert</Text>
  </TouchableOpacity>
</View>
</View>
</View>
</CollapseBody>
</Collapse>

<TouchableOpacity  onPress={()=>{
  this.props.navigation.navigate("history");
}} style={[mystyle.regInput,{height:40,width:width-40,borderRadius:20,borderBottomLeftRadius:0,borderBottomRightRadius:0,justifyContent:"center",paddingHorizontal:50}]}>
<Icon.AntDesign name="barschart" style={{position:"absolute",left:20,top:10}} size={25} />
<Text>Payment History</Text>
</TouchableOpacity>
<TouchableOpacity  onPress={()=>{
  this.props.navigation.navigate("aboutus");
}} style={[mystyle.regInput,{height:40,width:width-40,borderRadius:20,borderBottomLeftRadius:0,borderBottomRightRadius:0,justifyContent:"center",paddingHorizontal:50}]}>
<Icon.Ionicons name="ios-information-circle-outline" style={{position:"absolute",left:20,top:10}} size={25} />
<Text>About Us</Text>
</TouchableOpacity>
<ReturnADS
        list={banner_150}
        size={80}
        />
</View>
</View> 
</ScrollView> 
<Camera />
</View>)
    }
}
ProfileCalss.defaultProps = {
 
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(ProfileCalss);

