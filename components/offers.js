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

class OfferClass extends PureComponent{

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
  return(<TouchableOpacity 
      onPress={()=>{
      }} style={{width:width-40,minHeight:90,backgroundColor:"#444"}} >

     </TouchableOpacity>);
  }
}
OfferClass.defaultProps = {
 
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(OfferClass);
