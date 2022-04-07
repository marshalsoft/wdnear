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
import { postDATA } from '../includes/func';

class AboutClass extends PureComponent{
    componentDidMount()
    {
        this.getSettings() ; 
     }
    constructor(props)
    {
        super(props);
        this.state = {
            paystack_payment:0,
            transaction_fee:0
        }
    }
 
componentWillUnmount()
{

}
getSettings()
{
    postDATA("payment/getPaymentSettings",{

    }).then((res)=>{
    if(res.status)
    {
        this.setState(res.result);
    }
    })
}
render() 
{
return(<View style={mystyle.window} >
    <ScrollView 
keyboardShouldPersistTaps="always" style={{flex:1}}>
   <View style={{width:width-20,padding:10}} >
   </View>
   </ScrollView>
</View>
)
    }
}
AboutClass.defaultProps = {
 
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(AboutClass);

