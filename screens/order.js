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
import Login from '../screens/login';
import * as Animatable from 'react-native-animatable';

import {returnAllNumbers,postDATA} from '../includes/func';

class NotifyClass extends PureComponent{
    componentDidMount()
    {
     }
    constructor(props)
    {
        super(props);
        this.state = {
            loading:true
        }
    }
 
componentWillUnmount()
{

}

render() 
{
  const {notificationList} = this.state;
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
        <Text style={{fontSize:16,color:"#fff",fontWeight:"bold"}}>Place order</Text>
         </View>
         </View>
         <ScrollView 
keyboardShouldPersistTaps="always"style={{flex:1}}>
           <View style={{flex:1,justifyContent:"center",alignItems:"center",paddingBottom:70}} >
       
           </View>
         </ScrollView>
    </View>)
    }
}
NotifyClass.defaultProps = {
 
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(NotifyClass);

