import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {Platform,
     StyleSheet,
     Image, 
     Text, 
     View,
     FlatList,
     TouchableOpacity,
    TextInput ,
    ScrollView,
    Animated,
    Easing,
    AsyncStorage,
    ActivityIndicator,
    Dimensions,
    BackAndroid,
    Modal } from 'react-native';
import Icons from './icons';
import mystyle from './mystyle';
const ListCountries = require("../json/country-by-flag");
const {width,height} = Dimensions.get("window");
const LoadCountriesClass  = ({returnData=()=>{},showCountryList = false})=> {
    const [countryList,SetcountryList] = React.useState([]);
    const [searchCountry,SetsearchCountry] = React.useState("");
    const [alhabet,Setalhabet] = React.useState([]);
    const [slideBack,SeTslideBack]= React.useState(false);
    React.useEffect(()=>{
    var  shw = [];
    var cCode =   ListCountries.map((a)=>{ 
    var chk = false;
    if(shw.indexOf(String(a.name)[0]) == -1)
    {
    chk = true;
    shw.push(String(a.name)[0]);
    }

    a.flag = a.flag.includes("data:image/png;base64,")?a.flag:"data:image/png;base64,"+a.flag;
    return {alpha:chk,...a}
    }).sort((a,b)=>{ 
         return a.name > b.name;
        })   
    // console.log(cCode);
    SetcountryList([...cCode])
    },[null])

return(<Modal 
    visible={showCountryList}
    onRequestClose={()=>{
      returnData({showCountryList:false});
    }}
    animationType="slide"
    transparent={false}
    style={{backgroundColor:"white"}}
    >
   <View style={{flex:1,backgroundColor:"white",flexDirection:"column"}}>
<View style={{height:50,marginBottom:10,flexDirection:"row",padding:10,alignItems:"center"}}>
<TouchableOpacity style={{width:30,justifyContent:"center",alignItems:"center"}} onPress={()=>{
   returnData({showCountryList:false});
    }}>
<Icons.AntDesign color="black" name="close" size={23} />
</TouchableOpacity>
<Text style={{marginLeft:15,fontWeight:"bold",width:"100%"}}>Select a country</Text>
</View>
<View style={{width:width,height:50,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
<Icons.Evilicons name="search" size={30} style={{margin:10}} />
<View style={{flex:1,borderColor:"#ccc",borderWidth:slideBack?0:1,backgroundColor:"#f7f7f7",borderRadius:20,margin:5}}>
<TextInput underlineColorAndroid="transparent" style={{flex:1,paddingHorizontal:15}} value={searchCountry} onChangeText={(text)=>{
var x = ListCountries.filter((v)=>String(v.name).toLowerCase().includes(String(text).toLowerCase()))
SetcountryList(text == ""?[...ListCountries]:[...x])
SetsearchCountry(text);
 }} 
 placeholder="search for a country ..." 
 />
{searchCountry != ""?<TouchableOpacity style={{alignSelf:"flex-end",position:"absolute",height:"100%",width:40,justifyContent:"center",alignItems:"center"}} onPress={()=>{ 
SetsearchCountry("")
SetcountryList([...ListCountries]);
}} >
<Icons.Ionicons color="black" name="md-close-circle" size={20} style={{ }} />
</TouchableOpacity>:null}
</View>
</View>
<View style={{flex:1,flexDirection:"column",marginTop:10}}>
<FlatList 
style={{flex:1}}
keyExtractor={(item,index)=>item.key = `key${index}`}
data={countryList}
renderItem={({item})=><View style={{flexDirection:"column",width:width,height:null,justifyContent:"center",alignItems:"center"}}>
    {item.alpha?<View style={{width:"100%",paddingLeft:30,paddingBottom:5,fontSize:30,fontWeight:"bold"}}>
    <Text style={{fontSize:20,fontWeight:"bold"}}>{String(item.name)[0]}</Text>
    </View>:null}
    <TouchableOpacity
onPress={()=>{
//  item.country = item.name;
returnData({showCountryList:false,selectedCountry:item,country:item.name});
}} style={{flexDirection:"row",width:width,height:60,paddingLeft:10,marginLeft:20}}>
 <Image source={{uri:item.flag}} resizeMode="stretch" style={{width:40,height:20,borderRadius:1,marginHorizontal:10,backgroundColor:"#ccc"}} /> 
<Text numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
</TouchableOpacity>
</View>}
/>
</View> 
</View>
</Modal>)
    }
    
export default LoadCountriesClass;