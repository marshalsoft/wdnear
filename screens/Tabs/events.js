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
    RefreshControl,
    ScrollView,
    Animated,
    Easing,
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
    Modal, 
    DeviceEventEmitter,
    PermissionsAndroid,
    Alert} from 'react-native';
    import Icon from '../../includes/icons';
    import mystyle from '../../includes/mystyle';
    import { Picker } from '@react-native-picker/picker';
    import {postDATA,getDATA,returnComma,calculateDistance} from '../../includes/func';
const {width,height} = Dimensions.get("window");
import Loader from '../../components/loader';
import { connect } from 'react-redux';
import storage from '@react-native-firebase/storage';
import firebase from 'firebase'; 
import FS from 'rn-fetch-blob';
import Moment from 'moment';
import * as Animatable from 'react-native-animatable';
import FileViewer from 'react-native-file-viewer';
import CameraRoll from '@react-native-community/cameraroll';

 class EventTabClass extends PureComponent{

        componentDidMount()
        {
          const Actions = this.props.navigation;
         this.setState({isProcessing:true,showLoader:true,success:false,errorTxt:"Please wait..."})
         this.getEvents();
        }
         getEvents()
         {
         postDATA("event/getAllEvents",{limit:50,
          page:this.state.nbrpages
        }).then((res)=>{
         console.log(res);
         var r = {};
         if(String(res.success).includes("1"))
        {
          var r = {nbrpages:0,current_page:1,per_page:12,first_nbr:0,nextpage:0,pages:[]};
          if(res.pagination != undefined)
          {
            var pages = [];
            r.eventPaging = res.pagination;
            for(var i = 0;i < parseInt(r.nbrpages);i++)
            {
            pages.push(`${i+1}`)
            }
            this.setState({eventPaging:pages});
          }
         if(`${res.result[0]}` == undefined)
         {
          this.setState({EventList:res.result})
         }else{
           var evnt = [];
           for(var g in res.result)
           {
             evnt.push(res.result[g]);
           }
          this.setState({EventList:evnt.map((a,i)=>{
            console.log(a);
            console.log(`${a.images["200_200"]}`);
            if(a.images["200_200"] != undefined)
            {
              try{
                a.main_image = a.images["200_200"].url;
              }catch(e){
                a.main_image = null;
              }
            }else{
              a.main_image = null;
            }
            if(a.ticket != undefined)
            {
              try{
                a.lat = a.latitude == undefined?a.lat:a.latitude;
                a.lng = a.longitude == undefined?a.lng:a.longitude;
                a.distance_from_me = returnComma(parseFloat(calculateDistance(a.lat,this.props.Reducer.latitude,a.lng,this.props.Reducer.longitude)).toFixed(0));
                a.ticket = String(a.ticket).replace(/["]/g,"").replace(/['']/g,'"');
                // console.log(a.ticket);
                a.ticket = JSON.parse(a.ticket);
              }catch(e){
                a.ticket = [];
              }
            }
            return a;
          })},()=>{
         console.log(this.state.EventList);
          })
         }
        }
        this.setState({refreshing:false,loadMore:false})
          })
         }
         componentWillUnmount()
         {
         }
          constructor(props)
          {
            super(props);
            this.state = {
            loadMore:false,
            setIndex:0,
            EventList:[],
            showLoader:false,
            isProcessing:false,
            refreshing:false,
            errorInfo:"Please wait...",
            success:false,
            current_page: 1,
            per_page: 1,
            count: 0,
            first_nbr: 0,
            nbrpages: 1,
            nextpage:-1,
            setpage:1,
            pages:[],
            eventPaging:[]
            }
            this.getEvents.bind();
          }
          
 render()
 {
  const {
    loadMore,
    showLoader,
    isProcessing,
    errorInfo,
    success,
    OfferList,
    setIndex,
    EventList,
    selectedCategory,
    current_page,
    per_page,
    count,
    first_nbr,
    nbrpages,
    nextpage,
    setpage
  } = this.state;
 
 return(<View 
  style={mystyle.window}>
 {this.state.EventList.length != 0?<View style={[mystyle.myalert,{}]}>
  <Text style={{fontSize:10}}>Swipe down to reload content</Text>
</View>:null}
   {EventList.length == 0?<View style={{flex:1}}>
<View style={[mystyle.myalert,{}]}>
  <Text>No content found!</Text>
</View>
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
</View>:<View style={{padding:10,backgroundColor:"white"}}>
     <Text>Buy tickets to your favorite events</Text>
   </View>}
  <FlatList
   refreshControl={<RefreshControl
   progressViewOffset={-20}
     refreshing={this.state.refreshing}
     onRefresh={()=>{
       this.setState({refreshing:true},()=>this.getEvents())
     }}
   />}
  contentContainerStyle={{paddingBottom:150}}
  keyExtractor={(item,index)=>`key${index}`}
  data={EventList}
  renderItem={({item,index})=><View
  style={[mystyle.card,{elevation:5,width:width-20,padding:0,minHeight:50,borderRadius:10,marginTop:10,alignSelf:"center",flexDirection:"column"}]}>
   <View style={{width:"100%",height:140,backgroundColor:"#444",marginBottom:5}}>
   <Image source={item.main_image == null?require("../../images/placeholder2.png"):{uri:item.main_image}} style={{width:"100%",height:140}} resizeMode="cover" />
  <View style={{width:"100%",height:140,position:"absolute",top:0,left:0,backgroundColor:"rgba(0,0,0,0.4)"}}>
  <View style={{flexDirection:"column",position:"absolute",position:"absolute",top:0,left:-13}}>
  {["","","","",""].map((d,o)=><View key={o} style={{width:20,height:20,borderRadius:30,backgroundColor:"rgba(255,255,255,0.7)",marginVertical:5}}></View>)}
 </View>
 <View style={{flexDirection:"column",position:"absolute",position:"absolute",top:0,right:-13}}>
  {["","","","",""].map((d,o)=><View key={o} style={{width:20,height:20,borderRadius:30,backgroundColor:"rgba(255,255,255,0.7)",marginVertical:5}}></View>)}
 </View>
 </View>
   <View style={{position:"absolute",bottom:0,left:0,padding:5,paddingLeft:20,flexDirection:"row"}}>
   <Icon.FontAwesome name="phone" color="#fbc004" size={20} />
   <Text style={{color:"white",marginHorizontal:2}}>{item?.tel}</Text>
   </View>
   <TouchableOpacity
   onPress={()=>{
   try
   {
  const Actions = this.props.navigation;
     Actions.navigate("map",{
       lt:item.lat,
       lg:item.lng,
       maptitle:item?.name,
       mapaddress:item?.address,
       mapimage:item?.main_image
     })
   }catch(e){}
    // alert(JSON.stringify(item.lng))
   }}
    style={{position:"absolute",bottom:0,right:0,padding:5,alignSelf:"center",backgroundColor:mystyle.active.color,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
   <Icon.FontAwesome name="map-marker" color="white" style={{marginRight:5}}/>
   <Text style={[mystyle.whitetxt,{fontSize:10}]}>view in map({item?.distance_from_me}m)</Text>
   </TouchableOpacity>
   </View>
   <View style={{width:"100%",flexDirection:"row"}}>
  <View style={{flex:1,flexDirection:"column",padding:15,paddingVertical:10}}>
  <View style={{width:"100%"}}>
    <Text numberOfLines={1} style={[mystyle.title]} ellipsizeMode="tail">{item?.name}</Text>
  </View>
  <View style={{width:"100%"}}>
    <Text numberOfLines={2} ellipsizeMode="tail" style={[mystyle.subtitle]}>{item?.description}</Text>
  </View>
  </View>
  <View style={{width:110}}>
  <TouchableOpacity 
  onPress={()=>{
  item.actual_price = item?.service_price;
  // console.log(item);
  // return ;
  const Actions = this.props.navigation;
  Actions.navigate("view_events",{event_data:item});
  }}
  activeOpacity={0.5}
  style={[mystyle.btn,{width:90,paddingVertical:5,marginTop:10}]}
  >
<Text style={{fontSize:12,color:"white"}}>Book Now</Text>
  </TouchableOpacity>
  </View>
  </View>
  </View>}
  ListFooterComponent={()=><View  style={{width:"100%",justifyContent:"center",alignItems:"center",backgroundColor:"white"}} >
  {loadMore?<View style={{width:"100%",justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
   <ActivityIndicator color={"red"} size="small" />
   <Text style={{fontSize:10,color:"red"}}> Loading more items...</Text>
 </View>:null}
 </View>}
 onEndReached={()=>{
   this.setState({loadMore:true,nbrpages:this.state.nbrpages+10},()=>this.getServices()); 
 }}
 onEndReachedThreshold={1}
  />
{/*  
<Loader 
{...this.state}
returnData={(d)=>{
this.setState(d);
}} /> */}
</View>)
        }
    }
const mapStateToProps = (state) => {
    return state;
 };
export default connect(mapStateToProps)(EventTabClass);
    