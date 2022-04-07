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
    Modal } from 'react-native';
    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';
   
const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import * as Animatable from 'react-native-animatable';


class LoaderScreen extends PureComponent{
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

return(<Modal 
visible={this.props.showLoader}
transparent={true}
animationType="none"
style={{flex:1}} 
onRequestClose={()=>{
if(!this.props.isProcessing)
{
this.props.returnData({showLoader:false});
}
}}
>
<TouchableWithoutFeedback
onPress={()=>{
    if(!this.props.isProcessing)
    {
        this.props.returnData({
            showLoader:false,
            isProcessing:false
        });
    }
}} style={{width:width,height:height}}> 
<View style={[mystyle.modalback]}>
    
    {this.props.isProcessing?<View style={[{width:100,height:100,justifyContent:"center",alignItems:"center"}]}>
        <ActivityIndicator color={mystyle.active.color} size="large" />
     </View>:<View style={{justifyContent:"center",alignItems:"center",flex:1}}>
     <View style={{justifyContent:"center",alignItems:"center",padding:10}}>
         <View style={[mystyle.card,{width:width-100,minHeight:50,justifyContent:"center",alignItems:"flex-start",padding:20}]}>
        <Text>{this.props.errorInfo}</Text>
     </View>
<TouchableOpacity
   onPress={()=>{
    if(!this.props.isProcessing)
    {
        this.props.returnData({
            showLoader:false,
            isProcessing:false
        });
    }
}}  
     style={{width:20,height:20,justifyContent:"center",alignItems:"center",position:"absolute",top:5,right:5,backgroundColor:"red",elevation:3,borderRadius:40}}>
    <Icon.AntDesign
     name="close" 
    color="white"
     size={20} />
</TouchableOpacity>
     </View>
    
     </View>}
</View>
</TouchableWithoutFeedback>   
</Modal>)
    }
}
LoaderScreen.defaultProps = {
    showLoader:false,
    isProcessing:true,
    errorInfo:"",
    success:false,
    returnData:()=>{}
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(LoaderScreen);

