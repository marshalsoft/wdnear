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
import * as Animatable from 'react-native-animatable';
import Moment from 'moment';

import {returnAllNumbers,postDATA,calculateDistance} from '../includes/func';

class ProductSearchCLass extends PureComponent{
    componentDidMount()
    {
      if(this.props?.route?.params?.searchTXT?.name != "")
      {
      this.searchServices(this.props?.route?.params?.searchTXT)
      }
     }
    constructor(props)
    {
        super(props);
        this.state = {
          searchTXT:"",
          searchList:[],
          loading:false,
          searchComplete:false,
          color:"",
          name:""
        }
    }
    searchServices(d)
    {
      this.setState({searchTXT:d,loading:true},()=>{
        postDATA("store/getServices",{search:d}).then((res)=>{
          console.log(res);
          this.setState({loading:false,searchList:res.result.map((a,i)=>{
            a.images_list = a.images;
            if(a.images)
            {
              if(a.images.length > 0)
              {
                try {
                  a.images = {uri:a.images[0]["200_200"].url}
                } catch (error) {
                a.images = {uri:null}
                }
              }else{
                a.images = {uri:null}
              }
            }
            return a;
          }),searchComplete:true}); 
        })
      })
    }
  
componentWillUnmount()
{

}

render() 
{
  const {color,name} = this.state
  const Actions = this.props.navigation;
return(<View style={mystyle.window} >
    <View style={{height:60,width:width,backgroundColor:color == ""?mystyle.active.color:color,flexDirection:"row"}}>
         <TouchableOpacity 
         onPress={()=>{
           Actions.goBack();
         }}
         style={{width:40,height:60,justifyContent:"center",alignItems:"center"}} >
           <Icon.MaterialIcons name="keyboard-arrow-left"  size={25} color="white" />
         </TouchableOpacity>
         <View style={{flex:1,justifyContent:"center",paddingHorizontal:10}}>
        <Text ellipsizeMode="tail" numberOfLines={1} style={{fontSize:16,color:"#fff",fontWeight:"bold"}}>{name == ""?"Service Search":"Searching Category: "+name}</Text>
         </View>
         </View>
         <ScrollView 
keyboardShouldPersistTaps="always"style={{flex:1}}>
        <View style={{flex:1,alignItems:"center",flexDirection:"column"}}>
        <View style={[mystyle.regInput,{justifyContent:"center",width:width-40,height:50,elevation:3,overflow:"hidden"}]}>
        <Icon.Evilicons name="search" size={40} style={{position:"absolute",top:10,left:10}} />
        <TextInput 
        placeholder="Search..."
        style={{width:"60%",marginLeft:40}}
        onChangeText={(d)=>{
         this.searchServices(d); 
        }}
        value={this.state.searchTXT}
        />
        {this.state.searchTXT != ""?<TouchableOpacity 
        onPress={()=>{
          this.setState({searchTXT:""})
        }}
        style={{position:"absolute",right:10}}>
          <Icon.AntDesign name="closecircle" size={20}/>
        </TouchableOpacity>:null}
        </View>
        {this.state.loading?<View style={{padding:5,paddingHorizontal:20,flexDirection:"row",justifyContent:"flex-start",alignItems:"flex-start",width:"100%"}}>
        <ActivityIndicator size="small" color="red" />
        <Text style={{marginLeft:6,fontSize:12}}>Fetching...</Text>
        </View>:null}
        {this.state.searchComplete?<View style={{padding:10,backgroundColor:"#ffeeee",width:"100%"}}>
<Text style={{fontSize:12}}>{this.state.searchList.length == 0?"Oops! No result found.":"Number of result found: "+this.state.searchList.length}</Text>
</View>:null}
<FlatList
      keyboardShouldPersistTaps="always"
      data={this.state.searchList}
      contentContainerStyle={{paddingBottom:50}}
      renderItem={({item,index})=><TouchableOpacity
     onPress={()=>{
    item.distance_from_me = parseFloat(calculateDistance(item.latitude,this.props.Reducer.latitude,item.longitude,this.props.Reducer.longitude)).toFixed(2);
    item.lat = item.latitude;
    item.lng = item.longitude;
    console.log(item);
    this.props.navigation.navigate("view_product",{productDetails:item});
        }}
        style={{width:width-20,flexDirection:"row",borderBottomWidth:0.5,borderBottomColor:"#444",marginBottom:10,backgroundColor:"white"}}>
          <View style={{width:90,height:60,backgroundColor:"#444"}}>
            <Image source={item.images} style={{width:90,height:60}} resizeMode="cover"/>
          </View>
          <View style={{flex:1,flexDirection:"column",paddingHorizontal:10}}>
            <Text style={{fontSize:14,fontWeight:"bold"}} ellipsizeMode="tail" numberOfLines={1} >{item.name}</Text>
            <Text  style={{fontSize:12}} ellipsizeMode="tail" numberOfLines={1}>{item.detail}</Text>
            <Text style={{fontSize:12,color:"red"}}>{item.category_name}</Text>
          </View>
          <View style={{width:30,height:60,alignItems:"center",justifyContent:"center"}}>
        <Icon.MaterialIcons name="keyboard-arrow-right" size={20}/>
          </View>
        </TouchableOpacity>}
       />
        </View>
        </ScrollView>
    </View>)
    }
}

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(ProductSearchCLass);

