import React, {PureComponent} from 'react';
import {
  Platform,
     StyleSheet,
     Text, 
     View,
     Clipboard,
     SafeAreaView,
     FlatList,
     ToastAndroid,
     TouchableOpacity,
    TextInput ,
    RefreshControl,
    ScrollView,
    Animated,
    Easing,
    NativeModules,
    Keyboard,
    Image,
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
    Modal } from 'react-native';
    import Icon from '../includes/icons';
    import mystyle from '../includes/mystyle';
    import {postDATA,getMime} from '../includes/func';
const {width,height} = Dimensions.get("window");
import { connect } from 'react-redux';
import VersionCheck from 'react-native-version-check';
import DeviceInfo from 'react-native-device-info';
class UpgradeClass extends PureComponent{
getUpdate()
{
    VersionCheck.getLatestVersion({
        provider: 'playStore'  // for Android
      }).then(latestVersion => {
          var vercode = DeviceInfo.getVersion();
          if((latestVersion).toString() != (vercode).toString())
          {
              this.setState({show:true})
          }
    })
}
    constructor(props)
    {
        super(props);
        this.state = {
            show:false,
            count:0,
            downloading:false,
            downloadStatus:""
        }
    
    }
 
componentWillUnmount()
{

}
componentDidMount()
{
    this.getUpdate();
}
// downloadInstall()
// {
// const filePath = RNFS.DocumentDirectoryPath + '/wedeynear.apk';
// var dol = RNFS.downloadFile({
//     fromUrl:`https://play.google.com/store/apps/details?id=com.wedeynear`,
//     toFile: filePath,
//     progressInterval:100,
//     progress: (res) => {
//         console.log((res.bytesWritten / res.contentLength).toFixed(2));
//         this.setState({count:String((res.bytesWritten / res.contentLength).toFixed(2))+"%"})
//     },
//     begin:(res)=>{
//        if(res.statusCode != 200)
//        {
//         this.setState({count:0,downloading:true,downloadStatus:"Downloading:"})
//        }
//     },
//     progressDivider: 1
// })

// dol.promise.then(result => {
//     if(result.statusCode == 200){
//         // this.setState({count:0,downloading:false,downloadStatus:""})
//         RNApkInstallerN.install(filePath)
//     }
// });

// }
render() 
{
return(<Modal
onRequestClose={()=>{
  this.setState({show:false});
}}
onShow={()=>{
    this.getUpdate();
}}
visible={this.state.show}
transparent={true}
animationType="fade"
style={{flex:1}} >
<View style={{flex:1,flexDirection:"column",alignItems:"center",justifyContent:"center",backgroundColor:"rgba(0,0,0,0.4)"}}>
<View 
style={[mystyle.card,{marginVertical:50,width:width-80,flexDirection:"column",padding:20}]}>
{this.state.downloading?<View style={{justifyContent:"center",alignItems:"center"}}>
<Text style={{fontSize:18,fontWeight:"bold",marginBottom:10}}>{this.state.downloadStatus}{this.state.downloading}</Text>
</View>:<View style={{flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
<View style={{padding:10,flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
<Text style={{fontSize:18,fontWeight:"bold",marginBottom:10}}>A new version available.</Text>
<Text style={{fontSize:14,textAlign:"center"}}>{`There is a new version of wedeynear available for download, \nthis will replace the existing version, tap 'Upgrade Now' to continue.`}</Text>
</View>
<TouchableOpacity
style={{backgroundColor:mystyle.active.color,width:150,height:40,alignItems:"center",justifyContent:"center",elevation:3,borderRadius:50,marginVertical:20,alignSelf:"center"}}
onPress={()=>{
    // this.downloadInstall()
    Linking.openURL("https://play.google.com/store/apps/details?id=com.wedeynear")
}}
>
 <Text style={{color:"white"}}>Upgrade Now</Text>   
</TouchableOpacity>
</View>}
</View>
</View>
</Modal>
)
    }
}
UpgradeClass.defaultProps = {
  screen_route:"",
  success:false,
  errorInfo:""
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(UpgradeClass);

