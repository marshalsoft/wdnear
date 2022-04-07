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
import {returnAllNumbers,postDATA} from '../includes/func';
import MapView, { PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

class MapClass extends PureComponent{
    componentDidMount()
    {
     }
    constructor(props)
    {
        super(props);
        this.state = {
        }
    }
 
componentWillUnmount()
{

}

render() 
{
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
        <Text style={{fontSize:16,color:"#fff",fontWeight:"bold"}}>Map location</Text>
         </View>
         </View>
         <ScrollView 
keyboardShouldPersistTaps="always"style={{flex:1,backgroundColor:"#e4f1f8"}}>
           <View style={{flex:1,justifyContent:"center",alignItems:"center",paddingBottom:70}} >
 <MapView
     // remove if not using Google Maps
       style={{width:width,height:height-60}}
       initialRegion={{
         latitude:this.props.lt == null?parseFloat(this.props.latitude):parseFloat(this.props.lt),
         longitude:this.props.lg == null?parseFloat(this.props.longitude):parseFloat(this.props.lg),
         latitudeDelta: 0.0182,
         longitudeDelta: 0.3421
       }}
      //  region={{
      //    latitude:this.props.lt == null?parseFloat(this.props.latitude):parseFloat(this.props.lt),
      //    longitude:this.props.lg == null?parseFloat(this.props.longitude):parseFloat(this.props.lg),
      //    latitudeDelta:0.0922,
      //    longitudeDelta:0.0421
      //  }}
       showsUserLocation
       showsMyLocationButton
       provider={PROVIDER_GOOGLE}
       zoomEnabled={true}
       pitchEnabled={false}
       mapType="standard"
     >
       {[
        
        {
         latitude:this.props.lt == null?parseFloat(this.props.latitude):parseFloat(this.props.lt),
         longitude:this.props.lg == null?parseFloat(this.props.longitude):parseFloat(this.props.lg),
         maptitle:this.props.maptitle,
         address:this.props.mapaddress,
         image:this.props.mapimage
         },
         {
         latitude:parseFloat(this.props.latitude),
         longitude:parseFloat(this.props.longitude),
         maptitle:"My location",
         address:this.props.address,
          image:require("../images/pin.png")
        }
       ].map((a,i)=><MapView.Marker
       key={i}
      coordinate={{
        latitude:a.latitude,
        longitude:a.longitude
      }}
    >
    <TouchableOpacity 
    onPress={()=>{

    }}
    style={{flexDirection:"column",alignItems:"center",justifyContent:"center",marginTop:40}}>
    <Text style={{fontSize:10,width:100,fontWeight:"bold",textAlign:"center"}}>{a.maptitle}</Text>
    <Image source={a.image} style={{width:50,height:50}} resizeMode="stretch"/>
    <Text style={{fontSize:10,width:100}}>{a.address}</Text>
    </TouchableOpacity>
    </MapView.Marker>)}
    <MapViewDirections
    origin={{
         latitude:parseFloat(this.props.latitude),
         longitude:parseFloat(this.props.longitude),
        }}
    destination={{
         latitude:this.props.lt == null?parseFloat(this.props.latitude):parseFloat(this.props.lt),
         longitude:this.props.lg == null?parseFloat(this.props.longitude):parseFloat(this.props.lg),
         }}
    apikey={'AIzaSyD9l_dK7T-zV40LYZrmsoFTcsyfQ_em18g'}
    strokeWidth={5}
    strokeColor="rgba(255,0,0,1)"
  />
    {/* <MapView.Polyline
		coordinates={[
		{
         latitude:parseFloat(this.props.latitude),
         longitude:parseFloat(this.props.longitude),
        },
        {
         latitude:this.props.lt == null?parseFloat(this.props.latitude):parseFloat(this.props.lt),
         longitude:this.props.lg == null?parseFloat(this.props.longitude):parseFloat(this.props.lg),
         }
		]}
		strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
		strokeColors={[
			'#7F0000',
			'#7F0000'
		]}
		strokeWidth={4}
	/> */}
    </MapView>
     </View>
         </ScrollView>
    </View>)
    }
}
MapClass.defaultProps = {
  lt:null,
  lg:null,
  maptitle:"",
  mapaddress:""
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(MapClass);

