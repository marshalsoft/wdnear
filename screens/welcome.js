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
    Modal } from 'react-native';
    import Icon from '../includes/icons';
    import mystyle from '../includes/mystyle';
const {width,height} = Dimensions.get("window");
import { connect } from 'react-redux';

class LoginClass extends PureComponent{
    componentDidMount()
    {
         
     }
    constructor(props)
    {
        super(props);
        this.state = {
        }
    }

render() 
{
return(<View style={mystyle.window} >
<View style={{flex:1,flexDirection:"column",alignItems:"center",justifyContent:"center",backgroundColor:"white"}}>
<Image source={require("../images/back2.png")} style={{width:width,height:height,position:"absolute"}} resizeMode="cover" />
<View style={{flex:1,flexDirection:"column",position:"absolute",top:0,justifyContent:"center"}}>
<View style={{width:width,minHeight:150,backgroundColor:"rgba(255,255,255,0.4)",flexDirection:"column",alignItems:"center",justifyContent:"center",marginTop:70}}>
<Image source={require("../images/flashcrop.png")} style={{width:150,height:80}} resizeMode="stretch" />
</View>
<View style={{width:width-85,alignSelf:"center",marginTop:60,minHeight:150,flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
<Text style={[mystyle.whitetxt,{fontSize:25,fontWeight:"bold"}]}>
  Welcome to WeDeyNear  
</Text>
<Text style={[mystyle.whitetxt,{fontSize:16,textAlign:"center"}]}>
{`An innovative intelligent search app platform to connect with different services providers and clients in real time for trusted transactions instantly.`}
</Text>
<View style={{width:width-60,alignItems:"flex-end",flexDirection:"row"}} >
<View style={{flex:1}}></View>
    <Text style={[mystyle.active,{marginVertical:10}]}>Already a user?</Text>
</View>
<View style={{width:width-60,alignItems:"flex-end",flexDirection:"row"}} >
    <View style={{flex:1}}></View>
    <TouchableOpacity 
    onPress={()=>{
    this.props.navigation.reset({
        index:0,
        routes:[{name:'login'}],
      })
    }}
    style={[mystyle.btn,{width:110,height:30,padding:0}]}>
    <Text style={[mystyle.whitetxt]}>click here</Text>
    </TouchableOpacity>
</View>
<View style={{width:width,marginTop:50,justifyContent:"center",alignItems:"center",flexDirection:"row"}} >
<TouchableOpacity onPress={()=>{
        this.props.navigation.reset({
            index:0,
            routes:[{name:'signup_login'}],
          })
    }} style={[{width:70,height:70,backgroundColor:"white",justifyContent:"center",alignItems:"center",borderRadius:60,elevation:5}]}>
    <Icon.MaterialIcons name="keyboard-arrow-right" color={mystyle.active.color} size={35} />
    </TouchableOpacity>
</View>
</View>
</View>
</View>
</View>
)
    }
}
LoginClass.defaultProps = {
 
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(LoginClass);

