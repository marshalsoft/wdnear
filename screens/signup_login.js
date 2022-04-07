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
    import mystyle from '../includes/mystyle';
const {width,height} = Dimensions.get("window");
import { connect } from 'react-redux';

class SignClass extends PureComponent{
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
return(<View style={mystyle.window} >
<View style={{flex:1,flexDirection:"column",alignItems:"center",justifyContent:"center",backgroundColor:"white"}}>
<Image source={require("../images/signup-img.png")} style={{width:width,height:width-115}} resizeMode="stretch" />
<TouchableOpacity
      onPress={()=>{
          this.props.navigation.reset({
            index:0,
            routes:[{name:'login'}]
          })
        }} style={[mystyle.btn,{width:180}]}>
    <Text style={mystyle.whitetxt}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity
      onPress={()=>{
        this.props.navigation.navigate('numberscreen')
        // Actions.numberscreen();//"numberscreen",{goback:"signup_login"});
        }} style={[mystyle.btninactive,{width:180,marginVertical:20}]}>
    <Text style={{fontWeight:"bold"}}>Sign up</Text>
      </TouchableOpacity>
</View>
</View>
)
    }
}
SignClass.defaultProps = {
 
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(SignClass);

