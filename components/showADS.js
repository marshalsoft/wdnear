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
    TextInput,
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
    TimePickerAndroid,
    DeviceEventEmitter,
    Alert,
    KeyboardAvoidingView,
    Modal 
  } from 'react-native';
    import { connect } from 'react-redux';

const {width,height} = Dimensions.get("window");

const ADSClass =({list,size = 80,props})=>{
const [counter,SetCounter] = React.useState(0);
var sliD = React.useRef(null);

return list.length == 0?null:<View 
onLayout={()=>{
if(list.length != 0)
{
setInterval(()=>{
    try {
        this.sliD.scrollTo({x:counter*(width-20),y:0,animation:true});
        if(counter == list.length-1)
        {
            SetCounter(0)
        }else{
         SetCounter(counter+1)
        }   
    } catch (error) {
        
    }
 },3000)
}
}}
style={{width:width-20,margin:10,height:size,justifyContent:"center",flexDirection:"row"}}>
<ScrollView
style={{width:width-20,height:size}} // =====> the container will be height 300
horizontal
pagingEnabled
ref={sliD}
showsHorizontalScrollIndicator={false}
showsVerticalScrollIndicator={false}
>
{list.map((a,i)=><TouchableOpacity
onPress={()=>{
console.log(a.banner_image)
try{
a.image = {uri:a.banner_image["200_200"].url};
props.dispatch({type:"update",value:{showADS:true,adsImage:a,showPrompt:false}})
}catch(e)
{
  // a.image = require("../images/placeholder2.png");
}
}}
key={i}
style={{width:width-20,height:size,justifyContent:"center",flexDirection:"row",backgroundColor:"#eee"}}>
<View style={{width:width-20,height:size,justifyContent:"center"}}>
<Image source={{uri:a.banner_image["200_200"].url}} style={{width:width-20,height:size}} resizeMode="cover" />
</View>
<Text style={{position:"absolute",left:10,bottom:10,color:"white",fontSize:10,
textShadowColor:"#444",
textShadowOffset:{width:1, height:1},
textShadowRadius:2}}>{a?.title}</Text>
</TouchableOpacity>)}
</ScrollView>
<Text style={{position:"absolute",left:10,top:10,color:"white",fontSize:9,
textShadowColor:"#444",
textShadowOffset:{width:1, height:1},
textShadowRadius:2}}>Ads ({list.length})</Text>
</View>
}

const mapDispatchToProps = (state)=>{
    return state;
}
export default connect(mapDispatchToProps)(ADSClass);
