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
     DeviceEventEmitter,
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
    import LottieView from 'lottie-react-native';
    const {width,height} = Dimensions.get("window");
    import Icon from '../includes/icons';
    
    class TermsClass extends PureComponent{
    componentDidMount()
    {
      setTimeout(()=>{
        DeviceEventEmitter.emit("ads",{});
       },6000)
     }
    constructor(props)
    {
        super(props);
        this.state = {
          terms:true,
          webloader:true,
          swtSect:false,
        }
    }
 
    componentWillUnmount()
    {

    }

  render() 
  {
    const css = `var x = $('.mu-menu-btn'); x.hide();`;
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
            <Text style={{fontSize:16,color:"#fff",fontWeight:"bold"}}>{this.state.terms?"Terms and conditions":"Policy"}</Text>
            </View>
            <TouchableOpacity 
            onPress={()=>{
              this.setState({terms:!this.state.terms,webloader:true})
            }}
            style={{width:90,height:60,justifyContent:"center",alignItems:"center"}} >
            <Text style={{fontSize:16,color:"#fff",fontWeight:"bold",opacity:0.5}}>{!this.state.terms?"Terms":"Policy"}</Text>
              </TouchableOpacity>
            </View>
    {this.state.swtSect?<View style={{padding:20}}>
    <Text style={{textAlign:"justify"}}>
    {`This page tells you the terms and conditions on which we supply our services described on our website www.wedeynear.com to you. \n
    Please read these terms and conditions carefully before using any Services from our website. By using any of our Services, you will be bound by these terms and conditions. Refusal to accept these Terms and Conditions will result in no Services from our website or mobile app being able to be used.
    `}</Text>
    <Text style={{fontWeight:"bold"}}>
    {`Our primary services are:`}</Text>
    <Text style={{textAlign:"justify"}}>
    {`A platform for all services providers to advertise/promote their services to their potential clients.An intelligent search engine for locating services
    \n
    We will not be liable for any financial transactions dealings between vendors and clients that happens outside our website or app.`}</Text>
    </View>:<View style={{padding:0,justifyContent:"center",alignItems:'center',height:height-100,width,overflow:"hidden"}}>
    <WebView 
      // mu-menu-btn
      javaScriptEnabled
      injectedJavaScript={css}
      source={{uri:this.state.terms?this.props.terms_and_condition:this.props.privacy_policy}}
      scalesPageToFit={true}
      useWebKit={false}
      onLoadEnd={()=>{
        this.setState({webloader:false});
      }} 
     style={{width,height:height-100}}
      ></WebView>
    {this.state.webloader?
    <View style={{width,height:height-100,flexDirection:"column",justifyContent:"center",alignItems:'center',position:"absolute",top:0,left:0,backgroundColor:"rgba(255,255,255,0.2)"}}>
    <LottieView style={{width:100}} source={require('../json/loader-b.json')} autoPlay loop />
    <Text style={{color:"black"}}>Loading...</Text>
    </View>:null}
    </View>}
    </View>)
  }
  
  }
  TermsClass.defaultProps = {
  
  }
  const mapStateToProps = (state) => {
    return state;
  };
  export default connect(mapStateToProps)(TermsClass);

