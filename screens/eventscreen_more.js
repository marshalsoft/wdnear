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
    KeyboardAvoidingView,
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
    Alert,
    DeviceEventEmitter} from 'react-native';
    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';
import { postDATA,PasswordStrength,returnComma,getDATA,returnMobile,returnAllNumbers} from '../includes/func';

const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import Loader from '../components/loader';
import Country from '../includes/countries';

class EventMoreClass extends PureComponent{
    componentDidMount()
    {
      postDATA("verification/getVerificationDetails",{
        user_id:parseInt(this.props.id_user)
      }).then((res)=>{
        if(res.status)
        {
          if(res.result != undefined)
          {
          this.props.dispatch({type:"update",value:{verifyBusiness:res.result.verified,verifiedSetting:res.result.verified == "no"}})
          }
        } 
      })
}


    constructor(props)
    {
        super(props);
        this.state = {
            loading:true,
            showLoader:false,
            isProcessing:true,
            errorInfo:"Please wait...",
            success:false,
            kyUp:false,
            ticketList:[],
            event_coupon:"",
            scolV:false,
            amount:0
            }
    }
 
componentWillUnmount()
{

}

render() 
{
var {amount} = this.state;
const Actions = this.props.navigation;
return(<KeyboardAvoidingView 
  behavior="padding"
  keyboardVerticalOffset={40}  style={[mystyle.window,{backgroundColor:"white"}]} >
<View style={{flex:1,justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
<View style={{width:width,height:70,justifyContent:"center",alignItems:"center",backgroundColor:"#f9f5f5",elevation:3}}>
<TouchableOpacity onPress={()=>{
Actions.goBack();
}} style={[{width:60,height:70,justifyContent:"center",alignItems:"center",position:"absolute",top:0,left:0,zIndex:99}]}>
<Icon.MaterialIcons color={"red"} name="keyboard-arrow-left" size={30} />
</TouchableOpacity>
<View >
    <Text style={{color:"black",fontSize:18}}>Event Ticket(s)</Text>
</View>
</View>
<ScrollView 
keyboardShouldPersistTaps="always"style={{flex:1}} >
<View style={{width:width,alignItems:"center",flexDirection:"column",paddingBottom:70}} >
<View style={{justifyContent:"center",alignItems:"flex-start",paddingLeft:30,marginBottom:10,width:"100%",paddingTop:10}}>
<Text >TICKET TYPES</Text>
</View>
<View style={{padding:10,backgroundColor:"#f3f3f3",borderRadius:10,borderColor:"#cecece",borderWidth:0.5,flexDirection:"column",height:270}}>
<ScrollView 
keyboardShouldPersistTaps="always"
horizontal
ref={e=>this.ticketSlide=e}
pagingEnabled
scrollEnabled={1}
scrollEnabled={false}
style={{width:width-90,height:270}}
showsVerticalScrollIndicator={false}
showsHorizontalScrollIndicator={false}
>
{this.state.ticketList.length != 0?<View style={{width:width-90,flexDirection:"column",height:260}}>
<ScrollView
 nestedScrollEnabled = {true}
style={{width:width-90,height:260}}>
{this.state.ticketList.map((a,i)=><View key={i} style={{width:"100%",height:95,backgroundColor:"#f1fffa",flexDirection:"column",padding:10,borderRadius:10,borderColor:"#444",borderWidth:0.5,marginBottom:10,overflow:"hidden"}}>
<Text style={{fontSize:10}}>Ticket category</Text>
<Text style={{fontSize:14,fontWeight:"bold",marginBottom:10}}>{a.ticket_name}</Text>
<View style={{flexDirection:"row"}}>
<View style={{flexDirection:"column",flex:1}}>
<Text style={{fontSize:10}}>Ticket price</Text>
<Text style={{fontSize:14,fontWeight:"bold",marginBottom:10}}>NGN{returnComma(a.ticket_price)}</Text>
</View>
<View style={{flexDirection:"column",flex:1}}>
<Text style={{fontSize:10}}>Ticket quantity</Text>
<Text style={{fontSize:14,fontWeight:"bold",marginBottom:10}}>{a.ticket_qty}</Text>
</View>
</View>
<View style={{borderBottomLeftRadius:15,flexDirection:"row",top:0,right:0,position:"absolute",width:40,height:25,backgroundColor:"#ccc"}}>
<TouchableOpacity
onPress={()=>{
    this.setState({ticketList:this.state.ticketList.filter((a,p)=>p != i)})
}}
style={{flexDirection:"row",flex:1,justifyContent:"center",alignItems:"center"}}>
<Icon.Evilicons name="trash" style={{color:"red"}} size={20} />
    </TouchableOpacity>
    </View>
</View>)}
</ScrollView>
<View style={{width:width-90,height:30,justifyContent:"center",flexDirection:"row"}}>
    <View style={{flex:1,alignItems:"flex-start",padding:5}}>
    <Text style={{fontSize:10}}>Ticket(s) {this.state.ticketList.length}</Text>
    </View>
    <TouchableOpacity
onPress={()=>{
    this.ticketSlide.scrollTo({x:width-90,y:0,animated:true}); 
}}
style={{flexDirection:"row",padding:5}}>
        <Text style={{color:"red",fontSize:10}}>Add another Ticket type</Text>
        <Icon.AntDesign name="plus" style={{color:"red",marginHorizontal:5}} />
    </TouchableOpacity>
    </View>
</View>:null}
<View style={{width:width-90,flexDirection:"column",height:270}}>
<Text style={{fontSize:10}}>Ticket category</Text>
<View style={[{height:40,width:width-90,backgroundColor:"#fff",borderRadius:5,borderColor:"#707070",borderWidth:0.5,marginBottom:15}]}>
<TextInput 
    keyboardType="default"
    placeholder="ticket category (e.g Regular)"
   onChangeText={(d)=>this.setState({event_ticket_name:String(d).replace(/[ ]/g,'')})}
    value={this.state.event_ticket_name}
    style={{color:"#000",fontSize:14,flex:1,textAlignVertical:"center",textAlign:"left",paddingHorizontal:10}}
    />
</View>
<Text style={{fontSize:10}}>Ticket Price</Text>
<View style={[{height:40,width:width-90,backgroundColor:"#fff",borderRadius:5,borderColor:"#707070",borderWidth:0.5,marginBottom:15}]}>
<TextInput 
    keyboardType="default"
    placeholder="ticket price..."
    keyboardType="phone-pad"
   onChangeText={(d)=>this.setState({event_ticket_price:returnAllNumbers(d)})}
    value={returnComma(this.state.event_ticket_price)}
    style={{color:"#000",fontSize:14,flex:1,textAlignVertical:"center",textAlign:"left",paddingLeft:50}}
    />
    <Text style={{position:"absolute",left:10,top:7}}>NGN</Text>
</View>
<Text style={{fontSize:10}}>Quantity</Text>
<View style={[{height:40,width:width-90,backgroundColor:"#fff",borderRadius:5,borderColor:"#707070",borderWidth:0.5,marginBottom:15}]}>
<TextInput 
    keyboardType="phone-pad"
    placeholder="000"
   onChangeText={(d)=>this.setState({event_ticket_Quantity:returnAllNumbers(d)})}
    value={this.state.event_ticket_Quantity}
    style={{color:"#000",fontSize:14,flex:1,textAlignVertical:"center",textAlign:"left",paddingHorizontal:10}}
    />
</View>
<View style={[mystyle.btn,{width:width-90,flexDirection:"column",padding:0,overflow:"hidden",width:150,flexDirection:"row"}]} >
    {this.state.ticketList.length != 0?<TouchableOpacity
    onPress={()=>{
      this.ticketSlide.scrollTo({x:0,y:0,animated:true}); 
    }} style={{width:40,height:40,backgroundColor:"#444",justifyContent:"center",alignItems:"center"}}>
        <Icon.MaterialIcons name="keyboard-arrow-left" size={20} color="white" />
    </TouchableOpacity>:null}
<TouchableOpacity 
onPress={()=>{
  if(this.state.event_ticket_name == "")
  {
ToastAndroid.show("Please enter ticket name",ToastAndroid.SHORT);
  }else if(this.state.event_ticket_price == "")
  {
ToastAndroid.show("Please enter ticket price",ToastAndroid.SHORT);
  }else if(this.state.event_ticket_Quantity == "")
  {
ToastAndroid.show("Please enter ticket quantity",ToastAndroid.SHORT);
  }else{
    this.setState({ticketList:[...this.state.ticketList,{
      ticket_name:this.state.event_ticket_name,
      ticket_price:parseInt(this.state.event_ticket_price),
      ticket_qty:parseInt(this.state.event_ticket_Quantity)
    }]},()=>{
        this.setState({
            event_ticket_name:"",
            event_ticket_price:"",
            event_ticket_Quantity:""})
      this.ticketSlide.scrollTo({x:0,y:0,animated:true}); 
    })  
  }
}}
style={{height:40,flexDirection:"row",justifyContent:"center",alignItems:"center",flex:1}}>
<Text style={{color:"white",fontSize:12}}>Add Ticket</Text>
 </TouchableOpacity>
</View>
</View>
</ScrollView>
</View>

<View style={{justifyContent:"center",alignItems:"flex-start",paddingLeft:30,marginBottom:0,width:"100%",paddingTop:10}}>
<Text >ENTER COUPON(optional)</Text>
</View>
<View style={[mystyle.regInput,{width:width-60,alignSelf:"flex-start",marginLeft:30,backgroundColor:"#fff",borderRadius:5,borderColor:"#707070",borderWidth:0.5}]}>
<TextInput 
    keyboardType="default"
    placeholder=""
    value={this.state.event_coupon}
    onChangeText={(d)=>{
        this.setState({event_coupon:d})
    }}
    onFocus={()=>this.setState({kyUp:true},()=>{

    })}
    onBlur={()=>this.setState({kyUp:false})}
    style={{color:"#000",fontSize:18,flex:1,textAlignVertical:"center",textAlign:"left",paddingHorizontal:10}}
    />  
</View>
<View style={[mystyle.btn,{width:width-90,flexDirection:"column",padding:0,overflow:"hidden",width:150,flexDirection:"row",marginTop:30}]} >
<TouchableOpacity 
onPress={()=>{
  if(this.state.ticketList.length == 0)
  {
ToastAndroid.show("Please add ticket(s)",ToastAndroid.SHORT);
  }else{
      var data = {
        ...this.props.event,
        user_id: parseInt(this.props.id_user),
        tickets:JSON.stringify(this.state.ticketList),
        single:true
}
if(this.state.event_coupon != "")
{
  data.event_coupon = this.state.event_coupon;
}

console.log(data);
// return ;
// if(String(this.props.paystack_payment) == "1")
// {
// amount = amount+(parseFloat(this.props.subscription_fee)*(parseInt(this.props.vat_fee)/100))
// Actions.bank_details({
//   screen_route:"menu",
//   module_endpoint:"event/createEvent",
//   save_endpoint:"payment/paySubscription",
//   params:{
//     event_id:""
//   },
//   memo:`Payment of NGN${amount} includes VAT of ${this.props.vat_fee}% for new event listing.`,
//   amount
// });
// }else{
  this.setState({
        showLoader:true,
        isProcessing:true,
        errorInfo:"Please wait...",
        success:false})
    postDATA("event/createEvent",data).then((res)=>{
        this.setState({
            showLoader:true,
            isProcessing:false,
            errorInfo:res.message,
            success:res.status},()=>{
              if(res.status)
              {
                DeviceEventEmitter.emit("reload",{action:"event"})
              }
            })
    })
  }
  // }
}}
style={[mystyle.btn,{width:width-90,flexDirection:"row",justifyContent:"center",alignItems:"center"}]}>
<Text style={{color:"white",fontSize:12}}>{this.props.bankDetails == ""?"Next":"Create Event"}</Text>
 </TouchableOpacity>
</View>
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
if(this.state.success)
{
  Actions.jump("menu")
}
this.setState(d);
}} />
</KeyboardAvoidingView>)
    }
}
EventMoreClass.defaultProps = {
  event_title:"",
  description:"",
  event_category:"",
  start_date:"",
  start_time:"",
  end_date:"",
  end_time:"",
  event_banner:"",
  event_venue:"",
  event_Organizer_details:"",
  event_website:""
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(EventMoreClass);

