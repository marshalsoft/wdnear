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
    Dimensions
  } from 'react-native';
    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';
  
const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import Login from '../screens/login';
import * as Animatable from 'react-native-animatable';

import {returnAllNumbers,postDATA} from '../includes/func';

class TermsClass extends PureComponent{
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
        <Text style={{fontSize:16,color:"#fff",fontWeight:"bold"}}>About Us</Text>
         </View>
         </View>
   <ScrollView 
keyboardShouldPersistTaps="always"style={{flex:1}} >
   <View style={{flexDirection:"column",width:width,padding:15}}>
<Text style={mystyle.title}>About Us</Text>
<Text style={{marginBottom:5,textAlign:"justify"}}>WedeyNear is an app that intelligently searches for nearby services. It can also connect service providers and customers in real-time.</Text>
<Text style={{marginBottom:5,textAlign:"justify"}}>
Using WedeyNear, the customer can connect with the potential service providers and have their queries answered before setting out. Thereby avoiding unnecessary journeys.
</Text>
<Text style={{marginBottom:15,textAlign:"justify"}}>WedeyNear also benefits the service providers to showcase their services to a broader community. Other benefits to the service providers include targeted promotions and campaigns.</Text>
<Text style={mystyle.title}>Mission</Text>
<Text style={{marginBottom:15,textAlign:"justify"}}>To help clients to get the right locations for the services/products they need at the right time.</Text>
<Text style={mystyle.title}>Vision</Text>
<Text style={{marginBottom:5,textAlign:"justify"}}>To make locating local services as simple as ABC and help vendors/services providers connect better and quicker with potential customers.</Text>
<View style={{flexDirection:"column",width:width-30,alignItems:"center"}}>
<TouchableOpacity 
     onPress={()=>{
     Linking.openURL("tel:"+this.props.support_phone);
    }} style={[{width:width-90,height:50,marginTop:20,backgroundColor:mystyle.active.color,justifyContent:"center",alignItems:"center",borderRadius:60,elevation:5,flexDirection:"row"}]}>
    <Icon.FontAwesome name="phone" color="white" size={20} />
    <Text style={{color:"white",fontWeight:"bold",fontSize:18,marginHorizontal:10}}>Call Us</Text>
    </TouchableOpacity>
    <TouchableOpacity 
     onPress={()=>{
       var  url = "admin@wedeynear.com";
       if(this.props.support_email != "")
       {
        url = this.props.support_email;
       }
      //  alert(url)
        Linking.openURL("mailto:"+url);
    }} style={[{width:width-90,height:50,marginTop:20,marginBottom:50,backgroundColor:mystyle.active.color,justifyContent:"center",alignItems:"center",borderRadius:60,elevation:5,flexDirection:"row"}]}>
    <Icon.FontAwesome name="envelope" color="white" size={18} />
    <Text style={{color:"white",fontWeight:"bold",fontSize:18,marginHorizontal:10}}>Mail Us</Text>
    </TouchableOpacity>  
   </View>
   </View>
   </ScrollView>
    </View>)
    }
}
TermsClass.defaultProps = {
 
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(TermsClass);

