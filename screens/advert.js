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
    Slider,
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
    PanResponder,
    DeviceEventEmitter,
    KeyboardAvoidingView,
    Modal, 
    Alert} from 'react-native';
    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';
import { postDATA,PasswordStrength,getDATA,returnMobile,returnComma,returnAllNumbers,Emailvalidate} from '../includes/func';
import { Picker } from '@react-native-picker/picker';
const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import Loader from '../components/loader';
import Country from '../includes/countries';
import {DocumentPicker,DocumentPickerUtil} from "react-native-document-picker";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Moment from 'moment';
import ImagePreview from 'react-native-image-preview';

class AdvertClass extends PureComponent{
componentDidMount()
{
    //  this.setState({mobile:returnMobile(this.props.telephone),username:this.props.username})   
    this.setState({mylocation:this.props.address,
    latitude:this.props.latitude,
    longitude:this.props.longitude,...this.props.advert});
    // this.getCategory();
    this.getBilling();
    setTimeout(()=>{
       this.DE = DeviceEventEmitter.emit("ads",{});
       },6000)
}

 Next()
 {
    if(this.state.business_name == "")
    {
    this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter service name, thanks."})
    }else if(this.state.business_description == "")
    {
    this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter description, thanks."})
   }else if(String(this.state.business_email).trim() == "")
   {
   this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter email, thanks."})
   }else if(!Emailvalidate(String(this.state.business_email).trim()))
   {
   this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter a valid email address, thanks."})
   }else if(this.state.business_mobile == "")
   {
   this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter phone number, thanks."})
   }else if(this.state.business_mobile.length != 10)
   {
   this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter a valid phone number, thanks."})
   }else if(this.state.business_address == "")
   {
   this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter business address, thanks."})
   }else{
    if(this.state.business_website != "")
    {
       if(!this.validateUrl(this.state.business_website))
       {
           alert("Please enter a valid website")
           return;
       }
    }
    this.SlideView.scrollTo({x:width,y:0,animated:true});
    }
 }
    constructor(props)
    {
        super(props);
        this.state = {
            module_id:"",
            module_name:"",
            business_name:"",
            module_category:"",
            business_address:"",
            business_mobile:"",
            business_email:"",
            business_website:"",
            bussines_category:"",
            business_description:"",
            business_target_audience:"",
            business_target_audience_default:false,
            loading:true,
            showLoader:false,
            showSearch:false,
            plansloader:false,
            isProcessing:true,
            errorInfo:"Please wait...",
            success:false,
            kyUp:false,
            setLocation:false,
            advert_type:"Impression",
            audience_name:"",
            section:"",
            tabIndex:0,
            distance_range:1,
            mylocation:"",
            mylocation2:"",
            latitude:27.2038,
            longitude:77.5011,
            set_gender:["Male","Female"],
            age_range:6,
            set_age:18,
            bannerSize:{name:"",value:"",height:50},
            add_location:"",
            loading:false,
            banner:{uri:null,fileName:""},
            location_loading:false,
            listLocation:[],
            banners:[],
            plans:[],
            amount:0,
            allcountries:false,
            showPreview:false,
            imageZoom:null,
            country:"",
            selectedCountry:{
            flag:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUCAIAAAAVyRqTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0RjI4OEFDMTE3ODQxMUUyQTcxNDlDNEFCRkNENzc2NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0RjI4OEFDMjE3ODQxMUUyQTcxNDlDNEFCRkNENzc2NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjRGMjg4QUJGMTc4NDExRTJBNzE0OUM0QUJGQ0Q3NzY2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjRGMjg4QUMwMTc4NDExRTJBNzE0OUM0QUJGQ0Q3NzY2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+qCpo0QAAADBJREFUeNpiZGgPZMAN/leswyPL2BGER5aJgWZg1OhRo0eNHjV61OhRo2lnNECAAQBu1gQALTkVbAAAAABJRU5ErkJggg==",
            name:"Nigeria",calling_code:"234"},
            showCountryList:false,
            min_age:6,
            max_age:11
            }
            this.animSize = new Animated.Value(50);
            this.animAgeSize = new Animated.Value(18);
    }
    getBilling()
    {
     this.setState({plansloader:true},()=>postDATA("campaign/getAdvertPricing",{
     user_id:parseInt(this.props.id_user)
     }).then((res)=>{
         console.log(res);
        var plans = [];
        var banners = [];
        var colors = [
            "rgba(252,186,47,0.4)",
            "rgba(145,255,158,0.4)",
            "rgba(112,206,252,0.4)",
            "rgba(238,49,36,0.4)"
        ];
        try{
        if(res.result.banners)
        {
             banners = res.result.banners.map((a,i)=>{
                var h = a.key == "half"?(height/2):a.key  == "full"?height:parseInt(a.key);
                var n = a.key  == "half"?"Half Screen":a.key  == "full"?"Full Screen":`width:${parseInt(width)} x height:`+a.key;
                 return {name:n,value:a.value,height:h};
             });
            if(banners.length != 0){
                this.setState({bannerSize:banners[0]})
            }
        }
        }catch(e){ }
        try{
        plans = res.result.plans.map((a,i)=>{
            a.color = colors[i];
            a.height = parseInt(a.height);
            return a;
           })
        }catch(e){ }
        console.log("banners:",banners);
        console.log("plans:",plans);
       this.setState({plansloader:false,banners,plans});
     }));
    }
componentWillUnmount()
{
if(this.DE)
{
 this.DE.remove();
}
}
getLatLng(address)
{
    // this.setState({add_location:d,loading:true},()=>{
        var x = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${this.props.googleKey}`;
       console.log(x);
        fetch(x).then((res)=>res.json()).then((res)=>{
    //    console.log(res);
       if(res.status = "OK")
       {
        const {location} = res.results[0].geometry;
       console.log(location);
        this.setState({latitude:location.lat,longitude:location.lng},()=>{
            console.log(this.state.latitude);
        }); 
       }
    // })
    })
}
searchLocation(d)
{
this.setState({add_location:d,loading:true},()=>{
    var x = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${d}&key=${this.props.googleKey}`;
   console.log(x);
    fetch(x).then((res)=>res.json()).then((res)=>{
   console.log(res);
    this.setState({loading:false,listLocation:res.predictions}); 
})  
})
}
getLocation(lt,lng)
{
 this.setState({latitude:lt,longitude:lng,location_loading:true},()=>{
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lt},${lng}&key=${this.props.googleKey}`).then((res)=>res.json()).then((res)=>{
        this.setState({location_loading:false}); 
      if(res.status == "OK")
           {
           var address = res.results[0].formatted_address;
           console.log(address);
           this.setState({mylocation:address,mylocation2:address});
           }
      }) 
 });
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
const {advert_type,loading,
    listLocation,
    audience_name,
    business_description,
    business_target_audience_default,
    business_name,bussines_category,
    bannerSize,
    amount,
    business_target_audience,longitude,latitude,plans} = this.state;
    const {advert} = this.props;
    const Actions = this.props.navigation;
return(<View style={[mystyle.window,{backgroundColor:"white"}]} >
 <View style={{width:width,height:height,flexDirection:"column"}}> 
<ScrollView 
keyboardShouldPersistTaps="always"
horizontal
ref={e=>this.SlideView=e}
pagingEnabled
scrollEnabled={false}
style={{width:width,height:height}}>
<View style={{width:width,height:height,justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
<View style={{width:width,height:70,justifyContent:"center",alignItems:"center",backgroundColor:mystyle.active.color}}>
<TouchableOpacity onPress={()=>{
Actions.goBack();
}} style={[{width:60,height:70,justifyContent:"center",alignItems:"center",position:"absolute",top:0,left:0,zIndex:99}]}>
<Icon.MaterialIcons color={"white"} name="keyboard-arrow-left" size={30} />
</TouchableOpacity>
<View >
    <Text style={{color:"white",fontSize:18}}>PLACE YOUR ADVERT</Text>
</View>
</View>
<KeyboardAvoidingView style={{flex:1}}>
<ScrollView 
keyboardShouldPersistTaps="always"
keyboardShouldPersistTaps="always"
ref={e=>this.VwSc=e}
onContentSizeChange={()=>{
    if(this.VwSc && this.state.kyUp)
    {
        this.VwSc.scrollToEnd({animated:true})
    }
}}
style={{flex:1}} >
<View style={{width:width,minHeight:height,alignItems:"center",flexDirection:"column"}} >
<View style={{justifyContent:"center",paddingLeft:50,width:"100%",paddingTop:20}}>
</View>
<View style={{width:width-90}}>
<Text >Name of service or product</Text>
</View>
<View style={[mystyle.regInput,{width:width-90}]}>
<TextInput 
    keyboardType="default"
    placeholder="Name of service and product"
   onChangeText={(d)=>this.setState({business_name:d})}
    value={this.state.business_name}
    style={{color:"#000",fontSize:14,flex:1,textAlignVertical:"top",textAlign:"left",paddingHorizontal:10}}
    autoCapitalize={false}
    />
</View>
<View style={{width:width-90}}>
<Text >Description of services and products</Text>
</View>
<View style={[mystyle.regInput,{width:width-90}]}>
<TextInput 
    keyboardType="default"
    placeholder=""
    multiline
    value={this.state.business_description}
    onChangeText={(d)=>{
        this.setState({business_description:d})
    }}
    style={{color:"#000",fontSize:18,flex:1,textAlignVertical:"top",textAlign:"left",paddingHorizontal:10,minHeight:100}}
    />
   
    </View>
    <View style={{width:width-90}}>
<Text >Email</Text>
</View>
<View style={[mystyle.regInput,{width:width-90}]}>
<TextInput 
    keyboardType="default"
    placeholder="Business email"
    maxLength={50}
   onChangeText={(d)=>this.setState({business_email:String(d).trim()})}
    value={this.state.business_email}
    style={{color:"#000",fontSize:14,flex:1,textAlignVertical:"top",textAlign:"left",paddingHorizontal:10}}
    />
</View>
<View style={{width:width-90}}>
<Text >Phone number</Text>
</View>
<View style={[mystyle.regInput,{width:width-90,borderRadius:10,borderColor:"#cecece",borderWidth:0.5,flexDirection:"row",height:45}]}>
<TouchableOpacity
onPress={()=>{
  this.setState({showCountryList:true})
}}
style={[{width:70,height:45,backgroundColor:"white",justifyContent:"center",alignItems:"center",flexDirection:"row",overflow:"hidden",borderWidth:1,borderColor:mystyle.regInput.backgroundColor,borderTopLeftRadius:10,borderBottomLeftRadius:10}]}>
<Image source={{uri:String(this.state.selectedCountry.flag).includes("data:image/png;base64,")?this.state.selectedCountry.flag:"data:image/png;base64,"+this.state.selectedCountry.flag}} style={{width:25,height:15}} resizeMode="cover" />
<Icon.SimpleLineIcons name="arrow-down" size={12} color="black"  style={{paddingHorizontal:5}} />
</TouchableOpacity>
<TextInput 
    keyboardType="phone-pad"
    maxLength={10}
    placeholder="Business mobile"
    value={this.state.business_mobile}
    onChangeText={(d)=>{
        this.setState({business_mobile:returnMobile(d)})
    }}
    style={{color:"#000",fontSize:14,flex:1,textAlignVertical:"top",textAlign:"left",paddingHorizontal:10,height:45}}
    />  
</View>

<View style={{width:width-90}}>
<Text >Address</Text>
</View>
<View style={[mystyle.regInput,{width:width-90}]}>
<TextInput 
    keyboardType="default"
    multiline
    placeholder="Business address"
    maxLength={60}
   onChangeText={(d)=>this.setState({business_address:d})}
    value={this.state.business_address}
    style={{color:"#000",fontSize:14,flex:1,textAlignVertical:"top",textAlign:"left",paddingHorizontal:10}}
    />
</View>
<View style={{width:width-90}}>
<Text >Website (Optional)</Text>
</View>
<View style={[mystyle.regInput,{width:width-90}]}>
<TextInput 
    keyboardType="default"
    maxLength={50}
    placeholder="Business website"
   onChangeText={(d)=>this.setState({business_website:String(d).replace(/[ ]/,'')})}
    value={this.state.business_website}
    style={{color:"#000",fontSize:14,flex:1,textAlignVertical:"top",textAlign:"left",paddingHorizontal:10}}
   onFocus={()=>this.setState({kyUp:true})}
   onBlur={()=>this.setState({kyUp:false})}
   autoCapitalize={false}
    />
</View>
<Text style={{color:"black",width:"100%",marginLeft:50,marginVertical:10}}>Set target audience</Text>
<View style={{height:2,backgroundColor:"red",width:width}}></View>
<View
onPress={()=>{
    Actions.terms();
}}
style={{width:"80%",flexDirection:"row",alignItems:"center",marginTop:10}}>
<View style={{flexDirection:"row"}}>
<Text style={{paddingLeft:10,fontSize:12,alignItems:"center"}}>By tapping on create your audience, you have agreed to wedeynear </Text>
 <TouchableOpacity
onPress={()=>{
      Actions.terms();
  }} style={{flexWrap:"wrap"}}>
<Text style={{color:"red",alignItems:"center",fontSize:12}}>terms and conditions</Text>
</TouchableOpacity>
</View>
</View>
<TouchableOpacity
onPress={()=>{
    // if(!this.state.terms)
    // {
    //     ToastAndroid.show("Please agree to terms and conditions",ToastAndroid.SHORT);
    //     return ;
    // }
    this.Next();
}}
style={{width:"80%",flexDirection:"row",alignItems:"center",marginTop:10}}>
<View style={{flexDirection:"column",flex:1}}>
<Text style={{width:width,paddingLeft:10,fontWeight:"bold"}}>Create your own audience</Text>
<Text style={{width:width,paddingLeft:10,fontSize:12}}>WeDeyNear will target people at random</Text>
</View>
<View style={{width:60,height:70,justifyContent:"center",alignItems:"center"}}>
<Icon.MaterialIcons name="keyboard-arrow-right" size={30} />
</View>
</TouchableOpacity>
<TouchableOpacity onPress={()=>{
  this.Next();
}} style={[{width:120,height:50,backgroundColor:"red",justifyContent:"center",alignItems:"center",borderRadius:50,elevation:5,marginTop:30,flexDirection:"row",marginBottom:60}]}>
<Text style={{color:"white"}}>Next</Text>
<Icon.MaterialIcons name="keyboard-arrow-right" color={"white"} size={30} />
</TouchableOpacity>
{this.state.kyUp?<View style={{height:210,width:width-50}}></View>:null}
</View>
</ScrollView>
</KeyboardAvoidingView>
</View>
<View style={{width:width,height:height,justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
<View style={{width:width,height:70,justifyContent:"center",alignItems:"center",backgroundColor:"white",elevation:3}}>
<TouchableOpacity onPress={()=>{
    this.SlideView.scrollTo({x:0,y:0,animated:true});
}} style={[{width:60,height:70,justifyContent:"center",alignItems:"center",position:"absolute",top:0,left:0,zIndex:99}]}>
<Icon.MaterialIcons color={mystyle.active.color} name="keyboard-arrow-left" size={30} />
</TouchableOpacity>
<View >
    <Text style={{color:"black",fontSize:18}}>Create Audience</Text>
</View>
</View>
<ScrollView 
keyboardShouldPersistTaps="always"style={{flex:1}} >
<View style={{width:width,minHeight:height,alignItems:"center",flexDirection:"column"}} >
<View style={{width:width,minHeight:100,alignItems:"center",flexDirection:"column",justifyContent:"center"}} >
<Text style={{fontSize:22,color:"black",fontWeight:"bold"}}>1,000</Text>
<Text style={{fontSize:12}}>Potential people reached</Text>
<View style={{width:width,marginTop:10,alignItems:"center",flexDirection:"row",justifyContent:"center"}} >
{["","","a"].map((a,i)=><View key={i} style={{width:50,marginHorizontal:2,height:2,backgroundColor:a == ""?"limegreen":"#ccc"}} >

</View>)}
</View>
</View>
<View style={{flexDirection:"row",width:width-60}}>
<View style={{flexDirection:"column",flex:1}}>
<Text style={{width:width,paddingLeft:10,fontWeight:"bold"}}>All Countries</Text>
<Text style={{width:"100%",paddingLeft:10,marginBottom:10,fontSize:10}}>I want my advert be view accross the world</Text>
</View>
<View style={{flexDirection:"column",width:60}}>
<Switch 
onValueChange={()=>{
    this.setState({allcountries:!this.state.allcountries})
}}
value={this.state.allcountries}
/>
</View>
</View>
{!this.state.allcountries?<TouchableOpacity
onPress={()=>{
    this.SlideView.scrollTo({x:width*2,y:0,animated:false});
    this.setState({section:"location"})
}}
style={{width:"80%",flexDirection:"row",alignItems:"center",marginVertical:20}}>

<View style={{flexDirection:"column",flex:1,flexWrap:"wrap"}}>
<Text style={{width:width,fontWeight:"bold"}}>Location</Text>
<Text style={{width:"100%",paddingLeft:5,marginBottom:10}}>{String(this.state.mylocation).split(",").filter((a,i)=> i != 0).map((a,i)=>{
    return " > "+a;
}).join(`\n`)}</Text>
</View>
<View style={{width:30,height:70,justifyContent:"center",alignItems:"center"}}>
<Icon.SimpleLineIcons name="arrow-right" size={20} />
</View>
</TouchableOpacity>:null}
<View style={{flexDirection:"row",width:width-60,marginBottom:20}}>
<Text style={{paddingLeft:10,fontWeight:"bold"}}>Distance:</Text>
<Text style={{paddingLeft:10}}>{this.state.distance_range}km</Text>
</View>
<View style={{height:2,backgroundColor:"red",width:width-30}}></View>
<TouchableOpacity
onPress={()=>{
    this.SlideView.scrollTo({x:width*2,y:0,animated:true});
    this.setState({section:"age"})
}}
style={{width:"80%",flexDirection:"row",alignItems:"center",marginVertical:20}}>
<View style={{flexDirection:"column",flex:1}}>
<Text style={{width:width,paddingLeft:10,fontWeight:"bold"}}>Age & Gender</Text>
<Text style={{width:width,paddingLeft:10}}>Range: {[this.state.min_age,this.state.max_age].join(" - ")}{`\nGender: `+this.state.set_gender.join(" & ")}</Text>
</View>
<View style={{width:30,height:70,justifyContent:"center",alignItems:"center"}}>
<Icon.SimpleLineIcons name="arrow-right" size={20} />
</View>
</TouchableOpacity>
<View style={{height:2,backgroundColor:"red",width:width-30}}></View>
<View style={{width:width,marginTop:30,justifyContent:"center",alignItems:"center",flexDirection:"row"}} >
<TouchableOpacity onPress={()=>{
    this.SlideView.scrollTo({x:width*3,y:0,animated:true});
}} style={[{width:120,height:50,backgroundColor:"red",justifyContent:"center",alignItems:"center",borderRadius:50,elevation:5,marginTop:50,flexDirection:"row"}]}>
<Text style={{color:"white"}}>Next</Text>
<Icon.MaterialIcons name="keyboard-arrow-right" color={"white"} size={30} />
</TouchableOpacity>
</View>
</View>
</ScrollView>
</View>
<View style={{width:width,height:height,justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
<View style={{width:width,height:60,flexDirection:"column",justifyContent:"center",alignItems:"center",elevation:3,borderBottomColor:"#444",borderBottomWidth:0.2}}>
{this.state.section == "location"?<View style={[mystyle.regInput,{width:width-30,height:40,flexDirection:"row",justifyContent:"center",alignItems:"center"}]}>
<TouchableOpacity
onPress={()=>{
    this.setState({showSearch:true})
}} style={{flex:1}}>
<TextInput 
editable={false}
    keyboardType="default"
    placeholder="Search location..."
    value={this.state.add_location}
    style={{color:"#000",fontSize:14,flex:1,textAlign:"left",paddingLeft:50}}
    />
    <Icon.Evilicons name="search" style={{position:"absolute",left:10,top:10,fontSize:30}} />
</TouchableOpacity>
</View>:<Text style={{fontWeight:"bold"}}>Select Age & Gender</Text>}
</View>
<ScrollView 
keyboardShouldPersistTaps="always"style={{flex:1}} >
<View style={{width:width,paddingVertical:20,paddingBottom:50,alignItems:"center",flexDirection:"column"}} >
{this.state.section == "location"?<View style={{width:width,flexDirection:"column",alignItems:"center"}}>
<View style={{width:width,alignItems:"center"}}>
<View style={{width:width,backgroundColor:"#ccc",justifyContent:"center",alignItems:"center"}}>

<View style={{width:width,height:width}}>
<MapView
     // remove if not using Google Maps
       style={{width:width,height:width}}
       initialRegion={{
         latitude:this.state.latitude,
         longitude:this.state.longitude,
         latitudeDelta: 0.015,
         longitudeDelta: 0.0121,
       }}
       region={{
         latitude:this.state.latitude,
         longitude:this.state.longitude,
         latitudeDelta: 0.015,
         longitudeDelta: 0.0121,
       }}
       onRegionChange={({latitude,longitude})=>{
        console.log(latitude,longitude);
       }}
       onRegionChangeComplete={({latitude,longitude})=>{
        //    console.log(latitude,longitude);
        this.getLocation(latitude,longitude);
       }}
       showsUserLocation
       showsMyLocationButton
       provider={PROVIDER_GOOGLE}
     >
     </MapView>
     </View> 
     <Animated.View style={{width:this.animSize,
        height:this.animSize,
        backgroundColor:"rgba(0,0,0,0.4)",
        borderRadius:this.animSize,
        position:"absolute",
        justifyContent:"center",alignItems:"center",
        zIndex:999}}>
        <Icon.FontAwesome size={30} name="map-marker" color="red"/>
    </Animated.View>
</View>
<View style={{width:width-10,flexDirection:"row",padding:15}}>
<View style={{flex:1,justifyContent:"center",flexDirection:"column"}}>
<View style={{flexDirection:"column"}}>
<Text style={{fontWeight:"bold"}}>Use my current location</Text> 
<Text style={{fontSize:12}}>{String(this.props.address).split(",").filter((a,i)=> i != 0).join(",")}</Text> 
<Text style={{fontWeight:"bold",marginTop:10}}>Target location</Text>
{this.state.location_loading?<ActivityIndicator size="small" color={mystyle.active.color}  style={{position:"absolute",left:0,top:75}}/>:null}
<Text style={{width:"100%",paddingLeft:20,marginBottom:10}}>{String(this.state.mylocation).split(",").filter((a,i)=> i != 0).map((a,i)=>{
    return " > "+a;
}).join(`\n`)}</Text>
</View>
</View>
<View style={{width:60}}>
    <Switch
    onValueChange={(d)=>{
        this.setState({setLocation:d})
    }}
    value={this.state.setLocation}
    /> 
</View>   
</View>
<View style={{height:1,backgroundColor:"red",width:width-30}}></View>
<View style={{width:width-10,flexDirection:"column",padding:15}}>
<Text style={{}}>Radius</Text> 

<View style={{width:width-30}}>
 <Animated.Text style={{
    backgroundColor:"#eeeeee",
    width:50,
    textAlign:"center",
    transform:[
        {translateX:this.animSize}
    ]
}}>{this.state.distance_range}km</Animated.Text>
 </View>
<View style={{width:width-10,flexDirection:"row",marginTop:15,alignItems:"center"}}>
<View style={{width:10}}>
<Icon.MaterialIcons name="keyboard-arrow-left" />
</View>
<View style={{flex:1}}>
<Slider 
thumbTintColor="red"
minimumValue={50}
maximumValue={width}
minimumTrackTintColor="red"
maximumTrackTintColor="green"
step={10}
onValueChange={(d)=>{
console.log(d);
if(d <= 280)
{
    // d = d >= 230?240:d;
    this.animSize.setValue(d);
}
this.setState({distance_range:d});
}}
value={this.state.distance_range}
style={{width:width-140,alignSelf: 'center',transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]}}
// thumbImage={require('./images/tea.png')}
// trackImage={require('./images/tea.png')}
/>
</View>
<View style={{width:30}}>
<Icon.SimpleLineIcons name="arrow-right" size={10} />
</View>
</View>
</View>
</View>
</View>:null}
{this.state.section == "age"?<View style={{width:width,height:height-270,flexDirection:"column",alignItems:"center"}}>
<Text style={{width:"100%",paddingLeft:30,marginVertical:10}}>Age & Gender</Text>
<Text style={{
    backgroundColor:"#eeeeee",
    width:60,
    textAlign:"center",
    position:"absolute",
    left:130,
    top:10
}}>{this.state.min_age} to {this.state.max_age}</Text> 
<View style={{width:width-30}}> 
</View>
<View style={{width:width-30,flexDirection:"column",marginBottom:30}}>
<Text style={{fontSize:10,marginTop:15,fontWeight:"bold"}}>Min Age - ({this.state.min_age})</Text>
<View style={{width:"100%",flexDirection:"row",marginTop:15,alignItems:"center"}}>
<View style={{width:20,justifyContent:"center",alignItems:"center"}}>
<Icon.SimpleLineIcons name="arrow-left" size={15}/>
</View>
<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
<Slider 
thumbTintColor="red"
minimumValue={6}
maximumValue={80}
minimumTrackTintColor="red"
maximumTrackTintColor="green"
step={1}
onValueChange={(d)=>{
this.setState({min_age:d,max_age:d+5,ageSet:true});
}}
// value={this.state.age_range}
style={{width:"75%",alignSelf: 'center',transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]}}
/>
</View>
<View style={{width:20,justifyContent:"center",alignItems:"center"}}>
<Icon.SimpleLineIcons name="arrow-right"  size={15}/>
</View>
</View>
<Text style={{fontSize:10,marginTop:15,fontWeight:"bold"}}>Max Age - ({this.state.max_age})</Text>
<View style={{width:"100%",flexDirection:"row",marginTop:15,alignItems:"center"}}>
<View style={{width:20,justifyContent:"center",alignItems:"center"}}>
<Icon.SimpleLineIcons name="arrow-left" size={15}/>
</View>
<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
<Slider 
thumbTintColor="red"
minimumValue={this.state.min_age+5}
maximumValue={100}
minimumTrackTintColor="red"
maximumTrackTintColor="green"
step={1}
Value={this.state.min_age+5}
onValueChange={(d)=>{
this.setState({max_age:d,ageSet:true});
}}
style={{width:"75%",alignSelf: 'center',transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]}}
/>
</View>
<View style={{width:20,justifyContent:"center",alignItems:"center"}}>
<Icon.SimpleLineIcons name="arrow-right"  size={15}/>
</View>
</View></View>
<View style={{height:50,width:width-60,flexDirection:"row"}}>
  <View style={{flex:1,justifyContent:"center"}}>
      <Text>Male </Text>
  </View>
  <View style={{height:50,justifyContent:"center"}}>
      <Switch
      onValueChange={(d)=>{
          this.setState({set_gender:d?[...this.state.set_gender,"Male"]:this.state.set_gender.filter((a,i)=>a != "Male")});
      }} 
      value={this.state.set_gender.includes("Male")}
      />
  </View>
</View>
<View style={{height:50,width:width-60,flexDirection:"row"}}>
  <View style={{flex:1,justifyContent:"center"}}>
      <Text>Female</Text>
  </View>
  <View style={{height:50,justifyContent:"center"}}>
  <Switch
    onValueChange={(d)=>{
        this.setState({set_gender:d?[...this.state.set_gender,"Female"]:this.state.set_gender.filter((a,i)=>a != "Female")});
    }} 
    value={this.state.set_gender.includes("Female")}
      />
  </View>
</View>
</View>:null}
<TouchableOpacity 
onPress={()=>{
 this.SlideView.scrollTo({x:width,y:0,animated:true});
}}
 style={[mystyle.btn,{width:90,height:40,justifyContent:"center",alignItems:"center"}]}>
<Icon.MaterialIcons color={"white"} name="keyboard-arrow-left" size={20} />
<Text style={{fontSize:10,color:"white",marginLeft:5}}>Done</Text>
</TouchableOpacity>
</View>
</ScrollView>
</View>
<View style={{width:width,height:height,justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
<View style={{width:width,height:70,justifyContent:"center",alignItems:"center",backgroundColor:"white",elevation:3}}>
<TouchableOpacity onPress={()=>{
    this.SlideView.scrollTo({x:width,y:0,animated:false});
}} style={[{width:60,height:70,justifyContent:"center",alignItems:"center",position:"absolute",top:0,left:0,zIndex:99}]}>
<Icon.MaterialIcons color={mystyle.active.color} name="keyboard-arrow-left" size={30} />
</TouchableOpacity>
<View >
    <Text style={{color:"black",fontSize:18}}>Upload banner</Text>
</View>
</View>
<ScrollView 
keyboardShouldPersistTaps="always"style={{flex:1}} >
<View style={{width:width,minHeight:height,alignItems:"center",flexDirection:"column",paddingTop:10}} >
<View style={{width:width,minHeight:100,alignItems:"center",flexDirection:"column",justifyContent:"center"}} >
<Text style={{fontSize:22,color:"black",fontWeight:"bold"}}>1,000</Text>
<Text style={{fontSize:12}}>Potential people reached</Text>
<View style={{width:width,marginTop:10,alignItems:"center",flexDirection:"row",justifyContent:"center"}} >
{["","",""].map((a,i)=><View key={i} style={{width:50,marginHorizontal:2,height:2,backgroundColor:a == ""?"limegreen":"#ccc"}} >

</View>)}
</View>
</View>
<Text style={{color:"black",fontSize:14,marginBottom:5}}>Campaign Banner</Text>
<TouchableOpacity
activeOpacity={this.state.banner.uri != null?0.5:1}
 onPress={()=>{
     if(this.state.banner.uri != null)
     {
        this.setState({showPreview:true,imageZoom:this.state.banner.uri});
     }
}} style={{height:parseInt(this.state.bannerSize.height),backgroundColor:"#ccc",width:width,overflow:"hidden",borderColor:"#444",borderWidth:0.5}}>
<View >
    <Image source={this.state.banner.uri == null?require("../images/placeholder2.png"):{uri:this.state.banner.uri}}
    resizeMode="cover"  style={{height:this.state.bannerSize.height,width:width}}/>
<View style={{backgroundColor:"rgba(0,0,0,0.4)",height:50,position:"absolute",bottom:0,width,left:0,padding:10,flexDirection:"column"}}>
<Text style={{color:"white"}}>{this.state.banner.uri == null?"Add a":"Tap here to preview"} banner</Text>
<Text style={{color:"white",fontSize:10}}>Banner size:{this.state.bannerSize.name}</Text>
</View>
</View>
</TouchableOpacity>
<Text style={{color:"black",fontSize:14,marginTop:10}}>Select Banner Size</Text>
<View style={[mystyle.regInput,{width:width-30,alignItems:"center",justifyContent:"center",flexDirection:"row",height:40,overflow:"hidden",marginTop:5}]}>
{this.state.plansloader?<View style={{width:width-50,alignItems:"flex-start"}} >
 <ActivityIndicator size="small" color="red" />
</View>:<Picker
style={{width:"80%"}}
mode="dropdown"
onValueChange={(d,i)=>{
var dd =  this.state.banners[i];
console.log(dd);
this.setState({bannerSize:dd})
}}
selectedValue={this.state.bannerSize.name}
>
{this.state.banners.map((a,i)=><Picker.Item 
  key={i} value={a.name} label={a.name} />)}
</Picker>}
</View>

<TouchableOpacity
onPress={()=>{
    if(this.state.bannerSize.name == "")
    {
        ToastAndroid.show("Please select banner size",ToastAndroid.LONG)
        return true;
    }
 DocumentPicker.show({
    filetype: [DocumentPickerUtil.images()],
  },(error,res)=>{
if(error)
{
  return true;
}
var sizeInMB = (res.fileSize / (1024*1024)).toFixed(2);
console.log(sizeInMB);
// if(sizeInMB > 2)
// {
//   alert(`File size must less than or equal to 2MB`);
//   return ;
// }
res.path = res.uri;
res.name = res.fileName;
res.filename = res.fileName;
this.setState({banner:res})
console.log(res);
})

}}
style={[{width:200,height:50,backgroundColor:"red",justifyContent:"center",alignItems:"center",borderRadius:50,elevation:5,marginTop:50}]}
 >
<Text style={{color:"white"}}>{this.state.banner.uri == null?"Add":"Change"} Banner image</Text>
</TouchableOpacity>
{this.state.banner.uri == null?null:<TouchableOpacity
onPress={()=>{
 this.SlideView.scrollTo({x:width*4,y:0,animated:true});
}} style={[{width:150,height:50,backgroundColor:"red",justifyContent:"center",alignItems:"center",borderRadius:50,elevation:5,marginTop:50,flexDirection:"row"}]}>
<Text style={{color:"white"}}>Next</Text>
<Icon.MaterialIcons name="keyboard-arrow-right" color={"white"} size={30} />
</TouchableOpacity>}
<View style={{width:width,height:70}}></View>
</View>
</ScrollView>
</View>
<View style={{width:width,height:height,justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
<View style={{width:width,height:70,justifyContent:"center",alignItems:"center",backgroundColor:"white",elevation:3}}>
<TouchableOpacity onPress={()=>{
    this.SlideView.scrollTo({x:width*3,y:0,animated:true});
}} style={[{width:60,height:70,justifyContent:"center",alignItems:"center",position:"absolute",top:0,left:0,zIndex:99}]}>
<Icon.MaterialIcons color={mystyle.active.color} name="keyboard-arrow-left" size={30} />
</TouchableOpacity>
<View >
    <Text style={{color:"black",fontSize:18}}>Billing Plan</Text>
</View>
</View>
<ScrollView 
keyboardShouldPersistTaps="always"style={{flex:1}} >
<View style={{width:width,minHeight:height,alignItems:"center",flexDirection:"column"}} >
<View style={{width:width,minHeight:90,alignItems:"center",flexDirection:"column",justifyContent:"center"}} >
<Text style={{fontSize:22,color:"black",fontWeight:"bold"}}>You're all set</Text>
<Text style={{fontSize:12}}>Select a billing plan</Text>
</View>
<View style={{height:1,backgroundColor:"red",width:width-30}}></View>
<View style={{width:width,padding:10,alignItems:"center",flexDirection:"column",paddingVertical:20}} >
<ScrollView 
keyboardShouldPersistTaps="always"
horizontal
style={{flex:1}}
showsHorizontalScrollIndicator={false}
showsVerticalScrollIndicator={false}
style={{height:290}}
>
{plans.map((a,i,self)=><View key={i} style={[mystyle.card,{width:(width/2)-35,marginHorizontal:5,height:280,alignItems:"center",padding:20,flexDirection:"column",backgroundColor:a.color,elevation:0}]} >
<Text style={{fontSize:18,fontWeight:"bold"}}>{a.month} Month{`${parseInt(a.month) > 1?"s":""}`}</Text>
<Text style={{fontSize:16,color:mystyle.active.color}}>NGN{returnComma(`${parseInt(a.month)*this.state.bannerSize.value}`)}</Text>
<View style={{flex:1,alignItems:'center',paddingVertical:10}}>
    <Text style={{textAlign:"center"}}>If you select this billing plan, your campaign will run for a period of {a.month} Month before you have to pay again.</Text>
</View>
<TouchableOpacity
onPress={()=>{
    this.setState({plans:self.map((b,o)=>{
        b.select = i == o?true:false;
        if(i == o)
        {
          this.setState({amount:returnComma(`${parseInt(b.month)*this.state.bannerSize.value}`)})
        }
        return b;
    })})
}}
style={[mystyle.btn,{height:30,padding:5,width:"100%",justifyContent:"center",alignItems:"center",backgroundColor:a.select?mystyle.btn.backgroundColor:"white"}]}>
<Text style={{fontSize:12,color:!a.select?mystyle.btn.backgroundColor:"white"}}>select</Text>
</TouchableOpacity>
</View>)}
</ScrollView>
</View>
<View style={{paddingHorizontal:20}}>
<Text style={{fontSize:16,color:"black",textAlign:"center"}}>Payment of NGN{returnComma(parseInt(String(amount).replace(",",""))+(parseFloat(String(amount).replace(",",""))*(parseInt(this.props.vat_fee)/100)))} for {this.state.plans.filter((a,i)=>a.select).map((a,i)=>{
 return `${a.month} ${parseInt(a.month) > 1?"Months":"Month"}` ;   

}).join("")} campaign plan including VAT of {this.props.vat_fee}% will be debited from your card, tap on "Make Payment" to continue.</Text>
</View>
<TouchableOpacity 
onPress={()=>{
    if(this.state.plans.filter((a,i)=>a.select).length == 0)
    {
        ToastAndroid.show("Please select a billing plan, thanks.",ToastAndroid.LONG);
        return ;
    }
    var plan = this.state.plans.filter((a,i)=>a.select)[0];
    console.log(plan);
    var data = {
        user_id:parseInt(this.props.id_user),
        module_name:this.state.module_name,
        module_id:parseInt(this.state.module_id),
        title:this.state.business_name,
        module_category:parseInt(this.state.module_category_id),
        description:this.state.business_description,
        target:JSON.stringify({
            location:this.state.allcountries?String(this.state.mylocation).split(",").filter((a,i)=> i != 0):"all countries",
            gender:this.state.set_gender,
            age_range:[6,this.state.set_age]
        }),
        banner_size:this.state.bannerSize.height,
        image:this.state.banner,
        single:true,
        plan:parseInt(plan.advert_id),
        start_date:Moment(new Date()).format("YYYY-MM-DD"),
        end_date:Moment(new Date()).add(plan.month,"month").format("YYYY-MM-DD"),
        telephone:this.state.selectedCountry.calling_code+this.state.business_mobile,
        email:String(this.state.business_email).toLowerCase().trim(),
        address:String(this.state.business_address).trim()
     }
     if(this.state.business_website != "")
     {
        if(!this.validateUrl(this.state.business_website))
        {
            alert("Please enter a valid website")
            return;
        }
        data.website = String(this.state.business_website).toLowerCase()
     }
// advertId:parseInt(plan.advert_id),
// audience_type:this.state.advert_type,

var amo = parseInt(String(amount).replace(",",""))+(parseFloat(String(amount).replace(",",""))*(parseInt(this.props.vat_fee)/100))
const da = {
    paymentTo:"ads",
    screen_route:"menu",
    save_endpoint:"payment/advertPayment",//"campaign/createAdvert",
    params:data,
    memo:`Payment of NGN${returnComma(amo)} for ${this.state.plans.filter((a,i)=>a.select).map((a,i)=>{
        return `${a.month} ${parseInt(a.month) > 1?"Months":"Month"}` ;   
       }).join("")} campaign plan including VAT of ${this.props.vat_fee}% will be debited from your card`,
    amount:amo,
    email_msg:` and your receipt has been sent to your email (${this.props.email}), thanks.`
}  
console.log(da)
Actions.bank_details(da);
}}  style={[{width:180,height:50,marginTop:18,backgroundColor:mystyle.btn.backgroundColor,justifyContent:"center",alignItems:"center",borderRadius:60,elevation:5}]}>
<Text style={{color:"white",fontWeight:"bold",fontSize:18}}>Make payment</Text>
</TouchableOpacity>
</View>
</ScrollView>
</View>
</ScrollView>
<Modal 
visible={this.state.showSearch}
onRequestClose={()=>{
    this.setState({showSearch:false})
}}
>
<View style={{flexDirection:"column",flex:1}}>
<View style={{width:width,alignItems:"center",flexDirection:"row"}}>
<View style={[mystyle.regInput,{width:width-60,height:50}]}>
<TextInput 
    keyboardType="default"
    placeholder="Search location..."
    autoFocus
   onChangeText={(d)=>this.searchLocation(d)}
    value={this.state.add_location}
    style={{color:"#000",fontSize:14,flex:1,textAlign:"left",paddingLeft:50}}
    />
    <Icon.Evilicons name="search" style={{position:"absolute",left:10,top:15,fontSize:30}} />
</View>
<TouchableOpacity
onPress={()=>{
    this.setState({showSearch:false})
}}
style={{width:40,height:50,marginLeft:-5,alignItems:"center",justifyContent:"center"}}>
<Icon.AntDesign name="close" size={20} />
</TouchableOpacity>
</View>
<View style={{width:width,alignItems:"center",flex:1}}>
{loading?<View style={{padding:10,justifyContent:"flex-start",alignItems:"center",flexDirection:"row"}}>
             <ActivityIndicator color={mystyle.active.color} />
           <Text style={{fontSize:12,marginLeft:5}}>loading...</Text>
           </View>:listLocation.length == 0?<View style={[mystyle.myalert,{alignItems:"center"}]} >
          <View style={{height:30,width:50,justifyContent:"center",alignItems:"center"}} >
          <Icon.Ionicons name="ios-information-circle-outline" size={20} />
          </View>
          <Text>No location found !</Text>
          </View>:null}    
<FlatList 
data={listLocation}
renderItem={({item,index})=><TouchableOpacity 
style={{flexDirection:"row",width:width,marginBottom:10,minHeight:50,borderBottomWidth:0.5,borderBottomColor:"#444",alignItems:"center"}}
onPress={()=>{
    this.setState({add_location:"",showSearch:false,setLocation:false,mylocation:item.description},()=>{
    // this.getLatLng(item.description);
    });
}}
>

<View style={{flexDirection:"row",flex:1,flexWrap:"wrap",paddingHorizontal:20}}>
<Icon.FontAwesome name="map-marker" size={20} style={{position:"absolute",left:20}}  />
<Text style={{fontSize:12,paddingHorizontal:30}} >{item.description}</Text>
<Icon.MaterialIcons name="keyboard-arrow-right" size={15} style={{position:"absolute",right:20}} />
</View>
</TouchableOpacity>}
/>
</View>
</View>
</Modal>

</View>  
 <ImagePreview visible={this.state.showPreview} 
 source={{uri:this.state.imageZoom}} close={()=>{
   this.setState({showPreview:false});
 }} /> 
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
    if(this.props.screen_route != "")
    {
     Actions.jump(this.props.screen_route);       
    }else{
        Actions.goBack();
    }
    }
this.setState(d);
}} />
</View>)
    }
}
AdvertClass.defaultProps = {
    advert:{
        module_category:"",
        module_id:"",
        module_name:"",
        module_category_id:""
    },  
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(AdvertClass);

