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
const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import * as Animatable from 'react-native-animatable';
import moment  from 'moment';
import firebase from 'firebase'; 
import Sound from 'react-native-sound'; 

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey:"AIzaSyAxk6-y3UFwM0pP1deA_FDtxOjvwqXFmBg",
    authDomain:"wedeynear-dcf63.firebaseapp.com",
    databaseURL:"https://wedeynear-dcf63.firebaseio.com",
    projectId:"wedeynear-dcf63",
    storageBucket:"wedeynear-dcf63.appspot.com",
    messagingSenderId:"568520040394",
    appId:"1:568520040394:web:f1d90e467ba1aaca773933",
    measurementId: "G-9PHHQVN26E",

  });
}
import FS from 'rn-fetch-blob';
import {DocumentPicker,DocumentPickerUtil} from "react-native-document-picker";
import {sendNotification,NotifyAlert,GoOnlineStatus} from '../includes/fire';
import Camera from '../includes/camera';
import auth from '@react-native-firebase/auth';
import CameraRoll from '@react-native-community/cameraroll';
import FileViewer from 'react-native-file-viewer';
import Moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import PushNotification from 'react-native-push-notification';
import ChatBoard from '../components/ChartBoad';
class ChatClass extends PureComponent{
  captureCamera(){
    const options = {mirrorImage:true,pauseAfterCapture:false,doNotSave:false,fixOrientation:true, quality:0.5,height:height,width:width,base64:true};
    this.camera.takePictureAsync(options).then((data)=>{
    // const uriParts = String(data.uri).split('.');
    //  const fileType = uriParts[uriParts.length - 1];
    //  const filename = String(new Date().getMilliseconds()).replace(/[.]/g,'')+"."+fileType
    // this.sendMessage(this.props.id_user,{text:this.state.sendchat,image:"data:image/png;base64,"+data.base64})
    this.setState({showCamera:false});
    });
  }
  componentDidMount()
  {
      // alert(JSON.stringify(this.props.updatelist))
      AsyncStorage.getItem("chat").then((d)=>{
        if(d == null)
        {
          AsyncStorage.removeItem("chat");
          this.props.dispatch({type:"update",value:{chatcount:0,notifications:[]}})
          PushNotification.setApplicationIconBadgeNumber(0);
        
        }else{
          var ch = JSON.parse(d).filter((a,i)=>i != 0);
          AsyncStorage.setItem("chat",JSON.stringify(ch));
          this.props.dispatch({type:"update",value:{chatcount:ch.length,notifications:ch}})
          PushNotification.setApplicationIconBadgeNumber(ch.length);
        }

    })
    

      auth().onAuthStateChanged((user) => {
        console.log("user:",user)
        if(!user)
        {
          auth().signInAnonymously();
        }else{
          // this.setState({token:auth().currentUser.getToken()})
        }
      })
      const cha = this.props.chatdata;
      this.dbOnline = firebase.database().ref(`onoff@${cha.recipient_id}`);
      this.dbOnline.on("value",(snapshot)=>{
        if(snapshot.exists())
        {
          var v = snapshot.val();
          this.setState({online:v["status"]})
        }
      })
      this.db_service = firebase.database().ref(`service@${cha.id_store}`);
      this.props.updatelist.map((a,i)=>{
        this.db_service.child(`${a}`).update({read:true});
        return a;
      })
      this.db_token = firebase.database().ref(`fcmToken/${cha.recipient_id}`);
      this.db_token.on("value",(snapshot)=>{
        if(snapshot.exists())
        {
          var v = snapshot.val();
          this.setState({recipient_fcmToken:v["fcmToken"]});
        }
      })

      this.dbPath = String(cha.chatroom).replace(/[#,.$ -]/g,'').trim();
      this.db = firebase.database().ref(this.dbPath);
      this.setState({chatroom:this.dbPath});
      this.db.on("value",(snapshot)=>{
         var v = snapshot.val();
         this.setState({loading:false})
         if(snapshot.exists())
         {
           var keys = Object.keys(v);
           var chatlst = keys.map((a,i)=>{
             var data = v[a];
             data["key"] = a;
             return data;
            });
          var dates = [];
           this.setState({chatslist:chatlst.map((a,i)=>{
             var d = Moment(a.date).format("Do MMMM YYYY")
            if(dates.indexOf(d) == -1)
            {
              a.showDate = true;
              dates.push(d)
            }else{
              a.showDate = false;
            }
            return a;
           })}) 
           
         }else{
          //  alert(JSON.stringify(cha))
          this.sendMessage({text:`Hi ${this.props.firstname}, welcome to ${cha?.business_name} thank you for contacting us! Please how can we help you?`,type:"text",intro:true});
         }
      },(e)=>{ })

  }
  sendAttach(o,text)
  {
      return new Promise((resolve,reject) =>{
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
          readContent:true
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
      this.sendMessage({
        file:res,
        type:o,
        text:this.state.sendchat,
        intro:false});
      })
      }else{
        // this.setState({showCamera:true,switchCamera:d})
        ImagePicker.openCamera({
          width: 120,
          height: 120,
          cropping: false,
          compressImageMaxHeight: 120,
          compressImageMaxWidth:120,
          compressImageQuality:1,
          hideBottomControls:true,
          cropperActiveWidgetColor:"red",
          cropperToolbarWidgetColor:"red",
        }).then(image => {
          console.log(image)
          // alert(JSON.stringify(image));
          // return ;
             this.sendMessage({
              file:{uri:image.path},
              type:"IMAGE",
              text:this.state.sendchat,
              mime:image.mime,
              intro:false
              });
            })
            resolve(true);
      }
      }else{
        alert("Access denied");
      }
    })
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
      var path = fs.dirs.DocumentDir + `/file${d.key}.pdf`;
     var base64 = String(d.file.uri).replace("data:application/pdf;base64,","")
    //  console.log(base64);
    // alert(base64);
      // return ;
      fs.writeFile(path,base64, 'base64').then((res)=>{
        // alert(JSON.stringify(path))
      // if (Platform.OS == "Android") {
      // FileViewer.open(path);
       android.actionViewIntent(path,"application/pdf");
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
  writeImage(d)
     {
     
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          'title': 'App Permission',
         'message': `WeDeyNear app needs access to store file.`
        }).then((granted)=>{
       if(granted === "granted"){ 
      const { config, fs,android,ios } = FS;
      var path = fs.dirs.DocumentDir + `/file${d.key}.png`;
    //  console.log(path);
    //  console.log(d.pdf);
     var base64 = String(d.file.uri).replace("data:image/png;base64,","");
    //  console.log(base64);
      // return ;
      //  alert(base64);
      //  return ;
      this.setState({showProgress:true})
      fs.writeFile(path,base64, 'base64').then(()=>{
       CameraRoll.save(path, 'photo')
       .then((res) => {
        console.log(res)
       //  console.log(res.path())
       FileViewer.open(res);
      this.setState({showProgress:false})
       }).catch(err => {
         Alert.alert(
           'Save remote Image',
           'Failed to save Image: ' + err.message,
           [{text: 'OK', onPress: () => console.log('OK Pressed')}],
           {cancelable: false},
         );
       }).finally(() => this.setState({showLoader: false}));
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
            chatslist:[],
            chatroom:"",
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
            showPicture:false,
            slideIcons:false,
            online:"Offline",
            recipient_fcmToken:"",
            fileUploading:false,
            reply:[],
            currentKey:"",
            selectedKey:[]
    }
    this.sound1 = null;
    this.sendMessage.bind();
  }
 
componentWillUnmount()
{
  if(this.db)
   {
    this.db.off();
   }
   
}
handlerLongClick(d){
  //handler for Long Click
  var n = this.state.selected.filter((a,i)=>parseInt(a.sender_id) != parseInt(this.props.id_user));
  if(n.length == 1)
  {
    return ;
  }
    this.setState({selected:[...this.state.selected,{key:d.path,text:d.text,sender_id:d.sender_id,reply_text:d.reply_text == undefined?[]:d.reply_text}]})
  
};


sendMessage(d){
  AsyncStorage.getItem(
    "userdata"
  ).then((u)=>{
    AsyncStorage.getItem(
      "fcmToken"
    ).then((tkn)=>{
  const {chatroom,recipient_id,business_name,recipient_name,business_avatar,banner,id_store} = Object.assign(JSON.parse(u),this.props.chatdata);
  const {id_user,avatar,placehoder,firstname,lastname} = this.props;
 console.log("username:>",lastname+"|"+firstname);
  var chatObj = {
    id:d.intro?recipient_id:id_user,
    type:["JPEG","JPG","PNG","SVG"].includes(d.type)?"Image":String(d.type).toUpperCase(),
    fileUploading:d.file == null || d.file == undefined?false:true,
    file:d.file == null || d.file == undefined?{uri:""}:d.file,
    mime:d.mime == null || d.mime == undefined?"":d?.mime,
    percentage:0,
    content:d.text,
    chatroom:`${chatroom}`,
    targetId:d.intro?recipient_id:id_user,
    chatInfo: {
      avatar:String(avatar?.uri).replace("/public/avatar.png","") == ""?placehoder:d.intro?{uri:business_avatar}:avatar,
      id:d.intro?recipient_id:id_user,
      nickName:d.intro?business_name:firstname+" "+lastname
    },
    avatar:String(avatar?.uri).replace("/public/avatar.png","") == ""?placehoder:d.intro?{uri:business_avatar}:avatar,
    date:new Date().toISOString(),
    time:Moment().format("hh:mm A"),
    hasWebsite:{
      title:"",
      body:""
    },
   reply:{},
   chatReply:false
  }
  if(this.state.reply.length == 1)
    {
      var replyObj = this.state.reply[0];
      chatObj.reply = replyObj;
      chatObj.chatReply = true;
    }
    const newPostRef = this.db.push(chatObj,(error)=>{
    if(!error && !d.intro)
    {
  this.db_service.push({
    read:false,
    ...chatObj.chatInfo,
    chatroom:chatroom,
    date:new Date().toISOString(),
    time:Moment().format("hh:mm A"),
    content:d.text
  });
  const key = newPostRef.key;
  // alert(this.state.recipient_fcmToken)
  this.setState({sendchat:"",fileUploading:false,currentKey:key,reply:[],selectedKey:[],showReply:false});
  chatObj.chatInfo = JSON.stringify(chatObj.chatInfo);
  chatObj.avatar = JSON.stringify(chatObj.avatar);
  chatObj.file = JSON.stringify(chatObj.file);
  chatObj.hasWebsite = JSON.stringify(chatObj.hasWebsite);
  chatObj.reply = JSON.stringify(chatObj.reply);
  var notify = {
    messageId:moment().format("YYYMMDDhhmmss"),
    title:"You have chat from "+firstname+" "+lastname,
    body:chatObj.content,
    bigText:`This chat is from your service page on WeDeyNear app`,
    ...chatObj,
    type:"chat",
    ...this.props.chatdata
  }
  console.log("notify:",notify);
  console.log("notify:",JSON.stringify(notify));
  // return;
  if(chatObj.id != chatObj.recipient_id)
  {
  sendNotification(this.state.recipient_fcmToken,notify);
  }
      if(chatObj.file.uri !== "")
      {
        // alert(chatObj.file.uri)
        try {
        
      const { config, fs,android } = FS;
      let data = '';
      fs.readStream(
      chatObj.file.uri,
      'base64',
      4095).then((ifstream) => {
        ifstream.open()
        ifstream.onData((chunk) => {
          data += chunk;
        })
        ifstream.onError((err) => {
          this.db.child(`${key}`).update({file:"error"})
        })
        ifstream.onEnd(() => { 
         const path = chatObj.type == "IMAGE"?"data:image/png;base64,"+data:"data:application/pdf;base64,"+data;
      //  alert(JSON.stringify(path));
      //  return ;
        this.db.child(`${key}`).update({file:{uri:path}})
        this.db.child(`${key}`).update({percentage:100})
        })
      })
      }catch(error) {
         this.db.child(`${key}`).update({file:"error"})  
      }
      }
       
      }else{
        // alert(JSON.stringify(error));
      }
    })
        })
      })
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
// this.sendMessage(this.videoFile);
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
  <Image 
  style={{width,height,position:"absolute",top:0,left:0}}
  source={require("../images/chatbck.png")}
  resizeMode="cover"
  />
<View style={{flexDirection:"column",width:width,height:height}}>
<View style={{height:60,width:width,backgroundColor:mystyle.active.color,flexDirection:"row"}}>
         <TouchableOpacity 
         onPress={()=>{
          const Actions = this.props.navigation;
           if(this.state.reply.length != 0)
           {
             this.setState({reply:[],showReply:false,selectedKey:[]})
             return ;
           }
           Actions.goBack();
         }}
         style={{width:40,height:60,justifyContent:"center",alignItems:"center"}} >
           <Icon.MaterialIcons name="keyboard-arrow-left"  size={25} color="white" />
         </TouchableOpacity>
         {this.state.reply.length == 0?<View style={{flex:1,flexDirection:"row"}}>
         <View style={{flex:1,justifyContent:"center",paddingLeft:10,flexDirection:"column"}}>
        <Text ellipsizeMode="tail" numberOfLines={1} style={{fontSize:14,color:"#fff",fontWeight:"bold"}}>{this.props.chatdata.business_name}</Text>
        <Text ellipsizeMode="tail" numberOfLines={1} style={{fontSize:10,color:"#fff"}}>{this.state.online}</Text>
         </View>
         {String(this.props.chatdata.business_telephone).trim() != ""?<TouchableOpacity 
         onPress={()=>{
          Alert.alert("Alert",`Calling ${this.props.chatdata.reply?this.props.chatdata.recipient_name:this.props.chatdata.business_name} will attract charges and this will be done using your mobile operator, \ndo you want to continue?`,
          [
          {text: 'No',onPress:() => {
          //  Actions.drawerClose();
          }, style: 'cancel'},
          {text: 'Yes', onPress: () => {
           Linking.openURL("tel:"+this.props.chatdata.business_telephone);
          }, style: 'cancel'}
          ],
          {cancelable:false})
         }}
         style={{width:35,height:60,justifyContent:"center",alignItems:"center"}} >
           <Icon.FontAwesome name="phone"  size={25} color="white" />
         </TouchableOpacity>:null}
         {!this.props.chatdata.reply?<TouchableOpacity 
         onPress={()=>{
          Linking.openURL("mailto:"+this.props.chatdata.business_email)
         }}
         style={{marginHorizontal:10,width:35,height:60,justifyContent:"center",alignItems:"center"}} >
         <Icon.SimpleLineIcons name="envelope"  size={25} color="white" />
         </TouchableOpacity>:null}
         <TouchableOpacity 
         onPress={()=>{
          const Actions = this.props.navigation;
          Actions.navigate("settings",{chat:true});
         }}
         style={{marginHorizontal:10,width:30,height:60,justifyContent:"center",alignItems:"center"}} >
        <Icon.Feather name="sliders"  size={25} color="white" />
         </TouchableOpacity>
         </View>:<View style={{flex:1,flexDirection:"row",alignItems:"center",paddingLeft:10}}>
         <View style={{flex:1,justifyContent:"center",paddingLeft:10}}>
        {/* <Text style={{fontSize:16,color:"#fff"}} >{this.state.reply.length}</Text> */}
        </View>
        {this.state.reply.filter((a,i)=>i == 0).map((a,i)=>{
        return <View style={{flex:1,flexDirection:"row",justifyContent:"flex-end",alignItems:"center"}}>
        <TouchableOpacity
        onPress={() => {
          this.setState({showReply:true})
        }}
        style={{justifyContent:"center",paddingHorizontal:10,flexDirection:"row"}}>
        <Icon.Entypo name="reply"  size={20} color="white" />
        <Text style={{fontSize:12,color:"white",marginLeft:5}}>Reply</Text>
        </TouchableOpacity>
        {a.id == this.props.id_user?<TouchableOpacity 
         onPress={()=>{
          Alert.alert("Confirm",`Are you sure you want to delete this message?`,
          [
          {text: 'No',onPress:() => {
          //  Actions.drawerClose();
          }, style: 'cancel'},
          {text: 'Yes', onPress: () => {
            if(parseInt(a.id) == parseInt(this.props.id_user))
            {
              this.db.child(a.key).update({deleted:true}); 
            }
           this.setState({reply:[],showReply:false,selectedKey:[]})
          }, style: 'cancel'}
          ],
          {cancelable:false})
         }}
         style={{marginHorizontal:10,height:60,justifyContent:"center",alignItems:"center",flexDirection:"row"}} >
           <Icon.Evilicons name="trash"  size={25} color="white" />
        <Text style={{fontSize:12,color:"white",marginLeft:2}}>Delete</Text>
         </TouchableOpacity>:null}
        </View>})}
        </View>}
         </View>
<KeyboardAvoidingView
behavior="padding"
keyboardVerticalOffset={50}
style={{width:width,height:height-70}}
>
<View style={{flex:1}}>
<ScrollView 
keyboardShouldPersistTaps="always"
 ref={e=>this.scrollView = e }
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
 style={{flex:1}}
 >
<View style={{flexDirection:"column",marginBottom:50}}>
<View style={{width:"100%",height:100,backgroundColor:"#444"}}>
<Image 
source={{uri:this.props.chatdata.banner}} style={{width:"100%",height:100}} resizeMode="cover" />
</View>
{this.state.loading?<View style={{flexDirection:"row",padding:10,width:"100%",justifyContent:"flex-start",alignItems:"flex-start"}}>
<ActivityIndicator size="small" color={mystyle.active.color} />
<Text style={{marginLeft:5,fontSize:12}}>Loading...</Text>
</View>:null}
<ChatBoard 
 list={this.state.chatslist}
 db={this.db}
selectedKey={this.state.selectedKey}
selectedList={(k)=>{
var rply  = this.state.chatslist.filter((a,i)=>a?.key == k);
this.setState({selectedKey:k,reply:rply,showReply:false}); 
// alert(JSON.stringify(rply))
}}
downloads={(d)=>{
  if(d.type == "IMAGE")
  {
    this.writeImage(d);
  }else if(d.type == "PDF")
  {
    this.writePDF(d);
  }
}}
deselectList={(k)=>{
  //  this.setState({selectedKey:this.state.selectedKey.filter((a,i)=>a != k)})
}}
selectedReply={(d)=>{
  // d?this.initReply():this.initDelete();
}}
room={this.state.chatroom}
updateItem={(k,url)=>{
  url = String(url).toLowerCase();
//   fetch(`${url}`).then((res)=>res.text()).then((res)=>{
//   postDATA("decodeWebSite",{website:`${url}`,siteData:res}).then((res)=>{
//     // alert(JSON.stringify(res))
//     if(res.status)
//     {
//     this.db.child(k).child("hasWebsite").update(res.result);
//     }
//   })
// }).catch((e)=>{
//   // alert(JSON.stringify(e))
// })
}}
showPreviewAvatar={(a)=>{
//  alert(JSON.stringify(a));
 this.setState({...a,showPicture:true});
}}
 />
</View>
 </ScrollView>
<View style={{position:"absolute",overflow:"hidden",bottom:0,width:width,flexDirection:"column"}}>
  {this.state.showReply && this.state.reply.length != 0?<Animatable.View 
  animation="slideInDown"
  duration={200}
  easing="ease-in-out-back"
  style={{width:width,minHeight:40,backgroundColor:"#f5fffb",flexDirection:"row"}}>
<TouchableOpacity
onPress={()=>{
  this.setState({showReply:false,reply:[],selectedKey:[],sendchat:""})
}}
style={{position:"absolute",top:10,right:10}}
>
<Icon.AntDesign name="closecircleo" size={20} />
</TouchableOpacity>
{this.state.reply[0].content == ""?<View style={{height:50,width:"90%"}}>
{this.state.reply[0].type == "IMAGE"?<Image source={this.state.reply[0].file} 
style={{width:"100%",height:"100%",opacity:0.7}}
resizeMode="cover"
/>:<View style={{flexDirection:"row",alignItems:"center",padding:10}}>
<Icon.FontAwesome name={`file-o`} size={30} color="rgba(0,0,0,0.2)"/>
<Text style={{color:"#999",fontWeight:"bold",fontSize:15,marginLeft:10}}>{this.state.reply[0].type} File</Text>
</View>}
</View>:<Text style={{padding:15,paddingRight:30}}>{this.state.reply[0].content}</Text>}
  </Animatable.View>:
!showAttachment?<View style={{paddingHorizontal:10,width:width}}>
    <ScrollView 
keyboardShouldPersistTaps="always"
    horizontal
    showsHorizontalScrollIndicator={false}
    style={{}}
    >
  {["Track Order","Cancel my order","Return my order","Payment issues","Account issues"].map((a,i)=><TouchableOpacity key={i}
  onPress={()=>{
    if(this.state.loading)
    {
      ToastAndroid.show("Please wait...",ToastAndroid.SHORT);
      return ;
    }
    this.sendMessage({text:a,type:"text",intro:false});
  }}
  style={{borderWidth:0.2,borderColor:"#ccc",padding:5,paddingHorizontal:10,margin:5,backgroundColor:"#e6fff2",borderRadius:30,elevation:3}}
  >
   <Text>{a}</Text>
  </TouchableOpacity>)}  
</ScrollView>
</View>:<Animatable.View

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
 this.sendAttach(a,this.state.sendchat)
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
</Animatable.View>}
</View>
</View>
<View style={{width:"100%",backgroundColor:"#f0f0f0",borderTopColor:"#ccc",borderTopWidth:0.4,flexDirection:"column",marginBottom:-10}}>
<View style={{flexDirection:"row",maxHeight:280,alignItems:"flex-start"}}>
<TouchableOpacity 
onPress={()=>{
  this.setState({showAttachment:true,slideIcons:!this.state.slideIcons})
 }}
style={{height:80,justifyContent:"center",alignItems:"center"}}>
 {!this.state.slideIcons?<Icon.Evilicons name="paperclip" size={35} />:<Icon.Evilicons name="chevron-down" size={35} />}
</TouchableOpacity>
<View style={{flex:1,flexDirection:"row",paddingLeft:10,paddingBottom:5,alignItems:"flex-start",justifyContent:"center"}}>
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
  this.sendMessage({text:this.state.sendchat,type:"text",intro:false});

}
}}
style={{height:70,justifyContent:"center",alignItems:"center"}}>
 <Icon.MaterialIcons name="send" size={30} />
</TouchableOpacity>
</Animatable.View>
</View>
</View>
</KeyboardAvoidingView>
</View>
<Modal
      animationType="fade"
      transparent={true}
      visible={this.state.showPicture}
      onRequestClose={() => {
       this.setState({showPicture:false});
      }}
   style={{flex:1}}>
   <View  style={{flex:1,justifyContent:"center",alignItems:"center"}}>
     <TouchableOpacity 
     onPress={()=>{
      this.setState({showPicture:false})
    }}
    style={{justifyContent:"center",alignItems:"center",width,height,position:"absolute",backgroundColor:"rgba(0,0,0,0.5)",flexDirection:"column"}}>
    </TouchableOpacity>
    <Animatable.View 
     pointerEvents={'none'}
    animation={{
      from:{
        transform:[
          {translateY:70}
        ],
        height:50,
        width:50
      },
      to:{
        transform:[
          {translateY:0}
        ],
        height:width-60,
        width:width-60
      }
    }}
    duration={500}
    style={{zIndex:999}}
    >
    <View
     pointerEvents={'none'}
    style={{width:"100%",height:"100%",overflow:"hidden",backgroundColor:"#ccc",borderRadius:10,borderWidth:2,borderColor:"white"}}>

  
      <Image source={this.state.showPreviewAvatar} style={{width:"100%",height:"100%"}} resizeMode="cover" />
      </View>
      <TouchableOpacity
      onPress={()=>{
        this.setState({showPicture:false})
      }}
      style={{position:"absolute",right:-10,top:-10,zIndex:99}}>
        <Icon.AntDesign name="closecircle" color="red" size={20} />
      </TouchableOpacity>
      </Animatable.View>
    </View>
    </Modal>
</View>)
    }
}
ChatClass.defaultProps = {
  chatdata:{
  banner:"", // store details
  id_store:0,
  product_name:"",
  business_name:"",
  recipient_id:"",
  product_name:"",
  category_name:"",
  store_fcmToken:"",
  fcmToken:"",// senders details
  offer:false
},
  updatelist:[]
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(ChatClass);


