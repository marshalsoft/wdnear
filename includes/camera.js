import React, {PureComponent} from 'react';
import {Platform,
     StyleSheet,
     Image, 
     Text, 
     View,
     TouchableOpacity,
    TextInput,
    Scrollview,
    Animated, 
    Easing,
    ToastAndroid,
    Dimensions,
    AsyncStorage,
    Modal } from 'react-native';
import { RNCamera, FaceDetector } from 'react-native-camera';
import {connect} from 'react-redux';
import Icon from '../includes/icons';
import mystyle from '../includes/mystyle';
import Loader from '../components/loader';
import {postDATA,getDATA} from '../includes/func';
// import { uploadFiles, DocumentDirectoryPath } from "react-native-fs";
import Upload from 'react-native-background-upload';

const {width,height} = Dimensions.get("window");
class CameraClass extends PureComponent{
constructor(props)
{
super(props);
this.state = {
  cameraSnaped:false,
  setFlash:false,
  faceDetect:false,
  showLoader:false,
  isProcessing:true,
  errorInfo:"",
  success:false,
  image:{uri:null}
}
this.captureCamera.bind();
  }
captureCamera() {
    const options = {mirrorImage:true,pauseAfterCapture:false,doNotSave:false,fixOrientation:true, quality:0.5,height:height,width:width};
    this.camera.takePictureAsync(options).then((data)=>{
    const uriParts = String(data.uri).split('.');
    const fileType = uriParts[uriParts.length - 1];
    const filename = String(new Date().getMilliseconds()).replace(/[.]/g,'')+"."+fileType
    // console.log(data)
    this.setState({image:{uri:data.uri,name:filename,type:"image/"+fileType},cameraSnaped:true});
    });
}
uploadImage(data,url){
AsyncStorage.getItem("token").then((res)=>{
const options = {
  url:`https://wedeynear.com/api/${url}`,
  path:String(data.uri).replace("file://","content://").replace("///","//"),
  method: 'POST',
  parameters:data.parameters,
  field:"image",
  type: 'multipart',
  maxRetries: 2, // set retry count (Android only). Default 2
  headers: {
    'Accept':'*/*',
    'User-Agent':'android', 
   'Api-key-android':'6f7c2e24e0452391e61b00c4e1815ea0',
   'Authorization':`${res}`
  },
  // Below are options only supported on Android
  notification: {
    enabled: true
  },
  useUtf8Charset: true
}
console.log(options);
Upload.startUpload(options).then((uploadId) => {
  console.log('Upload started')
  Upload.addListener('progress', uploadId, (data) => {
    console.log(`Progress: ${data.progress}%`)
  })
  Upload.addListener('error', uploadId, (data) => {
    console.log(`Error: ${data.error}%`)
    this.setState({isProcessing:false,showLoader:true,success:true,errorInfo:data.error})
  })
  Upload.addListener('cancelled', uploadId, (data) => {
    console.log(`Cancelled!`,data)
    this.setState({isProcessing:false,showLoader:true,success:true,errorInfo:JSON.stringify(data)})
  })
  Upload.addListener('completed', uploadId, (data) => {
    // data includes responseCode: number and responseBody: Object
    console.log('Completed!',data)
    this.setState({isProcessing:false,showLoader:true,success:true,errorInfo:"Image uploaded successfully"})
  })
}).catch((err) => {
  console.log('Upload error!', err)
})
})

// var files = [
//   {
//     name: "file",
//     filename: "file.jpg",
//     filepath: DocumentDirectoryPath + "/file.jpg",
//     filetype: "image/jpeg",
//   },
// ];

// uploadFiles({
//   toUrl: "https://upload-service-url",
//   files: files,
//   method: "POST",
//   headers: {
//     Accept: "application/json",
//   },
//   //invoked when the uploading starts.
//   begin: () => {},
//   // You can use this callback to show a progress indicator.
//   progress: ({ totalBytesSent, totalBytesExpectedToSend }) => {},
// });
}
  render()
  {
    return(
      <Modal
      animationType="slide"
      transparent={false}
      visible={this.props.showCamera}
      onRequestClose={() => {
       this.props.dispatch({type:"update",value:{showCamera:false}});
      }}
   style={{flex:1}}>
     <View style={{justifyContent:"center",alignItems:"center",flex:1}}>
     <TouchableOpacity onPress={()=>{
    this.props.dispatch({type:"update",value:{showCamera:false}});
  }} style={{position:'absolute',right:20,top:20,width:40,backgroundColor:"white",borderRadius:40,width:40,height:40,justifyContent:"center",alignItems:"center",elevation:4}}>
<Icon.AntDesign name="close" size={26} color="black" />
</TouchableOpacity>
     <View style={{justifyContent:"center",alignItems:"center",width:200,minHeight:280}}>
     <View style={{justifyContent:"center",alignItems:"center",width:200,height:200,borderRadius:120,overflow:"hidden",borderWidth:5,borderColor:"red"}}>
  {!this.state.cameraSnaped?<RNCamera
  onMountError={()=>{

  }}
        ref={ref =>this.camera = ref}
        style = {{width:200,height:200}}
        captureAudio={false}
        playSoundOnCapture={true}
        type={RNCamera.Constants.Type.front}
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
        flashMode={this.state.setFlash?RNCamera.Constants.FlashMode.on:RNCamera.Constants.FlashMode.off}
        onFaceDetectionError={()=>{
         ToastAndroid.show("Face not detected.",ToastAndroid.SHORT)
         this.setState({faceDetect:false});
        }}
    />:<Image 
    source={this.state.image}
    style={{width:200,height:200}}
    />}
    </View>
    <TouchableOpacity onPress={()=>{
    if(this.state.cameraSnaped)
    {
      this.setState({cameraSnaped:false,image:{uri:null}});
      return ;
    }
  this.captureCamera();
  }} style={{position:"absolute",bottom:20,backgroundColor:"white",borderRadius:50,width:50,height:50,justifyContent:"center",alignItems:"center",elevation:4}}>
{!this.state.cameraSnaped?<Icon.FontAwesome name="camera" color="red" size={20} />:
<View >
  <Icon.FontAwesome name="image" color="red" size={20} />
  <Icon.Feather name="slash" color="red" size={40} style={{position:"absolute",left:-10,top:-10}} />
</View>}
  </TouchableOpacity>
  <TouchableOpacity onPress={()=>{
  this.setState({setFlash:!this.state.setFlash});
  }} style={{position:'absolute',right:20,bottom:40,width:40,backgroundColor:"white",borderRadius:40,width:40,height:40,justifyContent:"center",alignItems:"center",elevation:4}}>
<Icon.Entypo name={"flashlight"} size={20} color="black" />
{this.state.setFlash?<Icon.Feather name="slash" color="black" size={20} style={{position:"absolute",left:10,top:10}} />:null}
</TouchableOpacity>
    </View>
  <Text>{this.state.faceDetect?"Face detected":"face not detected"}</Text>
  <TouchableOpacity 
     onPress={()=>{
       var d = {showCamera:false,avatar:this.state.image};
        if(!this.state.cameraSnaped)
        {
          delete d.avatar;
          this.props.dispatch({type:"update",value:{showCamera:false}});
        }else{
        this.setState({isProcessing:true,showLoader:true,success:false,errorTxt:"Please wait..."},()=>{
        // this.uploadImage({
        //   ...this.state.image,
        //   parameters:{
        //   user_id:String(this.props.id_user),
        //   type:"user"
        //   }
        // },"user/api_uploadUserPhoto");

        // return;
        var img = this.state.image;
        // img.uri = String(img.uri).replace("file://","content://");
          postDATA("user/api_uploadUserPhoto",{
            user_id:String(this.props.id_user),
            type:"user",
            image:img}).then((res)=>{
           console.log(res);
           if(String(res.success).includes("1"))
           {
           this.setState({isProcessing:false,showLoader:true,success:true,errorInfo:"Image uploaded successfully"})
           try {
           res.result = res.result[0];
           var avatar = res.result.images[0]["200_200"].url;
           this.props.dispatch({type:"update",value:{avatar:{uri:avatar}}});
           AsyncStorage.getItem("userdata").then((res)=>{
             if(res != null)
             {
               var u = JSON.parse(res);
               u.avatar = {uri:avatar};
               AsyncStorage.setItem("userdata",JSON.stringify(u));
             }
           })
           } catch (error) {
           }
           }else{
           this.setState({isProcessing:false,showLoader:true,success:false,errorInfo:"Oops! something went wrong, try again later."})
           }
  })
})
        }
    }} style={[{marginTop:40,width:150,height:40,backgroundColor:mystyle.active.color,justifyContent:"center",alignItems:"center",borderRadius:5,elevation:5,flexDirection:"row"}]}>
    <Text style={{color:"white",fontSize:16}}>{!this.state.cameraSnaped?"Cancel":"Save Image"}</Text>
    </TouchableOpacity>
    </View>
<Loader 
{...this.state}
returnData={(d)=>{
this.setState(d);
}} />
    </Modal>)
          }
        }
    CameraClass.defaultProps = {
      returnData:()=>{},
      showCamera:false
    }
    const mapStateToProps = (state) => {
      return state;
    };
    export default connect(mapStateToProps)(CameraClass);
    
    
     