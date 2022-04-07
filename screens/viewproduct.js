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
    BackHandler,
    WebView,
    Switch,
    AsyncStorage,
    ViewPagerAndroid,
    Image,
    Modal, 
    Alert,
    KeyboardAvoidingView,
    PermissionsAndroid,
    DeviceEventEmitter,
    Share} from 'react-native';
    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';

const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import Loader from '../components/loader';
import * as Animatable from 'react-native-animatable';
import Moment  from 'moment';
import {returnAllNumbers,postDATA,returnComma} from '../includes/func';
import firebase from 'firebase'; 
import MultiShare from 'react-native-multi-share';
import ImageViewer from 'react-native-image-zoom-viewer';
if (!firebase.apps.length) {
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
import PushNotification from 'react-native-push-notification';
import FS from 'rn-fetch-blob';
import Ratings from '../components/ratings';
import FileViewer from 'react-native-file-viewer';
import CameraRoll from '@react-native-community/cameraroll';
import {PinchGestureHandler,State} from 'react-native-gesture-handler';
import ReturnADS  from '../components/showADS';
const { config, fs,android,ios } = FS;
class ProductClass extends PureComponent{
    componentDidMount()
    {
      // BackHandler.addEventListener("hardwareBackPress",()=>{
        
      //   return true;
      // })
      AsyncStorage.getItem("new_service").then((d)=>{
        if(d == null)
        {
          AsyncStorage.removeItem("new_service");
          this.props.dispatch({type:"update",value:{new_service_count:0}})
          PushNotification.setApplicationIconBadgeNumber(0);
        }else{
          var ch = JSON.parse(d).filter((a,i)=>i != 0);
          AsyncStorage.setItem("new_service",JSON.stringify(ch));
          this.props.dispatch({type:"update",value:{new_service_count:ch.length}})
          PushNotification.setApplicationIconBadgeNumber(ch.length);
        }
      })
      var data = this.props?.route?.params?.productDetails;
      this.setState(data)
      console.log("data.user:",data);
      // return ;
     this.setState({business_avatar:data.user.map((a,i)=>a.images).filter((a,i)=>i==0).map((a,i)=>a[0]["100_100"].url).join("")})
      AsyncStorage.getItem("likes").then((like)=>{
        console.log("like",like)
        if(like != null)
        {
          var k = JSON.parse(like);
          if(k.filter((a,i)=>String(data.id_store)).length != 0)
          {
            this.setState({showLike:false});
          }
        }
      })
      console.log("view product:");
      console.log("product details:",this.props.route.params.productDetails);
      // var sID = 111;//data.id_store = "111";
      var chd = data.offer?`offer@${String(data.id_offer)}`:`service@${String(data.id_store)}`;
      this.db = firebase.database().ref(chd);
      this.db.on("value",(snapshot)=>{
      var v = snapshot.val();
      // alert(JSON.stringify(v))
      // return ;
            if(snapshot.exists())
            {
            var chats = [];
            for(var m in v)
            {
            var chat = v[m];
            chat.key = m;
            chats.push(chat);
            }
            // alert(JSON.stringify(chats));
            this.setState({messages:chats},()=>{
              this.setState({loading:false})
              })
            }else{
                this.setState({loading:false})
            }
      })
      var path = fs.dirs.DocumentDir + `/product_image${data.id_store}.png`;
      this.setState({imagePath:path});
        AsyncStorage.getItem("fcmToken").then((e)=>{
          this.setState({fcmToken:e});
        })
    this.BackH = BackHandler.addEventListener("hardwareBackPress",()=>{
      if(this.state.showPreview)
      {
        this.setState({showPreview:false})
        return true;
      }
      if(this.state.setIndex == 1)
      {
        this.chatScrol.scrollTo({x:0,y:0,animated:true});
        this.setState({setIndex:0});
        return true;
      }
      this.props.navigation.goBack();
      return true;
    })
    var data = {
      images:"",
      store_id:parseInt(data.id_store)
    }
    console.log("rate:",data);
    postDATA("store/getServiceRate",data).then((res)=>{
      console.log("rate",res);
      if(res.status)
      {
        this.setState({rating:res.result.votes});
      }
    })
      
     }
    async onShare(options) {
      await MultiShare.share(options);
    }
    constructor(props)
    {
        super(props);
        this.state = {
          business_avatar:null,
          showLike:true,
          users_array:[],
          showAds:false,
          showNumber:false,
          showPreview:false,
          showAttachment:false,
          setIndex:0,
          slideIndex:1,
          slideAnim:true,
          searchTXT:"",
          loading:true,
          fcmToken:"",
          rating:0,
          imagePath:null,
          messages:[],
          imageZoom:null,
          zoomImages:[],
          user:[
            {telephone:""}
          ],
          address:"",
          category_name:"",
          date_created:"",
          detail:{},
          id_store:"",
          images:[],
          images_list:[],
          lat:"",
          lng:"",
          opening:"",
          other_images:[],
          product_name:"",
          service_price:"",
          service_price_min:"",
          user_id:"",
          distance_from_me:"",
          percent:"",
          date_end:"",
          telephone:"",
          offer:false
        }
        this.scale = new Animated.Value(1);
        this.onZoomEvent = Animated.event(
          [
            {
              nativeEvent: { scale: this.scale }
            }
          ],
          {
            useNativeDriver: true
          }
        )
    }
    onZoomStateChange = event => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        Animated.spring(this.scale, {
          toValue: 1,
          useNativeDriver: true
        }).start()
      }
    } 
   
componentWillUnmount()
{
  if(this.BackH)
  {
    this.BackH.remove();
  }
  if(this.intv1)
  {
    clearInterval(this.intv1);
  }
  if(this.db)
  {
    this.db.off();
  }
  if(this.db2)
  {
    this.db2.off();
  }
}
writeFile(uri)
{
const { config, fs,android,ios } = FS;
  fs.exists(this.state.imagePath).then((exist) => {
    if(exist)
    {
       FileViewer.open(this.state.imagePath);
    }else{
 PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
   {
     'title': 'App Permission',
    'message': `WeDeyNear app needs access to store file.`
   }).then((granted)=>{
  if(granted === "granted"){ 
 //  console.log(fs);
//  console.log(path);
//  console.log(d.pdf);
 // return ;
 this.setState({showLoader:true})
 config({
  fileCache: true,
  appendExt: 'png',
  path:this.state.imagePath
 }).fetch('GET',uri).then((res)=>{
  CameraRoll.save(res.data, 'photo')
  .then((res) => {
   console.log(res)
  //  console.log(res.path())
  FileViewer.open(res);
 this.setState({showLoader:false})
  })
  .catch(err => {
    Alert.alert(
      'Save remote Image',
      'Failed to save Image: ' + err.message,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  }).finally(() => this.setState({showLoader: false}));
})
.catch(error => {
this.setState({showLoader: false});
Alert.alert(
  'Save remote Image',
  'Failed to save Image: ' + error.message,
  [{text: 'OK', onPress: () => console.log('OK Pressed')}],
  {cancelable: false},
);
});
  // android.actionViewIntent(res.path(),'image/png');
}else{
alert("Access denied");
}
})
    }
  })
}
render() 
{
const {showNumber} = this.state;
  const {
  telephone,
  address,
  category_name,
  date_created,
  detail,
  id_store,
  images,
  images_list,
  lat,
  lng,
  opening,
  other_images,
  product_name,
  service_price,
  service_price_min,
  user,
  user_id,
  distance_from_me,
  percent,
  date_end,
  offer} = this.state;
  const banner_150 = this.props.Reducer.adsList.filter((a,i)=>String(a.banner_size) == "150")
  const banner_320 = this.props.Reducer.adsList.filter((a,i)=>String(a.banner_size) == "320")
  const banner_350 = this.props.Reducer.adsList.filter((a,i)=>String(a.banner_size) == "350")
  const Actions = this.props.navigation;
return (<View style={mystyle.window} >
  <ScrollView
  horizontal
  ref={e=>this.chatScrol=e}
  style={{height:height,width:width}}
  nestedScrollEnabled = {true}
  scrollEnabled={false}
  >
  <View style={{height:height,width:width}}>
    <ScrollView
     nestedScrollEnabled = {true}
     style={{height:height,width:width}}>
    <View style={{width:width,flexDirection:"column",paddingBottom:50}}>
    <View style={{height:60,width:width,flexDirection:"row",position:"absolute",zIndex:99}}>
         <TouchableOpacity 
         onPress={()=>{
           Actions.goBack();
         }}
         style={{width:40,height:60,justifyContent:"center",alignItems:"center"}} >
           <Icon.MaterialIcons name="keyboard-arrow-left"  size={25} color="white" />
         </TouchableOpacity>
         <View style={{flex:1,justifyContent:"center",paddingLeft:10}}>
         </View>
         {/* {Object.keys(this.state.messages).length > 0?<TouchableOpacity 
         onPress={()=>{
          if(String(user[0].id_user) == String(this.props.id_user))
          {
            this.chatScrol.scrollTo({x:width,y:0,animated:true});
            this.setState({setIndex:1})
          }
         }}
         style={{width:40,marginHorizontal:5,height:60,justifyContent:"center",alignItems:"center"}} >
         <Icon.AntDesign name="user"  size={25} color="white" />
           <Animatable.Text
           animation="fadeIn"
           useNativeDriver
iterationCount="infinite"
style={{color:"red",position:"absolute",top:5,right:5}}>{Object.keys(this.state.messages).length}</Animatable.Text>
         </TouchableOpacity>:null} */}
         <TouchableOpacity 
         onPress={()=>{
  const shareOptions = {
  title: 'Hey there buddy!',
  message: `Hey there! I am on "wedeynear". I am sure you will find it useful and it’s FREE!! \n`+images.uri+"\n download the app now \nhttps://play.google.com/store/apps/details?id=com.wedeynear", 
  url:images.uri,
  subject: 'Subject'
};
        Share.share(shareOptions);
        }}
         style={{width:40,marginHorizontal:5,height:60,justifyContent:"center",alignItems:"center"}} >
         <Icon.Entypo name="share"  size={25} color="white" />
         </TouchableOpacity>
         <TouchableOpacity 
         onPress={()=>{
           var data = this.props.route.params.productDetails;
           if(this.state.showLike)
           {
           AsyncStorage.getItem("likes").then((like)=>{
             console.log("like",like)
             if(like == null)
             {
              ToastAndroid.show("I love this service.",ToastAndroid.LONG);
              AsyncStorage.setItem("likes",JSON.stringify([data.id_store]))
              this.setState({showLike:false})
            }else{
               var lk = JSON.parse(like);
               if(lk.filter((a,i)=>data.id_store).length == 0)
               {
              ToastAndroid.show("I love this service.",ToastAndroid.LONG);
              this.setState({showLike:false})
               }else{
               lk = [...lk,data.id_store];
               this.setState({showLike:false})
               }
              AsyncStorage.setItem("likes",JSON.stringify(lk))
             }
           })
          }else{
            ToastAndroid.show("You have already like this service.",ToastAndroid.LONG);
          }
         }}
         style={{width:40,height:60,justifyContent:"center",alignItems:"center"}} >
         <Icon.FontAwesome name="thumbs-o-up"  size={25} color={!this.state.showLike?"red":"white"} />
         </TouchableOpacity>
         </View>
   <View
 style={[{width:width,padding:0,borderRadius:10,alignSelf:"center",flexDirection:"column"}]}>
  <View style={{width:"100%",height:300,backgroundColor:"#444",marginBottom:5}}>
  <Image 
  source={images.uri == null?require("../images/placeholder2.png"):{uri:images_list[0]["560_560"].url}} style={{width:"100%",height:300}} 
  resizeMode="cover" 
  resizeMethod="resize"
  />
  <TouchableOpacity
  activeOpacity={0.1}
  onPress={()=>{
    try{
    var x = images_list[0]["560_560"].url;
    this.setState({showPreview:true,zoomImages:[{url:x}]});
    }catch(e){
      alert("Oops! image note available.")
    }
   }} 
   style={{width:"100%",height:300,backgroundColor:"#444",position:"absolute",top:0,left:0,backgroundColor:"rgba(0,0,0,0.2)"}}>
 </TouchableOpacity>
  <View style={{borderWidth:0,minHeight:70,borderColor:"#ccc",width:width-20,margin:10,position:"absolute",bottom:offer?30:10,justifyContent:"center",flexDirection:"column"}}>
<Text style={{fontSize:14,color:"white",
textShadowColor:"#444",
textShadowOffset:{width:1, height:1},
textShadowRadius:2
}}>Min Price:{"NGN"+returnComma(service_price_min)}{`\nMax Price: NGN`+returnComma(service_price)}</Text>
{offer?<Text style={{fontSize:12,color:"white"}}>{percent+"% discount of (NGN"+returnComma(parseFloat(service_price) - (parseInt(percent)/100)*parseFloat(service_price))})</Text>
:null}
</View>
  <View style={{position:"absolute",bottom:0,left:0,padding:5,flexDirection:"row"}}>
{["","","","",""].filter((a,i)=>i <= this.state.rating).map((a,i)=><Icon.FontAwesome key={i} name="star" color="#fbc004" size={20} />)}
  <Text style={{color:"white",marginHorizontal:2}}>{this.state.rating}</Text>
  </View>
   <TouchableOpacity 
   onPress={()=>{
     Actions.map({
       lt:lat,
       lg:lng,
       maptitle:product_name,
       mapaddress:address,
       mapimage:{uri:images_list[0]["100_100"].url}
     })
   }}
  style={{position:"absolute",bottom:0,right:0,padding:5,alignSelf:"center",backgroundColor:mystyle.active.color,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
  {offer?<Animatable.Text 
  animation={{
    from:{
      transform:[{
        opacity:1
      }]
    },
    to:{
      transform:[{
        opacity:0
      }]
    }
  }} 
  iterationCount="infinite"
  duration={1000}
  userNativeDriver
  style={[mystyle.whitetxt,{marginRight:5}]}>{"Valid till "+Moment(date_end).format("Do, MMM YY hh:mm a")} | </Animatable.Text>:null}
  <Icon.FontAwesome name="map-marker" color="white" style={{marginRight:5}}/>
   <Text style={[mystyle.whitetxt]}>{distance_from_me}m</Text>
   </TouchableOpacity>
  </View>
  <ReturnADS
  list={banner_150}
  size={80}
  />
<View style={{width:width,alignItems:"center",justifyContent:"center"}}>
{other_images.length != 0?<Text style={{fontSize:12,width:"100%",textAlign:"left",paddingLeft:16,marginBottom:5}}>More images ({other_images.filter((a,i)=>i != 0).length})</Text>:null}
{other_images.length != 0?<ScrollView 
keyboardShouldPersistTaps="always"
horizontal
style={{width:width-30,height:70}}
showsHorizontalScrollIndicator={false}
ref={e=>this.adsScroll=e}
>
{other_images.map((a,i,self)=>{
a.id = i;
if(i == 0)
{
  return null;
}
  return <TouchableOpacity 
 activeOpacity={0.5}
onPress={()=>{
  try{
  var x = [{url:a["560_560"].url},...
  other_images.filter((x)=>i != x.id).map((im,i)=>{
    return {url:im["560_560"].url};
  })]

  this.setState({showPreview:true,zoomImages:x});
  }catch(e){
  }
}}
key={i} style={{marginHorizontal:2,width:100,height:60,backgroundColor:"#ccc",marginBottom:10}}>
<Image source={{uri:a["200_200"].url}} style={{width:100,height:60}} resizeMode="cover" />
</TouchableOpacity>

})}
</ScrollView>:null}
</View>
 <View style={{width:"100%",flexDirection:"column",padding:15,paddingVertical:10,alignItems:"center",backgroundColor:"rgba(233,227,227,0.7)"}}>
 <View style={{width:"100%",backgroundColor:"white",width:width-40}}>
 <View style={{overflow:"hidden",width:width-40,marginBottom:10,height:50,backgroundColor:"#ccc",alignItems:"center",justifyContent:"center"}}>
<Image source={require("../images/back3.png")} style={{width:width,height:height,position:"absolute"}} resizeMode="cover" />
 <View style={{width:"100%",paddingVertical:10,height:"100%",alignItems:"center",position:"absolute",backgroundColor:"rgba(255,255,255,0.6)"}}>
 </View>
 <Text style={{fontSize:12}}>{offer?"OFFER":category_name}</Text>
 </View>
 <View style={{width:"100%",paddingHorizontal:15,paddingBottom:15,minHeight:250,justifyContent:"flex-start"}}>
   <Text  style={[mystyle.title,{margin:0}]} >{product_name}</Text>
 <View style={{flex:1,justifyContent:"flex-start",alignItems:"flex-start"}}>
   <Text style={[mystyle.subtitle]}>{JSON.stringify(detail)}</Text>
 </View>
 <View style={{width:"100%",flexDirection:"row",borderTopColor:"#444",borderTopWidth:0.5}}>
 <View style={{padding:5,flex:1,alignItems:"center",flexDirection:"row"}}>
   <Icon.FontAwesome name="map-marker" size={20} />
   <Text style={[mystyle.subtitle,{fontSize:10,marginLeft:5}]}> {String(address)}</Text>
 </View>
 <View style={{padding:5,flex:1,flexDirection:"row"}}>
 <Icon.FontAwesome name="calendar" size={12} />
   <Text style={[mystyle.subtitle,{fontSize:10}]}> Posted: {date_created}</Text>
 </View>
 </View>
 <View style={{width:"100%",flexDirection:"row"}}>
 {user.map((a,i)=>a.telephone).filter((a,i)=>i==0).join("") != ""?<TouchableOpacity
 onPress={()=>{
  //  alert(JSON.stringify(user))
   this.setState({showNumber:!showNumber});
 }} style={{padding:5,flex:1,alignItems:"center",flexDirection:"row"}}>
 <Icon.FontAwesome name="phone" size={15} />
 <Text style={[mystyle.subtitle,{fontSize:10}]}> {showNumber?user.map((a,i)=>a.telephone).filter((a,i)=>i==0).join(""):"Show number"}</Text>
 </TouchableOpacity>:<Text style={{flex:1,color:"red",fontSize:10}}>Mobile contact not available</Text>}
 <View style={{padding:5,flex:1,flexDirection:"row"}}>
 <Icon.MaterialIcons name="timer" size={15} />
 <Text style={[mystyle.subtitle,{fontSize:10}]}>{`opening hrs: 1${opening}`}</Text>
 </View>
 </View>
 </View>
 <View style={{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"center",padding:20}}>
 {String(this.props.Reducer.id_user) != String(user_id)?<Ratings 
returnData={(d)=>{
this.setState(d);
}}
id_store={parseInt(id_store)}
rating={this.state.rating}
/>:null}
</View>
{String(user.map((a,i)=>a.user_verified).filter((a,i)=>i==0).join("")).toLowerCase() != "yes"?<Image source={require("../images/uv.png")} style={{width:70,height:70,position:"absolute",bottom:0,right:0,opacity:0.7,transform:[{
  rotate:"0deg"
}]}} resizeMode="cover" />:<Image source={require("../images/v.png")} style={{width:70,height:70,position:"absolute",bottom:0,right:0,transform:[{
  rotate:"-45deg"
}]}} resizeMode="cover" />}
 </View>
 </View>
 </View>
 <View style={{height:60,width:width,flexDirection:"row",justifyContent:"center",marginTop:10}}>
 {/* <TouchableOpacity 
 onPress={()=>{
  Actions.order();
 }}
 style={{height:40,marginHorizontal:5,justifyContent:"center",alignItems:"center",width:80,backgroundColor:mystyle.active.color,borderRadius:40,elevation:3}}>
  <Text style={[mystyle.whitetxt]}>Order</Text>
  </TouchableOpacity> */}
{String(user_id) != String(this.props.Reducer.id_user) && user.map((a,i)=>a.telephone).join("") != ""?<TouchableOpacity 
 onPress={()=>{
   ToastAndroid.show("Call requested",ToastAndroid.SHORT);
    Linking.openURL("tel:"+user.map((a,i)=>a.telephone).join(""));
 }}
 style={{height:40,marginHorizontal:5,justifyContent:"center",alignItems:"center",width:120,backgroundColor:mystyle.active.color,borderRadius:40,elevation:3}}>
  <Text style={[mystyle.whitetxt]}>Call Now</Text>
  </TouchableOpacity>:null}
  <TouchableOpacity 
  onPress={()=>{
    // console.log("this.props:",this.props);
    // return ;
  if(parseInt(user_id) == parseInt(this.props.Reducer.id_user))
  {
    this.chatScrol.scrollTo({x:width,y:0,animated:true});
    this.setState({setIndex:1});
  }else{
    // store details
    var details = this.props.route.params.productDetails;
    console.log("details:",details);
    var owner = user[0].business_details;
    console.log("owner:",owner);
    var pm = {
        banner:images.uri,
        id_store:parseInt(details.id_store),
        business_name:owner.business_name,
        business_email:owner.business_email,
        business_telephone:details.telephone,
        business_avatar:this.state.business_avatar,
        chatroom:details.offer?`offer_${details.id_offer}_${this.props.Reducer.id_user}`:`service_${details.id_store}_${this.props.Reducer.id_user}`,
        recipient_id:parseInt(owner.user_id),
        recipient_email:owner.business_email,
        offer:details.offer,
        reply:false
      }
  // alert(JSON.stringify(this.props.typeAuth));
  // return ;
  console.log("pam:",pm);
  console.log("pam:",owner);
  // return ;
  Actions.chat_client({chatdata:pm});
  }
 }}
 style={{height:40,marginHorizontal:5,justifyContent:"center",alignItems:"center",width:100,backgroundColor:mystyle.active.color,borderRadius:40,elevation:3}}>
 <Text style={[mystyle.whitetxt]}>{parseInt(this.props.Reducer.user_id) == parseInt(this.props.Reducer.id_user)?"Messages":"Chat"}</Text>
 </TouchableOpacity>
 </View>
 </View>
 </ScrollView> 
 </View> 
 <View style={{flexDirection:"column",width:width,height:height,backgroundColor:"white"}}>
<View style={{height:60,width:width,backgroundColor:mystyle.active.color,flexDirection:"row"}}>
 <TouchableOpacity 
 onPress={()=>{
  this.chatScrol.scrollTo({x:0,y:0,animated:true});
  this.setState({setIndex:0});
  }}
   style={{width:40,height:60,justifyContent:"center",alignItems:"center"}} >
    <Icon.MaterialIcons name="keyboard-arrow-left"  size={25} color="white" />
    </TouchableOpacity>
    <View style={{flex:1,justifyContent:"center",paddingLeft:10}}>
    <Text style={{fontSize:16,color:"#fff",fontWeight:"bold"}}>Messaging</Text>
    </View>
    </View>
  <ScrollView 
keyboardShouldPersistTaps="always"style={{flex:1}} >
   <View style={{flexDirection:"column",width,alignItems:"center",paddingBottom:80}}>
    {this.state.loading?<View style={{padding:5,paddingHorizontal:20,flexDirection:"row",justifyContent:"flex-start",alignItems:"flex-start",width:"100%"}}>
     <ActivityIndicator size="small" color="red" />
     <Text style={{marginLeft:6,fontSize:12}}>Fetching...</Text>
     </View>:null}
    <ChatMsg chats={this.state.messages} props={this.props} />
   </View>
   </ScrollView>
</View> 
</ScrollView> 
<Modal 
onRequestClose={()=>{
  this.setState({showPreview:false}) 
}}
visible={this.state.showPreview} transparent={true}>
 <ImageViewer
 enablePreload={true}
 loadingRender={()=><ActivityIndicator size="small" color={mystyle.active.color} />}
 useNativeDriver={true}
 enableSwipeDown={true}
 enableImageZoom={true}
 onSwipeDown={()=>{
  this.setState({showPreview:false})
 }}
 renderArrowLeft={()=><View style={{backgroundColor:"rgba(0,0,0,0.4)",padding:10}}>
 <Icon.MaterialIcons name="keyboard-arrow-left"  size={25} color="white" />
 </View>}
 renderArrowRight={()=><View style={{backgroundColor:"rgba(0,0,0,0.4)",padding:10}}>
  <Icon.MaterialIcons name="keyboard-arrow-right"  size={25} color="white" />
 </View>}
 renderHeader={()=><View style={{justifyContent:"center",padding:10}}>
   <Text style={{color:"white"}}>Image Preview</Text>
   <Text style={{color:"white",fontSize:10}}>Swipe down to exit</Text>
</View>}
  imageUrls={this.state.zoomImages}/>
 </Modal>
 <Loader 
 {...this.state}
 returnData={(d)=>this.setState(d)}
 />
 </View>)
    }
}

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(ProductClass);

const ChatMsg = ({chats = [],props})=>{
 if(chats.length == 0)
 {
 return <View style={mystyle.myalert}>
   <Text>No chat avaliable</Text>
 </View>
 }else{
var exis = [];
return chats.map((a,i)=>{
if(exis.indexOf(a.nickName) !== -1)
{
  return null;
}
exis.push(a.nickName);
return <TouchableOpacity key={i}
    onPress={()=>{
      //  return;
       const {user,images,id_store} = props.route.params.productDetails;
      //  console.log(user)
      //  alert(JSON.stringify(user[0].business_details));
      // return ;
      var pm = {
        banner:images?.uri,
        id_store:parseInt(id_store),
        business_name:user[0].business_details?.business_name,
        business_email:user[0].business_details?.business_email,
        business_avatar:user[0].business_details?.business_logo,
        business_telephone:user[0].business_details?.telephone,
        chatroom:a.chatroom,
        recipient_id:parseInt(user[0].business_details.user_id),
        recipient_email:user[0].business_details?.business_email,
        recipient_name:a.nickName,
        reply:true
      }
    //  alert(JSON.stringify(chats.map((n,l)=>n.key)))
  Actions.chat_client({chatdata:pm,updatelist:chats.filter((k,l)=>k.nickName == a.nickName).map((n,l)=>n.key)});
    }} style={[{width:width,justifyContent:"center",flexDirection:"row",borderColor:"#444",borderBottomWidth:0.5,padding:10}]}>
    <View 
   style={{width:50,height:50,justifyContent:"center",alignItems:"center",borderRadius:50,borderColor:"#444",backgroundColor:"#444",borderWidth:0.5,marginVertical:5}} >
    <View 
   style={{overflow:"hidden",width:50,height:50,justifyContent:"center",alignItems:"center",borderRadius:50}} >
   <Image source={a.avatar} style={{width:50,height:50}} />
  </View>
   {!a.read?<View style={{position:"absolute",right:0,bottom:0,borderRadius:10,height:10,width:10,backgroundColor:"green"}}></View>:null}
  </View>
  <View 
   style={{flex:1,height:50,justifyContent:"center",marginHorizontal:10}} >
    <Text ellipsizeMode="tail" numberOfLines={1}  style={{color:"black",fontSize:12}}>{a.nickName}</Text>
    <Text ellipsizeMode="tail" numberOfLines={1} style={{color:"black",fontSize:10}}>{a?.content}</Text>
    </View>
    <View 
   style={{height:50,justifyContent:"center",alignItems:"center",paddingRight:10}} >
    <Text style={{color:"black",fontSize:10}}>{Moment(a?.date).fromNow()}</Text>
   </View>
    </TouchableOpacity>})
 }
}

