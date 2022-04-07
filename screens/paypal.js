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
    Alert,
    Image,
    RefreshControl,
    DeviceEventEmitter,
    Modal } from 'react-native';
    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';

const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import Loader from '../components/loader';

class PaypalClass extends PureComponent{
    componentDidMount()
    {
      this.setState({url:this.state.url+`${this.props.amount}USD`});
      BackHandler.addEventListener("hardwareBackPress",()=>{
        this.navBar();
        return true;
      })
     }
     navBar()
     {
      const Actions = this.props.navigation;
      if(this.state.canGoBack)
      {
       this.WV.goBack()
      }else{
         Actions.goBack();
      }
     }
    constructor(props)
    {
        super(props);
        this.state = {
            showLoader:true,
            loading:true,
            isProcessing:true,
            errorInfo:"Please wait...",
            success:false,
            refreshing:false,
            canGoBack: false,
            canGoForward: false,
            loading: true,
            target: 4177,
            title: "",
            url: "https://www.paypal.com/paypalme/marshalsoft/",
            currentPage:""
        }
    }
 
componentWillUnmount()
{

}

render() 
{
return(<View style={mystyle.window} >
    <View style={{height:60,width:width,backgroundColor:mystyle.active.color,flexDirection:"row"}}>
         <TouchableOpacity 
         onPress={()=>{
          this.navBar()
         }}
         style={{width:40,height:60,justifyContent:"center",alignItems:"center"}} >
           <Icon.MaterialIcons name="keyboard-arrow-left"  size={25} color="white" />
         </TouchableOpacity>
         <View style={{flex:1,justifyContent:"center",paddingLeft:10}}>
        <Text style={{fontSize:16,color:"#fff",fontWeight:"bold"}}>{this.state.canGoBack?this.state.title.includes("www.")?"loading...":this.state.title:"Pay with PayPal"}</Text>
         </View>
         </View>
 
<View style={{flexDirection:"column",flex:1}}>
  <ScrollView 
keyboardShouldPersistTaps="always"
  refreshControl={
    <RefreshControl
    progressViewOffset={-20}
      refreshing={this.state.refreshing}
      onRefresh={()=>{
        this.setState({refreshing:true})
      }}
    />}
  style={{height:height-100,width}} >
  <View style={{flexDirection:"column",height:height-100,width,padding:15,paddingTop:0}}>
   <WebView 
   ref={e=>this.WV=e}
   style={{height:height-100,width}}
   source={{uri:this.state.url}}
   onNavigationStateChange={(d)=>{
    console.log(d)
    d.isProcessing = d.loading;
    if(String(d.url).includes("signin?"))
    {
      d.isProcessing = false;
      d.showLoader = false;
      d.errorInfo = "Login with your PayPal Credentials to complete this transaction, Thanks";
    }else{
      d.showLoader = true;
      d.isProcessing = true;
    }
    d.currentPage = d.url;
    delete d.url;
    this.setState(d)
    }}
 
   
   >

   </WebView>
    </View>
 </ScrollView>
</View>
<Loader 
showLoader={this.state.showLoader}
isProcessing={this.state.loading}
errorInfo={this.state.errorInfo}
returnData={(d)=>{
this.setState(d);
}}
    />
    </View>)
    }
}
PaypalClass.defaultProps = {
  amount:""
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(PaypalClass);

