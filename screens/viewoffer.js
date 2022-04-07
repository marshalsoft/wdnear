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
import FS from 'rn-fetch-blob';
import Ratings from '../components/ratings';
import FileViewer from 'react-native-file-viewer';
import CameraRoll from '@react-native-community/cameraroll';
import {PinchGestureHandler,State} from 'react-native-gesture-handler';
const { config, fs,android,ios } = FS;
class OfferClass extends PureComponent{
    componentDidMount()
    {
      const Actions = this.props.navigation;
      console.log("view product:");
      console.log("product details:",this.props.productDetails);
      var data = this.props.productDetails;
      var chd = `offer@${String(data.id_offer)}`;
      var path = fs.dirs.DocumentDir + `/product_image${data.id_store}.png`;
      this.setState({imagePath:path});
      console.log("firebase:",chd);
      this.db = firebase.database().ref(chd);
    
      this.db.on("value",(snapshot)=>{
      var v = snapshot.val();
            var allmsgs = [];
            if(v != null)
            {
            for(var m in v)
            {
            var d = v[m];
            console.log("chats:",d);
            // var chats = d[mm];
            // console.log("cahts:>",d);
            if(parseInt(d.sender_id) != this.props.id_user)
            {
              try {
                allmsgs[`${d.sender_name.replace(" ","_")}`].push(d)
              } catch (error) {
                allmsgs[`${d.sender_name.replace(" ","_")}`] = [d];
              }
            }
            // for(var mm in d)
            // { 
            // if(chats.sender_id != this.props.id_user)
            // {
            // if(msg[m] == undefined)
            // {
            //   msg[m] = chats;
            //   msg[m].showread = [{show:chats.read,text:chats.text,date:chats.date}];
            // }else{
            //   msg[m].showread.push({show:chats.read,text:chats.text,date:chats.date});
            // }
            }
            }else{
              // this.db.push({
              //   banner:data.images.uri, 
              //   id_store:parseInt(data.id_store),
              //   product_name:data.product_name,
              //   business_name:data.user[0].business_details.business_name,
              //   chatroom:offer?`offer@${data.id_store}_${data.user_id}_${this.props.id_user}`:`service@${data.id_store}_${data.user_id}_${this.props.id_user}`,
              //   sender_id:parseInt(this.props.id_user),
              //   recipient_id:data.user_id,
              //   product_name:data.product_name,
              //   category_name:data.category_name,
              //   store_fcmToken:"",
              //   storeOwner:data.user[0],
              //   room:[parseInt(this.props.id_user),parseInt(data.user_id)],
              //   // senders details
              //   fcmToken:this.state.fcmToken,
              //   send_by:String(this.props.id_user) == String(data.user_id)?this.props.firstname+" "+this.props.lastname:this.props.typeAuth == "client"?this.props.firstname+" "+this.props.lastname:data.user[0].business_details.business_name,
              //   sender_name:this.props.firstname+" "+this.props.lastname,
              //   offer:data.offer,
              //   reply:false
              // })
            }
            // 
        console.log("allmsgs:",allmsgs);
        this.setState({messages:allmsgs},()=>{
        this.setState({loading:false})
        })

      })
     
      console.log("storeOwner:",data.user_id);
        this.db2 = firebase.database().ref(`fcmToken/${data.user_id}`);
        this.db2.on("value",(snapshot)=>{
          var v = snapshot.val();
          // alert(JSON.stringify(v));
          console.log("db fcmToken:",v);
          if(v != null)
          {
          if(v["fcmToken"] != undefined)
          {
            console.log("db2 fcmToken:",v["fcmToken"]);
            this.setState({store_fcmToken:v["fcmToken"]})
          // alert(JSON.stringify(v["fcmToken"]));
          }
          }
        })
        AsyncStorage.getItem("fcmToken").then((e)=>{
          this.setState({fcmToken:e});
        })
    this.BackH = BackHandler.addEventListener("hardwareBackPress",()=>{
      if(this.state.setIndex == 1)
      {
        this.chatScrol.scrollTo({x:0,y:0,animated:true});
        this.setState({setIndex:0});
        return true;
      }
      Actions.goBack();
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
    
   
    setTimeout(()=>{
      DeviceEventEmitter.emit("ads",{});
     },6000)
     }
    constructor(props)
    {
        super(props);
        this.state = {
          users_array:[],
          showNumber:false,
          showPreview:false,
          showAttachment:false,
          setIndex:0,
          slideIndex:1,
          slideAnim:true,
          searchTXT:"",
          loading:true,
          store_fcmToken:"",
          fcmToken:"",
          rating:0,
          imagePath:null,
          messages:[],
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
  category_color,
  category_id,
  category_name,
  city,
  created_at,
  customers,
  date_created,
  detail,
  distance,
  featured,
  gallery,
  id_store,
  images,
  images_list,
  lat,
  latitude,
  link,
  lng,
  longitude,
  nbrOffers,
  nbr_votes,
  opening,
  opening_time_table,
  other_images,
  price,
  product_image,
  product_name,
  service_price,
  service_price_min,
  status,
  tags,
  telephone,
  updated_at,
  user,
  user_id,
  verified,
  percent,
  date_end,
  offer,
  voted,
  votes} = this.props.productDetails;
  const Actions = this.props.navigation;
return(<View style={mystyle.window} >
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
         {this.state.messages.length > 0?<TouchableOpacity 
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
style={{color:"red",position:"absolute",top:5,right:5}}>{this.state.messages.length}</Animatable.Text>
         </TouchableOpacity>:null}
         <TouchableOpacity 
         onPress={()=>{
          Share.share({message:`Hey there! I am on “wedeynear”. I am sure you will find it useful and it’s FREE!! \ndownload the app now \nhttps://play.google.com/store/apps/details?id=com.wedeynear`});
         }}
         style={{width:40,marginHorizontal:5,height:60,justifyContent:"center",alignItems:"center"}} >
         <Icon.Entypo name="share"  size={25} color="white" />
         </TouchableOpacity>
         <TouchableOpacity 
         onPress={()=>{
         }}
         style={{width:40,height:60,justifyContent:"center",alignItems:"center"}} >
         <Icon.FontAwesome name="thumbs-o-up"  size={25} color="white" />
         </TouchableOpacity>
         </View>
   <View
 style={[{width:width,padding:0,borderRadius:10,alignSelf:"center",flexDirection:"column"}]}>
  <View style={{width:"100%",height:300,backgroundColor:"#444",marginBottom:5}}>
  <Image source={images.uri == null?require("../images/placeholder.png"):{uri:images_list[0]["560_560"].url}} style={{width:"100%",height:300}} resizeMode="cover" />
  <TouchableOpacity
  activeOpacity={0.1}
  onPress={()=>{
    // this.setState({showPreview:true});
    var path = fs.dirs.DocumentDir + `/product_image${this.props.id_store}.png`;
    this.setState({imagePath:path},()=>{
      this.writeFile(images_list[0]["200_200"].url);
    });
   }} style={{width:"100%",height:300,backgroundColor:"#444",position:"absolute",top:0,left:0,backgroundColor:"rgba(0,0,0,0.2)"}}>
 </TouchableOpacity>
  <View style={{borderWidth:0,height:70,borderColor:"#ccc",width:width-20,margin:10,position:"absolute",bottom:10,justifyContent:"center",flexDirection:"column"}}>
<Text style={{fontSize:20,color:"white"}}>Min Price:{"NGN"+returnComma(service_price_min)}{`\nMax Price: NGN`+returnComma(service_price)}</Text>
{offer?<Text style={{fontSize:18,color:"white"}}>{percent+"% discount of (NGN"+returnComma(parseFloat(service_price) - (parseInt(percent)/100)*parseFloat(service_price))})</Text>
:null}
</View>
  <View style={{position:"absolute",bottom:0,left:0,padding:5,flexDirection:"row"}}>
{["","","","",""].filter((a,i)=>i <= this.state.rating).map((a,i)=><Icon.FontAwesome key={i} name="star" color="#fbc004" size={20} />)}
  <Text style={{color:"white",marginHorizontal:2}}>{this.state.rating}</Text>
  </View>
  <View style={{position:"absolute",bottom:0,right:0,padding:5,alignSelf:"center",backgroundColor:mystyle.active.color,flexDirection:"row"}}>
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
  <Text style={[mystyle.whitetxt]}>{Math.round(parseInt(distance)/10000)}km</Text>
  </View>
  </View>
  <View style={{width:width-20,margin:10,justifyContent:"center",flexDirection:"row"}}>
<ScrollView 
keyboardShouldPersistTaps="always"
horizontal
style={{width:width-20,height:60}}
showsHorizontalScrollIndicator={false}
pagingEnabled={true}
scrollEnabled={false}
ref={e=>this.adsScroll=e}
>
{this.props.adsList.filter((a,i)=>a.banner_size == "150").map((a,i)=><TouchableOpacity
onPress={()=>{
 
}}
key={i}
style={{width:width-20,height:150,justifyContent:"center",flexDirection:"row",backgroundColor:"white"}}>
<View style={{width:width-20,height:150,justifyContent:"center"}}>
  <Image source={{uri:a.banner_image["100_100"].url}} style={{width:width-20,height:150}} resizeMode="cover" />
</View>
<Text style={{position:"absolute",left:10,top:10,color:"white"}}>Ads</Text>
</TouchableOpacity>)}
</ScrollView>
</View>
<View style={{width:width,alignItems:"center",justifyContent:"center"}}>
{other_images.length != 0?<Text style={{fontSize:16,width:"100%",textAlign:"left",paddingLeft:16,marginBottom:5}}>More images ({other_images.length})</Text>:null}
{other_images.length != 0?<ScrollView 
keyboardShouldPersistTaps="always"
horizontal
style={{width:width-30,height:70}}
showsHorizontalScrollIndicator={false}
ref={e=>this.adsScroll=e}
>
{other_images.map((a,i,self)=><TouchableOpacity 
 activeOpacity={0.5}
onPress={()=>{
  var path = fs.dirs.DocumentDir + `/products_image_${this.props.id_store}_${i}.png`;
  console.log(path);
  console.log(a);
  this.setState({imagePath:path},()=>{
    this.writeFile(a["560_560"].url);
  });
}}
key={i} style={{marginHorizontal:2,width:100,height:60,backgroundColor:"#ccc",marginBottom:10}}>
<Image source={{uri:a["200_200"].url}} style={{width:100,height:60}} resizeMode="cover" />
</TouchableOpacity>)}
</ScrollView>:null}
</View>
 <View style={{width:"100%",flexDirection:"column",padding:15,paddingVertical:10,alignItems:"center",backgroundColor:"rgba(233,227,227,0.7)"}}>
 <View style={{width:"100%",backgroundColor:"white",width:width-40}}>
 <View style={{overflow:"hidden",width:width-40,marginBottom:10,height:50,backgroundColor:"#ccc",alignItems:"center",justifyContent:"center"}}>
<Image source={require("../images/back3.png")} style={{width:width,height:height,position:"absolute"}} resizeMode="cover" />
 <View style={{width:"100%",paddingVertical:10,height:"100%",alignItems:"center",position:"absolute",backgroundColor:"rgba(255,255,255,0.6)"}}>
 </View>
 <Text style={{fontSize:16}}>{offer?"OFFER":category_name}</Text>
 </View>
 <View style={{width:"100%",paddingHorizontal:15,paddingBottom:15,minHeight:250,justifyContent:"flex-start"}}>
   <Text  style={[mystyle.title,{margin:0}]} >{product_name}</Text>
 <View style={{flex:1,justifyContent:"flex-start",alignItems:"flex-start"}}>
   <Text style={[mystyle.subtitle]}>{detail}</Text>
 </View>
 <View style={{width:"100%",flexDirection:"row",borderTopColor:"#444",borderTopWidth:0.5}}>
 <View style={{padding:5,flex:1,alignItems:"center",flexDirection:"row"}}>
   <Icon.FontAwesome name="map-marker" size={20} />
   <Text style={[mystyle.subtitle,{fontSize:12,marginLeft:5}]}> {String(address)}</Text>
 </View>
 <View style={{padding:5,flex:1,flexDirection:"row"}}>
 <Icon.FontAwesome name="calendar" size={12} />
   <Text style={[mystyle.subtitle,{fontSize:12}]}> Posted: {date_created}</Text>
 </View>
 </View>
 <View style={{width:"100%",flexDirection:"row"}}>
 {telephone != ""?<TouchableOpacity
 onPress={()=>{
   this.setState({showNumber:!showNumber});
 }} style={{padding:5,flex:1,alignItems:"center",flexDirection:"row"}}>
 <Icon.FontAwesome name="phone" size={15} />
 <Text style={[mystyle.subtitle,{fontSize:12}]}> {showNumber?telephone:"Show number"}</Text>
 </TouchableOpacity>:<Text style={{flex:1,color:"red",fontSize:10}}>Mobile contact not available</Text>}
 <View style={{padding:5,flex:1,flexDirection:"row"}}>
 <Icon.MaterialIcons name="timer" size={15} />
 <Text style={[mystyle.subtitle,{fontSize:12}]}>{`opening hrs: 1${opening}`}</Text>
 </View>
 </View>
 </View>
 <View style={{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"center",padding:20}}>
 {String(this.props.id_user) != String(user_id)?<Ratings 
returnData={(d)=>{
this.setState(d);
}}
id_store={parseInt(id_store)}
rating={this.state.rating}
/>:null}
</View>
{String(user[0].user_verified).toLowerCase() != "yes"?<Image source={require("../images/uv.png")} style={{width:70,height:70,position:"absolute",bottom:0,right:0,opacity:0.7,transform:[{
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
{String(user_id) != String(this.props.id_user) && telephone != ""?<TouchableOpacity 
 onPress={()=>{
   ToastAndroid.show("Call requested",ToastAndroid.SHORT);
    Linking.openURL("tel:"+telephone);
 }}
 style={{height:40,marginHorizontal:5,justifyContent:"center",alignItems:"center",width:120,backgroundColor:mystyle.active.color,borderRadius:40,elevation:3}}>
  <Text style={[mystyle.whitetxt]}>Call Now</Text>
  </TouchableOpacity>:null}
  <TouchableOpacity 
 onPress={()=>{
  
  if(String(user_id) == String(this.props.id_user))
  {
    this.chatScrol.scrollTo({x:width,y:0,animated:true});
    this.setState({setIndex:1})
  }else{
    // store details
    var pam = {
      banner:images.uri, 
      id_store:parseInt(id_store),
      product_name:product_name,
      business_name:user[0].business_details.business_name,
      chatroom:offer?`offer@${id_offer}_${user_id}_${this.props.id_user}`:`service@${id_store}_${user_id}_${this.props.id_user}`,
      sender_id:parseInt(this.props.id_user),
      recipient_id:user_id,
      product_name:product_name,
      category_name:category_name,
      store_fcmToken:this.state.store_fcmToken,
      storeOwner:user[0],
      room:[parseInt(this.props.id_user),parseInt(user_id)],
      // senders details
      fcmToken:this.state.fcmToken,
      send_by:String(this.props.id_user) != String(user_id)?this.props.firstname+" "+this.props.lastname:this.props.typeAuth == "client"?this.props.firstname+" "+this.props.lastname:user[0].business_details.business_name,
      sender_name:this.props.firstname+" "+this.props.lastname,
      offer:offer,
      reply:false
      }
  //  alert(JSON.stringify(this.props.typeAuth));
  // return ;
  console.log("pam:",pam);
  // return ;
  Actions.chat_client({chatdata:pam});
  }
 }}
 style={{height:40,marginHorizontal:5,justifyContent:"center",alignItems:"center",width:100,backgroundColor:mystyle.active.color,borderRadius:40,elevation:3}}>
 <Text style={[mystyle.whitetxt]}>{String(user_id) == String(this.props.id_user)?"Messages":"Chat"}</Text>
 </TouchableOpacity>
 </View>
 </View>
 </ScrollView> 
 </View> 
 <View style={{flexDirection:"column",width:width,height:height,backgroundColor:"white"}}>
<View style={{height:60,width:width,backgroundColor:mystyle.active.color,flexDirection:"row"}}>
 <TouchableOpacity 
 onPress={()=>{
  this.chatScrol.scrollTo({x:0,y:0,animated:true})
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
   <View style={{flexDirection:"column",width:width,alignItems:"center"}}>
      {this.state.loading?<View style={{padding:5,paddingHorizontal:20,flexDirection:"row",justifyContent:"flex-start",alignItems:"flex-start",width:"100%"}}>
     <ActivityIndicator size="small" color="red" />
     <Text style={{marginLeft:6,fontSize:12}}>Fetching...</Text>
     </View>:Object.keys(this.state.messages).length == 0?<View style={mystyle.myalert}>
     <Text style={{marginLeft:6,fontSize:12}}>No message found.</Text>
     </View>:null}
    <View style={[{width:width,height:1,flexDirection:"row",borderColor:"#444",borderBottomWidth:0.5,padding:10}]}>
    </View>
    {Object.keys(this.state.messages).map((a,i)=>{
    var chat = this.state.messages[a].reverse()[0];
    var showDot = chat.read;
    var text = chat.text;
    var chatdate = chat.date+" "+chat.time;
    return <TouchableOpacity key={i}
    onPress={()=>{
      console.log("chat",chat)
      var pam = {
        banner:chat.banner, 
        id_store:parseInt(chat.id_store),
        product_name:chat.product_name,
        business_name:chat.business_name,
        chatroom:chat.chatroom,
        sender_id:parseInt(this.props.id_user),
        recipient_id:parseInt(chat.sender_id),
        product_name:chat.product_name,
        category_name:chat.category_name,
        store_fcmToken:chat.fcmToken,
        room:chat.room,
        // senders details
        fcmToken:chat.store_fcmToken,
        send_by:chat.business_name,
        sender_name:this.props.firstname+" "+this.props.lastname,
        offer:chat.offer,
        reply:true
        }
    //  alert(JSON.stringify(this.props.typeAuth));
    // return ;
  console.log("pam:",pam);
    // return ;
    Actions.chat_client({chatdata:pam});
  
  
    }} style={[{width:width,justifyContent:"center",flexDirection:"row",borderColor:"#444",borderBottomWidth:0.5,padding:10}]}>
    <View 
   style={{width:50,height:50,justifyContent:"center",alignItems:"center",borderRadius:50,borderColor:"#444",backgroundColor:"white",borderWidth:0.5,marginVertical:5}} >
   <Icon.AntDesign name="user"  size={20} color="black" />
   {!showDot?<View style={{position:"absolute",right:0,bottom:0,borderRadius:10,height:10,width:10,backgroundColor:"green"}}></View>:null}
  </View>
  <View 
   style={{flex:1,height:50,justifyContent:"center",marginHorizontal:10}} >
    <Text ellipsizeMode="tail" numberOfLines={1}  style={{color:"black",fontSize:16}}>{a.replace("_"," ")}</Text>
    <Text ellipsizeMode="tail" numberOfLines={1} style={{color:"black",fontSize:12}}>{text}</Text>
    </View>
    <View 
   style={{width:80,height:50,justifyContent:"center",alignItems:"center",paddingRight:10}} >
    <Text style={{color:"black",fontSize:12}}>{Moment(new Date(chatdate)).fromNow()}</Text>
   </View>
    </TouchableOpacity>;
  })}
   </View>
   </ScrollView>
  
  </View> 
 </ScrollView>  
 {this.state.showPreview?<View style={{...StyleSheet.absoluteFill,backgroundColor:"rgba(0,0,0,0.8)",justifyContent:"center",alignItems:"center"}}>
<PinchGestureHandler
      onGestureEvent={this.onZoomEvent}
      onHandlerStateChange={this.onZoomStateChange}>
<Animated.Image 

source={{uri:images_list[0]["560_560"].url}} style={{width:width,height:width,
transform: [{ scale: this.scale }]}} resizeMode="cover" >
</Animated.Image>
</PinchGestureHandler>
<TouchableOpacity
onPress={()=>{
  this.setState({showPreview:false})
}}
style={{position:"absolute",top:0,right:0,padding:20}}>
  <Icon.AntDesign name="close" size={30} color="white" />
</TouchableOpacity>
 </View>:null}
 <Loader 
 {...this.state}
 returnData={(d)=>this.setState(d)}
 />
 </View>)
    }
}
OfferClass.defaultProps = {
  productDetails:{
    percent:0,
    date_end:new Date().toDateString(),
    offer:false,
    address: "",
    category_color: null,
    category_id: "",
    category_name: "",
    city: null,
    created_at: "",
    customers: null,
    date_created: "",
    detail: "",
    distance: "",
    featured: null,
    gallery: 0,
    id_store: "24",
    images: {uri: ""},
    images_list: [],
    lat: 0,
    latitude: "",
    link: "",
    lng: 0,
    longitude: "",
    nbrOffers: 0,
    nbr_votes: "",
    opening: 0,
    opening_time_table: [],
    other_images:[],
    price: "",
    product_image: {uri: ""},
    product_name: "",
    service_price: "",
    service_price_min: null,
    status: "1",
    tags: null,
    telephone: "",
    updated_at: "",
    user: [],
    user_id: "",
    verified: "",
    voted: false,
    votes: 0,
    id_offer:0
  }
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(OfferClass);

