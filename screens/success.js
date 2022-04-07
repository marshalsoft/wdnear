import React, {PureComponent} from 'react';
import {
  Platform,
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
    NativeModules,
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
    import LottieView from 'lottie-react-native';
const {width,height} = Dimensions.get("window");
import { connect } from 'react-redux';

class SuccessClass extends PureComponent{
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
const {success,errorInfo,navigation} = this.props;
const Actions = navigation;
return(<View style={mystyle.window} >
<View style={{flex:1,flexDirection:"column",alignItems:"center",justifyContent:"center",backgroundColor:"#e53934"}}>
<View style={{flex:4,paddingHorizontal:30,flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
{success?<LottieView source={require("../json/tick3.json")} 
autoPlay
loop={false}
speed={0.5}
hardwareAccelerationAndroid
autoSize
style={{width:80,height:80}}  />:<Icon.AntDesign name="closecircleo" color="white" size={40} />}
<Text style={{fontSize:20,color:"white",textAlign:"center",marginVertical:20}}>{errorInfo}</Text>
</View>
<View style={{flex:1,flexDirection:"column",alignItems:"center"}}>
<TouchableOpacity
style={{backgroundColor:"white",width:150,height:40,alignItems:"center",justifyContent:"center",elevation:5,borderRadius:50}}
onPress={()=>{
  if(this.props.innerPage)
  {
  this.props.returnData();
  }else{
    if(this.props.screen_route == "")
    {
    Actions.goBack();
    }else{
     Actions.jump(this.props.screen_route);
    }
    }
}}
>
 <Text>{success?"Done":"Cancel"}</Text>   
</TouchableOpacity>
</View>
</View>

</View>
)
    }
}
SuccessClass.defaultProps = {
  screen_route:"",
  success:false,
  errorInfo:"",
  innerPage:false,
  returnData:()=>null
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(SuccessClass);

