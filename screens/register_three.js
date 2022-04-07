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
    CameraRoll,
    KeyboardAvoidingView,
    Modal, 
    DeviceEventEmitter,
    Slider} from 'react-native';
    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';
 
const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import Loader from '../components/loader';
import Country from '../includes/countries';
import {returnAllNumbers,postDATA} from '../includes/func';
import ViewShot from "react-native-view-shot";
// import MultiShare from 'react-native-multi-share';
import ImagePicker from 'react-native-image-crop-picker';
import FS from 'rn-fetch-blob';
const {fs} = FS;
import VerifyBusinessView from '../components/business_verification';

class RegisterThreeCLass extends PureComponent{
    componentDidMount()
    {
   
     }
     
    constructor(props)
    {
        super(props);
        this.state = {
            mobile:"",
            showLoader:false,
            isProcessing:true,
            errorInfo:"Please wait...",
            success:false,
            kyUp:false,
            firstname:"",
            lastname:"",
            email:"",
            bussines_name:"",
            bussines_address:"",
            bussines_email:"",
            bussines_website:"",
            country:"",
            province:"",
            card_type:"",
            account_name:"",
            account_no:"",
            showCountryList:false,
            showCropper:false,
            uncropperImage:{uri:null},
            business_logo:{uri:null,fileName:"image source..."},
            business_description:"",
            business_verify_date:null,
            business_verify_options:"",
            business_verify:false,
            sixer:new Animated.Value(100),
            cardlist:[]
        }
        this.setLogo.bind();
    }
    async getDocumentDirAsync() {
        const dir = `${fs.dirs.DocumentDir}/images`;
        if (!(await fs.isDir(dir))) {
          await fs.mkdir(dir);
        }
        return dir;
      }
      
      async copyToDocumentDirAsync(from) {
        const dir = await this.getDocumentDirAsync();
        const filename = from.replace(/^.*[\\/]/, '');
        const to = `${dir}/${filename}`;
        await fs.cp(from, to);
        return to;
      }
     
    //   async onShare(d) {
    //     const uri = await this.copyToDocumentDirAsync(d);
    //     // MultiShare.share({ message:"", images: [uri] });
    //   }
      getImage(uri) {
      return new Promise((resolve,reject)=>{
        CameraRoll.saveToCameraRoll(uri).then((path)=>{
      //  alert(JSON.stringify(path));
    var spl = String(path).split("/");
    resolve({uri:path,
          path:path,
          name:spl[spl.length-1],
          fileName:spl[spl.length-1],
          filename:spl[spl.length-1],
          type:"image/png"
        })
      })
    });
      } 
componentWillUnmount()
{

}
setLogo()
{
  ImagePicker.openPicker({
    width: 120,
    height: 120,
    cropping: true,
    compressImageMaxHeight: 120,
    compressImageMaxWidth:120,
    compressImageQuality:1,
    hideBottomControls:true,
    cropperActiveWidgetColor:"red",
    cropperToolbarWidgetColor:"red"
  }).then(image => {
    console.log(image)
    var spl = String(image.path).split("/");
    this.setState({business_logo:{uri:image.path,
      path:image.path,
      name:spl[spl.length-1],
      fileName:spl[spl.length-1],
      filename:spl[spl.length-1],
      type:image.mime,
      mime:image.mime
    }});
  });
}
render() 
{
const {bussines_category,
    bussines_address,
    bussines_email,
    bussines_name,
    bussines_website,
    business_logo,
    card_type,
    account_name,
    account_no,
    business_verify_date,
    business_verify_options,
    business_verify,
    cardlist,
    business_description} = this.state;
    const Actions = this.props.navigation;
return(<KeyboardAvoidingView 
  behavior="padding"
  keyboardVerticalOffset={40}  style={[mystyle.window,{backgroundColor:"white"}]} >
<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
<TouchableOpacity onPress={()=>{
Actions.goBack();
}} style={[{width:60,height:60,justifyContent:"center",alignItems:"center",position:"absolute",top:0,left:0,zIndex:99}]}>
<Icon.MaterialIcons color={mystyle.active.color} name="keyboard-arrow-left" size={30} />
</TouchableOpacity>
<ScrollView
ref={e=>this.sceRR=e}
onContentSizeChange={()=>{
    this.sceRR.scrollToEnd({animated:true});
}}
keyboardShouldPersistTaps={true}
style={{flex:1,paddingTop:30}} >
<View style={{width:width,minHeight:height,justifyContent:"center",alignItems:"center",flexDirection:"column"}} >
<View style={{width:width-100,marginBottom:10,flexDirection:"row"}} >
<TouchableOpacity
onPress={()=>{
    this.setLogo();
}} style={{overflow:"hidden",borderRadius:5,borderWidth:3,borderColor:mystyle.active.color,width:100,height:100,backgroundColor:"#444",justifyContent:"center",alignItems:"center"}} >
<Text style={[mystyle.active,{fontSize:10,position:"absolute",paddingHorizontal:15}]}>tap here to select image...</Text>
<Image style={{width:100,height:100}} source={business_logo} resizeMode="cover" />
{this.state.business_logo.uri != null?<Icon.AntDesign name="checkcircleo" size={20} style={{position:"absolute",top:2,right:2}} color={"limegreen"} />:null}
</TouchableOpacity>
<View style={{flex:1,justifyContent:"center",padding:10}}>
<Text style={mystyle.active}>Request for a logo</Text>
<Text style={{width:"75%"}}>Brand/Business logo</Text>
<Text style={{fontSize:10,color:"#999"}}>{business_logo.fileName}</Text>
</View>
</View>

<Text style={{width:"75%"}}>Brief Description of Brand/Business </Text>
<View style={[mystyle.regInput,{width:width-90,minHeight:70,borderRadius:5}]}>
<TextInput 
    keyboardType="default"
    placeholder="Business description"
    multiline
    maxLength={150}
    onChangeText={(d)=>this.setState({business_description:d})}
    value={this.state.business_description}
    onFocus={()=>this.setState({kyUp:true})}
    onBlur={()=>this.setState({kyUp:false})}
    style={{fontSize:16,flex:1,textAlignVertical:"top",textAlign:"left",paddingHorizontal:10}}
    />
</View>

<View style={{height:150,width:width-50,alignItems:"center",marginTop:50}}>
    <TouchableOpacity onPress={()=>{
      if(business_logo.uri == null)
      {
      this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please select business logo, thanks."})
      }else if(business_description == "")
      {
      this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter business description, thanks."})
      }else{
        //   alert(JSON.stringify(this.props))
       var data = {
        user_id:parseInt(this.props.id_user),
        business_name:this.props.reg_name,
        business_description:this.state.business_description,
        business_website:this.props.reg_website,
        business_email:this.props.reg_email,
        business_category:parseInt(this.props.category),
        lat:this.props.latitude,
        lng:this.props.longitude,
        image:this.state.business_logo
      }
      //  console.log(data);
      // alert(JSON.stringify(data))
      // return ;
       this.setState({showLoader:true,isProcessing:true,success:false,errorInfo:"Please wait..."})
       postDATA("user/upgradeUser",data).then((res)=>{
        //  alert(JSON.stringify(res))
       if(res.status)
       {
        AsyncStorage.getItem("userdata").then((u)=>{
          if(u !== null)
          {
          var uD = {...JSON.parse(u),typeAuth:"vendor"};
          AsyncStorage.setItem("userdata",JSON.stringify(uD))
          this.props.dispatch({type:"update",value:uD});
          DeviceEventEmitter.emit("showVerifyBusiness",{});
          }
        })
      res.message = "Your account upgrade was successful, you will need to verify your business next."
      }
      this.setState({showLoader:true,isProcessing:false,success:res.status,errorInfo:res.message})
      })
      }
    }} style={[{width:width-60,height:50,marginTop:10,backgroundColor:mystyle.active.color,justifyContent:"center",alignItems:"center",borderRadius:60,elevation:5}]}>
    <Text style={{color:"white",fontWeight:"bold",fontSize:18}}>Upgrade Account</Text>
    </TouchableOpacity>
</View>
{this.state.kyUp?<View style={{height:100,width:width-50}}></View>:null}
</View>
</ScrollView>
</View>
<Modal 
visible={this.state.showCropper}
style={{width:width,height:height}}
onRequestClose={()=>{
    this.setState({showCropper:false})
}}
>
<View style={{width:width,height:height,justifyContent:"center",alignItems:"center",backgroundColor:"black"}}>
<ViewShot 
ref="viewShot"
options={{ format: "png", quality: 0.9 }} style={{width:120,height:120,justifyContent:"center",alignItems:"center",position:"absolute"}}>
<Animated.Image 
source={this.state.uncropperImage}
style={{width:this.state.sixer,height:this.state.sixer}} />
</ViewShot>
<View style={{width:120,height:120,justifyContent:"center",alignItems:"center",position:"absolute",borderWidth:2,borderColor:'white',elevation:4}}>
</View>
<View style={{backgroundColor:"rgba(0,0,0,0.4)",padding:10,position:"absolute",bottom:120,width:"100%",flexDirection:"column"}}>
<Text style={{color:"white",fontSize:10,marginBottom:10}}>Slide to crop the image</Text>
<Slider 
maximumValue={width}
minimumValue={120}
step={1}
onValueChange={(d)=>{
    this.state.sixer.setValue(d);
}}
style={{width:"100%"}}
/>
</View>
<TouchableOpacity
              onPress={()=>{
                this.refs.viewShot.capture().then(uri => {
                 this.getImage(uri).then((obj)=>{
                 console.log(obj);
                 this.setState({business_logo:obj,showCropper:false});
                  })
                });
              }}
              style={[mystyle.btn,{width:150,position:"absolute",bottom:50}]} >
           <Text style={{color:"white"}}>Save Image</Text> 
 </TouchableOpacity>
</View>
</Modal>
<VerifyBusinessView />
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
}else{
  Actions.goBack();
}
this.setState(d);
}} />
</KeyboardAvoidingView>)
    }
}
RegisterThreeCLass.defaultProps = {
    category:"",
    reg_name:"",
    reg_address:"",
    reg_email:"",
    reg_website:"",
    business_lat:"",
    business_lng:""
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(RegisterThreeCLass);

