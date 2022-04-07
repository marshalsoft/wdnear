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

import {returnAllNumbers,postDATA} from '../includes/func';

class MyServicesClass extends PureComponent{
    componentDidMount()
    {
     this.getEvents();
     }
    constructor(props)
    {
        super(props);
        this.state = {
            EventsList:[],
            Evn:[],
            showLoader:false,
            isProcessing:true,
            errorInfo:"Please wait...",
            success:false,
        }
        this.getEvents.bind();
    }
 
componentWillUnmount()
{

}
getEvents()
{
  this.setState({loading:true})
  var data = {
              user_id:parseInt(this.props.Reducer.id_user),
              image:""
            };
   postDATA("event/getMyEvents",data).then((res)=>{
    console.log(res);
   this.setState({
    loading:false,
    errorInfo:res.status?"Services fetched successful":"Oops! Services not fetched"
    },()=>{
    if(res.status && res.result)
    {
       if(res.pagination != undefined)
       {
         r = res.pagination;
         this.setState({...r});
       }
        this.setState({EventsList:res.result.map((a,i)=>{
          console.log(a);
          console.log(`${a.images[0]["200_200"]}`);
          try{
              a.main_image = a.images[0]["200_200"].url;
            }catch(e){
              a.main_image = null;
            }
          if(a.ticket != undefined)
          {
            try{
              a.ticket = String(a.ticket).replace(/["]/g,"").replace(/['']/g,'"');
              // console.log(a.ticket);
              a.ticket = JSON.parse(a.ticket);
            }catch(e){
              a.ticket = [];
            }
          }
          return a;
        }).reverse()},()=>{
       console.log(this.state.EventsList);
        })
       }
   })
   })
}
render() 
{
  const {EventsList,loading} = this.state;
 
return(<View style={mystyle.window} >
    <View style={{height:60,width:width,backgroundColor:mystyle.active.color,flexDirection:"row"}}>
         <TouchableOpacity 
         onPress={()=>{
          const Actions = this.props.navigation;
           Actions.goBack();
         }}
         style={{width:40,height:60,justifyContent:"center",alignItems:"center"}} >
           <Icon.MaterialIcons name="keyboard-arrow-left"  size={25} color="white" />
         </TouchableOpacity>
         <View style={{flex:1,justifyContent:"center",paddingLeft:10}}>
        <Text style={{fontSize:16,color:"#fff",fontWeight:"bold"}}>MY EVENTS ({EventsList.length})</Text>
         </View>
         </View>
   {!loading && EventsList.length == 0?<View style={[mystyle.myalert,{}]}>
    <Text>No event found!</Text>
  </View>:loading?<View style={{flexDirection:"row",padding:10,width:"100%",justifyContent:"flex-start",alignItems:"flex-start"}}>
   <ActivityIndicator size="small" color={mystyle.active.color} />
   <Text style={{marginLeft:5,fontSize:12}}>Loading...</Text>
  </View>:null}
{!loading && EventsList.length != 0? <View style={{flexDirection:"column",flex:1}}>
  <ScrollView 
keyboardShouldPersistTaps="always"style={{flex:1}} >
  <View style={{flexDirection:"column",width:width,padding:15,paddingBottom:80}}>
{EventsList.map((a,i,self)=><View

    key={i} style={{justifyContent:"center",borderBottomWidth:0.5,borderBottomColor:"#ccc",flexDirection:"column",marginBottom:10,backgroundColor:"#fff"}} >
   <View style={{height:90,justifyContent:"center",alignItems:"center",borderBottomWidth:0.5,borderBottomColor:"#ccc",flexDirection:"column",marginBottom:10,backgroundColor:"#ccc"}} >
   <Image source={{uri:a.main_image}}  style={{width:width-20,height:90}} />
   <View style={{width:width-20,justifyContent:"center",flexDirection:"column",position:"absolute",bottom:10,left:20}} >
   <Text style={{fontSize:14,color:"#fff",fontWeight:"bold", textShadowColor: 'rgba(0, 0, 0, 0.75)',
  textShadowOffset: {width: -1, height: 1},
  textShadowRadius: 5}}>{a.name}</Text> 
   </View> 
   </View>
   <View  style={{flexDirection:"column",padding:15,paddingTop:0}} >
<Text style={{fontSize:14,color:"#000",fontWeight:"bold"}}>Tickets</Text> 
<View style={{flexDirection:"row",flexWrap:"wrap"}}>
{/*a.ticket.map((b,i)=><View key={i} style={{alignSelf:"center",flexDirection:"row",margin:5,backgroundColor:"#d5f0de",padding:5}}>
<Icon.Entypo name="ticket" color={"red"} size={20} />
<Text style={{fontSize:12,color:"#000",marginLeft:5}}>{String(b.ticket_name).toUpperCase()} : NGN{b.ticket_price} - QTY: {b.ticket_qty}</Text> 
</View>)*/}
       </View>
   <Text style={{fontSize:14,color:"#000"}}>{a.description}</Text> 
   <View style={{flexDirection:"row",alignItems:"center",borderBottomColor:"#ccc",borderBottomWidth:0.5,padding:5}}>
    <Icon.FontAwesome name="map-marker" color={"red"} />
   <Text style={{fontSize:12,color:"#000",marginLeft:5}}>{a.address}</Text> 
   </View>
   {a.website != null?<View style={{flexDirection:"row",alignItems:"center",borderBottomColor:"#ccc",borderBottomWidth:0.5,padding:5}}>
    <Icon.Entypo name="globe" color={"red"} />
   <Text style={{fontSize:12,color:"#000",marginLeft:5}}>{a.website}</Text> 
   </View>:null}
   <View style={{flexDirection:"row",alignItems:"center",borderBottomColor:"#ccc",borderBottomWidth:0.5,padding:5}}>
    <Icon.Entypo name="phone" color={"red"} />
   <Text style={{fontSize:12,color:"#000",marginLeft:5}}>{a.tel}</Text> 
   </View>
   <View style={{flexDirection:"row",alignItems:"center",borderBottomColor:"#ccc",borderBottomWidth:0.5,padding:5}}>
   <Text style={{fontSize:12,color:"#000",marginLeft:5}}>Created: {a.created_at}</Text> 
   </View>
   </View>
    </View>)}
{["","","","",""].filter((a,i)=>i < (5-EventsList.length)).map((a,i)=><View key={i} style={[mystyle.card,{width:width-20,padding:10,minHeight:50,borderRadius:10,marginTop:10,alignSelf:"center",flexDirection:"column"}]}>
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
      this.props.navigation.reset({
        index:0,
        routes:[{name:'myservices',params:{createvent:true}}],
      })
    //  Actions.navigate("replace("myservices",{createvent:true});
    }} style={[{width:180,height:40,backgroundColor:mystyle.active.color,justifyContent:"center",alignItems:"center",borderRadius:5,elevation:5,flexDirection:"row"}]}>
    <Text style={{color:"white",fontSize:16}}>Create an event</Text>
    </TouchableOpacity>
</View>
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
<View style={{position:"absolute",bottom:80,width:width,alignItems:"center"}}>
<TouchableOpacity 
     onPress={()=>{
        // Actions.replace("myservices",{createvent:true});
        this.props.navigation.reset({
          index:0,
          routes:[{name:'myservices',params:{createvent:true}}],
        })
    }} style={[{width:180,height:40,backgroundColor:mystyle.active.color,justifyContent:"center",alignItems:"center",borderRadius:5,elevation:5,flexDirection:"row"}]}>
    <Text style={{color:"white",fontSize:16}}>Create an event</Text>
    </TouchableOpacity>
</View>
</View>}

    </View>)
    }
}
MyServicesClass.defaultProps = {
 
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(MyServicesClass);

