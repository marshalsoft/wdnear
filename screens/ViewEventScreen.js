import React, {PureComponent} from 'react';
import {Platform,
    StyleSheet,
    Text, 
    View,
    Share,
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
    Slider,
    ActivityIndicator,
    TimePickerAndroid,
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
    PanResponder,
    Modal, 
    PermissionsAndroid,
    DeviceEventEmitter,
    Alert} from 'react-native';
    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';
import { postDATA,PasswordStrength,returnComma,getDATA,returnMobile,returnAllNumbers} from '../includes/func';

const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import Loader from '../components/loader';
import * as Animatable from 'react-native-animatable';
import FS from 'rn-fetch-blob';
import Moment from 'moment';
import FileViewer from 'react-native-file-viewer';
import CameraRoll from '@react-native-community/cameraroll';
import ReturnADS  from '../components/showADS';

class ViewEventsClass extends PureComponent{
    componentDidMount()
    {
   console.log(this.props.event_data);
   const { config, fs,android,ios } = FS;
   var path = fs.dirs.DocumentDir + `/event_${this.props.event_data.id_event}.png`;
   this.setState({imagePath:path,...this.props.event_data});
   postDATA("store/getServices",{
     store_id:this.props.event_data.store_id
   }).then((res)=>{
     console.log(res);
     
   })
   setTimeout(()=>{
    DeviceEventEmitter.emit("ads",{});
  },4000)
}

    constructor(props)
    {
        super(props);
        this.state = {
          selectedTicket:{ticket_name:"",ticket_price:0},
          quantity:"1",
          imagePath:null,
          address: "",
          autres: null,
          created_at: "",
          date_b: "",
          date_created: "",
          date_e: "",
          description: "",
          distance: "",
          end_time: "",
          event_coupon: null,
          featured: null,
          id_event: "",
          main_image:"",
          lat: "",
          link: "",
          lng: "",
          name: "",
          status: "",
          store_id: "",
          store_name: "",
          tags: null,
          tel: "",
          ticket:[],
          time: "",
          updated_at: null,
          user_id: "",
          verified: "",
          website: null,
          keyUp:false
            }
     
    }
 
componentWillUnmount()
{

}
zoomImage(uri,id_event)
{
  const { config, fs,android,ios } = FS;
  var path = fs.dirs.DocumentDir + `/event_${id_event}.png`;
  //  console.log(res.path())
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
     path:path
    }).fetch('GET',uri).then((res)=>{
    
     CameraRoll.save(res.data, 'photo')
     .then((resp) => {
     //  console.log(res.path())
     FileViewer.open(res.data);
    this.setState({showLoader:false,imagePath:res.data})
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
 }).catch((e)=>
 {
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
   path:path
  }).fetch('GET',uri).then((res)=>{
   CameraRoll.save(res.data, 'photo')
   .then((resp) => {
   //  console.log(res.path())
   FileViewer.open(res.data);
  this.setState({showLoader:false,imagePath:res.data})
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
})
}
render() 
{
const {
  address,
  autres,
  created_at,
  date_b,
  date_created,
  date_e,
  description,
  distance,
  end_time,
  event_coupon,
  featured,
  id_event,
  main_image,
  lat,
  link,
  lng,
  name,
  store_id,
  store_name,
  tags,
  tel,
  ticket,
  time,
  updated_at,
  user_id,
  verified,
  website} = this.state;
  var a = Moment().format("YYYY-MM-DD");//now
  var b = Moment(this.state.date_e).format("YYYY-MM-DD");
  var duration = Moment(b).diff(Moment(a), 'days');
  const banner_150 = this.props.adsList.filter((a,i)=>String(a.banner_size) == "150")
  const banner_320 = this.props.adsList.filter((a,i)=>String(a.banner_size) == "320")
  const banner_350 = this.props.adsList.filter((a,i)=>String(a.banner_size) == "350")
  const Actions = this.props.navigation;

return(<View 
onLayout={()=>{
 
}}
style={[mystyle.window,{backgroundColor:"white"}]} >
<View style={{width:width,height:height,justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
<View style={{width:width,height:70,justifyContent:"center",alignItems:"center",backgroundColor:"#f9f5f5",elevation:3}}>
<TouchableOpacity onPress={()=>{
Actions.goBack();
}} style={[{width:60,height:70,justifyContent:"center",alignItems:"center",position:"absolute",top:0,left:0,zIndex:99}]}>
<Icon.MaterialIcons color={"red"} name="keyboard-arrow-left" size={30} />
</TouchableOpacity>
<View >
<Text style={{color:"black",fontSize:18}}>Event Booking</Text>
</View>
</View>
<View style={{flex:1}}>
<ScrollView
keyboardShouldPersistTaps={"always"}
ref={e=>this.cs=e}
onContentSizeChange={()=>{
  if(this.cs)
  {
    this.cs.scrollToEnd({animated:true});
  }
}}
style={{flex:1}} >
<View style={{width:width,alignItems:"center",flexDirection:"column",marginBottom:50}} >
<TouchableOpacity
    onPress={()=>{
    
      this.zoomImage(main_image,id_event);
    }}
    style={{width:"100%",height:230}}>
<Image source={{uri:main_image}} style={{width:"100%",height:230,backgroundColor:"#444"}} resizeMode="contain" />
</TouchableOpacity>
{duration < 0?<View 
style={[mystyle.myalert,{}]}>
<Animatable.View 
animation="fadeIn"
iterationCount="infinite"
duration={1000}
iterationDelay={100}
easing="ease-in-out-back"
useNativeDriver
style={{width:40,height:40,justifyContent:"center",alignItems:"center"}}>
<Icon.Entypo name="info" size={30} />
</Animatable.View>
<View style={{flex:1}}>
<Text >Oops! this event has ended, please check on another event. thanks  </Text>
</View>
</View>:null}
<View style={{width:"100%",flexDirection:"column",padding:15}}>
    <Text style={[mystyle.title]} >{name}</Text>
    <Text style={[mystyle.subtitle]}>{description}</Text>
    <View style={{flexDirection:"column",width:"100%",marginVertical:20,justifyContent:"center"}}>
    <View style={{position:"absolute",width:2,backgroundColor:"#ccc",height:"80%",left:5}}></View>
    <TouchableOpacity
    onPress={()=>{
      Linking.openURL("tel:"+tel);
    }}
    style={{width:"100%",flexDirection:"row",marginTop:10,backgroundColor:"white"}}>
   <Icon.FontAwesome name="phone" color="red" size={20} />
   <Text style={{color:"black",marginHorizontal:10,textDecorationLine:"underline",fontSize:12}}>{tel}</Text>
   </TouchableOpacity> 
   <View style={{width:"100%",flexDirection:"row",marginTop:10,backgroundColor:"white"}}>
   <Icon.FontAwesome name="map-marker" color="red" size={20} />
   <Text style={{color:"black",marginHorizontal:10,fontSize:12}}>{address}</Text>
   </View> 
   <View style={{width:"100%",flexDirection:"row",marginTop:10}}>
   <View style={{backgroundColor:"white",width:30,height:30,justifyContent:"center"}}>
   <Icon.FontAwesome name="calendar" color="red" size={20} />
   </View>
   <View style={{width:"100%",flexDirection:"row"}}>
   <View style={{flex:1,flexDirection:"column",}}>
   <Text style={{color:"black",marginHorizontal:10,fontWeight:"bold"}}>Starts At</Text>
   <Text style={{color:"black",marginHorizontal:10,fontSize:12}}>{Moment(date_b).format("Do, MMMM YYYY")}</Text>
   <Text style={{color:"black",marginHorizontal:10,fontSize:12}}>{time}</Text>
   </View>
   <View style={{flex:1,flexDirection:"column",}}>
   <Text style={{color:"black",marginHorizontal:10,fontWeight:"bold"}}>Ends At</Text>
   <Text style={{color:"black",marginHorizontal:10,fontSize:12}}>{Moment(date_e).format("Do, MMMM YYYY")}</Text>
   <Text style={{color:"black",marginHorizontal:10,fontSize:12}}>{end_time}</Text>
   </View>
   </View>
   </View>
   <View style={{width:"100%",flexDirection:"row",marginTop:10,backgroundColor:"white"}}>
  <Icon.FontAwesome name="globe" color="red" size={20} />
  <TouchableOpacity
  onPress={()=>{
  Linking.openURL(`${website}`);
  }}
  >
  <Text style={{color:"black",marginHorizontal:10,textDecorationLine:"underline",fontSize:12}}>{website}</Text>
  </TouchableOpacity>
  </View>
  </View>
   {duration >= 0?<Text style={{color:"black",marginTop:10,fontWeight:"bold"}}>Tickets</Text>:null}
   {duration >= 0?<Text style={{color:"black",fontSize:12}}>Select a ticket below</Text>:null}
 {duration >= 0?<View style={{width:"100%",flexDirection:"row",marginTop:10,flexWrap:"wrap"}}>
  {ticket.map((a,i)=><TouchableOpacity
  onPress={()=>{
    this.setState({selectedTicket:a})
  }}
  key={i} style={{width:"100%",flexDirection:"row",minHeight:70,marginBottom:10,borderColor:"#ccc",borderRadius:5,borderWidth:0.5,backgroundColor:this.state.selectedTicket.ticket_name == a.ticket_name?"#e3f5e9":"#eee"}}>
<View style={{width:60}}>
<Icon.Fontisto name="ticket-alt" size={49}  style={{position:"absolute",left:10,top:10}}/>
</View>
<View style={{padding:10,flex:1}}>
<Text >{a.ticket_name}</Text>
<Text style={{fontWeight:"bold"}}>NGN{returnComma(a.ticket_price)}</Text>
</View>
<View style={{width:60,minHeight:60,justifyContent:"center",alignItems:"center"}}>
  {this.state.selectedTicket.ticket_name == a.ticket_name?<Icon.Evilicons name="check" color="limegreen" size={40}/>:null}
</View>
  </TouchableOpacity>)}
 <Text style={{color:"black",marginTop:10,fontWeight:"bold"}}>Quantity</Text>
  <View style={{width:"100%",flexDirection:"row",minHeight:50,marginBottom:10,borderColor:"#ccc",borderRadius:5,borderWidth:0.5}}>
<TextInput
 style={{width:"100%",paddingHorizontal:20}}
 maxLength={6}
 keyboardType="number-pad"
onChangeText={(d)=>{
  this.setState({quantity:returnAllNumbers(d)})
}}
placeholder="0"
value={this.state.quantity}
onFocus={()=>{
  this.setState({keyUp:true})
}}
onBlur={()=>{
  this.setState({keyUp:false})
}}
></TextInput>
  </View>
<Text style={{color:"black",marginBottom:-10,marginTop:10}}>Summary</Text>
  <View style={{width:"100%",flexDirection:"row"}}>
  <View style={{padding:5,flexDirection:"column",flex:1}}>
<Text style={{color:"black",marginTop:10,fontWeight:"bold"}}>No. of Tickets</Text>
<Text style={{width:"100%",textAlign:"center"}}>{this.state.quantity}</Text>
</View>
<View style={{padding:5,flexDirection:"column",flex:1}}>
<Text style={{color:"black",marginTop:10,fontWeight:"bold",textAlign:"center"}}>Total Amount</Text>
<Text style={{width:"100%",textAlign:"center"}}>NGN{returnComma(parseFloat(parseFloat(this.state.selectedTicket.ticket_price)*parseFloat(this.state.quantity)).toFixed(2))}</Text>
</View>
<View style={{padding:5,flexDirection:"column",flex:1}}>
<Text style={{color:"black",marginTop:10,fontWeight:"bold",textAlign:"center"}}>VAT. {this.props.vat_fee}%</Text>
<Text style={{width:"100%",textAlign:"center"}}>NGN{returnComma(parseFloat((parseFloat(this.state.selectedTicket.ticket_price)*parseFloat(this.state.quantity))*(parseFloat(this.props.vat_fee)/100)).toFixed(2))}</Text>
</View>
  </View>
  </View>:null}
  </View>
  {duration >= 0?<TouchableOpacity 
  onPress={()=>{
    
    if(duration < 0)
    {
      alert("Oops! this event has ended, please check on another event. thanks ");
      return ;
    }
    if(this.state.selectedTicket.ticket_price == 0)
    {
      alert("Oops! Please select a ticket");
      return ;
    }
    if(this.state.quantity == "" || parseInt(this.state.quantity) == 0)
    {
      alert("Oops! Please enter quantity");
      return ;
    }
    const {user_id} = this.props.event_data;
    var price = parseFloat(this.state.selectedTicket.ticket_price)*parseFloat(this.state.quantity)
    var data = {
      user_id:parseInt(this.props.id_user),
      owner_id:parseInt(user_id),
      event_id:parseInt(this.state.id_event),
      ticket_price:price+(price*(parseFloat(this.props.vat_fee)/100)),
      ticket_category:this.state.selectedTicket.ticket_name,
    }
    console.log("data:",data)
    // return ;
  //  Actions.view_events({event_data:item});
  Actions.bank_details({
    paymentTo:"event",
    screen_route:"menu",
    module_endpoint:"ticket/createTicket",
    save_endpoint:"ticket/createTicket",         
    params:data,
    memo:`Payment of NGN${returnComma(parseFloat(data.ticket_price))} for ${name} event, this amount includes VAT of ${this.props.vat_fee}%`,
    amount:data.ticket_price,
    email_msg:` and your ticket has been sent to your email (${this.props.email}), thanks.`
});
  }}
  activeOpacity={0.5}
  style={[mystyle.btn,{width:150,paddingVertical:10,marginTop:10}]}
  >
<Text style={{fontSize:12,color:"white"}}>Book Now</Text>
  </TouchableOpacity>:null}
  <ReturnADS
  list={banner_150}
  size={80}
  />
{this.state.keyUp?<View style={{height:130,width}} ></View>:null}
</View>
</ScrollView>
</View>  
</View>
<Loader 
{...this.state}
returnData={(d)=>{
this.setState(d);
}} />
</View>)
    }
}
ViewEventsClass.defaultProps = {
   event_data:{
    address: "",
    autres: null,
    created_at: "",
    date_b: "",
    date_created: "",
    date_e: "",
    description: "",
    distance: "",
    end_time: "",
    event_coupon: null,
    featured: null,
    id_event: "",
    main_image:"",
    lat: "",
    link: "",
    lng: "",
    name: "",
    status: "",
    store_id: "",
    store_name: "",
    tags: null,
    tel: "",
    ticket:[],
    time: "",
    updated_at: null,
    user_id: "",
    verified: "",
    website: null
   }
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(ViewEventsClass);

