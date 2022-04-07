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
    import mystyle from '../includes/mystyle';
import Ratings from '../components/ratings';
import { connect } from 'react-redux';

class SuccessClass extends PureComponent{
    componentDidMount()
    {
     
     }

    constructor(props)
    {
        super(props);
        this.state = {
          showRating:false
        }
    
    }
 
componentWillUnmount()
{

}

render() 
{

return(<View style={mystyle.window} >
<View style={{flex:1,flexDirection:"column",alignItems:"center",justifyContent:"center",backgroundColor:"#e53934"}}>
<TouchableOpacity
style={{backgroundColor:"white",width:150,height:40,alignItems:"center",justifyContent:"center",elevation:5,borderRadius:50,marginVertical:20}}
onPress={()=>{
  this.setState({showRating:true})
}}
>
 <Text>Cancel</Text>   
</TouchableOpacity>
<Ratings 
returnData={(d)=>{
  this.setState(d);
}}
/>
</View>

</View>
)
    }
}
SuccessClass.defaultProps = {
  screen_route:"",
  success:false,
  errorInfo:""
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(SuccessClass);

