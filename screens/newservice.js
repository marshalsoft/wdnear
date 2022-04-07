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
    TextInput,
    ScrollView,
    Animated,
    Easing,
    Keyboard,
    ActivityIndicator,
    Linking,
    TouchableWithoutFeedback,
    Dimensions,
    BackAndroid,
    WebView,
    Switch,
    AsyncStorage,
    ViewPagerAndroid,
    BackHandler,
    Image,
    DeviceEventEmitter,
    Alert,
    KeyboardAvoidingView,
    Modal 
  } from 'react-native';
    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';
    import * as EvalEmail from 'email-validator';
import { Picker } from '@react-native-picker/picker';
const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import Loader from '../components/loader';
import * as Animatable from 'react-native-animatable';
import Country from '../includes/countries';
import {postTEST,postDATA,getDATA,returnAllNumbers,returnMobile,returnComma} from '../includes/func';
import {Collapse,CollapseHeader, CollapseBody, AccordionList} from 'accordion-collapse-react-native';
import {launchImageLibrary,launchCamera} from "react-native-image-picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';
import FS from 'rn-fetch-blob';
import { RNCamera, FaceDetector } from 'react-native-camera';
import FileViewer from 'react-native-file-viewer';
const { config, fs,android,ios } = FS;
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import ReturnADS  from '../components/showADS';
class NewServiceClass extends PureComponent{

  setSubscription(d)
  {
    var amount = parseInt(this.state.amount)* parseInt(this.props.Reducer.subscription_fee)+(parseInt(this.state.amount)* parseFloat(this.props.Reducer.subscription_fee))*(parseFloat(this.props.Reducer.vat_fee)/100)
    var more_images = null;
    if(d.more_images != undefined)
    {
      more_images = d.more_images
      delete d.more_images
    }
   d = {
    screen_route:"menu",
    module_endpoint:"store/create",
    save_endpoint:"payment/paySubscription",
    params:{
      packageName:"basic",
      numberOfMonth:this.state.amount,
      ...d
    },
    paymentTo:"service",
    more_images:more_images,
    action:"service",
    memo:`Payment of NGN${returnComma(amount)} includes VAT of ${this.props.Reducer.vat_fee}% for new service plan of ${this.state.amount} Month(s) will charged on your card.`,
    amount:amount
}
console.log(d)
const Actions = this.props.navigation;

    Actions.navigate("bank_details",d);
  }
 
    componentDidMount()
    {
      AsyncStorage.getItem("fcmToken").then((fcmToken)=>{
       console.log("push:",fcmToken)
        if(fcmToken != null)
        {
          this.setState({store_fcmToken:fcmToken});
        }
      });
      // problem this.props.dispatch({type:"update",value:{_amount:0,_duration:"1"}})
      var addData = {}
      addData.telephone = this.props.Reducer.telephone;
      addData.region = this.props.Reducer.city;
      if(this.props?.route?.params)
      {
        console.log(this.props?.route?.params);
        addData.business_images = this.props?.route?.params?.images;
        addData.business_title = this.props?.route?.params?.product_name;
        addData.bussines_address = this.props?.route?.params?.address;
        addData.bussines_email = this.props?.route?.params?.user.map((a,i)=>a.email).join("");
        addData.bussines_description = this.props?.route?.params?.detail;
        addData.offer = this.props?.route?.params?.offer;
        addData.setoffer = true;
        addData.category_id = this.props?.route?.params?.category_id;
        addData.service_price = this.props?.route?.params?.service_price == null?0:this.props?.route?.params?.service_price;
      }else{
        addData.bussines_address = this.props.Reducer.address;
        addData.bussines_email = String(this.props.Reducer.email).trim();
      }
      this.setState(addData);
    console.log("addData:",addData);

    this.props.dispatch({type:"update",value:{editMobile:false}})  
    if(this.props.Reducer.categoryList.length == 0)
    {
    this.getCategory();
    }else{
      this.setState({loader:false})
    }
    postDATA("payment/getUserSubscription",{
      user_id:parseInt(this.props.Reducer.id_user),
      image:""
    }).then((res)=>{
      console.log("payment/getUserSubscription:",res)
    if(res.status)
    {
      this.props.dispatch({type:"update",value:{user_subscription:res.result}})
    }
    })
     }
    
     getCategory()
     {
       this.setState({loader:true});
      postDATA("category/getAllCategory",{}).then((res)=>{
       var x = [];
       if(res.success == 1)
       {
        for(var o in res.result)
        {
          x.push(res.result[o]);
        }
       }
    //    alert(JSON.stringify(res))
        this.props.dispatch({type:"update",value:{categoryList:x}});
        this.setState({loader:false});
     })
     }
    constructor(props)
    {
        super(props);
        this.state = {
            mobile:"",
            showLoader:false,
            isProcessing:true,
            showCamera:false,
            errorInfo:"Please wait...",
            success:false,
            kyUp:false,
            firstname:"",
            lastname:"",
            email:"",
            store_fcmToken:"",
            category_id:"",
            business_title:"",
            bussines_address:"",
            bussines_email:"",
            bussines_description:"",
            business_mobile:"",
            business_images:{uri:null},
            isCollapsed:false,
            numberEditted:false,
            country:"",
            showCountryList:false,
            province:"",
            region:"",
            loader:true,
            country:"",
            selectedCountry:{
            flag:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUCAIAAAAVyRqTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0RjI4OEFDMTE3ODQxMUUyQTcxNDlDNEFCRkNENzc2NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0RjI4OEFDMjE3ODQxMUUyQTcxNDlDNEFCRkNENzc2NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjRGMjg4QUJGMTc4NDExRTJBNzE0OUM0QUJGQ0Q3NzY2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjRGMjg4QUMwMTc4NDExRTJBNzE0OUM0QUJGQ0Q3NzY2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+qCpo0QAAADBJREFUeNpiZGgPZMAN/leswyPL2BGER5aJgWZg1OhRo0eNHjV61OhRo2lnNECAAQBu1gQALTkVbAAAAABJRU5ErkJggg==",
            name:"Nigeria",calling_code:"234"},
            service_price:"",
            min_price:"",
            setoffer:false,
            start_date:Moment(new Date()).add(1,"day"),
            start_time:"",
            end_date:null,
            end_time:"",
            discount:"",
            percentage:"",
            amount:1,
            addimage_list:[],
            listLocation:[],
            setFlash:false,
            showImage:false,
            showSearch:false,
            imageUrl:null,
            latitude:this.props.Reducer.latitude,
            longitude:this.props.Reducer.longitude,
            add_location:"",
            city:"",
            offer:false,
            city:"",
            country:"",
            service_price:"",
            showDate1:false
        }
        this.getCategory.bind();
    }
    captureCamera() {
      const options = {mirrorImage:true,pauseAfterCapture:false,doNotSave:false,fixOrientation:true, quality:0.5,height:height,width:width};
      this.camera.takePictureAsync(options).then((data)=>{
      const uriParts = String(data.uri).split('.');
       const fileType = uriParts[uriParts.length - 1];
       const filename = String(new Date().getMilliseconds()).replace(/[.]/g,'')+"."+fileType
          // console.log(data)
          this.setState({addimage_list:[...this.state.addimage_list,{uri:data.uri,fileName:filename,filename:filename,type:"image/"+fileType,path:data.uri,name:filename}],showCamera:false});
        
        });
    }
componentWillUnmount()
{

}
searchLocation(d)
{
this.setState({add_location:d,loading:true},()=>{
    var x = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${d}&key=${this.props.Reducer.googleKey}`;
   console.log(x);
    fetch(x).then((res)=>res.json()).then((res)=>{
   console.log(res);
    this.setState({loading:false,listLocation:res.predictions}); 
})  
})
}
getLatLng(address)
{
    // this.setState({add_location:d,loading:true},()=>{
        var x = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${this.props.Reducer.googleKey}`;
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
getLocation(lt,lng)
{
 this.setState({latitude:lt,longitude:lng,location_loading:true},()=>{
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lt},${lng}&key=${this.props.Reducer.googleKey}`).then((res)=>res.json()).then((res)=>{
        this.setState({location_loading:false}); 
      if(res.status == "OK")
           {
           var address = res.results[0].formatted_address;
           var addressSplit = String(address).split(",");
           var city = "";
           try {
            city = addressSplit[addressSplit.length - 2];
           } catch (error) {
             
           }
           console.log(city);
           this.setState({bussines_address:address,region:city});
           }
      }) 
 });
}

render() 
{

const {
    bussines_category,
    bussines_address,
    bussines_email,
    business_title,
    business_mobile,
    business_images,
    add_location,
    bussines_description,
    country,
    numberEditted,
    selectedCountry,
    telephone,
    setoffer,
    service_price,
    addimage_list,
    latitude,
    longitude,
    listLocation,
    region} = this.state;
    const banner_150 = this.props.Reducer.adsList.filter((a,i)=>String(a.banner_size) == "150")
    const banner_320 = this.props.Reducer.adsList.filter((a,i)=>String(a.banner_size) == "320")
    const banner_350 = this.props.Reducer.adsList.filter((a,i)=>String(a.banner_size) == "350")
return(<KeyboardAvoidingView 
  behavior="padding"
  keyboardVerticalOffset={40}   style={[mystyle.window,{backgroundColor:"white"}]} >
<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
<View style={{width:width,height:50,justifyContent:"center",alignItems:"center",backgroundColor:"#f9f5f5",elevation:3}}>
<TouchableOpacity onPress={()=>{
const Actions = this.props.navigation;
Actions.goBack();
}} style={[{width:60,height:50,justifyContent:"center",alignItems:"center",position:"absolute",top:0,left:0,zIndex:99}]}>
<Icon.MaterialIcons color={"red"} name="keyboard-arrow-left" size={30} />
</TouchableOpacity>
<View >
<Text style={{color:"black",fontSize:18}}>Add new service</Text>
</View>
</View>
<ScrollView 
keyboardShouldPersistTaps="always"
ref={e=>this.SclV=e}

style={{flex:1,paddingTop:10}} >
<View style={{width:width,minHeight:height,justifyContent:"center",alignItems:"center",flexDirection:"column"}} >
<TouchableOpacity onPress={()=>{
  launchImageLibrary({ title: 'Image', maxHeight: 300, maxWidth: width }, res => {
    if (res.didCancel) {
      
    } else if (res.error) {
      
    } else {
const img  = res["assets"][0];
var sizeInMB = (img.fileSize / (1024*1024)).toFixed(2);
console.log(sizeInMB);
if(sizeInMB > 2)
{
  alert(`File size must less than or equal to 2MB`);
  return ;
}
console.log(img);
img.path = img.uri;
img.name = img.fileName;
img.filename = img.fileName;
this.setState({business_images:img})
    }
})
}} style={{width:width-30,height:150,backgroundColor:"#ccc",marginTop:20}}>
<Image source={business_images.uri == null?require("../images/placeholder2.png"):business_images} style={{width:width-30,height:150}} resizeMode="cover" />
{this.state.offer?<Icon.AntDesign name="edit" size={20} style={{position:"absolute",top:2,right:10,color:"red"}} />:null}
</TouchableOpacity>
{!this.state.offer?<Text style={{fontSize:12,marginLeft:20,width:"100%",marginTop:10,textAlign:"left"}} >Only 4 product images can be added.</Text>:null}
{!this.state.offer?<View style={{width:width-20,margin:10,height:70,flexDirection:"row"}}>
{addimage_list.length != 0?<ScrollView 
keyboardShouldPersistTaps="always"
horizontal
style={{width:width-60,height:70}}
showsHorizontalScrollIndicator={false}
ref={e=>this.adsScroll=e}
>
{addimage_list.map((a,i,self)=><TouchableOpacity 
 activeOpacity={0.5}
onPress={()=>{
    Alert.alert("Action",`What do you want to do?`,
    [
      {text: 'Cancel', onPress: () => {
   
      }, style: 'cancel'},
     {text: 'Remove', onPress: () => {
        this.setState({addimage_list:self.filter((a,o)=>o != i)})
    }, style: 'cancel'},
  {text: 'Preview', onPress: () => {
    // alert(a.uri)
    this.setState({showImage:true,imageUrl:a.uri});
}, style: 'cancel'}
    ],
    {cancelable:false})
}}
key={i} style={{marginHorizontal:2,width:100,height:60,backgroundColor:"#ccc"}}>
<Image source={{uri:a.uri}} style={{width:100,height:60}} resizeMode="cover" />
<View style={{justifyContent:"center",alignItems:"center",position:"absolute",top:5,right:5}} >
         <Icon.FontAwesome name="eye"  size={12} color="red" />
         </View>
     <View style={{justifyContent:"center",alignItems:"center",position:"absolute",top:25,right:5}} >
         <Icon.FontAwesome name="trash"  size={12} color="red" />
         </View>
</TouchableOpacity>)}
</ScrollView>:<View style={{width:width-90,overflow:"hidden",flexDirection:"row"}}>
{["","","",""].map((a,i)=><View 
  
    key={i} style={{opacity:0.3,marginHorizontal:2,width:85,height:60,backgroundColor:"#ccc"}}>
    <View style={{justifyContent:"center",alignItems:"center",position:"absolute",top:5,right:5}} >
             <Icon.FontAwesome name="eye"  size={12} color="red" />
             </View>
             <View style={{justifyContent:"center",alignItems:"center",position:"absolute",top:25,right:5}} >
             <Icon.FontAwesome name="trash"  size={12} color="red" />
             </View>
    </View>)}
</View>}
<TouchableOpacity
  activeOpacity={0.1}
  onPress={()=>{
    if(this.state.addimage_list.length < 4)
    {
    Alert.alert("Action",`Add image by choosing from either (Camera of file) buttons below.`,
    [
      {text: 'Cancel', onPress: () => {
   
      }, style: 'cancel'},
     {text: 'Camera', onPress: () => {
      this.setState({showCamera:true});
    }, style: 'cancel'},
  {text: 'Image File', onPress: () => {
    launchImageLibrary({ title: 'Image', maxHeight: 300, maxWidth: width }, res => {
      if (res.didCancel) {
        
      } else if (res.error) {
        
      } else {
  const img  = res["assets"][0];
  var sizeInMB = (img.fileSize / (1024*1024)).toFixed(2);
  console.log(sizeInMB);
  if(sizeInMB > 2)
  {
    alert(`File size must less than or equal to 2MB`);
    return ;
  }
  console.log(img);
  img.path = img.uri;
  img.name = img.fileName;
  img.filename = img.fileName;
  this.setState({addimage_list:[...this.state.addimage_list,img]})
      }
  })
}, style: 'cancel'}
    ],
    {cancelable:false})
}else{
    alert(`You have reached the maximum number of added products.`)
}
   }} style={[mystyle.btn,{width:60,height:30,paddingVertical:1,backgroundColor:this.state.addimage_list.length < 4?mystyle.btn.backgroundColor:"#ccc"}]}>
    <Icon.AntDesign name="plus" size={14} color="white"/>
    <Text style={{fontSize:10,color:'white'}}> Image</Text>
 </TouchableOpacity>
</View>:null}
<View style={[mystyle.regInput,{width:width-30,minHeight:50}]}>
<TextInput 
    keyboardType="default"
    placeholder="Services title"
    multiline
    onChangeText={(d)=>this.setState({business_title:d})}
    value={this.state.business_title}
    style={{fontSize:14,flex:1,textAlignVertical:"top",textAlign:"left",paddingLeft:10}}
    />
</View>
<View style={[mystyle.regInput,{width:width-30,minHeight:80}]}>
<TextInput 
    keyboardType="default"
    placeholder="Description"
    multiline
    onChangeText={(d)=>this.setState({bussines_description:d})}
    value={this.state.bussines_description}
    style={{fontSize:14,flex:1,textAlignVertical:"top",textAlign:"left",padding:10}}
    />
</View>
{!this.state.offer?<View style={[mystyle.regInput,{width:width-30,height:50,alignItems:"flex-start"}]}>
{this.state.loader?<ActivityIndicator size="small" color="red" style={{margin:15}} />:<Picker 
mode="dropdown"
    onValueChange={(d,i)=>{
    if(i == 0)
    {
    ToastAndroid.show("Select another item..",ToastAndroid.LONG);
    return ;
    }
    var catg = this.props.Reducer.categoryList[i-1];
    console.log(catg);
        this.setState({bussines_category:d,
        category_id:catg.id_category});
    }}
    selectedValue={this.state.bussines_category}
    style={{marginLeft:20,width:"90%"}}
    >
{[{name:"Select Category"},...this.props.Reducer.categoryList].map((a,i)=><Picker.Item key={i}
label={a.name} value={a.name}
/>)}
    </Picker>}
</View>
:null}
<Collapse 
style={{width:width-30}}
onToggle={(isCollapsed)=>this.setState({isCollapsed:isCollapsed})}
>
<CollapseHeader 
style={{width:width-30,alignItems:"center"}}
>
 {!this.state.isCollapsed?<View style={{marginBottom:10,width:width-30,flexDirection:"column",borderColor:"#444",borderRadius:5,borderWidth:0.5,padding:10,alignSelf:"center"}}>
 <View style={{paddingHorizontal:10,paddingRight:20,flexDirection:"row"}}>  
     <Icon.MaterialCommunityIcons name="map-marker" size={20} style={{marginRight:5,marginLeft:-3}}/>
     <Text style={{width:"90%"}}>{this.state.bussines_address == ""?`No address (${this.props.Reducer.country})`:`${this.state.bussines_address}\n${String(this.state.city).replace("undefined","")}`}</Text>
     </View>
     <View style={{paddingHorizontal:10,flexDirection:"row",alignItems:"center"}}>  
     <Icon.FontAwesome name="envelope" size={15} style={{marginRight:10}}/>
     <Text>{this.state.bussines_email}</Text>
     </View>
     <View style={{paddingHorizontal:10,flexDirection:"row"}}>
     <Icon.FontAwesome name="phone" size={15} style={{marginRight:10}}/>
     <Text>{this.state.telephone}</Text>
     </View>
 <Icon.AntDesign name="edit" size={20} style={{position:"absolute",top:2,right:10,color:"red"}} />
 </View>:<View style={{flexDirection:"row",alignItems:"flex-end",width:"100%"}}>
 <View style={{flex:1}}></View>
 <Icon.SimpleLineIcons name="arrow-down" size={15} />
 </View>} 
</CollapseHeader>
<CollapseBody style={{flexDirection:"column",width:width-30,marginLeft:-10}}>
<TouchableOpacity 
onPress={()=>{
  this.setState({showSearch:true})
}}
style={[mystyle.regInput,{padding:10,width:width-30,alignItems:"flex-start",flexDirection:"row",alignItems:"center"}]}>
<Icon.FontAwesome name="map-marker" style={{paddingRight:10,fontSize:15}} />
<Text 
 style={{fontSize:14,flex:1,textAlignVertical:"top",textAlign:"left"}}
>{this.state.bussines_address}</Text>
</TouchableOpacity>
<View style={[mystyle.regInput,{width:width-30}]}>
<TextInput 
    keyboardType="default"
    placeholder="Email"
    onChangeText={(d)=>this.setState({bussines_email:String(d).trim()})}
    value={this.state.bussines_email}
    style={{fontSize:14,flex:1,textAlignVertical:"center",textAlign:"left",width:"100%",marginLeft:15}}
    />
</View>
<View style={[mystyle.regInput,{width:width-30,flexDirection:"row",borderWidth:1,borderColor:mystyle.regInput.backgroundColor}]}>
<TouchableOpacity
onPress={()=>{
  this.setState({showCountryList:true})
}}
style={[{width:70,height:50,backgroundColor:"white",justifyContent:"center",alignItems:"center",flexDirection:"row",overflow:"hidden"}]}>
<Image source={{uri:String(this.state.selectedCountry.flag).includes("data:image/png;base64,")?this.state.selectedCountry.flag:"data:image/png;base64,"+this.state.selectedCountry.flag}} style={{width:25,height:15}} resizeMode="cover"/>
<Icon.SimpleLineIcons name="arrow-down" size={10} color="black"  style={{position:"absolute",right:5,top:18}} />
</TouchableOpacity>
<TextInput 
    keyboardType="phone-pad"
    placeholder="Mobile"
    maxLength={15}
    onChangeText={(d)=>this.setState({telephone:returnAllNumbers(d)},()=>{
    this.props.dispatch({type:"update",value:{editMobile:true}})  
    })}
    value={returnMobile(this.state.telephone)}
    style={{fontSize:14,flex:1,textAlignVertical:"center",textAlign:"left",paddingLeft:10}}
    />
</View>
<TouchableOpacity 
onPress={()=>{
    this.setState({showCountryList:true});
}}
style={[mystyle.regInput,{width:width-30,height:50,alignItems:"center",justifyContent:"center"}]}>
<Text style={{color:this.state.country == ""?"gray":"black",fontSize:18,width:width-140,paddingLeft:5}}>{this.state.country == ""?"Select country":this.state.country}</Text>
<Icon.SimpleLineIcons name="arrow-up" style={{position:"absolute",right:20,top:12}} />
<Icon.SimpleLineIcons name="arrow-down" style={{position:"absolute",right:20,top:22}} />
</TouchableOpacity>
</CollapseBody>
</Collapse>
{this.state.offer?<View style={{paddingLeft:20,width:"100%"}}>
<Text style={{fontSize:12,width:"100%",paddingLeft:20,marginTop:20}}>Start at</Text>
</View>:null}
{this.state.offer?<View style={{padding:10,backgroundColor:"#f3f3f3",borderRadius:10,borderColor:"#cecece",borderWidth:0.5,flexDirection:"column",marginBottom:5}}>
{this.state.showDate1?<DateTimePicker
      value={new Date()}
      minimumDate={new Date(Moment().add(1,"day"))}
      display='spinner'
      mode={"date"}
      onChange={(event, selectedDate) => {
        var nw = Moment(selectedDate);
        this.setState({start_date:nw,end_date:null,showDate1:false})
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
        this.setState({start_time:tm,end_time:"0h 0min",showTime1:false})
      }}
      onError={()=>{

      }}
    />:null}
<TouchableOpacity
onPress={()=>{
 this.setState({showDate1:true});
}}
style={[{width:width-90,backgroundColor:"#fff",borderRadius:5,borderColor:"#707070",height:40,borderWidth:0.5,marginBottom:5,flexDirection:"row"}]}>
<View 
style={{justifyContent:"center",alignItems:"center",width:50,height:40}}>
<Icon.Evilicons name="calendar" size={30} />
</View>
<View style={{justifyContent:"center",alignItems:"flex-start",flex:1}}>
<Text>{this.state.start_date.format("DD-MM-YYYY")}</Text>
</View>
</TouchableOpacity>
<TouchableOpacity onPress={()=>{
  this.setState({showTime1:true});
}} style={[{width:width-90,backgroundColor:"#fff",borderRadius:5,borderColor:"#707070",height:40,borderWidth:0.5,marginBottom:5,flexDirection:"row"}]}>
<View 
style={{justifyContent:"center",alignItems:"center",width:50,height:40}}>
<Icon.Evilicons name="clock" size={30} />
</View>
<View style={{justifyContent:"center",alignItems:"flex-start",flex:1}}>
<Text>{this.state.start_time == ""?"0h 0min":this.state.start_time}</Text>
</View>
</TouchableOpacity>
<Text style={{width:width-90,textAlign:"left",marginVertical:5}}>End at</Text>
<TouchableOpacity 
onPress={()=>{
  this.setState({showDate2:true});
}} style={[{width:width-90,backgroundColor:"#fff",borderRadius:5,borderColor:"#707070",height:40,borderWidth:0.5,marginBottom:5,flexDirection:"row"}]}>
<View 
style={{justifyContent:"center",alignItems:"center",width:50,height:40}}>
<Icon.Evilicons name="calendar" size={30} />
</View>
<View style={{justifyContent:"center",alignItems:"flex-start",flex:1}}>
<Text>{this.state.end_date == null?"dd/mm/yyyy":this.state.end_date.format("DD-MM-YYYY")}</Text>
</View>
</TouchableOpacity>
<TouchableOpacity 
onPress={()=>{
    if(this.state.start_time == "")
    {
    ToastAndroid.show("Please select event start time first, thanks.",ToastAndroid.SHORT);
    return ;
    }
    this.setState({showTime2:true});
}}
style={[{width:width-90,backgroundColor:"#fff",borderRadius:5,borderColor:"#707070",height:40,borderWidth:0.5,marginBottom:5,flexDirection:"row"}]}>
<View 
style={{justifyContent:"center",alignItems:"center",width:50,height:40}}>
<Icon.Evilicons name="clock" size={30} />
</View>
<View style={{justifyContent:"center",alignItems:"flex-start",flex:1}}>
<Text >{this.state.end_time == ""?"0h 0min":this.state.end_time}</Text>
</View>
</TouchableOpacity>
{this.state.showDate2?<DateTimePicker
      value={new Date()}
      minimumDate={new Date(this.state.start_date)}
      display='spinner'
      mode={"date"}
      onChange={(event, selectedDate) => {
        var nw = Moment(selectedDate);
        this.setState({end_date:nw,showDate2:false})
        // alert(JSON.stringify(selectedDate))
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
        var fom_start = this.state.start_date;
                var fom_start_time = String(String(this.state.start_time).replace("AM","").replace("PM","")).split(" ");
                fom_start.set('hour', fom_start_time[0]);
                fom_start.set('minute', fom_start_time[1])
                var fom_end = this.state.end_date;
                fom_end.set('hour', tm.hour());
                fom_end.set('minute', tm.minute());
                var d = fom_end.diff(fom_start,"minutes");
                if(d < 59)
                {
                Alert.alert("Oops!",`Event start time must be atleast 1 hour greater than  event end time.`,[{text:"Ok"}]);
                return ;
                }
                // var f = fom.format("DD/MM/YYYY hh:mm");
        this.setState({end_time:tm.format("hh:mm A"),showTime2:false})
      }}
      onError={()=>{

      }}
    />:null}
</View>:null}
<View style={{width:this.state.offer?200:width-20,flexDirection:"row"}}>
{!this.state.offer?<Text style={{color:"black",flex:1,paddingLeft:15}}>Min Price (Optional)</Text>:null}
<Text style={{color:"black",flex:1,marginLeft:this.state.offer?-80:0}}>{this.state.offer?"Initial price":"Max Price (Optional)"}</Text>
</View>
<View style={{width,alignItems:"flex-start",paddingLeft:10,flexDirection:"row"}}>
<View style={{width:this.state.offer?200:width-20,flexDirection:"row"}}>
{!this.state.offer?<View style={[mystyle.regInput,{paddingLeft:15,flex:1,height:40,justifyContent:"center",alignItems:"center",flexDirection:"row"}]}>
<Text style={{color:"black"}}>NGN</Text>
<TextInput 
    keyboardType="phone-pad"
    placeholder="Price"
    maxLength={12}
    onChangeText={(d)=>this.setState({min_price:parseInt(returnAllNumbers(d))})}
    value={returnComma(this.state.min_price)}
    style={{fontSize:14,flex:1,textAlignVertical:"top",textAlign:"left",padding:10,color:"black"}}
    />
</View>:null}
<View style={[mystyle.regInput,{paddingLeft:15,flex:1,height:40,justifyContent:"center",alignItems:"center",flexDirection:"row"}]}>
<Text style={{color:"black"}}>NGN</Text>
<TextInput 
    keyboardType="phone-pad"
    placeholder="Price"
    editable={this.state.offer?this.state.service_price == null?true:false:true}
    maxLength={12}
    onChangeText={(d)=>this.setState({service_price:parseInt(returnAllNumbers(d))})}
    value={returnComma(this.state.service_price)}
    style={{fontSize:14,flex:1,textAlignVertical:"top",textAlign:"left",padding:10,color:"black"}}
    />
    {this.state.offer && this.state.service_price != null?<Icon.Entypo name="block" style={{color:"red",position:"absolute",right:10,top:15}} />:null}
</View>
</View>
</View>
{this.state.offer?<View style={{width,alignItems:"flex-start",paddingLeft:10,flexDirection:"row"}}>
<View style={{flex:1}}>
<Text style={{fontSize:12,width:"100%",paddingLeft:20,marginTop:10}}>Set discount offer in %</Text>
</View>
<View style={{flex:1}}>
<Text style={{fontSize:12,width:"100%",paddingLeft:20,marginTop:10}}>Discounted price</Text>
</View>
</View>:null}
{this.state.offer?<View style={{width,alignItems:"flex-start",paddingLeft:10,flexDirection:"row"}}>
<View style={{flex:1}}>
<View style={[mystyle.regInput,{width:"90%",height:40,alignItems:"flex-start"}]}>
<Picker 
style={{width:"100%"}}
onValueChange={(d)=>{
if(parseFloat(this.state.service_price) == 0)
{
  ToastAndroid.show("Please enter the initail price. thanks",ToastAndroid.LONG);
  return ;
}
var dis =  parseFloat(d)/100;
// console.log(String((parseFloat(String(this.state.service_price).replace(/[,]/g,'')) - (parseFloat(String(this.state.service_price).replace(/[,]/g,''))*dis))));
// // 
// return ;
this.setState({percentage:d,discount:String((parseFloat(String(this.state.service_price).replace(/[,]/g,'')) - (parseFloat(String(this.state.service_price).replace(/[,]/g,''))*dis)).toFixed(2))});
}}
selectedValue={this.state.percentage}
mode="dropdown"
>
{["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","57","58","59","60","61","62","63","64","65","66","67","68","69","70","71","72","73","74","75","76","77","78","79","80","81","82","83","84","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99"].map((a,i) =><Picker.Item key={i} label={a} value={a}/>)}
</Picker>
</View>
</View>
<View style={{flex:1}}>
<View style={[mystyle.regInput,{width:"90%",height:40,alignItems:"flex-start"}]}>
<TextInput 
    placeholder="0.00"
    editable={!this.state.offer}
    value={"NGN"+returnComma(this.state.discount)}
    style={{fontSize:14,color:"black",flex:1,textAlignVertical:"top",textAlign:"left",padding:10}}
    />
    <Icon.Entypo name="block" style={{color:"red",position:"absolute",right:10,top:15}} />
</View>
</View>
</View>:null}
{!this.state.offer && String(this.props.Reducer.paystack_payment) != "0" && this.props.Reducer._amount == 0?<View style={{width:"90%",flexDirection:"row"}}>
<View style={{flex:1}}>
  <Text>{`Subscription Fee (${this.state.amount}Month):\nNGN ${returnComma(parseInt(this.state.amount)* parseInt(this.props.Reducer.subscription_fee))}`} </Text>
</View>
<View style={{flexDirection:"row",width:80}} >
<TouchableOpacity
onPress={()=>{
  this.setState({amount:this.state.amount > 2?this.state.amount-1:1})
}}
style={{justifyContent:"center",alignItems:"center",width:30,backgroundColor:"#ccc",height:20,borderRadius:5}}>
<Icon.Entypo name="minus" />
</TouchableOpacity>
<Text style={{marginHorizontal:5}}>{this.state.amount}</Text>
<TouchableOpacity 
onPress={()=>{
  this.setState({amount:this.state.amount+1})
}} style={{justifyContent:"center",alignItems:"center",width:30,backgroundColor:"#ccc",height:20,borderRadius:5}} >
<Icon.Entypo name="plus" />
</TouchableOpacity>
</View>
</View>:null}
{!this.state.offer && String(this.props.Reducer.paystack_payment) != "0" && parseInt(this.props.Reducer._amount) == 0?<Text style={{color:"black",flex:1,padding:15,marginLeft:20,width:"100%"}}>NGN{returnComma((parseInt(this.state.amount)* parseFloat(this.props.Reducer.subscription_fee))*(parseFloat(this.props.Reducer.vat_fee)/100))} VAT of {this.props.vat_fee}% will be added to your payment</Text>:null}
<View style={{height:150,width:width-50,alignItems:"center"}}>
 {!this.state.offer?<TouchableOpacity
  onPress={()=>{
    // alert(this.props.telephone);
    if(business_images.uri == null)
    {
    this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please select image, thanks."})
    }else if(this.state.business_title == "")
      {
      this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter business title, thanks."})
    }else if(this.state.bussines_description == "")
      {
      this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter description, thanks."})
    }else if(this.state.category_id == "")
      {
      this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please select business category, thanks."})
    }else if(this.state.min_price > this.state.service_price)
     {
    this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please the maximum price must be greater than minimum price, thanks."})
   }else{
    AsyncStorage.getItem("fcmToken").then((e)=>{
      var data = {
        user_id:parseInt(this.props.Reducer.id_user),
        name:this.state.business_title,
        phone:this.state.telephone,
        address:this.state.bussines_address,
        lat:this.state.latitude,
        lng:this.state.longitude,
        category_id:parseInt(this.state.category_id),
        detail:this.state.bussines_description,
        images:this.state.business_images,
        single:true,
        service_price:this.state.service_price != ""?parseInt(this.state.service_price):0,
        actual_price:this.state.service_price != ""?parseInt(this.state.service_price):0,
        price:this.state.service_price != ""?parseInt(this.state.service_price):0,
        service_price_min:this.state.min_price != ""?this.state.min_price:0,
        fcm:e
      }
      
      console.log(data);

if(String(this.props.Reducer.paystack_payment) == "1" && parseInt(this.props.Reducer._amount) == 0)
{
  Alert.alert("Payment options","Select a payment method",
    [
      {text: 'Cancel', onPress: () => {
   
      }, style: 'cancel'},
     {text: 'Paystack', onPress: () => {
 if(this.state.addimage_list.length != 0)
{
  data.more_images = {
          user_id:data.user_id,
          images:this.state.addimage_list
          }
}
      this.setSubscription(data);
    }, style: 'cancel'},
  {text: 'PayPal', onPress: () => {
    var amount = parseInt(this.state.amount)* parseInt(this.props.Reducer.subscription_fee)+(parseInt(this.state.amount)* parseFloat(this.props.Reducer.subscription_fee))*(parseFloat(this.props.Reducer.vat_fee)/100)
    const Actions = this.props.navigation;
    Actions.navigate("paypal",{amount:amount})
}, style: 'cancel'}
    ],
    {cancelable:false})
}else{
  console.log(data);
  console.log(this.state.addimage_list);
  // return ;
  this.setState({showLoader:true,isProcessing:true,success:false,errorInfo:"Please wait..."})
  postDATA("store/createService",data).then((res)=>{
  console.log("store/createService:",res)
  // return ;
 if(String(res.success) == "1")
 {
   if(this.state.addimage_list.length == 0)
   {
    this.setState({
      errorInfo:res.message,
      showLoader:true,
      isProcessing:false,
      success:false})  
   }else{
  var moreImages = {
          user_id:data.user_id,
          store_id:parseInt(res.result[0].id_store),
          images:this.state.addimage_list
        }
    console.log("uploadStoreImages:",moreImages);
    postDATA("store/uploadStoreImages",moreImages).then(()=>{
      this.setState({bussines_category:"",
            bussines_email:"",
            business_title:"",
            telephone:"",
            business_images:{uri:null},
            bussines_description:"",
            country:"",
            region:"",
            showLoader:true,
            isProcessing:false,
            success:String(res.success) == "1",
            errorInfo:String(res.success) == "1"?"Your service was successfully added.":res.message})
         DeviceEventEmitter.emit("reload",{action:"service"});
    });
  }
      }else{
        this.setState({
            showLoader:true,
            isProcessing:false,
            success:false,
            errorInfo:res.message
          })  
      }
    }) 
}
})
}
    }} style={[{width:width-60,height:50,marginTop:10,backgroundColor:mystyle.active.color,justifyContent:"center",alignItems:"center",borderRadius:60,elevation:5}]}>
    <Text style={{color:"white",fontWeight:"bold",fontSize:18}}>Confirm</Text>
    </TouchableOpacity>:<TouchableOpacity onPress={()=>{
    // alert(this.props.telephone);
    if(business_images.uri == null)
    {
    this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please select image, thanks."})
    }else if(this.state.business_title == "")
      {
      this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter business title, thanks."})
    }else if(this.state.bussines_description == "")
      {
      this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter description, thanks."})
    }else if(this.state.category_id == "")
      {
      this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please select business category, thanks."})
    }else if(this.state.start_date == "")
    {
      this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please select start date, thanks."})
    }else if(this.state.start_time == "")
    {
  this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please select start time, thanks."})
    }else if(this.state.end_date == null)
  {
  this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please select end date, thanks."})
    }else if(this.state.end_time == "")
    {
    this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please select end time, thanks."})
    }else if(this.state.percentage == "")
    {
     this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please select percentage of discount, thanks."})
     }else{

      var data = {
        user_id:parseInt(this.props.Reducer.id_user),
        name:this.state.business_title,
        images:this.state.business_images,
        single:true,
        actual_price:this.state.service_price != ""?parseFloat(this.state.service_price):0,
        price:this.state.service_price != ""?parseFloat(this.state.service_price):"",
        discount:String(this.state.discount),
        percent:parseInt(this.state.percentage),
        service_id:parseInt(this.props.Reducer.id_store),
        start_date:Moment(this.state.start_date).format("YYYY-MM-DD"),
        start_time:this.state.start_time,
        end_date:Moment(this.state.end_date).format("YYYY-MM-DD"),
        end_time:this.state.end_time,
        detail:this.state.bussines_description,
        description:this.state.bussines_description,
        user_type:this.props.Reducer.typeAuth,
        store:"store"
      }
  console.log("----",data)
  this.setState({showLoader:true,isProcessing:true,success:false,errorInfo:"Please wait..."})
   postDATA("offer/createOffer",data).then((res)=>{
        console.log("store/createOffer:",res)
        if(res.status)
        {
          this.setState({bussines_category:"",
            bussines_email:"",
            business_title:"",
            telephone:"",
            business_images:{uri:null},
            bussines_description:"",
            country:"",
            region:""})
         DeviceEventEmitter.emit("reload",{action:"offer"});
        }
        this.setState({showLoader:true,isProcessing:false,success:res.status,errorInfo:res.status?"A new offer was successfully added.":res.message})
    }) 
       }
    }} style={[{width:width-60,height:50,marginTop:10,backgroundColor:mystyle.active.color,justifyContent:"center",alignItems:"center",borderRadius:60,elevation:5}]}>
    <Text style={{color:"white",fontWeight:"bold",fontSize:18}}>Confirm</Text>
    </TouchableOpacity>}
    <ReturnADS
        props={this.props}
        list={banner_150}
        size={80}
        />
</View>

</View>
</ScrollView>

</View>
<Modal 
visible={this.state.showSearch}
onRequestClose={()=>this.setState({showSearch:false})}
animationType="slide"
>
<View style={{backgroundColor:"white",width,height,flexDirection:"column"}}>
<View style={{width:width,alignItems:"center",position:"absolute",top:0,backgroundColor:"white",zIndex:99,flexDirection:"column"}}>  
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
    {this.state.loading?<ActivityIndicator color={mystyle.active.color} style={{position:"absolute",left:10,top:15}}  />:<Icon.Evilicons name="search" style={{position:"absolute",left:10,top:15,fontSize:30}} />}
</View>
<TouchableOpacity
onPress={()=>{
    this.setState({showSearch:false})
}}
style={{width:40,height:50,alignItems:"center",justifyContent:"center",elevation:1}}>
<Icon.AntDesign name="close" size={20} />
</TouchableOpacity>
</View>
<FlatList 
data={this.state.listLocation}
renderItem={({item,index})=><TouchableOpacity 
style={{flexDirection:"row",width:width,marginBottom:10,minHeight:50,borderBottomWidth:0.5,borderBottomColor:"#444"}}
onPress={()=>{
    this.setState({listLocation:[],bussines_address:item.description},()=>{
    this.getLatLng(item.description);
    });
}}
>
<View style={{width:40,height:50,alignItems:"center"}}>
<Icon.FontAwesome name="map-marker" size={20} />
</View>
<View style={{flexDirection:"column",flex:1,flexWrap:"wrap"}}>
<Text style={{width:"100%",fontSize:12}} >{item.description}</Text>
</View>
<View style={{width:60,height:50,justifyContent:"center",alignItems:"center"}}>
<Icon.MaterialIcons name="keyboard-arrow-right" size={15} />
</View>
</TouchableOpacity>}
/>
</View>
<View style={{overflow:"hidden"}}>
<View style={{width,height:height-160,justifyContent:"center",alignItems:"center"}}>
<MapView
     // remove if not using Google Maps
       style={{width:width,height:height-160}}
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
     <Image source={require("../images/pin.png")}  style={{width:30,height:35,position:"absolute"}} resizeMode="stretch" />
     </View>
 <View style={{width:"100%",justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
 <View style={{padding:10,flexDirection:"column",flex:1}}>
 <Text style={{fontSize:14,fontWeight:"bold"}}>Address: </Text>
 <Text style={{fontSize:14}}>{this.state.bussines_address}</Text>
</View>
</View>
<View style={{alignItems:"center",justifyContent:"center",height:90,paddingRight:15}}>
<TouchableOpacity 
onPress={()=>{
  this.setState({showSearch:false})
}}
style={{height:40,marginHorizontal:5,justifyContent:"center",alignItems:"center",width:120,backgroundColor:mystyle.active.color,borderRadius:40,elevation:3,marginBottom:15}}>
  <Text style={[mystyle.whitetxt]}>Done</Text>
  </TouchableOpacity>
</View>
</View>
</View>
</Modal>
<Modal
      animationType="slide"
      transparent={false}
      visible={this.state.showCamera}
      onRequestClose={() => {
       this.setState({showCamera:false});
      }}
   style={{flex:1}}>
     <View style={{justifyContent:"center",alignItems:"center",flex:1}}>
     <TouchableOpacity onPress={()=>{
       this.setState({showCamera:false});
  }} style={{position:'absolute',right:20,top:20,width:40,backgroundColor:"white",borderRadius:40,width:40,height:40,justifyContent:"center",alignItems:"center",elevation:4}}>
<Icon.AntDesign name="close" size={26} color="black" />
</TouchableOpacity>
  <View style={{justifyContent:"center",alignItems:"center",width,height}}>
 <RNCamera
  onMountError={()=>{

  }}
        ref={ref =>this.camera = ref}
        style = {{width,height}}
        captureAudio={false}
        playSoundOnCapture={true}
        type={this.state.flipCamera?RNCamera.Constants.Type.front:RNCamera.Constants.Type.back}
        faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
        permissionDialogTitle={'Permission to use camera'}
        permissionDialogMessage={'We need your permission to use your camera phone'}
        onBarCodeRead={({ barcodes }) => {
        }}
        onFacesDetected={(d)=>{
        if(!this.state.faceDetect)
        {
        ToastAndroid.show("Face detected.",ToastAndroid.SHORT)
        this.setState({faceDetect:true});
        this.captureCamera();
        }
        }}
        flashMode={this.state.setFlash?RNCamera.Constants.FlashMode.torch:RNCamera.Constants.FlashMode.off}
        onFaceDetectionError={()=>{
         ToastAndroid.show("Face not detected.",ToastAndroid.SHORT)
         this.setState({faceDetect:false});
        }}
    />
</View>
<View style={{position:"absolute",bottom:40,width,justifyContent:"center",alignItems:"center",flexDirection:"row"}}>

<TouchableOpacity onPress={()=>{
  this.setState({flipCamera:!this.state.flipCamera});
  }} style={{width:40,backgroundColor:"white",borderRadius:40,width:40,height:40,justifyContent:"center",alignItems:"center",elevation:4}}>
<Icon.Evilicons name={"refresh"} size={25} color="black" />
</TouchableOpacity>
<TouchableOpacity onPress={()=>{
  this.captureCamera();
  }} style={{backgroundColor:"white",borderRadius:50,width:50,height:50,justifyContent:"center",alignItems:"center",elevation:4,marginHorizontal:20}}>
<Icon.MaterialCommunityIcons name="camera" color="red" size={20} />
  </TouchableOpacity>
<TouchableOpacity onPress={()=>{
  this.setState({setFlash:!this.state.setFlash});
  }} style={{width:40,backgroundColor:"white",borderRadius:40,width:40,height:40,justifyContent:"center",alignItems:"center",elevation:4}}>
<Icon.Ionicons name={this.state.setFlash?"ios-flash":"ios-flash-off"} size={20} color="black" />
</TouchableOpacity>
 </View>
 </View>
</Modal>
<Country 
{...this.state}
returnData={(d)=>{
this.setState(d);
}} />
<Loader 
{...this.state}
returnData={(d)=>{
this.setState(d);
if(this.state.success)
{
  const Actions = this.props.navigation;
  Actions.goBack();
}
}} />
<Modal 
visible={this.state.showImage}
onRequestClose={()=>this.setState({showImage:false})}
transparent={true}
>
<View 
style={{width,height,backgroundColor:"rgba(0,0,0,0.7)",justifyContent:"center",alignItems:"center"}}
>
<TouchableOpacity 
onPress={()=>{
  this.setState({showImage:false})
}}
style={{position:"absolute",top:10,right:10,padding:5,backgroundColor:"rgba(0,0,0,0.2)"}}
>
<Icon.AntDesign name="close" color="white" size={20}/>
</TouchableOpacity>
<Image source={{uri:this.state.imageUrl}}  style={{height:"80%",width:width-20,backgroundColor:"#999"}} 
resizeMode="contain"
/>
</View>
</Modal>
</KeyboardAvoidingView>)
    }
}
NewServiceClass.defaultProps = {
    mobile:"",
    offer:false,
    product_name:"",
    detail:"",
    category_id:"",
    address:"",
    categoryList:[]
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(NewServiceClass);

