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
    import {postDATA,getDATA,returnComma,calculateDistance} from '../../includes/func';
const {width,height} = Dimensions.get("window");
import Loader from '../../components/loader';
import { connect } from 'react-redux';
import Moment from 'moment';
import * as Animatable from 'react-native-animatable';

 class OfferTabClass extends PureComponent{
 
        componentDidMount()
        {
         this.getOffers();
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
            OfferList:[],
            showLoader:false,
            isProcessing:true,
            refreshing:false,
            errorInfo:"Please wait...",
            success:false,
            selectedCategory:"",
            current_page: 1,
            per_page: 1,
            count: 0,
            first_nbr: 0,
            nbrpages: 1,
            nextpage:-1,
            setpage:1,
            pages:[],
            offerPaging:[]
            }
            this.getOffers.bind();
          }
          getOffers()
          {
          postDATA("offer/getAllOffers",{
           limit:50,
           page:this.state.nbrpages
       }).then((res)=>{
          console.log(res);
          this.setState({refreshing:false,loadMore:false},()=>{
         if(String(res.success).includes("1"))
         {
          console.log(res);
          var r = {nbrpages:0,current_page:1,per_page:12,first_nbr:0,nextpage:0,pages:[]};
          try
          {
            var pages = [];
            var dd = res.pagination;
            for(var i = 0;i < parseInt(dd.nbrpages);i++)
            {
            pages.push(`${i+1}`)
            }
            this.setState({offerPaging:pages});
          }catch(e){
 
          }
         var result = res.result.map((a,i)=>{
           a.images_list = a.images;
           a.product_name = a.name;
           a.lat = a.latitude == undefined?a.lat:a.latitude;
           a.lng = a.longitude == undefined?a.lng:a.longitude;
           delete a.name;
           a.distance_from_me = returnComma(parseFloat(calculateDistance(a.lat,this.props.Reducer.latitude,a.lng,this.props.Reducer.longitude)).toFixed(0));
           if(a.images)
           {
             if(a.images.length > 0)
             {
               if(a.images[0]["200_200"] != undefined)
               {
                 a.images = {uri:a.images[0]["200_200"].url}
               }else{
               a.images = {uri:null}
               }
             }else{
               a.images = {uri:null}
             }
           }
           return a;
         })
         this.setState({OfferList:result})
         }
          })
           })
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
  const banner_150 = this.props.Reducer.adsList.filter((a,i)=>String(a.banner_size) == "150")
  const banner_320 = this.props.Reducer.adsList.filter((a,i)=>String(a.banner_size) == "320")
  const banner_350 = this.props.Reducer.adsList.filter((a,i)=>String(a.banner_size) == "350")
// problem
  const ShowScreen = ["signup_login","login","new_service","edit_service","advert","bank_details","success","edit_product","code_verify","chat","event_type","event_more","advert","reg3","payment"].indexOf("k") == - 1;
  return(<View 
  style={mystyle.window}>
 {this.state.OfferList.length == 0?<View style={{flex:1}}>
  <View style={[mystyle.myalert,{}]}>
    <Text>No offer found!</Text>
  </View>
</View>:null}
{this.state.OfferList.length != 0?<View style={[mystyle.myalert,{}]}>
  <Text style={{fontSize:10}}>Swipe down to reload content</Text>
</View>:null}
<FlatList 
scrollEnabled={false}
contentContainerStyle={{paddingBottom:10}}
keyExtractor={(item,index)=>`${index}`}
data={this.state.OfferList}
renderItem={({item,index})=>{
  var a = Moment(item?.date_end);
  var b = Moment().utc();
  var days = a.diff(b,'days');
  var expired = days < 0;
return !expired?<TouchableOpacity 
 onPress={()=>{
  this.props.navigation.navigate("view_product",{productDetails:item});
 }}
 activeOpacity={0.9}
 style={[mystyle.card,{elevation:5,width:width-20,padding:0,minHeight:50,borderRadius:10,marginTop:10,alignSelf:"center",flexDirection:"column"}]}>
  <View style={{width:"100%",height:140,backgroundColor:"#444",marginBottom:5}}>
  <Image source={item?.images} style={{width:"100%",height:140}} resizeMode="cover" />
 <View style={{width:"100%",height:140,position:"absolute",top:0,left:0,backgroundColor:"rgba(0,0,0,0.2)"}}>
</View>
  <View style={{position:"absolute",left:0,top:0,padding:5,flexDirection:"row",backgroundColor:"#1170c7",width:56}}>
  <Text style={{color:"white",marginHorizontal:2,fontSize:10}}>featured</Text>
  </View>
  
  <View style={{position:"absolute",top:40,left:0,padding:5,flexDirection:"row"}}>
  <View style={{flex:1,flexDirection:"column"}}>
  <Text style={{color:"white",marginHorizontal:2}}>Initail Price</Text>
  <Text style={{color:"white",marginHorizontal:2,fontSize:20}}>NGN{returnComma(item?.actual_price)}</Text>
  </View>
  <View style={{flex:1,flexDirection:"column"}}>
  <Text style={{color:"white",marginHorizontal:2}}>Discounted Price</Text>
  <Text style={{color:"white",marginHorizontal:2,fontSize:20}}>NGN{returnComma(parseFloat(item?.actual_price) - (parseInt(item?.percent)/100)*parseFloat(item?.actual_price))}</Text>
  </View>
  </View>
  <View style={{position:"absolute",bottom:0,left:0,padding:5,flexDirection:"column",justifyContent:"center",width:"100%"}}>
  <View style={{flexDirection:"row"}}>
  <Text style={{color:"white",marginHorizontal:2}}>{item.percent}</Text>
  <Icon.FontAwesome name="percent" color="#ffffff" size={20} />
  <Text style={{color:"white",marginHorizontal:2}}> off</Text>
  <Text style={{color:"white",marginHorizontal:2}}> - ends - {Moment(item?.date_end).format("Do, MMM YYYY hh:mm a")}</Text>
</View>
<Animatable.Text animation="fadeOut" iterationCount="infinite" useNativeDriver style={{color:"yellow",fontSize:10}}>- {days} days to go -</Animatable.Text>
  </View>
  <View style={{position:"absolute",top:0,right:0,alignSelf:"center",backgroundColor:mystyle.active.color,flexDirection:"row"}}>
  <View style={{flex:1,padding:5,alignItems:"center"}}>
  <Text style={[mystyle.whitetxt,{fontSize:10}]}>offer in {item?.distance_from_me}m</Text>
  </View>
  <View style={{padding:5,width:60,backgroundColor:"#c4403c",alignItems:"center"}}>
  <Text style={[mystyle.whitetxt,{fontSize:10}]}>PROMO</Text>
  </View>
  </View>
  </View>
 <View style={{width:"100%",flexDirection:"row",padding:15,paddingVertical:10}}>
 <View style={{flex:1}}>
 <View style={{width:"100%"}}>
   <Text numberOfLines={1} style={[mystyle.title]} ellipsizeMode="tail">{item?.store_name}</Text>
 </View>
 <View style={{width:"100%"}}>
   <Text numberOfLines={1} ellipsizeMode="tail" style={[mystyle.subtitle]}>{String(item?.description).replace(/<[^>]*>?/gm, '')}</Text>
 </View>
 </View>
 <TouchableOpacity 
 onPress={()=>{
  // Linking.openURL("tel:"+this.props.support_phone)
}}
 style={{height:30,marginHorizontal:5,justifyContent:"center",alignItems:"center",width:70,backgroundColor:mystyle.active.color,borderRadius:40,elevation:3}}>
 <Text style={[mystyle.whitetxt,{fontSize:10}]}>More...</Text>
 </TouchableOpacity>
 </View>
 </TouchableOpacity>:null}
}

ListFooterComponent={()=><View  style={{width:"100%",justifyContent:"center",alignItems:"center",backgroundColor:"white"}} >
{loadMore?<View style={{width:"100%",justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
 <ActivityIndicator color={"red"} size="small" />
 <Text style={{fontSize:10,color:"red"}}> Loading more items...</Text>
</View>:null}
</View>}
onEndReached={()=>{
 this.setState({loadMore:true,nbrpages:this.state.nbrpages+10},()=>this.getOffers()); 
}}
onEndReachedThreshold={1}

/>

 <Loader 
{...this.state}
returnData={(d)=>{
this.setState(d);
}}
 />
</View>)
}
    }
    const mapStateToProps = (state) => {
        return state;
      };
    export default connect(mapStateToProps)(OfferTabClass);
    