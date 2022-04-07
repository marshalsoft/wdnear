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
    KeyboardAvoidingView,
    Image,
    Modal, 
    PermissionsAndroid,
    DeviceEventEmitter,
    Alert} from 'react-native';
    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';
import { RNCamera, FaceDetector } from 'react-native-camera';
const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import * as Animatable from 'react-native-animatable';
import moment  from 'moment';
import firebase from 'firebase'; 
import Sound from 'react-native-sound'; 
import * as EvalEmail from 'email-validator';
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyAxk6-y3UFwM0pP1deA_FDtxOjvwqXFmBg",
    authDomain: "wedeynear-dcf63.firebaseapp.com",
    databaseURL: "https://wedeynear-dcf63.firebaseio.com",
    projectId: "wedeynear-dcf63",
    storageBucket: "wedeynear-dcf63.appspot.com",
    messagingSenderId: "568520040394",
    appId: "1:568520040394:web:f1d90e467ba1aaca773933",
    measurementId: "G-9PHHQVN26E"
  });
}
import FS from 'rn-fetch-blob';
import {DocumentPicker,DocumentPickerUtil} from "react-native-document-picker";
import {sendNotification,NotifyAlert} from '../includes/fire';
import Camera from '../includes/camera';
import auth from '@react-native-firebase/auth';
import CameraRoll from '@react-native-community/cameraroll';
import FileViewer from 'react-native-file-viewer';
import Moment from 'moment';
class ChatClass extends PureComponent{
  captureCamera() {
    const options = {mirrorImage:true,pauseAfterCapture:false,doNotSave:false,fixOrientation:true, quality:0.5,height:height,width:width,base64:true};
    this.camera.takePictureAsync(options).then((data)=>{
    // const uriParts = String(data.uri).split('.');
    //  const fileType = uriParts[uriParts.length - 1];
    //  const filename = String(new Date().getMilliseconds()).replace(/[.]/g,'')+"."+fileType
        console.log(data)
        this.sendMessage({text:this.state.sendchat,image:"data:image/png;base64,"+data.base64})
        this.setState({showCamera:false});
      
      });
  }
    componentDidMount()
    {
      
      auth().onAuthStateChanged((user) => {
        console.log("user:",user)
        if(!user)
        {
          auth().signInAnonymously();
        }else{
          // this.setState({token:auth().currentUser.getToken()})
        }
      })
      this.videoFile = {
        videoID:"",
        token:"",
        video:"",
        uri:""
      }
        var data = this.props;
        console.log("chat data:",data);
        var recipient_token = "";
        var notifcation_time_check = 0;
        this.dbupdate_path = "";
        var checkDates = [];
          this.db = firebase.database().ref(`support`);
          this.db.child(this.props.id_user).on("value",(snapshot)=>{
            var v = snapshot.val();
            console.log(v)
                if(!v)
                {
                 this.db.child(this.props.id_user).push({
                     text:`Hi ${this.props.firstname}, welcome to wedeynear customer service, thank you for contacting us! Please how can we help you?`,
                     sender_id:"admin",
                     recipient_id:this.props.id_user,
                     time:moment().format("hh:mm a"),
                     date:moment().format("YYYY-MM-DD"),
                     user_name:`Customer care`,
                     user_email:this.props.support_email == ""?"admin@wedeynear.com":this.props.support_email,
                     fcmToken:this.props.fcm
                   })
                }else{
                  var msg = [];
                  for(var m in v)
                  {
                   var d = v[m];
                   d.showDate = true;
                   if(checkDates.includes(d.date))
                   {
                   d.showDate = false;
                   }else{
                   checkDates.push(d.date);
                   }
                   var updates = {};
                   updates[`${this.props.id_user}/${m}/read`] = true;
                   d.updates = `${this.props.id_user}/${m}/read`;
                   d.path = `${this.props.id_user}/${m}`;
                   if(d.videoID != undefined)
                   {
                    console.log(d.videoID);
                   if(this.videoFile.videoID == d.videoID)
                   {
                    this.dbupdate_path = `${this.props.id_user}/${m}/uri/`;
                    console.log(this.dbupdate_path);
                   }
                   }
                   msg.push(d)
                  }
              console.log(msg);
              this.setState({messages:msg,loading:false});
                }
            })
     }
     AI(i)
     {
      var txt = "";
       if(i == 0 && !this.state.aiList.includes(i))
       {
         
         if(this.props.orders.length == 0)
         {
          txt = `You do not have any order yet.`;
         }else{
           txt = "Please select from the list of ordered products.";
           var x = this.props.orders.map((a,i)=>{
            return `${a.name}\n${a.id}`;
           })
           txt += x.join(`\n`); 
         }
         this.setState({aiList:[...this.state.aiList,i]});
       }
       if(this.props.orders.length == 0)
         {

         }
      if(txt != "")
      {
        this.sendMessage(txt);
      }
     }
     sendAttach(o,d)
     {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          'title': 'App Permission',
         'message': `WeDeyNear app needs access to read file.`
        }).then((granted)=>{
       if(granted === "granted"){
      if(o == "Image" || o == "PDF")
      {
        DocumentPicker.show({
          filetype:[o == "Image"?DocumentPickerUtil.images():DocumentPickerUtil.pdf()],
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
      var sizeInMB = (res.fileSize / (1024*1024)).toFixed(2);
      if(sizeInMB > 2)
      {
        alert(`File size must less than or equal to 2MB`);
        return ;
      }
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
          console.log('oops', err)
        })
        ifstream.onEnd(() => { 
          res.uri = o == "Image"?"data:image/png;base64,"+data:"application/pdf;base64,"+data;
          var path = {
            text:this.state.sendchat
          }
          if(o == "Image")
          {
            path.image = res.uri;
          }else{
            path.pdf = res.uri;
          }
          // this.setState({attachMent:res},()=>{
            this.sendMessage(path);
          // })
        // alert(JSON.stringify(data))
        })
        })
      })
      }else{
        this.setState({showCamera:true,switchCamera:d})
      }
      }else{
        alert("Access denied");
      }
    })
     }
     writePDF(d)
     {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          'title': 'App Permission',
         'message': `WeDeyNear app needs access to store file.`
        }).then((granted)=>{
       if(granted === "granted"){ 
      const { config, fs,android,ios } = FS;
      var path = fs.dirs.DocumentDir + `/file${moment().format("YYYYMMDDhhmmss")}${d.image == undefined?".pdf":".png"}`;
    //  console.log(fs);
    //  console.log(path);
    //  console.log(d.pdf);
     var base64 = "";
     if(d.image == undefined)
     {
      base64 = String(d.pdf).replace("application/pdf;base64,","")
     }else{
      base64 = String(d.image).replace("data:image/png;base64,","")
     }
    //  console.log(base64);
      // return ;
      fs.writeFile(path,base64, 'base64').then(()=>{
      // if (Platform.OS == "Android") {
       if(d.image == undefined)
       {
        FileViewer.open(path);
      this.setState({showLoader:false})
       }else{
       CameraRoll.save(path, 'photo')
       .then((res) => {
        console.log(res)
       //  console.log(res.path())
       FileViewer.open(res);
      this.setState({showLoader:false})
       }).catch(err => {
         Alert.alert(
           'Save remote Image',
           'Failed to save Image: ' + err.message,
           [{text: 'OK', onPress: () => console.log('OK Pressed')}],
           {cancelable: false},
         );
       }).finally(() => this.setState({showLoader: false}));
      }
    }).catch((e)=>{
      Alert.alert(
        'Save remote Image',
        'Failed to save Image: ' + e.message,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    })
  }else{
    alert("Access denied");
  }
})
     }
   
    constructor(props)
    {
        super(props);
        this.state = {
            messages:[],
            sendchat:"",
            showImage:false,
            zoomImg:"",
            loading:true,
            aiList:[],
            selected:[],
            showAttachment:false,
            attachMent:{uri:null},
            showCamera:false,
            setFlash:false,
            switchCamera:false,
            recording:false,
            recordTimer:10,
            userreplied:false,
            slideIcons:false
        }
        this.sound1 = null;
    }
 
componentWillUnmount()
{
  if(this.db)
  {
    this.db.off()
  }
}
handlerLongClick(d){
  //handler for Long Click
  // alert(JSON.stringify(d))
  if(d.sender_id == this.props.id_user)
  {
    this.setState({selected:[...this.state.selected,d.path]})
  }else{
alert("Message cannot be deleted.")
  }
};
returnTXT(obj)
{
var spl = String(obj.text).split(" ").filter((a,i)=>String(a).replace(/[\n]/g,' ')); 
if(obj.image)
{
  return <View
  style={{padding:2,backgroundColor:"white",alignSelf:"center",borderRadius:10,width:"100%"}}>
   <View >
   <Image source={{uri:obj.image}} style={{height:350,width:width-80}} resizeMode="contain" />
   <TouchableOpacity 
  onPress={()=>{
this.writePDF(obj);
  }}
  style={{width:40,height:40,borderRadius:40,borderWidth:1,justifyContent:"center",alignItems:"center",backgroundColor:"#ccc",position:"absolute",bottom:20,right:20}}> 
  <Icon.Entypo name="download" size={20} />
  </TouchableOpacity>
{obj.read?<Icon.Entypo name="check" style={{position:"absolute",bottom:5,right:30,color:this.props.id_user == obj.sender_id?"white":"limegreen",marginTop:5}} />:null}
  </View>
  {obj.text != ""?<Text style={{margin:5,marginLeft:15}}>{String(obj.text).replace(/[\n]/g,"")}</Text>:null}
  </View>;
}
if(obj.pdf)
{
  return <View style={{flexDirection:"row",width:"100%"}}>
    <View style={{flexDirection:"row",justifyContent:"flex-end",backgroundColor:"transparent",alignItems:"center"}}>
    <View style={{height:70,width:50,justifyContent:"center",alignItems:"center",backgroundColor:"white",borderRadius:10}}>
    <Icon.FontAwesome name="file-pdf-o" size={50} />
    <Text style={{color:"black",fontSize:10,fontWeight:"bold"}}>PDF file</Text>
    </View>
  <TouchableOpacity 
  onPress={()=>{
this.writePDF(obj);
  }}
  style={{width:40,height:40,borderRadius:40,borderWidth:1,justifyContent:"center",alignItems:"center"}}> 
  <Icon.Entypo name="download" size={20} />
  </TouchableOpacity>
  </View>
  </View>;
}else if(obj.video)
{
  return <View style={{flexDirection:"row",width:"100%"}}>
    <View style={{flexDirection:"row",justifyContent:"flex-end",backgroundColor:"transparent",alignItems:"center"}}>
    {obj.uri == ""?<View style={{height:70,width:50,justifyContent:"center",alignItems:"center",backgroundColor:"white",borderRadius:10}}>
    <Icon.FontAwesome style={{opacity:obj.uri == ""?0.2:1}} name="file-video-o" size={50} />
    <Text style={{color:"black",fontSize:10,fontWeight:"bold"}}>Video file</Text>
    <ActivityIndicator color={"red"} style={{position:"absolute",top:20,left:15}} />
    </View>:<View style={{backgroundColor:"#ccc",width:width-100,borderRadius:5,overflow:"hidden"}}>
    <View  style={{width:width-100,height:150}}>
    <WebView 
    source={{uri:obj.uri}}
    style={{width:width-100,height:150}}
    
    />
    {obj.uri != ""?<TouchableOpacity 
  onPress={()=>{
    this.downloadFile(obj.uri);
  }}
  style={{width:40,height:40,borderRadius:40,borderWidth:1,justifyContent:"center",alignItems:"center",position:"absolute",bottom:15,right:12}}> 
  <Icon.Entypo name="download" size={20} color="white" />
  </TouchableOpacity>:null}
{obj.read?<Icon.Entypo name="check" style={{position:"absolute",bottom:10,right:10,color:this.props.id_user == obj.sender_id?"white":"limegreen",marginTop:5}} />:null}
    </View>
    {obj.text != ""?<Text style={{margin:5}}>{obj.text}</Text>:null}
    </View>}
  
  </View>
  </View>;
}else{ 
return <View style={{flexWrap:"wrap",flexDirection:"row",padding:5,paddingHorizontal:10,alignItems:"flex-start",justifyContent:"flex-start"}}>
{spl.map((a,i)=>{
  
  if(EvalEmail.validate(a))
    {
      return <TouchableOpacity
      key={i} onPress={()=>Linking.openURL(`mailto:${a}`)} style={{flexDirection:"row"}}><Text style={{color:"red",textDecorationLine:"underline"}}>{a}</Text><Icon.Evilicons color={"red"} name="envelope" size={20} style={{marginHorizontal:2,marginTop:3}} /></TouchableOpacity>
    }
    if(!isNaN(a) && String(a).length > 10)
    {
      return <TouchableOpacity
      key={i} onPress={()=>Linking.openURL(`tel:${a}`)} style={{flexDirection:"row"}}><Icon.FontAwesome color={this.props.id_user == obj.sender_id?"white":"black"} name="phone" size={15} style={{marginHorizontal:5,color:"red",marginTop:3}} /><Text style={{color:"red",textDecorationLine:"underline"}}>{a}</Text></TouchableOpacity>
    }
  return <Text key={i} style={{color:this.props.id_user == a.sender_id?"white":"black",margin:0}}> {`${a}`}</Text>
    })}
{obj.read?<Icon.Entypo name="check" style={{marginLeft:5,color:this.props.id_user == obj.sender_id?"white":"limegreen",marginTop:5}} />:null}
    </View>
}
}
downloadFile(uri)
{
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  {
    'title': 'App Permission',
   'message': `WeDeyNear app needs access to store file.`
  }).then((granted)=>{
 if(granted === "granted"){ 
console.log(uri);
const { config, fs,android,ios } = FS;
ToastAndroid.show("Download initialized you willbe notified when completed.",ToastAndroid.LONG);
config({
  fileCache : true,
  // android only options, these options be a no-op on IOS
  addAndroidDownloads : {
    // Show notification when response data transmitted
    notification : false,
    // Title of download notification
    title : 'Downloading video',
    // File description (not notification description)
    description : 'Video file',
    mime : 'video/mp4',
    // Make the file scannable  by media scanner
    mediaScannable : true,
  }
}).fetch('GET',uri).then((res)=>{
// if (Platform.OS == "Android") {
console.log(uri);
console.log("path",res.path());

// } else {
  // ios.previewDocument(res.path());
// }
sendLocalNotification({
  title:"Chat Video download",
  body:"Download completed",
  filepath:res.path(),
  fileType:"file",
  mime:'video/mp4'
})
}).catch((e)=>{
console.log(e);
ToastAndroid.show(e.message,ToastAndroid.SHORT);
})
 }else{
   alert("Access denied");
 }
 })
}
sendMessage(d){ 
  var txt = "";
  var chat = {
      sender_id:this.props.id_user,
      recipient_id:"admin",
      time:moment().format("hh:mm a"),
      date:moment().format("YYYY-MM-DD"),
      user_name:this.props.firstname+" "+this.props.lastname,
      user_email:this.props.email,
      fcmToken:this.props.fcm,
      admin_fcmToken:"",
      read:false
    }
    if(d.image)
      {
        chat.image = d.image;
        txt = "sent an image.";
      }else
    if(d.pdf)
      {
        chat.pdf = d.pdf;
        txt = "sent a PDF file.";
      }else
      if(d.video)
      {
        chat = {...chat,...this.videoFile};
        txt = "sent a Video file.";
      }else{
        chat.text = d;
        txt = d;
      }
      
    console.log("log-chat",chat);
    // return ;
  this.db.child(this.props.id_user).push(chat);
this.setState({sendchat:""});
var token  = chat.reply?chat.store_fcmToken:chat.user_fcmToken;
// alert(JSON.stringify(token));
console.log("token",token);
    sendNotification(token,{
      messageId:moment().format("YYYMMDDhhmmss"),
      title:"You have chat from "+this.props.firstname+" "+this.props.lastname,
      body:txt,
      chatroom:"support@"+this.props.recipient_id,
      bigText:`Chat from WeDeyNear app`,
      fcmToken:chat.admin_fcmToken,
      ...chat
    })
  }
sendNotify(d)
{

}
async startRecording() {
  const {uploadFiles} = this.props;
 
  this.setState({ recording: true });
  
  // default to mp4 for android as codec is not set
 this.camera.recordAsync({
  ratio:"4:3",
  pictureSize:{width:width,height:200},

 }).then((res)=>{
this.setState({ recording: false,showCamera:false });
console.log(res);
var d = String(res.uri).split(".");
console.log(d);
this.videoFile = {
  text:this.state.sendchat,
  video:true,
  uri:"",
  videoID:moment().format("YYYYMMDDhhmmssa"),
  update_path:Platform.OS === 'ios' ? res.uri.replace('file://', '') : res.uri,
  type:"video/"+d[d.length - 1]
}
console.log(this.videoFile);
this.sendMessage(this.videoFile);

  });
  this.RecoDTimer = setInterval(()=>{
    this.stopRecord();
  },1000)
}

stopRecord() {
  if(this.state.recordTimer <= 0)
  {
    if(this.RecoDTimer)
    {
      if(this.camera)
      {
        this.camera.stopRecording();
      }
      clearInterval(this.RecoDTimer);
      this.setState({ recording: false,recordTimer:10});
    return ;
    }
  }else{
    this.setState({recordTimer:this.state.recordTimer - 1,recording:true})
  }
}
render() 
{
const {selected,showAttachment,recording} = this.state;
return(<View style={mystyle.window} >
<View style={{flexDirection:"column",width:width,height:height}}>
<View style={{height:60,width:width,backgroundColor:mystyle.active.color,flexDirection:"row"}}>
         <TouchableOpacity 
         onPress={()=>{
          const Actions = this.props.navigation;
           if(this.state.selected.length != 0)
           {
             this.setState({selected:[]})
             return ;
           }
           Actions.goBack();
         }}
         style={{width:40,height:60,justifyContent:"center",alignItems:"center"}} >
           <Icon.MaterialIcons name="keyboard-arrow-left"  size={25} color="white" />
         </TouchableOpacity>
         {selected.length == 0?<View style={{flex:1,flexDirection:"row"}}>
         <View style={{flex:1,justifyContent:"center",paddingLeft:10}}>
        <Text style={{fontSize:16,color:"#fff",fontWeight:"bold"}}>{this.props.id_store == ""?"Chat Us":"Chat"}</Text>
        {this.props.id_store != ""?<Text ellipsizeMode="tail" numberOfLines={1} style={{fontSize:14,color:"#fff",fontWeight:"bold"}}>{this.props.id_store == ""?"Customer Care":this.props.user_name}</Text>:null}
         </View>
         <TouchableOpacity 
         onPress={()=>{
          Alert.alert("Alert",`Calling ${this.props.id_store != ""?this.props.storeOwner.username:"Customer's service"} will attract charges and this will be done using your mobile operator, \ndo you want to continue?`,
          [
          {text: 'No',onPress:() => {
          //  Actions.drawerClose();
          }, style: 'cancel'},
          {text: 'Yes', onPress: () => {
           Linking.openURL( "tel:"+this.props.support_phone)
          }, style: 'cancel'}
          ],
          {cancelable:false})
         }}
         style={{width:35,height:60,justifyContent:"center",alignItems:"center"}} >
           <Icon.FontAwesome name="phone"  size={25} color="white" />
         </TouchableOpacity>
         <TouchableOpacity 
         onPress={()=>{
          var  url = "admin@wedeynear.com";
          if(this.props.support_email != "")
          {
           url = this.props.support_email;
          }
         //  alert(url)
         Linking.openURL("mailto:"+url);
         }}
         style={{marginHorizontal:10,width:35,height:60,justifyContent:"center",alignItems:"center"}} >
         <Icon.SimpleLineIcons name="envelope"  size={25} color="white" />
         </TouchableOpacity>
         <TouchableOpacity 
         onPress={()=>{
          const Actions = this.props.navigation;
          Actions.settings({chat:true});
         }}
         style={{marginHorizontal:10,width:30,height:60,justifyContent:"center",alignItems:"center"}} >
        <Icon.Feather name="sliders"  size={25} color="white" />
         </TouchableOpacity>
         </View>:<View style={{flex:1,flexDirection:"row",alignItems:"center",paddingLeft:10}}>
         <View style={{flex:1,justifyContent:"center",paddingLeft:10}}>
        <Text style={{fontSize:16,color:"#fff"}} >{selected.length}</Text>
        </View>
        <View style={{justifyContent:"center",paddingLeft:10}}>
        <Text style={{fontSize:16,color:"#fff"}} >Delete</Text>
         </View>
        <TouchableOpacity 
         onPress={()=>{
          Alert.alert("Confirm",`Are you sure you want to delete this message?`,
          [
          {text: 'No',onPress:() => {
          //  Actions.drawerClose();
          }, style: 'cancel'},
          {text: 'Yes', onPress: () => {
           this.state.selected.forEach((s)=>{
             var spl = String(s).split("/");
            //  alert(JSON.stringify(spl))
             this.db.child(spl[0]).child(spl[1]).update({deleted:true}); 
           })
           this.setState({selected:[]})
            // this.setState({selected:[...this.state.selected,d.path]})
          }, style: 'cancel'}
          ],
          {cancelable:false})
         }}
         style={{marginHorizontal:10,width:40,height:60,justifyContent:"center",alignItems:"center"}} >
           <Icon.Ionicons name="ios-trash"  size={25} color="white" />
         </TouchableOpacity>
        </View>}
         </View>
  <KeyboardAvoidingView
behavior="padding" style={{width:width,height:height-70}}>
<View style={{flex:1}}>
<ScrollView 
keyboardShouldPersistTaps="always"
     ref={ ( ref ) => this.scrollView = ref }
     onContentSizeChange={()=>{   
      if(this.scrollView)
      {
        try {
        this.scrollView.scrollToEnd({animated:true});
        if(this.props.notifications_sound && this.sound1 == null)
        {
        this.sound1 = new Sound(require('../includes/slow.mp3'),
        (error, sound) => {
          if (error) {
            return true; 
          }
          this.sound1.play(() => {
          this.sound1.stop();
          this.sound1.release();
          this.sound1 = null;
          });
        });
      }
        } catch (error) {
        }
      }   
         // alert push notifcation
     }}
 nestedScrollEnabled={true}
 showsVerticalScrollIndicator={false}
 style={{flex:1,backgroundColor:"#ebebeb"}}
 >
 <View style={{flexDirection:"column",marginBottom:50}}>
  {this.state.loading?<View style={{flexDirection:"row",padding:10,width:"100%",justifyContent:"flex-start",alignItems:"flex-start"}}>
   <ActivityIndicator size="small" color={mystyle.active.color} />
   <Text style={{marginLeft:5,fontSize:12}}>Loading...</Text>
  </View> :null}
{this.props.id_store != ""?<View style={{width:"100%",height:100,backgroundColor:"#ccc"}}>
<Image source={this.props.banner == null?require("../images/placeholder.png"):{uri:this.props.banner}} style={{width:"100%",height:100}} resizeMode="cover" />
</View>:null}
{this.state.messages.map((a,i)=><View key={i} style={{width:width-15,padding:10,backgroundColor:selected.includes(a.path)?"rgba(84,169,210,0.1)":"transparent"}}>
{a.showDate?<View >
  <Text style={{padding:2,paddingHorizontal:5,marginVertical:10,alignSelf:"center",borderRadius:20,color:"white",fontSize:10,textAlign:"center",backgroundColor:"rgba(0,0,0,0.4)"}}>{Moment(a.date).format("Do, MMM YYYY")}</Text>
  </View>:null}
{this.props.id_user != a.sender_id?<View style={{flexDirection:"row",width:"90%",justifyContent:"flex-start",alignItems:"flex-start"}}>
{!a.deleted?<View style={{width:50,backgroundColor:"#ccc",height:50,borderRadius:50,justifyContent:"center",alignItems:"center"}}>
<Text style={{color:"#fff",fontSize:20}}>{String(a.user_name).split(" ").filter((a,i)=>i < 2).map((a,i)=>String(a[0]).toUpperCase()).join("")}</Text>  
</View>:null}
<View style={{flexDirection:"column"}}>
{a.deleted?<View style={{flexDirection:"row",alignItems:"center",backgroundColor:"rgba(255,255,255,0.5)",borderRadius:50,padding:5,paddingHorizontal:10}}>
  <Icon.Entypo name="block" style={{marginRight:5,color:"#ccc"}} />
  <Text style={{fontSize:12}}>
Message deleted
</Text></View>:<TouchableOpacity
onLongPress={()=>this.handlerLongClick(a)}
delayLongPress={200}
activeOpacity={0.7}
 style={{flexDirection:"column",alignSelf:"center",backgroundColor:"#fff",marginHorizontal:5,borderRadius:20}}>
{this.returnTXT(a)}
</TouchableOpacity>}
{!a.deleted?<Text style={{fontSize:10,marginLeft:15}}>{a.time}</Text>:null}
</View>
</View>:
<View style={{flexDirection:"row",paddingLeft:10,width:"90%",justifyContent:"flex-end"}}>
<View style={{flexDirection:"column"}}>
{a.deleted?<View style={{flexDirection:"row",alignItems:"center",backgroundColor:"rgba(255,255,255,0.5)",borderRadius:50,padding:5,paddingHorizontal:10,marginRight:-40}}>
<Icon.Entypo name="block" style={{marginRight:5,color:"#ccc"}} />
<Text style={{fontSize:12}}>Message deleted</Text></View>:<TouchableOpacity
underlayColor="white"
onPress={()=>{
  var x = this.state.selected.filter((b,i)=>b != a.path)
  if(this.state.selected.length > 0)
  {
    var n = this.state.selected.includes(a.path);
    this.setState({selected:n?x:[...this.state.selected,a.path]})
  }
}}
onLongPress={()=>this.handlerLongClick(a)}
delayLongPress={100}
activeOpacity={0.7}
style={{flexDirection:"column",alignSelf:"center",backgroundColor:a.pdf?"transparent":"#97ddff",marginHorizontal:5,borderRadius:10}}>
{this.returnTXT(a)}
</TouchableOpacity>}
{!a.deleted?<Text style={{fontSize:10,marginRight:15,width:"90%",textAlign:"right"}}>{a.time}</Text>:null}
</View>
{!a.deleted?<View style={{width:50,backgroundColor:"#FFD615",height:50,borderRadius:50,justifyContent:"center",alignItems:"center",marginRight:-40}}>
  <Text style={{color:"#fff",fontSize:20}}>{String(a.user_name).split(" ").filter((a,i)=>i < 2).map((a,i)=>String(a[0]).toUpperCase()).join("")}</Text>  
</View>:null}
</View>}
</View>)}
  </View>
   </ScrollView>
   <View style={{position:"absolute",overflow:"hidden",bottom:0,width:width,flexDirection:"column"}}>
  
{showAttachment?<Animatable.View
onAnimationEnd={()=>{
  if(!this.state.slideIcons)
  {
    this.setState({showAttachment:false})
  }else{
    this.setState({slideIcons:true})
  }
}}
animation={this.state.slideIcons?{
  from:{
    transform:[
      {translateY:70}
    ]
  },
  to:{
    transform:[
      {translateY:0}
    ]
  }
}:{
  from:{
    transform:[
      {translateY:0}
    ]
  },
  to:{
    transform:[
      {translateY:80}
    ]
  }
}}
duration={500}

easing="ease-in-out-back"
useNativeDriver
style={{paddingHorizontal:10,width:width,height:70,alignItems:"center",justifyContent:"center",backgroundColor:"white"}}>
 <ScrollView 
keyboardShouldPersistTaps="always"
    horizontal
    showsHorizontalScrollIndicator={false}
    style={{backgroundColor:"white"}}
    >
  {["Image","PDF","Camera"].map((a,i)=><TouchableOpacity key={i}
  onPress={()=>{
    if(this.state.loading)
    {
      ToastAndroid.show("Please wait...",ToastAndroid.SHORT);
      return ;
    }
 this.sendAttach(a,i == 2?false:true)
  }}
  style={{borderWidth:0.2,borderColor:"#ccc",padding:5,paddingHorizontal:10,margin:5,width:70,height:70}}
  >
    <Animatable.View 
   animation={{
    from:{
      transform:[
        {translateY:70}
      ]
    },
    to:{
      transform:[
        {translateY:0}
      ]
    }
  }}
  duration={200*(i+1)}
  easing="ease-in-out-back"
  useNativeDriver
    style={{flex:1,justifyContent:"center",alignItems:"center"}}>
<Icon.FontAwesome name={i == 0?"file-photo-o":i == 1?"file-pdf-o":i == 2?"camera":"video-camera"} size={30} />
<Text style={{fontSize:10,marginBottom:10}}>{a}</Text>
    </Animatable.View>
  </TouchableOpacity>)}  
</ScrollView>
</Animatable.View>:null}
</View>
</View>
<View style={{width:"100%",minHeight:80,backgroundColor:"#f0f0f0",borderTopColor:"#ccc",borderTopWidth:0.4,flexDirection:"column"}}>
<View style={{flexDirection:"row",maxHeight:280,alignItems:"flex-start"}}>
{/* <TouchableOpacity 
onPress={()=>{
  this.setState({showAttachment:true,slideIcons:!this.state.slideIcons})
 }}
style={{height:60,justifyContent:"center",alignItems:"center"}}>
 {!this.state.slideIcons?<Icon.Evilicons name="paperclip" size={35} />:<Icon.Evilicons name="chevron-down" size={35} />}
</TouchableOpacity> */}
<View style={{flex:1,flexDirection:"row",paddingLeft:10,paddingBottom:10,alignItems:"flex-start",justifyContent:"center"}}>
<TextInput 
ref={e=>this.chatInput=e}
onChangeText={(d)=>{
this.setState({sendchat:d});
}}
onFocus={()=>{

}}
value={this.state.sendchat}
style={{backgroundColor:"white",width:"100%",textAlignVertical:"top",paddingLeft:15,borderColor:"#ccc",borderWidth:0.5,borderRadius:10,margin:10}}
placeholder="Enter Your Message..."
multiline
/>
</View>
<Animatable.View animation="zoomIn" duration={500} useNativeDriver style={{width:60,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
<TouchableOpacity 
onPress={()=>{
  if(this.state.loading)
  {
    ToastAndroid.show("Please wait...",ToastAndroid.SHORT);
    return ;
  }
if(this.state.sendchat != "")
{
  this.sendMessage(this.state.sendchat);
}
}}
style={{height:60,justifyContent:"center",alignItems:"center"}}>
 <Icon.MaterialIcons name="send" size={30} />
</TouchableOpacity>
</Animatable.View>
</View>
</View>
</KeyboardAvoidingView>
</View>
<Modal
      animationType="slide"
      transparent={false}
      visible={this.state.showCamera}
      onRequestClose={() => {
       this.setState({showCamera:false});
      }}
   style={{flex:1}}>
     <View style={{justifyContent:"center",alignItems:"center",flex:1}}>
    <RNCamera
  onMountError={()=>{

  }}
        ref={ref =>this.camera = ref}
        style = {{width,height}}
        captureAudio={this.state.switchCamera}
        playSoundOnCapture={true}
        type={RNCamera.Constants.Type.back}
        permissionDialogTitle={'Permission to use camera'}
        permissionDialogMessage={'We need your permission to use your camera phone'}
        flashMode={this.state.setFlash?RNCamera.Constants.FlashMode.torch:RNCamera.Constants.FlashMode.off}
    />
    <TouchableOpacity onPress={()=>{
  this.setState({showCamera:false});
  }} style={{position:'absolute',right:20,top:20,width:40,backgroundColor:"white",borderRadius:40,width:40,height:40,justifyContent:"center",alignItems:"center",elevation:4}}>
<Icon.AntDesign name="close" size={30} color="black" />
</TouchableOpacity>
 <TouchableOpacity onPress={()=>{
  
  if(this.state.switchCamera)
    {
    if(this.state.recording)
    {
   this.stopRecord();   
    return ;
    }
    this.startRecording();
    }else{
      this.captureCamera();
    }
  }} style={{position:"absolute",bottom:40,backgroundColor:"white",borderRadius:50,width:50,height:50,justifyContent:"center",alignItems:"center",elevation:4}}>
<Icon.FontAwesome name={this.state.switchCamera?this.state.recording?"stop":"video-camera":"camera"} color="red" size={20} />
</TouchableOpacity>
  <TouchableOpacity onPress={()=>{
  this.setState({setFlash:!this.state.setFlash});
  }} style={{position:'absolute',right:(width/2)-100,bottom:45,width:40,backgroundColor:"white",borderRadius:40,width:40,height:40,justifyContent:"center",alignItems:"center",elevation:4}}>
<Icon.Ionicons name={this.state.setFlash?"ios-flash":"ios-flash-off"} size={20} color="black" />
</TouchableOpacity>
<View style={{position:'absolute',left:0,bottom:15,justifyContent:"center",alignItems:"center",width:"100%"}}>
<Text style={{color:"white",fontSize:12,textAlign:"center"}}>Maximum recording time: {this.state.recordTimer}</Text>
</View>
    </View>
    </Modal>
</View>)
    }
}
ChatClass.defaultProps = {
  fKey:"",
  banner:null,
  id_store:"",
  sender_id:"",
  recipient_id:"",
  storeOwner:{
  avatar: "",
  email: "",
  fullname: "",
  id:"",
  username:"",
  mobile: "",
  fcmKey:"",
  category_name:"",
  product_name:"",
  store_name:"",
  offer:false
}
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(ChatClass);

