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
    KeyboardAvoidingView,
    Modal, 
    Alert} from 'react-native';

    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';
import { postDATA,PasswordStrength,returnComma,getDATA,returnMobile,returnAllNumbers} from '../includes/func';

const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import Loader from '../components/loader';
import Country from '../includes/countries';
import Moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

class EventsClass extends PureComponent{
    componentDidMount()
    {
    //  this.setState({mobile:returnMobile(this.props.telephone),username:this.props.username})   
    this.setState({mylocation:this.props.Reducer.address,
    latitude:this.props.Reducer.latitude,
    longitude:this.props.Reducer.longitude});
    // this.getLocation();
}
 
 
    constructor(props)
    {
        super(props);
        this.state = {
            showDate1:false,
            showDate2:false,
            showTime1:false,
            showTime2:false,
            business_name:"",
            loading:true,
            showLoader:false,
            isProcessing:true,
            errorInfo:"Please wait...",
            success:false,
            kyUp:false,
            latitude:27.2038,
            longitude:77.5011,
            ticketList:[],
            bank_acc_name:"",
            bank_acc_number:"",
            event_category:"",
            category_id:"",
            cardType:"",
            event_ticket_name:"",
            event_ticket_Quantity:"",
            event_ticket_price:"",
            event_Organizer_details:"",
            event_category:"",
            event_description:"",
            event_venue:"",
            event_title:"",
            event_website:"",
            event_start_date:Moment().add(1,"day"),
            event_start_time:"",
            event_end_date:null,
            event_end_time:"",
            event_banner:{uri:""},
            event_coupon:""
            }
            this.animSize = new Animated.Value(50);
            this.animAgeSize = new Animated.Value(18);
    }
 
componentWillUnmount()
{

}
getLocation(lt,lng)
{
    this.setState({latitude:lt,longitude:lng});
fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lt},${lng}&key=AIzaSyA_o9pVQnHYdFZl9oFT07IgGxz8aXUbxxA`).then((res)=>res.json()).then((res)=>{
     if(res.status == "OK")
     {
     console.log(res.results[0].formatted_address);
     this.setState({mylocation:res.results[0].formatted_address,mylocation2:res.results[0].formatted_address});
     }
})   
}
render() 
{
const {advert_type,audience_name,business_description,business_target_audience_default,business_name,event_category,business_target_audience} = this.state;
const Actions = this.props.navigation;
return(<KeyboardAvoidingView 
  behavior="padding"
  keyboardVerticalOffset={40}  style={[mystyle.window,{backgroundColor:"white"}]} >
<View style={{width:width,height:height,justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
<View style={{width:width,height:70,justifyContent:"center",alignItems:"center",backgroundColor:"#f9f5f5",elevation:3}}>
<TouchableOpacity onPress={()=>{
Actions.goBack();
}} style={[{width:60,height:70,justifyContent:"center",alignItems:"center",position:"absolute",top:0,left:0,zIndex:99}]}>
<Icon.MaterialIcons color={"red"} name="keyboard-arrow-left" size={30} />
</TouchableOpacity>
<View >
    <Text style={{color:"black",fontSize:18}}>Create New Event</Text>
</View>
</View>
<ScrollView 
keyboardShouldPersistTaps="always"style={{flex:1}} >
<View style={{width:width,alignItems:"center",flexDirection:"column",paddingBottom:70}} >

<View style={{justifyContent:"flex-start",alignItems:"flex-start",paddingLeft:35,width:"100%",paddingTop:10,flexDirection:"row"}}>
<Text style={{fontSize:14,color:"black"}}>EVENT TITLE:(</Text>
<Text style={{fontSize:14,color:"red"}}>required</Text>
<Text style={{fontSize:14,color:"black"}}>)</Text>
</View>
<View style={[mystyle.regInput,{width:width-70,backgroundColor:"#f3f3f3",borderRadius:5,borderColor:"#cecece",borderWidth:0.5}]}>
<TextInput 
    keyboardType="default"
    placeholder="title..."
    maxLength={50}
    multiline
    value={this.state.event_title}
    onChangeText={(d)=>{
        this.setState({event_title:d})
    }}
    style={{color:"#000",fontSize:14,flex:1,textAlignVertical:"center",textAlign:"left",paddingHorizontal:10,minHeight:40,maxHeight:80}}
    />
   
    </View>
    <View style={{width:"80%"}}>
  <Text style={{fontSize:10}}>Count: ({this.state.event_title.length} of 50)</Text>
</View>
<View style={{justifyContent:"flex-start",alignItems:"flex-start",paddingLeft:35,width:"100%",paddingTop:10,flexDirection:"row"}}>
<Text style={{fontSize:14,color:"black"}}>EVENT DESCRIPTION:(</Text>
<Text style={{fontSize:14,color:"red"}}>required</Text>
<Text style={{fontSize:14,color:"black"}}>)</Text></View>
<View style={[mystyle.regInput,{width:width-70,backgroundColor:"#f3f3f3",borderRadius:5,borderColor:"#cecece",borderWidth:0.5}]}>
<TextInput 
    keyboardType="default"
    placeholder="description..."
    multiline
    maxLength={500}
    value={this.state.event_description}
    onChangeText={(d)=>{
        this.setState({event_description:d})
    }}
    style={{color:"#000",fontSize:14,flex:1,textAlignVertical:"top",textAlign:"left",paddingHorizontal:10,minHeight:80,maxHeight:120}}
    />
   
    </View>
    <View style={{width:"80%"}}>
  <Text style={{fontSize:10}}>Count: ({this.state.event_description.length} of 500)</Text>
</View>
<View style={{justifyContent:"center",alignItems:"flex-start",paddingLeft:30,marginBottom:10,width:"100%",paddingTop:10}}>
<Text style={{fontSize:14,color:"black"}}>EVENT TIME & DATE (required)</Text>
</View>
<View style={{padding:10,backgroundColor:"#f3f3f3",borderRadius:10,borderColor:"#cecece",borderWidth:0.5,flexDirection:"column",marginBottom:5}}>
<TouchableOpacity
onPress={()=>{
  this.setState({showDate1:true})
    // try {
    //    DatePickerAndroid.open({
    //       // Use `new Date()` for current date.
    //       // May 25 2020. Month 0 is January.
    //       minDate:new Date(Moment().add(1,"day")),
    //       mode:"spinner",
    //       date: new Date()
    //     }).then(( {
    //         action,
    //         year,
    //         month,
    //         day
    //       })=>{
    //     if (action !== DatePickerAndroid.dismissedAction) {
    //       // Selected year, month (0-11), day
    //     //   return ;
    //     var x = Moment(`${String(month+1).length == 1?"0"+(month+1):month+1}/${String(day).length == 1?"0"+day:day}/${year}`);
    //     this.setState({event_start_date:x,event_end_date:null},()=>{

    //     })
    //     }
    // });
    //   } catch ({ code, message }) {
    //     console.warn('Cannot open date picker', message);
    //   }
}}
style={[{width:width-90,backgroundColor:"#fff",borderRadius:5,borderColor:"#707070",height:40,borderWidth:0.5,marginBottom:5,flexDirection:"row"}]}>
<View 
style={{justifyContent:"center",alignItems:"center",width:50,height:40}}>
<Icon.Evilicons name="calendar" size={30} />
</View>
<View style={{justifyContent:"center",alignItems:"flex-start",flex:1}}>
<Text>{this.state.event_start_date.format("DD-MM-YYYY")}</Text>
</View>
</TouchableOpacity>
<TouchableOpacity onPress={()=>{
   this.setState({showTime1:true})
  //  return ;
  //   try {
  //     TimePickerAndroid.open({
  //         hour: 12,
  //         minute: 0,
  //         is24Hour: false, // Will display '2 PM'
  //         mode:"spinner"
  //       }).then(({ action, hour, minute })=>{
  //           if (action !== TimePickerAndroid.dismissedAction) {
  //               // Selected hour (0-23), minute (0-59)
  //               var hr = Moment(`${this.state.event_start_date.format("YYYY-MM-DD")}`).hours(hour).minutes(minute);
  //               var x = hr.format("hh:mm A")
  //               this.setState({event_start_time:`${x}`,event_end_time:"0:00"})
  //             }
  //       });
  //     } catch ({ code, message }) {
  //       console.warn('Cannot open time picker', message);
  //     }
}} style={[{width:width-90,backgroundColor:"#fff",borderRadius:5,borderColor:"#707070",height:40,borderWidth:0.5,marginBottom:5,flexDirection:"row"}]}>
<View 
style={{justifyContent:"center",alignItems:"center",width:50,height:40}}>
<Icon.Evilicons name="clock" size={30} />
</View>
<View style={{justifyContent:"center",alignItems:"flex-start",flex:1}}>
<Text>{this.state.event_start_time == ""?"0h 0min":this.state.event_start_time}</Text>
</View>
</TouchableOpacity>
{this.state.showDate1?<DateTimePicker
      value={new Date()}
      minimumDate={new Date(Moment().add(1,"day"))}
      display='spinner'
      mode={"date"}
      onChange={(event, selectedDate) => {
        var nw = Moment(selectedDate);
        this.setState({event_start_date:nw,event_end_date:null,showDate1:false})
        // alert(JSON.stringify(selectedDate))
      }}
    />:null}
    {this.state.showTime1?<DateTimePicker
      value={new Date()}
      minimumDate={new Date()}
      display='spinner'
      mode={"time"}
      is24Hour={false}
      onChange={(event, selectedDate) => {
        const tm = Moment(selectedDate).format("hh:mm A");
        // alert(tm)
        this.setState({event_start_time:tm,event_end_time:"0:00",showTime1:false})
      }}
      onError={()=>{

      }}
    />:null}
<Text style={{width:width-90,textAlign:"center",marginVertical:5}}>To</Text>
<TouchableOpacity onPress={()=>{
  this.setState({showDate2:true})
  // return ;
  //   try {
  //      DatePickerAndroid.open({
  //         // Use `new Date()` for current date.
  //         // May 25 2020. Month 0 is January.
  //         minDate:new Date(this.state.event_start_date),
  //         mode:"spinner",
  //         date: new Date()
  //       }).then(( {
  //           action,
  //           year,
  //           month,
  //           day
  //         })=>{
  //       if (action !== DatePickerAndroid.dismissedAction) {
  //         // Selected year, month (0-11), day
  //       //   return ;
  //       this.setState({event_end_date:Moment(`${String(month+1).length == 1?"0"+(month+1):month+1}/${String(day).length == 1?"0"+day:day}/${year}`)})
  //       }
  //   });
  //     } catch ({ code, message }) {
  //       console.warn('Cannot open date picker', message);
  //     }
}} style={[{width:width-90,backgroundColor:"#fff",borderRadius:5,borderColor:"#707070",height:40,borderWidth:0.5,marginBottom:5,flexDirection:"row"}]}>
<View 
style={{justifyContent:"center",alignItems:"center",width:50,height:40}}>
<Icon.Evilicons name="calendar" size={30} />
</View>
<View style={{justifyContent:"center",alignItems:"flex-start",flex:1}}>
<Text>{this.state.event_end_date == null?"dd/mm/yyyy":this.state.event_end_date.format("DD-MM-YYYY")}</Text>
</View>
</TouchableOpacity>
<TouchableOpacity 
onPress={()=>{
  // this.setState({showTime2:true})
  // return ;
    if(this.state.event_start_time == "")
    {
    alert("Please select event start time first, thanks.");
    return ;
    }
    if(this.state.event_end_date == null)
    {
    alert("Please select event end date first, thanks.");
    return ;
    }
    this.setState({showTime2:true})
    return ;
      // TimePickerAndroid.open({
      //     hour: 12,
      //     minute: 0,
      //     is24Hour: false,// Will display '2 PM'
      //     mode:"spinner",
      //   }).then(({ action, hour, minute })=>{
      //       if (action !== TimePickerAndroid.dismissedAction) {
      //           // Selected hour (0-23), minute (0-59)
      //           var fom_start = this.state.event_start_date;
      //           var fom_start_time = String(String(this.state.event_start_time).replace("h","").replace("min","")).split(" ");
      //           fom_start.set('hour', fom_start_time[0]);
      //           fom_start.set('minute', fom_start_time[1])
                
      //           var fom_end = this.state.event_end_date;
      //           fom_end.set('hour', hour);
      //           fom_end.set('minute', minute);
      //           var d = fom_end.diff(fom_start,"minutes");
      //           if(d < 59)
      //           {
      //           Alert.alert("Oops!",`Event start time must be atleast 1 hour greater than  event end time.`,[{text:"Ok"}]);
      //           return ;
      //           }
      //           // var f = fom.format("DD/MM/YYYY hh:mm");
      //           var hr = Moment(`${this.state.event_end_date.format("YYYY-MM-DD")}`).hours(hour).minutes(minute);
      //           var x = hr.format("hh:mm A")
      //           this.setState({event_end_time:`${x}`})
      //         }
      //   });
      // } catch ({ code, message }) {
      //   console.warn('Cannot open time picker', message);
      // }
}}
style={[{width:width-90,backgroundColor:"#fff",borderRadius:5,borderColor:"#707070",height:40,borderWidth:0.5,marginBottom:5,flexDirection:"row"}]}>
<View 
style={{justifyContent:"center",alignItems:"center",width:50,height:40}}>
<Icon.Evilicons name="clock" size={30} />
</View>
<View style={{justifyContent:"center",alignItems:"flex-start",flex:1}}>
<Text >{this.state.event_end_time == ""?"0h 0min":this.state.event_end_time}</Text>
</View>
</TouchableOpacity>
</View>
{this.state.showDate2?<DateTimePicker
      value={new Date()}
      minimumDate={new Date(this.state.event_start_date)}
      display='spinner'
      mode={"date"}
      onChange={(event, selectedDate) => {
        var x = Moment(selectedDate);
        this.setState({event_end_date:x,showDate2:false})
      }}
    />:null}
    {this.state.showTime2?<DateTimePicker
      value={new Date()}
      minimumDate={new Date()}
      display='spinner'
      mode={"time"}
      is24Hour={false}
      onChange={(event, selectedDate) => {
        const tm = Moment(selectedDate);
        var fom_start = this.state.event_start_date;
        var fom_start_time = String(String(this.state.event_start_time).replace("AM","").replace("PM","")).split(":");
        fom_start.set('hour', fom_start_time[0]);
        fom_start.set('minute', fom_start_time[1]);
        var fom_end = this.state.event_end_date;
        fom_end.set('hour', tm.hour());
        fom_end.set('minute', tm.minute());
        // alert(fom_end.toISOString())
        // return ;
                var d = fom_end.diff(fom_start,"minutes");
                if(d < 59)
                {
                Alert.alert("Oops!",`Event start time must be atleast 1 hour greater than  event end time.`,[{text:"Ok"}]);
                return ;
                }
      //  alert(fom_start_time[0])
       this.setState({event_end_time:tm.format("hh:mm A"),showTime2:false})
      }}
      onError={()=>{

      }}
    />:null}
<View style={[mystyle.btn,{width:width-90,flexDirection:"column",padding:0,overflow:"hidden",width:150,flexDirection:"row",marginTop:30}]} >
<TouchableOpacity 
onPress={()=>{
  if(this.state.event_title == "")
  {
ToastAndroid.show("Please enter title of event",ToastAndroid.SHORT);
  }else if(this.state.event_description == "")
  {
ToastAndroid.show("Please enter the description",ToastAndroid.SHORT);
  }else if(this.state.event_start_date == "")
  {
ToastAndroid.show("Please select event start date",ToastAndroid.SHORT);
  }else if(this.state.event_start_time == "")
  {
ToastAndroid.show("Please select event start time",ToastAndroid.SHORT);
  }else if(this.state.event_start_end == "")
  {
ToastAndroid.show("Please select event end date",ToastAndroid.SHORT);
  }else if(this.state.event_end_time == "")
  {
ToastAndroid.show("Please select event end time",ToastAndroid.SHORT);
  }else{
  
  var data =
        {event:{
          ...this.props?.route?.params?.event,
          name:this.state.event_title,
          description:this.state.event_description,
          start_date:this.state.event_start_date.format("YYYY-MM-DD"),
          start_time:this.state.event_start_time,
          end_date:this.state.event_end_date.format("YYYY-MM-DD"),
          end_time:this.state.event_end_time,
        }
    };
    delete data.event.category_name;
    delete data.event.category_id;
    data.event.store_id = parseInt(data.event.store_id);
    console.log(data);
    // alert(JSON.stringify(data));
    // return;
    this.props.navigation.navigate("event_type",data);
  }
}}
style={[mystyle.btn,{width:width-90,flexDirection:"row",justifyContent:"center",alignItems:"center"}]}>
<Text style={{color:"white",fontSize:12}}>Next</Text>
 </TouchableOpacity>
</View>

{this.state.kyUp?<View style={{height:250,width:width-50}}></View>:null}
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
EventsClass.defaultProps = {
  event:{
    category_name:""
  }
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(EventsClass);

