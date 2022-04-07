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
    DeviceEventEmitter,
    Image,
    Slider,
    PermissionsAndroid,
    Alert,
    Modal } from 'react-native';
    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';
    import ViewShot from "react-native-view-shot";
const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import Loader from '../components/loader';
import * as Animatable from 'react-native-animatable';
import {returnAllNumbers,postDATA,sendEmail,postTEST,returnComma} from '../includes/func';
import {DocumentPicker,DocumentPickerUtil} from "react-native-document-picker";
import Video from 'react-native-video';
import RNFetchBlob from "rn-fetch-blob";
import Moment from 'moment';
import FileViewer from 'react-native-file-viewer';
import CameraRoll from '@react-native-community/cameraroll';

class ReceiptClass extends PureComponent{
    componentDidMount()
    {
        this.refs.viewShot.capture().then(uri => {
            console.log("do something with ", uri);
            this.setState({imgUrl:uri});
          });
     this.setState({vat:this.props.vat_fee != null?parseFloat(this.props.vat_fee):0});
     }
  
    constructor(props)
    {
        super(props);
        this.state = {
            showLoader:false,
            isProcessing:true,
            errorInfo:"Please wait...",
            success:false,
            imgUrl:"",
            vat:0
        }
    }
 
componentWillUnmount()
{

}
writeFile()
{
const { config, fs,android,ios } = RNFetchBlob;
var data = '';
var path = fs.dirs.DocumentDir + `/payment_receipt${this.props.card_reference}.png`;
console.log(path);
fs.exists(path).then((exist) => {
    if(exist)
    {
      FileViewer.open(path);
    }else{
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
{
    'title': 'App Permission',
    'message': `WeDeyNear app needs access to store file.`
}).then((granted)=>{
  if(granted === "granted"){ 
this.setState({showLoader:true,isProcessing:true});
fs.readStream(
    this.state.imgUrl,
     'base64',
      4095).then((ifstream) => {
    ifstream.open()
    ifstream.onData((chunk) => {
      data += chunk
    })
    ifstream.onError((err) => {
    this.setState({showLoader:false,isProcessing:false})
    })
ifstream.onEnd(() => {
fs.writeFile(path,data, 'base64').then((res)=>{
    console.log("image_data:",res);
    CameraRoll.save(path, 'photo')
  .then((res) => {
  console.log(res)
  //  console.log(res.path())
  FileViewer.open(res);
this.setState({showLoader:false,isProcessing:false})
  }).catch(err => {
    Alert.alert(
      'Save remote Image',
      'Failed to save Image: ' + err.message,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  }).finally(() => this.setState({showLoader: false,isProcessing:false}));
}).catch(error => {
this.setState({showLoader: false,isProcessing:false});
Alert.alert(
  'Save remote Image',
  'Failed to save Image: ' + error.message,
  [{text: 'OK', onPress: () => console.log('OK Pressed')}],
  {cancelable: false}
);
});
    })
    })
  // android.actionViewIntent(res.path(),'image/png');
}else{
alert("Access denied");
}
})
    }
  })
}
render() 
{
  const Actions = this.props.navigation;
const {description,amount,totalAmount,card_type,date,last_4,card_reference,account_name} = this.props;
return(<View style={[mystyle.window,{backgroundColor:"white"}]} >
<View style={{width:width,height:70,justifyContent:"center",alignItems:"center",backgroundColor:mystyle.active.color}}>
<TouchableOpacity onPress={()=>{
Actions.goBack();
}} style={[{width:40,height:70,justifyContent:"center",alignItems:"center",position:"absolute",top:0,left:0,zIndex:99}]}>
<Icon.MaterialIcons color={"white"} name="keyboard-arrow-left" size={30} />
</TouchableOpacity>
<View >
<Text style={{color:"white",fontSize:18}}>Payment receipt</Text>
</View>
</View>
<ScrollView 
keyboardShouldPersistTaps="always"
ref={e=>this.ScrolV=e}
onContentSizeChange={()=>{
if(this.state.kyUp)
{
    this.ScrolV.scrollToEnd({animated:true}) 
}
}}
style={{width:width,height:height}} >
<View style={{padding:20,width:width,alignItems:"center",justifyContent:"center"}}>
<ViewShot 
ref="viewShot" options={{ format: "jpg", quality: 0.9 }}
style={[{width:width-50,marginHorizontal:5,height:670,alignItems:"center",padding:20,flexDirection:"column",backgroundColor:"white",padding:10}]} >
<Image style={{position:"absolute",top:0,left:0,width:width-50,height:690}} source={require('../images/receipt.png')} resizeMode="cover" />  
<Text style={{fontSize:18,fontWeight:"bold"}}>WeDeyNear</Text>
<Text style={{fontSize:12,fontWeight:"bold"}}>www.wedeynear.com</Text>
<Text style={{textAlign:"center",color:"#444",fontSize:12}}>{this.props.support_email == ""?"admin@wedeynear.com":this.props.support_email}, {this.props.support_phone}</Text>
<View style={{alignItems:'center',paddingVertical:10,marginTop:0}}>
    <Text style={{textAlign:"center",color:"#999",fontStyle:"italic"}}>This is auto generated payment receipt from wedeynear.</Text>
</View>

<View style={{alignItems:'center',paddingVertical:10,marginTop:0}}>
    <Text style={{textAlign:"center",color:"#444"}}>* * * * * * * * * * * * * * * * * * * * * * * * * * * * *</Text>
    <Text style={{textAlign:"center",color:"#444",fontWeight:"bold",fontSize:18}}>PAYMENT RECEIPT</Text>
    <Text style={{textAlign:"center",color:"#444"}}>* * * * * * * * * * * * * * * * * * * * * * * * * * * * *</Text>
</View>
<View style={{alignItems:'flex-start',marginTop:0,flexDirection:"column",width:"100%"}}>
    <Text style={{textAlign:"left",color:"#444",fontWeight:"bold"}}>Ref. No.</Text>
    <Text style={{textAlign:"left",color:"#444"}}>{card_reference}</Text>
</View>
<View style={{alignItems:'center',marginTop:20,flexDirection:"row"}}>
<View style={{flex:1,flexDirection:"column"}}>
    <Text style={{textAlign:"left",color:"#444",fontWeight:"bold"}}>Description</Text>
    <Text style={{textAlign:"left",color:"#444"}}>{description}</Text>
</View>
<View style={{flex:1,flexDirection:"column"}}>
  <Text style={{textAlign:"left",color:"#444",fontWeight:"bold"}}>VAT. {this.state.vat}%</Text>
</View>
</View>
<View style={{alignItems:'flex-start',marginTop:20,flexDirection:"row"}}>
<View style={{flex:1,flexDirection:"column"}}>
  <Text style={{textAlign:"left",color:"#444",fontWeight:"bold"}}>Payment Method</Text>
  <Text style={{textAlign:"left",color:"#444"}}>{String(card_type).toUpperCase()}</Text>
</View>
  <View style={{flex:1,flexDirection:"column"}}>
    <Text style={{textAlign:"left",color:"#444",fontWeight:"bold"}}>Date</Text>
    <Text style={{textAlign:"left",color:"#444"}}>{(date)}</Text>
</View>
</View>
<View style={{alignItems:'flex-start',marginTop:20,flexDirection:"column",width:"100%"}}>
<View style={{flexDirection:"column"}}>
    <Text style={{textAlign:"left",color:"#444",fontWeight:"bold"}}>Card No.</Text>
    <Text style={{textAlign:"left",color:"#444"}}>XXXX-XXXX-XXXX-{last_4}</Text>
</View>
<View style={{flexDirection:"column",marginTop:20}}>
    <Text style={{textAlign:"left",color:"#444",fontWeight:"bold"}}>Amount</Text>
    <Text style={{textAlign:"left",color:"#444"}}>NGN{returnComma(totalAmount)}</Text>
</View>
</View>
<View style={{alignItems:'center',paddingVertical:10,marginTop:0}}>
    <Text style={{textAlign:"center",color:"#444"}}>* * * * * * * * * * * * * * * * * * * * * * * * * * * * *</Text>
    <Text style={{textAlign:"center",color:"#444",fontWeight:"bold",fontSize:18}}>TOTAL: NGN {returnComma(totalAmount)}</Text>
    <Text style={{textAlign:"center",color:"#444"}}>* * * * * * * * * * * * * * * * * * * * * * * * * * * * *</Text>
</View>
<View style={{alignItems:'center',width:"100%",flexDirection:"column"}}>
  <Text style={{textAlign:"center",color:"#999",fontSize:12}}>Customer's copy</Text>
  <Text style={{textAlign:"center",color:"#999",fontSize:12}}>* * * * * * * * * * * * THANK YOU * * * * * * * * * * * * </Text>
</View> 
</ViewShot> 
</View>
<TouchableOpacity
onPress={()=>{
if(this.state.imgUrl != "")
{
this.writeFile(this.state.imgUrl);
}

}}
style={[mystyle.btn,{height:40,padding:5,width:width-60,justifyContent:"center",alignItems:"center",marginTop:30}]}>
<Text style={{fontSize:12,color:"white"}}>Save To Device</Text>
</TouchableOpacity>
<View style={{width:width,height:80}}></View>
</ScrollView>

<Loader 
{...this.state}
returnData={(d)=>{
this.setState(d);
if(this.state.success)
{
    Actions.goBack();
}
}} />
</View>)
    }
}
ReceiptClass.defaultProps = {
    description:"",
    price:"",
    card_type:"",
    date:"",
    last_4:"",
    card_reference:"",
    account_name:"",
    vat_fee:0
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(ReceiptClass);

