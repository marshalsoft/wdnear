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
    KeyboardAvoidingView,
    BackAndroid,
    WebView,
    Switch,
    AsyncStorage,
    ViewPagerAndroid,
    BackHandler,
    Image,
    PanResponder,
    Modal, 
    Alert} from 'react-native';

    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';
import { postDATA,PasswordStrength,returnComma,getDATA,returnMobile,returnAllNumbers} from '../includes/func';
const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import Loader from '../components/loader';
import Country from '../includes/countries';
import {DocumentPicker,DocumentPickerUtil} from "react-native-document-picker";
import FS from 'rn-fetch-blob';

class EventTypeClass extends PureComponent{
    componentDidMount()
    {

}


    constructor(props)
    {
        super(props);
        this.state = {
            business_name:"",
            loading:true,
            showLoader:false,
            isProcessing:true,
            errorInfo:"Please wait...",
            success:false,
            event_venue:"",
            event_tag:"",
            event_taglist:[],
            event_website:"",
            event_banner:{uri:""},
            event_Organizer_details:"",
            event_Organizer_mobile:"",
            imageload:false,
            scrVenable:false,
            country:"",
            selectedCountry:{
            flag:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUCAIAAAAVyRqTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0RjI4OEFDMTE3ODQxMUUyQTcxNDlDNEFCRkNENzc2NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0RjI4OEFDMjE3ODQxMUUyQTcxNDlDNEFCRkNENzc2NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjRGMjg4QUJGMTc4NDExRTJBNzE0OUM0QUJGQ0Q3NzY2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjRGMjg4QUMwMTc4NDExRTJBNzE0OUM0QUJGQ0Q3NzY2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+qCpo0QAAADBJREFUeNpiZGgPZMAN/leswyPL2BGER5aJgWZg1OhRo0eNHjV61OhRo2lnNECAAQBu1gQALTkVbAAAAABJRU5ErkJggg==",
            name:"Nigeria",calling_code:"234"},
            showCountryList:false,
            }
    }
 
componentWillUnmount()
{

}
validateUrl(value) {
  var url = String(value).toLowerCase().replace("http://","").replace("https://","")
  var spliUrl = String(url).split(".");
  var patt = new RegExp(/[0-9]/);
  var res = patt.test(spliUrl[spliUrl.length -1]);
  if(spliUrl.length < 3)
  {
    return false;
  }else if(spliUrl[0] !== "www")
  {
      return false;
  }else if(res)
  {
      return false;
  }else{
      return true;
  }
  }
render() 
{
return(<KeyboardAvoidingView 
  behavior="padding"
  keyboardVerticalOffset={40}  style={[mystyle.window,{backgroundColor:"white"}]} >
<View style={{flex:1,justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
<View style={{width:width,height:70,justifyContent:"center",alignItems:"center",backgroundColor:"#f9f5f5",elevation:3}}>
<TouchableOpacity onPress={()=>{
const Actions = this.props.navigation;
Actions.goBack();
}} style={[{width:60,height:70,justifyContent:"center",alignItems:"center",position:"absolute",top:0,left:0,zIndex:99}]}>
<Icon.MaterialIcons color={"red"} name="keyboard-arrow-left" size={30} />
</TouchableOpacity>
<View >
    <Text style={{color:"black",fontSize:18}}>Event banner</Text>
</View>
</View>
<ScrollView 
keyboardShouldPersistTaps="always"
ref={e=>this.Scrt=e}

style={{flex:1}} >
<View style={{width:width,alignItems:"center",flexDirection:"column",paddingBottom:70}} >
<View style={{justifyContent:"center",alignItems:"flex-start",paddingLeft:30,marginBottom:10,width:"100%",paddingTop:10}}>
<Text style={{fontSize:14,color:"black"}}>EVENT IMAGE (required)</Text>
</View>
<View style={{padding:10,width:width-10,backgroundColor:"#f3f3f3",borderRadius:10,borderColor:"#cecece",borderWidth:0.5,flexDirection:"column",marginBottom:5}}>
{this.state.event_banner.uri != ""?<Image source={this.state.event_banner} style={{width:width-30,height:150,marginBottom:5}} resizeMode="cover" />:null}
<TouchableOpacity
onPress={()=>{
  this.setState({imageload:true});
    DocumentPicker.show({
        filetype: [DocumentPickerUtil.images()],
      },(error,res)=>{
    if(error)
    {
    this.setState({imageload:false});
      return true;
    }
    // alert(JSON.stringify(res));
    var sizeInMB = (res.fileSize / (1024*1024)).toFixed(2);
    if(sizeInMB > 2)
    {
      this.setState({imageload:false});
      alert(`File size must less than or equal to 2MB`);
      return ;
    }
    res.path = res.uri;
    res.name = res.fileName;
    res.filename = res.fileName;
    this.setState({event_banner:res,imageload:false});
    return ;
    const { config, fs,android } = FS;
    let data = '';
    fs.readStream(
    res.uri,
    'base64',
    4095).then((ifstream) => {
      ifstream.open()
      ifstream.onData((chunk) => {
        data += chunk;
      })
      ifstream.onError((err) => {
        this.setState({imageload:false});
        // console.log('oops', err)
      })
      ifstream.onEnd(() => { 
       
        res.uri = "data:image/png;base64,"+data;
        this.setState({event_banner:res,imageload:false})
      // console.log(data)
      // alert(data)
      })
  })
    
})
}}
style={[{width:width-30,backgroundColor:"#fff",borderRadius:5,borderColor:"#707070",height:40,borderWidth:0.5,marginBottom:5,flexDirection:"row"}]}>
<View style={{padding:20,justifyContent:"center",alignItems:"flex-start",flex:1}}>
<Text style={{fontSize:10,marginLeft:15}}>{this.state.event_banner.uri == ""?"Select image file (banner)":this.state.event_banner.fileName}</Text>
{this.state.imageload?<ActivityIndicator size="small" color={mystyle.active.color} style={{position:"absolute",left:5}} />:null}
</View>
<View 
style={{justifyContent:"center",alignItems:"center",width:70,height:40,backgroundColor:"#d8d8d8"}}>
<Text style={{fontSize:12}}>{this.state.event_banner.uri == ""?"Upload":"Change"}</Text>
</View>
</TouchableOpacity>
<Text style={{width:width-30,fontSize:12,color:"#000"}}>Image format must be png, jpg or gif and the size should not exceed
8 MB.</Text>
</View>
{/* <View style={{justifyContent:"center",alignItems:"flex-start",paddingLeft:35,width:"100%",paddingTop:10}}>
<Text >EVENT TAGS (Optional)</Text>
</View>
<View style={{flexDirection:"row",flexWrap:"wrap",justifyContent:"flex-start",alignContent:"flex-start",alignItems:"flex-start",padding:5,width:width-30}}>
{this.state.event_taglist.map((a,i)=><View key={i} style={{justifyContent:"center",alignItems:"center",alignSelf:"center"}}><View style={{padding:5,margin:5,alignSelf:"center",backgroundColor:"#dffcf5",borderRadius:15,paddingHorizontal:10}}>
<Text style={{fontSize:10}}>#{a}</Text>

</View>
<TouchableOpacity
onPress={()=>{
  this.setState({event_taglist:[...this.state.event_taglist.filter((b,i)=>b != a)]})
}}
style={{borderRadius:20,padding:2,backgroundColor:"red",alignSelf:"center",width:15,height:15,position:"absolute",elevation:1,right:-5,top:-5,justifyContent:"center",alignItems:"center"}}
>
  <Icon.Ionicons name="ios-close" />
</TouchableOpacity>
</View>)}
</View>
<View style={[mystyle.regInput,{width:width-70,backgroundColor:"#f3f3f3",borderRadius:5,borderColor:"#cecece",borderWidth:0.5,flexDirection:"row"}]}>
<TextInput 
    keyboardType="default"
    placeholder="tag..."
    value={this.state.event_tag}
    onChangeText={(d)=>{
        this.setState({event_tag:String(d).replace(/[ ]/g,"")})
    }}
    onFocus={()=>{
      this.setState({scrVenable:true});
    }}
    style={{color:"#000",fontSize:16,flex:1,textAlignVertical:"center",textAlign:"left",paddingHorizontal:10,height:40}}
    />
{this.state.event_tag != ""?<TouchableOpacity
onPress={()=>{
  this.setState({event_taglist:[...this.state.event_taglist.filter((a,i)=>a != this.state.event_tag),this.state.event_tag],event_tag:""})
}}
style={[mystyle.btn,{borderRadius:20,alignSelf:"center",width:15,height:30,width:60,justifyContent:"center",alignItems:"center"}]}
>
<Text style={{color:"white"}}>Add</Text>
</TouchableOpacity>:null}
    </View> */}

<View style={{justifyContent:"center",alignItems:"flex-start",paddingLeft:35,width:"100%",paddingTop:10}}>
<Text style={{fontSize:14,color:"black"}}>VENUE DETAILS</Text>
</View>
<View style={[mystyle.regInput,{width:width-70,backgroundColor:"#f3f3f3",borderRadius:5,borderColor:"#cecece",borderWidth:0.5}]}>
<TextInput 
    keyboardType="default"
    multiline
    maxLength={500}
    placeholder="Venue details..."
    value={this.state.event_venue}
    onChangeText={(d)=>{
        this.setState({event_venue:d})
    }}
    style={{color:"#000",fontSize:14,flex:1,textAlignVertical:"top",textAlign:"left",paddingHorizontal:10,minHeight:100}}
    />
</View>
<View style={{width:"80%"}}>
  <Text style={{fontSize:10,marginTop:-10}}>Word Count: ({this.state.event_venue.length} of 500)</Text>
</View>
<View style={{justifyContent:"center",alignItems:"flex-start",paddingLeft:35,width:"100%",paddingTop:10}}>
<Text style={{fontSize:14,color:"black"}}>ORGANIZER'S DETAILS</Text>
</View>
<View style={[mystyle.regInput,{width:width-70,backgroundColor:"#f3f3f3",borderRadius:5,borderColor:"#cecece",borderWidth:0.5,flexDirection:"row"}]}>

<TextInput 
    keyboardType="default"
    multiline
    maxLength={500}
    placeholder="Organizer details..."
    value={this.state.event_Organizer_details}
    onChangeText={(d)=>{
        this.setState({event_Organizer_details:d})
    }}
    style={{color:"#000",fontSize:14,flex:1,textAlignVertical:"top",textAlign:"left",paddingHorizontal:10,minHeight:100}}
    />  
</View>
<View style={{justifyContent:"center",alignItems:"flex-start",paddingLeft:35,width:"100%",paddingTop:10}}>
<Text style={{fontSize:14,color:"black"}}>ORGANIZER'S PHONE</Text>
</View>
<View style={[mystyle.regInput,{width:width-70,backgroundColor:"#f3f3f3",borderRadius:5,borderColor:"#cecece",borderWidth:0.5,flexDirection:"row",height:40}]}>
<TouchableOpacity
onPress={()=>{
  this.setState({showCountryList:true})
}}
style={[{width:70,height:40,backgroundColor:"white",justifyContent:"center",alignItems:"center",flexDirection:"row",overflow:"hidden",borderWidth:1,borderColor:"#f3f3f3",borderTopLeftRadius:10,borderBottomLeftRadius:10}]}>
<Image source={{uri:String(this.state.selectedCountry.flag).includes("data:image/png;base64,")?this.state.selectedCountry.flag:"data:image/png;base64,"+this.state.selectedCountry.flag}} style={{width:25,height:15}} resizeMode="cover"/>
<Icon.SimpleLineIcons name="arrow-down" size={12} color="black"  style={{paddingHorizontal:5}} />
</TouchableOpacity>
<TextInput 
    keyboardType="phone-pad"
    maxLength={10}
    placeholder="Organizer mobile..."
    value={this.state.event_Organizer_mobile}
    onChangeText={(d)=>{
        this.setState({event_Organizer_mobile:returnMobile(d)})
    }}
    style={{color:"#000",fontSize:14,flex:1,textAlignVertical:"top",textAlign:"left",paddingHorizontal:10,height:45}}
    />  
</View>
<View style={{width:"80%"}}>
  <Text style={{fontSize:10,marginTop:-10}}>Word Count: ({this.state.event_Organizer_details.length} of 500)</Text>
</View>
<View style={{justifyContent:"center",alignItems:"flex-start",paddingLeft:35,marginBottom:10,width:"100%",paddingTop:10}}>
<Text style={{fontSize:14,color:"black"}}>EVENT WEBSITE (optional)</Text>
</View>
<View style={{padding:10,backgroundColor:"#f3f3f3",borderRadius:10,borderColor:"#cecece",borderWidth:0.5,flexDirection:"column"}}>
<View style={[{width:width-90,backgroundColor:"#fff",borderRadius:5,borderColor:"#707070",borderWidth:0.5,marginBottom:15}]}>
<TextInput 
    keyboardType="default"
    placeholder="http(s)://www.mysite.com"
    maxLength={100}
    onChangeText={(d)=>{
      this.setState({event_website:String(d).replace(/[ ]/g,'')});
    }}
    value={this.state.event_website}
    style={{color:"#000",fontSize:14,flex:1,textAlignVertical:"center",textAlign:"left",paddingHorizontal:10}}
    />
</View>
</View>
<View style={[mystyle.btn,{width:width-90,flexDirection:"column",padding:0,overflow:"hidden",width:150,flexDirection:"row",marginTop:30}]} >
<TouchableOpacity 
onPress={()=>{
if(this.state.event_banner.uri == "")
  {
ToastAndroid.show("Please select event banner",ToastAndroid.SHORT);
  }else if(this.state.event_venue == "")
  {
ToastAndroid.show("Please enter venue details",ToastAndroid.SHORT);
  }else if(this.state.event_Organizer_details == "")
  {
ToastAndroid.show("Please enter organizer's details",ToastAndroid.SHORT);
  }else if(this.state.event_Organizer_mobile == "")
  {
ToastAndroid.show("Please enter organizer's mobile",ToastAndroid.SHORT);
  }else{
    var url = this.state.event_website;
   if(url != "")
  {
    if(!String(url).includes("http"))
    {
      url = "http://"+url;
    }
  if(!this.validateUrl(url))
  {
  ToastAndroid.show("Please enter a valid website",ToastAndroid.SHORT);
  return ; 
  }
  } 
  var data = {
    event:{
            ...this.props?.route?.params?.event,
            images:this.state.event_banner,
            lat:this.props.Reducer.latitude,
            lng:this.props.Reducer.longitude,
            organizer_details:this.state.event_Organizer_details,
            phone:this.state.selectedCountry.calling_code+this.state.event_Organizer_mobile,
            address:this.state.event_venue
    }
  }
    if(this.state.event_website != "")
    {
      data.event.website = "http://"+this.state.event_website.replace("https://").replace("http://");
    }
    console.log(data);
    // return;
    this.props.navigation.navigate("event_more",data);
  }
}}
style={[mystyle.btn,{width:width-90,flexDirection:"row",justifyContent:"center",alignItems:"center"}]}>
<Text style={{color:"white",fontSize:12}}>Next</Text>
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
this.setState(d);
}} />
</KeyboardAvoidingView>)
    }
}
EventTypeClass.defaultProps = {
  event_title:"",
  description:"",
  event_category:"",
  start_date:"",
  start_time:"",
  end_date:"",
  end_time:"",
  event_banner:{}
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(EventTypeClass);

