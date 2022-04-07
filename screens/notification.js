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
    Image,
    Alert,
    Modal } from 'react-native';
    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';

const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import Moment from 'moment'
import {returnAllNumbers,postDATA} from '../includes/func';
import PushNotification from 'react-native-push-notification';

class NotifyClass extends PureComponent{
    componentDidMount()
    {
  PushNotification.setApplicationIconBadgeNumber(0);
  const {notificationList,title,id,selectedMail,notifications} = Object.assign(this.state,this.props);
   var noty =  [];
   var list =  [];
   notifications.map((a,i)=>{
    if(noty.indexOf(a.id) == - 1)
    {
      list.push(a);
      noty.push(a.id);
    }
     return a;
   })
  this.setState({notificationList:list})
     }
    constructor(props)
    {
        super(props);
        this.state = {
          notificationList:[]
        }
    }
 
componentWillUnmount()
{

}
getNotify()
{
  this.setState({
    loading:true})
postDATA("messenger/loadUserInbox",{
  user_id:parseInt(this.props.id_user),
  status:1,
  image:""
}).then((res)=>{
  if(res.status)
  {
    this.setState({
      loading:false,notificationList:res.result});
  }
  this.setState({
    loading:false});
  })
}
render() 
{
const {notificationList} = this.state;
const {title,id,selectedMail,notifications} = Object.assign(this.state,this.props);
const Actions = this.props.navigation;
return(<View style={mystyle.window} >
    <View style={{height:60,width:width,backgroundColor:mystyle.active.color,flexDirection:"row"}}>
         <TouchableOpacity 
         onPress={()=>{
           Actions.goBack();
         }}
         style={{width:40,height:60,justifyContent:"center",alignItems:"center"}} >
           <Icon.MaterialIcons name="keyboard-arrow-left"  size={25} color="white" />
         </TouchableOpacity>
         <View style={{flex:1,justifyContent:"center",paddingLeft:10}}>
        <Text style={{fontSize:16,color:"#fff",fontWeight:"bold"}}>{this.state.title}</Text>
         </View>
        {notifications.length != 0?<View style={{width:60,height:60,justifyContent:"center",alignItems:"center"}}>
           <Icon.FontAwesome name="bell" color="white" size={20} />
         <Text style={{color:"white",position:"absolute",top:10,right:18,fontSize:10}}>{notifications.length}</Text>
         </View>:null}
         </View>
    <View style={{flex:1,justifyContent:"center",alignItems:"center",paddingBottom:70,flexDirection:"column"}} >
    {notifications.length == 0?<View style={mystyle.myalert}>
         <Text style={{color:"red",fontSize:12}}>No notification found!</Text>
       </View>:null}
        <FlatList 
         data={notificationList}
         style={{width}}
         renderItem={({item,index})=>{
          const count = notifications.filter((a,i)=>item.id).length;
          // alert(JSON.stringify(item))
          if(count == 0)
          {
            return null;
          }
         return (<TouchableOpacity
         onPress={()=>{
          // chat = chat.filter((a,i)=>i == 0)[0]
          var pm = {
            banner:item.banner,
            id_store:parseInt(item.id_store),
            business_name:item.business_name,
            business_email:item.business_email,
            business_telephone:item.telephone,
            business_avatar:item.business_avatar,
            chatroom:item.chatroom,
            recipient_id:parseInt(item.recipient_id),
            recipient_email:item.recipient_email,
            offer:false,
            reply:false
          }
          // alert(JSON.stringify(pm))
          Actions.chat_client({chatdata:pm});
         }}
         activeOpacity={0.7}
        style={{height:90,justifyContent:"center",alignItems:"center",borderBottomWidth:0.5,borderBottomColor:"#ccc",flexDirection:"row",backgroundColor:item.selected?"#ffecec":"white"}} >
          <View style={{overflow:"hidden",width:50,height:50,marginHorizontal:15,borderRadius:100,justifyContent:"center",alignItems:"center",backgroundColor:"#444"}}>
            <Image source={JSON.parse(item.avatar)}  style={{width:60,height:60}} />
          </View>
          <View style={{flex:1,justifyContent:"center",flexDirection:"column"}} >
        <Text style={{fontSize:12,color:"#000",fontWeight:"bold"}}>{item.sender_name}</Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:11,color:"#000",fontWeight:"bold"}}>{JSON.parse(item.chatInfo)["nickName"]}</Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:11,color:"#000"}}>{item.content}</Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={{fontSize:11,color:"#000"}}>{Moment(item.date).fromNow()}</Text>
         </View>
         <View style={{width:60,height:40,alignItems:"center",justifyContent:"center",flexDirection:"row"}}>
        <Text>{count}</Text>
        <Icon.MaterialIcons name="keyboard-arrow-right" size={30}/>
          </View>
         </TouchableOpacity>)}}
         />
         </View>
          </View>)
    }
}
NotifyClass.defaultProps = {
  notifications:[]
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(NotifyClass);

