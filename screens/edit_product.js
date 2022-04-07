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
import firebase from 'firebase'; 
import {DocumentPicker,DocumentPickerUtil} from "react-native-document-picker";
import CountryList from '../includes/countries';
import { RNCamera, FaceDetector } from 'react-native-camera';

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
import {postTEST,postDATA,getDATA,returnAllNumbers,returnMobile,returnComma} from '../includes/func';
const { config, fs,android,ios } = FS;

class EditProductClass extends PureComponent{
    componentDidMount()
    {
      const Actions = this.props.navigation;
      console.log("senddata",this.props.route.params.senddata);
    this.setState(this.props.route.params.senddata,()=>{
      try{
      this.setState({mobile:this.state.user[0].telephone});
      }catch(e){

      }
    });
    this.BackH = BackHandler.addEventListener("hardwareBackPress",()=>{
      Actions.goBack();
      return true;
    })
   
     }
    constructor(props)
    {
        super(props);
        this.state = {
          showCamera:false,
          setFlash:false,
            id_user:"",
            selectedCountry:{
                flag:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUCAIAAAAVyRqTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0RjI4OEFDMTE3ODQxMUUyQTcxNDlDNEFCRkNENzc2NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0RjI4OEFDMjE3ODQxMUUyQTcxNDlDNEFCRkNENzc2NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjRGMjg4QUJGMTc4NDExRTJBNzE0OUM0QUJGQ0Q3NzY2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjRGMjg4QUMwMTc4NDExRTJBNzE0OUM0QUJGQ0Q3NzY2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+qCpo0QAAADBJREFUeNpiZGgPZMAN/leswyPL2BGER5aJgWZg1OhRo0eNHjV61OhRo2lnNECAAQBu1gQALTkVbAAAAABJRU5ErkJggg==",
                name:"Nigeria",calling_code:"234"},
            user:{
                result:[
                    {id_user:""}
                ]
            },
            seller:{},
           adsList:[],
           product_image:{uri:null},
           images_list:[],
           addimage_list:[],
            product_name:"",
            category_name:"",
          chatusers:{},
          users_array:[],
          sendchat:"",
          id_store:0,
          showNumber:false,
          showPreview:false,
          showAttachment:false,
          setIndex:0,
          price:"",
          country:"",
          city:"",
          slideIndex:1,
          slideAnim:true,
          searchTXT:"",
          loading:true,
          fcmToken:"",
          fKey:"",
          rating:0,
          imagePath:null,
          edit:true,
          detail:"",
          address:"",
          mobile:"",
          showCountryList:false,
          id_store:"",
          images:{uri:null},
          flipCamera:false
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
    // this.db.off();
  }
  if(this.db2)
  {
    // this.db2.off();
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
render() 
{
const {user,id_store,seller,sendchat,setIndex,adsList,showNumber,images,product_image,images_list,addimage_list,
  product_name,
  category_name,edit,id_user,
  offer,
  address,
  category_color,
  category_id,
  city,
  created_at,
  customers,
  date_created,
  detail,
  distance,
  featured,
  gallery,
  latitude,
  link,
  longitude,
  name,
  nbrOffers,
  nbr_votes,
  opening,
  opening_time_table,
  status,
  tags,
  mobile,
  updated_at,
  user_id,
  verified,
  voted,
  votes,
  offer_value} = this.state;

return(<View style={mystyle.window} >
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
         
         <TouchableOpacity 
         onPress={()=>{
            this.setState({edit:!this.state.edit});
         }}
         style={{width:60,height:60,justifyContent:"center",alignItems:"center"}} >
         <Icon.FontAwesome name={edit?"eye":"edit"}  size={25} color="white" />
         </TouchableOpacity>
         </View>
  <ScrollView
  ref={e=>this.chatScrol=e}
  onContentSizeChange={()=>{
      if(this.chatScrol && this.state.kyUp)
      {
        this.chatScrol.scrollToEnd({animated:true});
      }
  }}
  style={{height:height,width:width}}
  showsHorizontalScrollIndicator={false}
     >
 <View style={{width:width,flexDirection:"column",paddingBottom:50}}>
   <View
 style={[{width:width,padding:0,borderRadius:10,alignSelf:"center",flexDirection:"column"}]}>
  <View style={{width:"100%",height:300,backgroundColor:"#444",marginBottom:5}}>
  <Image source={images.uri == null?require("../images/placeholder.png"):{uri:images.uri}} style={{width:"100%",height:300}} resizeMode="cover" />
  <TouchableOpacity
  activeOpacity={0.1}
  onPress={()=>{
    // this.setState({showPreview:true});
    var path = fs.dirs.DocumentDir + `/product_image${id_store}.png`;
    this.setState({imagePath:path},()=>{
    this.writeFile(images.uri);
    })
   }} style={{width:"100%",height:300,backgroundColor:"#444",position:"absolute",top:0,left:0,backgroundColor:"rgba(0,0,0,0.2)"}}>
 </TouchableOpacity>
  <View style={{borderWidth:0,height:70,borderColor:"#ccc",width:width-20,margin:10,position:"absolute",bottom:10,justifyContent:"center",flexDirection:"column"}}>
{!edit?<Text style={{fontSize:20,color:"white"}}>{"Min price: NGN"+returnComma(this.state.service_price_min)}{`\nMax price: NGN`+returnComma(this.state.service_price)}</Text>:null}
</View>
</View>
{edit?<Text style={{fontSize:12,marginLeft:10}} >Only 4 product images can be added.</Text>:null}
<View style={{width:width-20,margin:10,height:70,flexDirection:"row"}}>
{addimage_list.length != 0?<ScrollView 
keyboardShouldPersistTaps="always"
horizontal
style={{width:width-60,height:70}}
showsHorizontalScrollIndicator={false}
ref={e=>this.adsScroll=e}
>
{addimage_list.map((a,i,self)=><TouchableOpacity 
 activeOpacity={edit?0.5:1}
onPress={()=>{
    if(edit)
    {
    Alert.alert("Action",`What do you want to do?`,
    [
      {text: 'Cancel', onPress: () => {
   
      }, style: 'cancel'},
     {text: 'Remove', onPress: () => {
        this.setState({addimage_list:self.filter((a,o)=>o != i)})
    }, style: 'cancel'},
  {text: 'Preview', onPress: () => {
    FileViewer.open(a.uri);
}, style: 'cancel'}
    ],
    {cancelable:false})
}
}}
key={i} style={{marginHorizontal:2,width:100,height:60,backgroundColor:"#ccc"}}>
<Image source={{uri:a.uri}} style={{width:100,height:60}} resizeMode="cover" />
{edit?<View style={{justifyContent:"center",alignItems:"center",position:"absolute",top:5,right:5}} >
         <Icon.FontAwesome name="eye"  size={12} color="red" />
         </View>:null}
         {edit?<View style={{justifyContent:"center",alignItems:"center",position:"absolute",top:25,right:5}} >
         <Icon.FontAwesome name="trash"  size={12} color="red" />
         </View>:null}
</TouchableOpacity>)}
</ScrollView>:<View style={{width:width-90,flexDirection:"row"}}>
{["","",""].map((a,i)=><View 
  
    key={i} style={{opacity:0.3,marginHorizontal:2,width:85,height:60,backgroundColor:"#ccc"}}>
    <View style={{justifyContent:"center",alignItems:"center",position:"absolute",top:5,right:5}} >
             <Icon.FontAwesome name="eye"  size={12} color="red" />
             </View>
             <View style={{justifyContent:"center",alignItems:"center",position:"absolute",top:25,right:5}} >
             <Icon.FontAwesome name="trash"  size={12} color="red" />
             </View>
    </View>)}
</View>}
{edit?<TouchableOpacity
  activeOpacity={0.1}
  onPress={()=>{
    if(this.state.addimage_list.length < 4)
    {
    Alert.alert("Action",`Add image by choosing from either (Camera or Image file) buttons below.\n * NOTE*: uploading new a image(s), this will overide(s) pre-exiting ones.`,
    [
      {text: 'Cancel', onPress: () => {
   
      }, style: 'cancel'},
     {text: 'Camera', onPress: () => {
      this.setState({showCamera:true});
    }, style: 'cancel'},
  {text: 'Image File', onPress: () => {
    DocumentPicker.show({
        filetype:[DocumentPickerUtil.images()],
      },(error,res)=>{
    if(error)
    {
      return true;
    }
    var sizeInMB = (res.fileSize / (1024*1024)).toFixed(2);
    console.log(sizeInMB);
    if(sizeInMB > 2)
    {
      alert(`File size must less than or equal to 2MB`);
      return ;
    }
    console.log(res);
    // alert(JSON.stringify(this.state.addimage_list));
    res.path = res.uri;
    res.name = res.fileName;
    res.filename = res.fileName;
    this.setState({addimage_list:[...this.state.addimage_list,res]})
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
 </TouchableOpacity>:null}
</View>
 {!edit?<View style={{width:"100%",flexDirection:"column",padding:15,paddingVertical:10,alignItems:"center",backgroundColor:"rgba(233,227,227,0.7)"}}>
 <View style={{width:"100%",backgroundColor:"white",width:width-40}}>
 <View style={{overflow:"hidden",width:width-40,marginBottom:10,height:50,backgroundColor:"#ccc",alignItems:"center",justifyContent:"center"}}>
<Image source={require("../images/back3.png")} style={{width:width,height:height,position:"absolute"}} resizeMode="cover" />
 <View style={{width:"100%",paddingVertical:10,height:"100%",alignItems:"center",position:"absolute",backgroundColor:"rgba(255,255,255,0.6)"}}>
 </View>
 <Text style={{fontSize:16}}>{this.state.offer?"OFFER":this.state.category_name}</Text>
 </View>
 <View style={{width:"100%",paddingHorizontal:15,paddingBottom:15,minHeight:250,justifyContent:"flex-start"}}>
   <Text  style={[mystyle.title,{margin:0}]} >{this.state.product_name}</Text>
 <View style={{flex:1,justifyContent:"flex-start",alignItems:"flex-start"}}>
   <Text style={[mystyle.subtitle]}>{this.state.detail}</Text>
 </View>
 <View style={{width:"100%",flexDirection:"row",borderTopColor:"#444",borderTopWidth:0.5}}>
 <View style={{padding:5,flex:1,alignItems:"center",flexDirection:"row"}}>
   <Icon.FontAwesome name="map-marker" size={15} />
   <Text style={[mystyle.subtitle,{fontSize:12,padding:5}]}> {this.state.address}</Text>
 </View>
 <View style={{padding:5,flex:1,flexDirection:"row"}}>
 <Icon.FontAwesome name="calendar" size={12} />
   <Text style={[mystyle.subtitle,{fontSize:12}]}> Posted: {this.state.date_created}</Text>
 </View>
 </View>
 <View style={{width:"100%",flexDirection:"row"}}>
 <TouchableOpacity
 onPress={()=>{
   this.setState({showNumber:!showNumber});
 }} style={{padding:5,flex:1,alignItems:"center",flexDirection:"row"}}>
   <Icon.FontAwesome name="phone" size={15} />
   <Text style={[mystyle.subtitle,{fontSize:12}]}> {showNumber?`${this.state.user[0].telephone}`:"Show number"}</Text>
 </TouchableOpacity>
 <View style={{padding:5,flex:1,flexDirection:"row"}}>
 <Icon.MaterialIcons name="timer" size={15} />
<Text style={[mystyle.subtitle,{fontSize:12}]}>{`opening hrs: 1${this.state.opening}`}</Text>
 </View>
 </View>
 </View>
<View style={{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"center",padding:20}}>
<Ratings 
returnData={(d)=>{
this.setState(d);
}}
id_store={this.state.id_store}
rating={this.state.rating}
/>
</View>
{String(this.state.verified) == "0"?<Image source={require("../images/uv.png")} style={{width:70,height:70,position:"absolute",bottom:0,right:0,opacity:0.7,transform:[{
  rotate:"0deg"
}]}} resizeMode="cover" />:<Image source={require("../images/v.png")} style={{width:70,height:70,position:"absolute",bottom:0,right:0,transform:[{
  rotate:"-45deg"
}]}} resizeMode="cover" />}
 </View>
 </View>:<View style={{flex:1,flexDirection:"column",paddingHorizontal:16,marginBottom:20}}>
 <Text style={{fontSize:16}}>Service Name</Text>
 <View style={[mystyle.regInput,{width:width-30,minHeight:50,margin:0}]}>
<TextInput 
    keyboardType="default"
    multiline
    onChangeText={(d)=>this.setState({product_name:d})}
    value={this.state.product_name}
    onFocus={()=>this.setState({kyUp:true})}
    onBlur={()=>this.setState({kyUp:false})}
    style={{fontSize:16,flex:1,textAlignVertical:"top",textAlign:"left",padding:10}}
    />
</View>  

<Text style={{fontSize:16}}>More detailed description</Text>
 <View style={[mystyle.regInput,{width:width-30,minHeight:80,margin:0}]}>
<TextInput 
    keyboardType="default"
    multiline
    onChangeText={(d)=>this.setState({detail:d})}
    value={this.state.detail}
    onFocus={()=>this.setState({kyUp:true})}
    onBlur={()=>this.setState({kyUp:false})}
    style={{fontSize:16,flex:1,textAlignVertical:"top",textAlign:"left",padding:10}}
    />
</View>  
<Text style={{fontSize:16,marginTop:10}}>Business Phone number</Text>
<View style={[mystyle.regInput,{width:width-30,flexDirection:"row",borderWidth:1,borderColor:mystyle.regInput.backgroundColor,margin:0}]}>
<TouchableOpacity
onPress={()=>{
  this.setState({showCountryList:true})
}}
style={[{width:70,height:50,backgroundColor:"white",justifyContent:"center",alignItems:"center",flexDirection:"row",overflow:"hidden"}]}>
<Image source={{uri:String(this.state.selectedCountry.flag).includes("data:image/png;base64,")?this.state.selectedCountry.flag:"data:image/png;base64,"+this.state.selectedCountry.flag}} style={{width:25,height:15}} resizeMode="cover"/>
</TouchableOpacity>
<TextInput 
    keyboardType="phone-pad"
    placeholder="Mobile"
    maxLength={15}
    onChangeText={(d)=>this.setState({mobile:returnAllNumbers(d)})}
    value={returnMobile(this.state.mobile)}
    onFocus={()=>this.setState({kyUp:true})}
    onBlur={()=>this.setState({kyUp:false})}
    style={{fontSize:16,flex:1,textAlignVertical:"center",textAlign:"left",paddingLeft:10}}
    />
</View>

<Text style={{fontSize:16,marginTop:10}}>Business Address</Text>
 <View style={[mystyle.regInput,{width:width-30,margin:0}]}>
<TextInput 
    keyboardType="default"
    multiline
    onChangeText={(d)=>this.setState({address:d})}
    value={this.state.address}
    onFocus={()=>this.setState({kyUp:true})}
    style={{fontSize:16,flex:1,textAlignVertical:"center",textAlign:"left",paddingLeft:16}}
    />
</View>

 </View>}

 </View>
 <View style={{height:60,width:width,flexDirection:"row",justifyContent:"center"}}>
 {edit?<TouchableOpacity 
 onPress={()=>{
    if(this.state.detail == "")
    {
    this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter details, thanks."})
    }else if(this.state.mobile == "")
    {
    this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter mobile number, thanks."})
    }else{
    var data = {
     store_id:parseInt(this.state.id_store),
     user_id:parseInt(this.state.id_user),
     name:this.state.product_name,
     phone:this.state.mobile,
     address:this.state.address,
     lat:this.props.Reducer.latitude == ""?"6.5244":this.props.Reducer.latitude,
     lng:this.props.Reducer.longitude == ""?"3.3792":this.props.Reducer.longitude,
     category_id:parseInt(category_id),//problem
     detail:this.state.detail,
     image:""
    }
   
  console.log(data)
// return;
this.setState({showLoader:true,isProcessing:true,success:false,errorInfo:"Please wait..."})
    postDATA("store/updateService",data).then((res)=>{
    if(this.state.addimage_list.length != 0 && res.success == 1)
    {
      var d = {
        user_id:data.user_id,
        store_id:data.store_id,
        images:this.state.addimage_list
      }
  console.log(d);
  postDATA("store/uploadStoreImages",d).then((res)=>{
        this.setState({showLoader:true,edit:!res.status,isProcessing:false,success:res.status,errorInfo:res.status?"Your service was successfully updated.":res.message},()=>{
         
        })
        })
    }else{
        this.setState({showLoader:true,isProcessing:false,success:res.status,errorInfo:res.status?"Your service was successfully updated.":res.message})
    }
    if(res.status)
    {
      DeviceEventEmitter.emit("reload",{action:"service"});
     setTimeout(()=>{
      Actions.goBack();
    },500)
    }
  }) 
} 
 }}
 style={{height:40,marginHorizontal:5,justifyContent:"center",alignItems:"center",width:150,backgroundColor:mystyle.active.color,borderRadius:40,elevation:3}}>
 <Text style={[mystyle.whitetxt]}>Update Service</Text>
 </TouchableOpacity>:null}
 </View>
 {this.state.kyUp?<View style={{height:250,width}}></View>:null}
 </View>
 </ScrollView> 
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
<CountryList 
showCountryList={this.state.showCountryList}
returnData={(d)=>{
d.calling_code = "+"+d.selectedCountry.calling_code;
this.setState(d);
}} 
/>
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
export default connect(mapStateToProps)(EditProductClass);

