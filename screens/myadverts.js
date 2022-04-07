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
    Image,
    Modal } from 'react-native';
    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';

const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import Moment from 'moment';

import {returnAllNumbers,postDATA} from '../includes/func';

class MyAdvertsClass extends PureComponent{
    componentDidMount()
    {
     this.getAdverts();
     }
    constructor(props)
    {
        super(props);
        this.state = {
            AdvertList:[],
            showLoader:false,
            isProcessing:true,
            errorInfo:"Please wait...",
            success:false,
        }
        this.getAdverts.bind();
    }
 
componentWillUnmount()
{

}
getAdverts()
{
  this.setState({loading:true})
  var data = {
              user_id:parseInt(this.props.id_user),
              image:""
            };
   postDATA("campaign/getMyAdvert",data).then((res)=>{
   this.setState({
    loading:false,
    errorInfo:res.status?"Advert fetched successful":"Oops! Services not fetched"
    },()=>{
    console.log(res);
    // return;
    if(res.status)
    {
        this.setState({AdvertList:res.result.map((a,i)=>{
          console.log(a);
          return a;
        }).filter((a,i)=>String(a.user_id) == String(this.props.id_user)).reverse()},()=>{
       console.log(this.state.AdvertList);

        })
    }
   })
   })
}
render() 
{
  const {AdvertList,loading} = this.state;
  const Actions = this.props.navigation;
return(<View style={mystyle.window} >
    <View style={{height:60,width:width,backgroundColor:mystyle.active.color,flexDirection:"row"}}>
         <TouchableOpacity 
         onPress={()=>{
           Actions.goBack();
         }}
         style={{width:40,height:60,justifyContent:"center",alignItems:"center"}} >
           <Icon.MaterialIcons name="keyboard-arrow-left"  size={25} color="white" />
         </TouchableOpacity>
         <View style={{flex:1,justifyContent:"center",paddingLeft:10}}>
        <Text style={{fontSize:16,color:"#fff",fontWeight:"bold"}}>MY ADVERTS ({AdvertList.length})</Text>
         </View>
         </View>
   {!loading && AdvertList.length == 0?<View style={[mystyle.myalert,{}]}>
    <Text>No advert found!</Text>
    <TouchableOpacity
    onPress={()=>{
      this.getAdverts();
    }}
    style={{padding:5,backgroundColor:"red",position:"absolute",right:20,top:8,paddingHorizontal:15,borderRadius:5}}
    >
      <Text style={{fontSize:10,color:"white"}}>Reload</Text>
    </TouchableOpacity>
  </View>:loading?<View style={{flexDirection:"row",padding:10,width:"100%",justifyContent:"flex-start",alignItems:"flex-start"}}>
   <ActivityIndicator size="small" color={mystyle.active.color} />
   <Text style={{marginLeft:5,fontSize:12}}>Loading...</Text>
  </View>:null}
{!loading && AdvertList.length != 0? <View style={{flexDirection:"column",flex:1}}>
  <ScrollView 
keyboardShouldPersistTaps="always"style={{flex:1}} >
  <View style={{flexDirection:"column",width:width,padding:15,paddingBottom:80}}>
{AdvertList.map((a,i,self)=><View
    key={i} style={{justifyContent:"center",borderBottomWidth:0.5,borderBottomColor:"#ccc",flexDirection:"column",marginBottom:30,backgroundColor:"#fff",padding:10}} >
   <Image source={{uri:a.banner_image["200_200"].url}}  style={{width:"100%",height:90}} />
   <View style={{flexDirection:"row"}}>
   <Text style={{fontSize:14,color:"#000",fontWeight:"bold"}}>Size: </Text> 
   <Text style={{fontSize:14,color:"#000"}}>{a.banner_size} x {width}</Text> 
   </View>
   <View style={{flexDirection:"row"}}>
   <Text style={{fontSize:14,color:"#000",fontWeight:"bold"}}>Plan: </Text> 
   <Text style={{fontSize:14,color:"#000"}}>{a.plan} Month</Text> 
   </View>
   <View style={{flexDirection:"row"}}>
   <Text style={{fontSize:14,color:"#000",fontWeight:"bold"}}>Start Date: </Text> 
   <Text style={{fontSize:14,color:"#000"}}>{Moment(a.start_date).format("Do, MMMM YYYY hh:mm:ss")}</Text> 
   </View>
   <View style={{flexDirection:"row"}}>
   <Text style={{fontSize:14,color:"#000",fontWeight:"bold"}}>End Date: </Text> 
   <Text style={{fontSize:14,color:"#000"}}>{Moment(a.end_date).format("Do, MMMM YYYY hh:mm:ss")}</Text> 
   </View>
   <View style={{flexDirection:"row"}}>
   <Text style={{fontSize:14,color:"#000",fontWeight:"bold"}}>Created at: </Text> 
   <Text style={{fontSize:14,color:"#000"}}>{Moment(a.created_at).format("Do, MMMM YYYY hh:mm:ss")}</Text> 
   </View>
    </View>)}
{["","","","",""].filter((a,i)=>i < (5-AdvertList.length)).map((a,i)=><View key={i} style={[mystyle.card,{width:width-20,padding:10,minHeight:50,borderRadius:10,marginTop:10,alignSelf:"center",flexDirection:"column"}]}>
<View style={{width:"100%",height:70,backgroundColor:"#f3f3f3",marginVertical:5}}>
</View>
<View style={{width:"100%",height:10,backgroundColor:"#f3f3f3",marginVertical:5}}>
</View>
</View>)}
</View>
   </ScrollView>
   </View>:<View style={{flex:1,flexDirection:"column"}}>
   {["","","",""].map((a,i)=><View key={i} style={[mystyle.card,{width:width-20,padding:10,minHeight:50,borderRadius:10,marginTop:10,alignSelf:"center",flexDirection:"column"}]}>
  <View style={{width:"100%",height:10,backgroundColor:"#f3f3f3",marginVertical:5}}>
  </View>
  <View style={{width:"100%",height:140,backgroundColor:"#f3f3f3",marginVertical:5}}>
  </View>
 <View style={{width:"100%",height:10,backgroundColor:"#f3f3f3",marginVertical:5}}>
 </View>
 <View style={{width:"100%",height:10,backgroundColor:"#f3f3f3",marginVertical:5}}>
</View>
</View>)}
</View>}
<View style={{position:"absolute",bottom:40,width:width,alignItems:"center"}}>
{!loading ?<TouchableOpacity 
     onPress={()=>{
        Actions.replace("myservices",{createadvert:true});
    }} style={[{width:180,height:40,backgroundColor:mystyle.active.color,justifyContent:"center",alignItems:"center",borderRadius:5,elevation:5,flexDirection:"row"}]}>
    <Text style={{color:"white",fontSize:16}}>Create an Ads</Text>
    </TouchableOpacity>:null}
</View>
    </View>)
    }
}
MyAdvertsClass.defaultProps = {
 
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(MyAdvertsClass);

