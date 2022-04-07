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
    Alert,
    Image,
    RefreshControl,
    DeviceEventEmitter,
    Modal } from 'react-native';
    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';

const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import Login from '../screens/login';
import * as Animatable from 'react-native-animatable';
import Loader from '../components/loader';
import Country from '../includes/countries';

import {returnAllNumbers,postDATA,calculateDistance} from '../includes/func';

class MyServicesClass extends PureComponent{
    componentDidMount()
    {
     this.getServices();
     DeviceEventEmitter.addListener("reload",(d)=>{
      if(d.action === "service")
      {
     this.getServices();
      }
     });
     if(this.props?.route?.params)
      {
        this.setState({createvent:this.props?.route?.params?.createvent})
      }
     }
    constructor(props)
    {
        super(props);
        this.state = {
            ServiceList:[],
            showLoader:false,
            loading:true,
            isProcessing:true,
            errorInfo:"Please wait...",
            success:false,
            refreshing:false,
            createvent:false
        }
        this.getServices.bind();
    }
 
componentWillUnmount()
{

}
getServices()
{
  this.setState({
    isProcessing:true,
    success:false,
    loading:true,
    errorInfo:"Please wait..."})
  var data = {
   user_id:parseInt(this.props.Reducer.id_user),
   limit:50
};

   postDATA("store/getServices",data).then((res)=>{
   console.log(res);
   this.setState({
    loading:false,refreshing:false,
    ServiceList:res.result.map((a,i)=>{
      a.images_list = a.images;
      if(a.images)
      {
        if(a.images.length > 0)
        {
          if(a.images[0])
          {
            a.images = {uri:a.images[0]["200_200"].url}
          }else{
          a.images = {uri:null}
          }
        }else{
          a.images = {uri:null}
        }
      }
      if(a.name)
      {
        a.product_name = a.name;
        delete a.name;
      }
      return a;
    })})
   })
}
deleteItem(id)
{
  this.setState({
    isProcessing:true,
    success:false,
    showLoader:true,
    errorInfo:"Please wait..."})
  var data = {
   user_id:parseInt(this.props.Reducer.id_user),
   store_id:id
};
   postDATA("store/delete",data).then((res)=>{
    this.setState({
      isProcessing:false,
      success:false,
      showLoader:false,
    ServiceList:this.state.ServiceList.filter((a,i)=>a.store_id != id)})

   })
}
render() 
{
  
  const {ServiceList,isProcessing,loading,createvent,createadvert} = Object.assign(this.state,this.props.Reducer);
return(<View style={mystyle.window} >
    <View style={{height:60,width:width,backgroundColor:mystyle.active.color,flexDirection:"row"}}>
         <TouchableOpacity 
         onPress={()=>{
          var Actions = this.props.navigation;
           Actions.goBack();
         }}
         style={{width:40,height:60,justifyContent:"center",alignItems:"center"}} >
           <Icon.MaterialIcons name="keyboard-arrow-left"  size={25} color="white" />
         </TouchableOpacity>
         <View style={{flex:1,justifyContent:"center",paddingLeft:10}}>
        <Text style={{fontSize:16,color:"#fff",fontWeight:"bold"}}>MY SERVICES</Text>
         </View>
         </View>
 
<View style={{flexDirection:"column",flex:1}}>

  <ScrollView 
keyboardShouldPersistTaps="always"
  scrollEnabled={ServiceList.length == 0?false:true}
  refreshControl={
    <RefreshControl
    progressViewOffset={-20}
      refreshing={this.state.refreshing}
      onRefresh={()=>{
        this.setState({refreshing:true},()=>this.getServices())
      }}
    />}
  style={{flex:1}} >
  <View style={{flexDirection:"column",width:width,padding:15,paddingTop:0,paddingBottom:100}}>
{ServiceList.length != 0?<View style={[mystyle.myalert,{width:width-30,marginHorizontal:0}]}>
<Text style={{fontSize:10}}>{createvent?``:`Swipe down to reload content`}</Text>
</View>:loading?<View style={{flexDirection:"row",padding:10,width:"100%",justifyContent:"flex-start",alignItems:"flex-start"}}>
   <ActivityIndicator size="small" color={mystyle.active.color} />
   <Text style={{marginLeft:5,fontSize:12}}>Loading...</Text>
  </View>:<View style={[mystyle.myalert,{alignItems:"center",width:width-30,marginHorizontal:0}]} >
          <View style={{height:30,width:50,justifyContent:"center",alignItems:"center"}} >
          <Icon.Ionicons name="ios-information-circle-outline" size={20} />
          </View>
          <Text>No service found !</Text>
          </View>}
{ServiceList.map((a,i,self)=><View
    key={i} style={{height:90,justifyContent:"center",alignItems:"center",borderBottomWidth:0.5,borderBottomColor:"#ccc",flexDirection:"column",marginBottom:10,backgroundColor:"#444",overflow:"hidden"}} >
   <Image source={a.images}  style={{width:width-20,height:90}} />
   <View style={{height:90,paddingLeft:40,width:width-20,justifyContent:"center",flexDirection:"column",position:"absolute",top:0,left:0,backgroundColor:"rgba(0,0,0,0.3)"}} >
   <Text style={{fontSize:14,color:"#fff",fontWeight:"bold"}}>{a.product_name}</Text>
   <Text style={{fontSize:14,color:"#fff"}}>{a.category_name}</Text>
   <Text style={{fontSize:14,color:"#fff"}}>{a.created_at}</Text>
   {createvent?<TouchableOpacity
   onPress={()=>{
    var Actions = this.props.navigation;
    Actions.navigate("create_events",{event:{store_id:a.id_store,category_id:a.category_id,category_name:a.category_name}})
   }}
     style={[{width:90,position:"absolute",bottom:5,right:20,height:30,backgroundColor:mystyle.active.color,justifyContent:"center",alignItems:"center",borderRadius:5,elevation:5,flexDirection:"row"}]}>
    <Text style={{color:"white",fontSize:12}}>Create Event</Text>
    </TouchableOpacity>:createadvert?<TouchableOpacity
    onPress={()=>{
      console.log(a)
      var Actions = this.props.navigation;
      Actions.navigate("advert",{advert:{
        module_id:a.id_store,
        category_id:a.category_id,
        module_category:a.category_name,
        module_category_id:a.category_id,
        module_name:"store"}})
    }}
      style={[{width:130,position:"absolute",bottom:5,right:20,height:30,backgroundColor:mystyle.active.color,justifyContent:"center",alignItems:"center",borderRadius:5,elevation:5,flexDirection:"row"}]}>
    <Text style={{color:"white",fontSize:12}}>Create Campagain</Text>
    </TouchableOpacity>:<TouchableOpacity
    onPress={()=>{
    var Actions = this.props.navigation;
    a.product_image = a.images;
    a.offer = true;
    console.log(a);
    Actions.navigate("new_service",a);
    }} style={[{width:110,position:"absolute",bottom:5,right:20,height:30,backgroundColor:mystyle.active.color,justifyContent:"center",alignItems:"center",borderRadius:5,elevation:5,flexDirection:"row"}]}>
    <Text style={{color:"white",fontSize:12}}>Create Offer</Text>
    </TouchableOpacity>}
    </View>
    {!createvent?<View style={{position:"absolute",top:0,left:0,height:"100%",backgroundColor:"rgba(0,0,0,0.3)",flexDirection:"column",width:30}}>
    <TouchableOpacity
    onPress={()=>{
      Alert.alert("Action",`Choose the follow proceed.\n1. Tap on "Send Email" to send an email for deletion of service.\n2. Tap on "Cancel" to exit the dialog box.`,
      [
        {text: 'Cancel', onPress: () => {
     
        }, style: 'cancel'},
        
       {text: 'Send Email', onPress: () => {
        //  alert(JSON.stringify(this.props))
        Linking.openURL(`mailto:admin@wedeynear.com?subject=Service deletion&body=Hi, Please help me to delete my service with following link ${a.link}`)
        }, style: 'cancel'}
      ],
      {cancelable:false})
    }}
     style={{justifyContent:"center",alignItems:"center",flex:1}} >
  <Icon.FontAwesome name="trash"  size={18} color="red" />
  </TouchableOpacity>
  <TouchableOpacity
  onPress={()=>{
    var Actions = this.props.navigation;
    Actions.navigate("view_product",{productDetails:a});
    return;
  // if(createadvert)
  // {
  //   Actions.advert({advert:{
  //     module_id:a.id_store,
  //     category_id:a.category_id,
  //     module_category:a.category_name,
  //     module_category_id:a.category_id,
  //     module_name:"store"}})
  // }else{
    a.offer = false;
    Alert.alert("Action",`Choose the follow proceed.\n1. Tap on "Edit" to edit service.\n2. Tap on "View" to view service.\n3. Tap on "Cancel" to exit the dialog box.`,
    [
      {text: 'Cancel', onPress: () => {
   
      }, style: 'cancel'},
     {text: 'Edit', onPress: () => {
      
    if(a.telephone != undefined){
     
      if(a.telephone == "")
      {
        if(a.user.result != undefined && a.user.result.length  != 0)
        {
        var mobile = a.user.result[0].telephone;
        var rv = String(mobile).split("").reverse();
        var num = rv.filter((a,i)=>i < 10).reverse().join("");
        a.mobile = num;
        a.calling_code = String(mobile).replace(a.mobile,"");
        console.log(a.mobile,a.calling_code)
        }
      }else{
        var rv = String(a.telephone).split("").reverse();
        var num = rv.filter((a,i)=>i < 10).reverse().join("");
        var ccode = String(a.telephone).replace(num,"");
        a.mobile = num;
        a.calling_code = ccode;
        console.log(a.telephone,ccode)
      }
      a.id_user = this.props.Reducer.id_user;
  }
  
  console.log(a);
  // return ;
  var Actions = this.props.navigation;
    Actions.navigate("edit_product",{senddata:a});
      }, style: 'cancel'},
  {text: 'View', onPress: () => {
    a.distance_from_me = parseFloat(calculateDistance(a.latitude,this.props.Reducer.latitude,a.longitude,this.props.Reducer.longitude)).toFixed(2);
    console.log(a);
        // return ;
        var Actions = this.props.navigation;
        Actions.navigate("view_product",{productDetails:a});
}, style: 'cancel'}
    ],
    {cancelable:false})
  // }
  }}
  activeOpacity={0.9}
              style={{justifyContent:"center",alignItems:"center",flex:1,marginTop:5}} >
             <Icon.FontAwesome name="eye"  size={18} color="red" />
             </TouchableOpacity>
    </View>:null}
    </View>)}
{["","","",""].filter((a,i,self)=>i < (self.length - ServiceList.length)).map((a,i)=><View key={i} style={[mystyle.card,{width:width-20,padding:10,minHeight:50,borderRadius:10,marginTop:10,alignSelf:"center",flexDirection:"column"}]}>
<View style={{width:"100%",height:70,backgroundColor:"#f3f3f3",marginVertical:5}}>
</View>
<View style={{width:"100%",height:10,backgroundColor:"#f3f3f3",marginVertical:5}}>
</View>
</View>)}
</View>
   </ScrollView>
   <View style={{position:"absolute",bottom:40,width:width,alignItems:"center"}}>
<TouchableOpacity 
     onPress={()=>{
      var Actions = this.props.navigation;
     Actions.navigate("new_service");
    }} style={[{width:180,height:40,backgroundColor:mystyle.active.color,justifyContent:"center",alignItems:"center",borderRadius:5,elevation:5,flexDirection:"row"}]}>
    <Text style={{color:"white",fontSize:16}}>Add a service</Text>
    </TouchableOpacity>
</View>
   </View>
<Country 
{...this.state}
returnData={(d)=>{
this.setState(d);
}} />
   <Loader 
{...this.state}
returnData={(d)=>{
this.setState(d);
}}
    />
    </View>)
    }
}
MyServicesClass.defaultProps = {
  createvent:false,
  createadvert:false
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(MyServicesClass);

