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
    Pressable,
    DeviceEventEmitter,
    Modal } from 'react-native';
    import Icon from '../includes/icons';
    import mystyle from '../includes/mystyle';
    import {postDATA,getMime} from '../includes/func';
const {width,height} = Dimensions.get("window");
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import Moment from 'moment';
import {DocumentPicker,DocumentPickerUtil} from "react-native-document-picker";
import { Picker } from '@react-native-picker/picker';

class SuccessClass extends PureComponent{

componentDidMount()
{

this.getStatus();
DeviceEventEmitter.addListener("showVerifyBusiness",()=>{
  this.getStatus();
})

}

 getStatus()
 {
   
   if(String(this.props.typeAuth).toLowerCase() == "vendor")
   {
  // alert(String(this.props.typeAuth).toLowerCase())
  postDATA("verification/getVerificationDetails",{
    user_id:this.props.id_user
  }).then((res)=>{
  // alert(JSON.stringify(res));
  var show = false;
  try {
    show = !res?.result?.id_verify;
  } catch (error) {
    
  }
  this.setState({BusinessVerified:show})
  })
}
 }

getType()
{
  if(this.state.verify_means.length == 0)
  {
  this.setState({menuloading:true});
  postDATA("verification/getTypesAssoc",{ }).then((res)=>{
    // alert(JSON.stringify(res))
  this.setState({menuloading:false});
  if(res.status)
  {
  this.setState({verify_means:Object.keys(res.result),...res.result})
  }
  })
  }
}

constructor(props)
    {
        super(props);
        this.state = {
            reload:false,
            loading:false,
            menuloading:false,
            msg:false,
            done:false,
            info:"",
            setDate:null,
            verifyType:"",
            doc:{uri:"",fileName:""},
            showVerify:false,
            verify_means:[],
            document: {},
            physical: {},
            video: {},
            selectedMeans:"",
            selectedMedium:"",
            means:"",
            BusinessVerified:false
        }
}
 
componentWillUnmount()
{
  DeviceEventEmitter.removeAllListeners("showVerifyBusiness");
}

render() 
{
const {typeAuth,showPrompt,showADS,showVerifyBusiness,done,verify_means,info,setDate,verifyType,doc,showVerify,BusinessVerified,showBtn} = Object.assign(this.state,this.props);
//  alert(String(this.props.typeAuth).toLowerCase());

return(<View style={{flexDirection:"column",width:"100%"}}>
 {this.props.showBtn && this.state.BusinessVerified?<TouchableOpacity 
onPress={()=>{
  Actions = this.props.navigation;
    if(String(this.props.typeAuth).toLowerCase() != "vendor")
    {
     Alert.alert("Business verification",`This feature is for vendors, \nDo you want to upgrade your account to VENDOR account?`,
     [{text:'Not Now',onPress:()=>{
      },style:'cancel'},
      {text:'Yes',onPress:()=>{
        // Actions.reg2();
      },style:'cancel'}],
      {cancelable:false})
    }else{
      this.setState({BusinessVerified:true});
    }
}}
style={{height:60,borderBottomWidth:0.2,flexDirection:"row",alignItems:"center",paddingHorizontal:5}}
>
<Icon.FontAwesome5 name="business-time" style={{color:"#444",marginHorizontal:5,fontSize:15}} />
<Text style={{fontSize:14,color:"#000"}}>Business Verification</Text>
</TouchableOpacity>:null}
<Modal
onRequestClose={()=>{
  this.setState({BusinessVerified:this.state.menuloading});
}}

visible={this.state.BusinessVerified && String(this.props.typeAuth).toLowerCase() == "vendor"}
transparent={true}
animationType="slide"
onShow={()=>{
  this.getType();
  this.getStatus();
}}
style={{flex:1}} >
<View style={{height,flexDirection:"column",alignItems:"center",justifyContent:"center",backgroundColor:"rgba(0,0,0,0.4)"}}>
<View style={{width:"100%"}}>
<ScrollView 
keyboardShouldPersistTaps="always"
style={{width}}
showsHorizontalScrollIndicator={false}
showsVerticalScrollIndicator={false}
>
<View style={{width,flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
<View 
ref={e=>this.ViewBod=e}
style={[mystyle.card,{marginVertical:50,width:width-80,flexDirection:"column"}]}>
<View style={{width:width,height:40,flexDirection:"row",backgroundColor:mystyle.active.color}}>
<TouchableOpacity onPress={()=>{
    this.setState({BusinessVerified:this.state.menuloading});
}} style={[{width:40,height:40,justifyContent:"center",alignItems:"center"}]}>
<Icon.MaterialIcons color={"white"} name="keyboard-arrow-left" size={20} />
</TouchableOpacity>
<View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
<Text style={{color:"white",fontSize:14,width:"100%",textAlign:"left"}}>Business location verification</Text>
</View>
</View>
<View style={{flexDirection:"column",width:"100%",minHeight:200}}>
{!this.state.menuloading?<View style={{padding:10,backgroundColor:"#ffeeee"}}>
<Text style={{fontSize:10}}>Every registered business on our app will be verified before getting a 'Verified Status' on their respective profile. Once we have conducted our verification of your business, your verification status will be updated accordingly.</Text>
<View style={{padding:10,flexDirection:"row"}}>
<Text style={{fontSize:10,fontWeight:"bold",marginRight:5}}>*</Text>
<Text style={{fontSize:10,fontWeight:"bold"}}>If your business is registered with CAC, please upload a valid registration doc Or any other professional certification.</Text>
</View>
</View>:null}
{this.state.menuloading?<View style={{width:"100%",flexDirection:"row",justifyContent:"center",height:180,alignItems:"center"}}>
<ActivityIndicator size="small" color="red"/>
<Text style={{paddingLeft:5,fontSize:10}}>loading...</Text>
</View>:<View style={{flexDirection:"column",marginBottom:10}}>
<View style={{flexDirection:"column",paddingHorizontal:15,borderBottomWidth:0.5,borderColor:"#444",paddingBottom:10,marginTop:15}}>
    <Text style={{fontSize:12,fontWeight:"bold"}}>Select Type</Text>
    </View>
{verify_means.map((a,i)=><TouchableOpacity 
    onPress={()=>{ 
     this.setState({verifyType:a,selectedMedium:""})
    }} 
     key={i} style={{padding:10,borderBottomWidth:0.2,borderColor:"#ccc",paddingLeft:20,flexDirection:"row",alignItems:"center",paddingVertical:15}} >
    {this.state.verifyType == a?<Icon.Feather name="check-circle" color="limegreen" size={15} style={{marginRight:10}} />:<View style={{height:15,width:15,backgroundColor:"#ccc",borderRadius:15,marginRight:10}}></View>}
    <Text style={{fontSize:14}}>{a}</Text>
</TouchableOpacity>)}
<View style={{flexDirection:"column"}}>
{this.state.verifyType == "video"?<View style={{flexDirection:"column",paddingHorizontal:15,borderBottomWidth:0.5,borderColor:"#444",paddingBottom:10}}>
    <Text style={{fontSize:12,fontWeight:"bold",marginTop:5}}>Select video call medium</Text>
    <View style={[mystyle.regInput,{width:"100%",marginLeft:0,alignSelf:"flex-start",backgroundColor:"#fff",borderRadius:5,borderColor:"#707070",paddingHorizontal:15,borderWidth:0.5,minHeight:50,alignItems:"center",flexDirection:"row"}]}>
    <Picker
    style={{width:"100%"}}
    mode="dropdown"
    onValueChange={(a)=>{
      this.setState({selectedMedium:a})
    }}
    selectedValue={this.state.selectedMedium}
    >
    {Object.keys(this.state.video).map((a,i)=><Picker.Item key={i} value={this.state.video[a]} label={this.state.video[a]}/>)}
    </Picker>
    </View>
    </View>:null}
</View>
<View style={{flex:1,flexDirection:"column",paddingHorizontal:15,borderBottomWidth:0,borderColor:"#444",paddingBottom:10,marginTop:15}}>
    <View style={{flexDirection:"row",paddingHorizontal:15,borderBottomWidth:0,borderColor:"#444",paddingBottom:10}}>
    <Text style={{fontSize:12,fontWeight:"bold",marginLeft:-10}}>Select a file</Text>
    <Text style={{fontSize:12}}> ( pdf, jpeg, png, jpg, MS word )</Text>
    </View>
    <TouchableOpacity
      onPress={()=>{
        DocumentPicker.show({
          filetype: [DocumentPickerUtil.allFiles()],
        },(error,res)=>{
      if(error)
      {
        return true;
      }
      // var ftype = [];
      // if(this.state.verifyType == "document")
      // {
      //   ftype = ["doc","pdf","docx"];
      // }else{
      //   ftype = ["mp4"]; 
      // }
      if(getMime(res.fileName,["doc","pdf","docx","png","JPEG","jpeg","jpg"]))
     {
      this.setState({doc:res});
      console.log(res);
     }else{
       alert("File type not accepted, Please select the following file type (Microsoft Word, PDF, PNG, JPEG). thanks")
     }
    })
    }}
    style={[mystyle.regInput,{width:"100%",marginLeft:0,alignSelf:"flex-start",backgroundColor:"#fff",borderRadius:5,borderColor:"#707070",paddingHorizontal:15,borderWidth:0.5,minHeight:50,alignItems:"center",flexDirection:"row"}]}>
    <Icon.FontAwesome name="file-photo-o" size={20} />
    <Text style={{width:"75%",fontSize:14,marginLeft:10}}>{this.state.doc.fileName == ""?"Select a file...":this.state.doc.fileName}</Text>
    </TouchableOpacity>
    <Text style={{fontSize:12,fontWeight:"bold"}}>Select document type</Text>
    <View style={{flexDirection:"column"}}>
    {Object.keys(this.state.document).map((a,i)=><TouchableOpacity key={i}
    onPress={()=>{
      this.setState({selectedMeans:a})
    }}
    style={{flexDirection:'row',alignItems:"center",marginVertical:10}}>
     {this.state.selectedMeans == a?<Icon.Feather name="check-circle" color="limegreen" size={15}  />:<View style={{width:15,height:15,alignItems:"center",justifyContent:"center",borderRadius:15,backgroundColor:"#ccc",overflow:"hidden"}}></View>}
      <Text style={{fontSize:14,marginHorizontal:5}}>{this.state.document[a]}</Text>
    </TouchableOpacity>)}
    </View>
    </View>
<TouchableOpacity 
    onPress={()=>{
      if(verifyType == "")
      {
        alert("Please select a type.");
      }else if(this.state.verifyType == "video" && this.state.selectedMedium == "")
      {
        alert("Please select video medium.");
      }else if(doc.uri == "" )
      {
        alert("Please select file document (pdf, jpeg, jpg, doc).");
      }else if(this.state.selectedMeans == "" )
      {
        alert("Please select document type.");
      }else{
      this.setState({menuloading:true,done:false})
        // return ;
        postDATA("verification/submitVerification",{
          user_id:parseInt(this.props.id_user),
          type:"document",
          verify_means:this.state.selectedMeans,
          verify_date:Moment().format("YYYY/MM/DD"),
          image:{
            uri:doc.uri,
            path:doc.uri,
            name:doc.fileName,
            fileName:doc.fileName,
            filename:doc.fileName,
            type:doc.type
          }
        }).then((res)=>{
          // alert(JSON.stringify(res));
          this.setState({menuloading:!res.status,msg:true,info:res.message == "" && res.status?"File uploaded successfully.":res.message,done:res.status})
          console.log(res);
          if(res.status)
          {
            this.props.dispatch({type:"update",value:{user_verified:"no"}})
          }
        })
    }
    }}
    style={{...mystyle.btn,width:120,marginVertical:10}}
    >
    <Text style={{color:"white"}}>Submit</Text>
    </TouchableOpacity>
</View>}
{this.state.msg?<View style={{...StyleSheet.absoluteFill,backgroundColor:"white",justifyContent:"center",alignItems:"center",padding:20,minHeight:180,width:"100%"}}>
 {done?<Icon.Feather name="check-circle" size={40} color="limegreen" />:<Icon.AntDesign name="closecircleo" size={40} color="red" />}
 <Text style={{textAlign:"center",fontSize:12}}>{this.state.info}</Text>
        <TouchableOpacity
        style={{backgroundColor:mystyle.active.color,width:150,height:40,alignItems:"center",justifyContent:"center",elevation:3,borderRadius:50,marginVertical:20}}
        onPress={()=>{
            this.setState({BusinessVerified:false,msg:false,closeView:true,menuloading:false});
        }}
        >
         <Text style={{color:"white"}}>{done?"Done":"Close"}</Text>   
        </TouchableOpacity>
        </View>:null}
</View>
</View>
</View>

</ScrollView>

</View>

</View>
</Modal>
</View>
)
    }
}
SuccessClass.defaultProps = {
  screen_route:"",
  success:false,
  errorInfo:"",
  show:false,
  showBtn:false
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(SuccessClass);

