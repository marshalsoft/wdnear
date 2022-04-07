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
    DeviceEventEmitter,
    Image,
    Slider,
    Modal } from 'react-native';
    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';

const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import Loader from '../components/loader';
import {returnAllNumbers,postDATA,sendEmail,postTEST,returnComma} from '../includes/func';

class WhatsnewClass extends PureComponent{
    componentDidMount()
    {
        this.Bk = BackHandler.addEventListener("hardwareBackPress",()=>{
            Actions.goBack();
            return true;
        })
     
     }
   
  
    constructor(props)
    {
        super(props);
        this.state = {
            showLoader:false,
            isProcessing:true,
            errorInfo:"Please wait...",
            success:false,
            loading:false,
            kyUp:false,
            numberOfMonths:"1"
        }
    }
 
componentWillUnmount()
{
if(this.Bk)
{
    this.Bk.remove();
}
}

render() 
{
const {numberOfMonths} = this.state;
const plans = [
    {
        plan:"Basic",
        month:1
    }
];

return(<View style={[mystyle.window,{backgroundColor:"white"}]} >
<View style={{width:width,height:70,justifyContent:"center",alignItems:"center",backgroundColor:mystyle.active.color}}>
<TouchableOpacity onPress={()=>{
Actions.goBack();
}} style={[{width:40,height:70,justifyContent:"center",alignItems:"center",position:"absolute",top:0,left:0,zIndex:99}]}>
<Icon.MaterialIcons color={"white"} name="keyboard-arrow-left" size={30} />
</TouchableOpacity>
<View >
<Text style={{color:"white",fontSize:18}}>Subscription</Text>
</View>
</View>
<ScrollView 
keyboardShouldPersistTaps="always"
ref={e=>this.ScrolV=e}
onContentSizeChange={()=>{
if(this.state.kyUp)
{
    this.ScrolV.scrollToEnd({animated:true}) 
}
}}
style={{width:width,height:height}} >
<View style={{width:width,height:height-130,alignItems:"center",justifyContent:"center"}}>
{plans.map((a,i,self)=><View key={i} style={[mystyle.card,{width:width-50,marginHorizontal:5,height:380,alignItems:"center",padding:20,flexDirection:"column",backgroundColor:a.color,elevation:1}]} >
<Text style={{fontSize:18,fontWeight:"bold"}}>Package Name: {a.plan}</Text>
<Text style={{fontSize:18,fontWeight:"bold"}}>Duration: {numberOfMonths == ""?"1":numberOfMonths} Month{`${parseInt(numberOfMonths) > 1?"s":""}`}</Text>
<Text style={{fontSize:16,color:mystyle.active.color}}>NGN{numberOfMonths == ""?this.props.subscription_fee:returnComma(`${parseInt(this.props.subscription_fee)*parseInt(numberOfMonths)}`)}</Text>
<View style={{flex:1,alignItems:'center',paddingVertical:10}}>
    <Text style={{textAlign:"center"}}>If you select this billing plan, your service will run for a period of {numberOfMonths == ""?"1":numberOfMonths} Month{`${parseInt(numberOfMonths) > 1?"s":""}`} before you have to pay again.</Text>
</View>
<View style={{flex:1,alignItems:'center',paddingVertical:10}}>
    <Text style={{textAlign:"center",color:"#d18583"}}>Enter number of month you want to subscribe for.</Text>
</View>
<View style={{flex:1,alignItems:'center',paddingVertical:10}}>
<View style={[mystyle.regInput,{width:width-100,alignItems:"flex-start",height:50}]}>
<TextInput 
    keyboardType="number-pad"
    maxLength={2}
    placeholder="Enter number of months here..."
    multiline
    onChangeText={(d)=>{
        if(d == "")
        {
       this.setState({numberOfMonths:""});
       return ;
        }
       this.setState({numberOfMonths:String(d).replace(/[^0-9]/,'')});
    }}
    value={this.state.numberOfMonths}
    onFocus={()=>this.setState({kyUp:true})}
    onBlur={()=>this.setState({kyUp:false})}
    style={{fontSize:this.state.numberOfMonths == ""?14:20,flex:1,paddingHorizontal:10,textAlignVertical:"top",textAlign:"left",height:50}}
    />
</View>
</View>
<TouchableOpacity
onPress={()=>{
    if(this.state.numberOfMonths == "")
    {
      alert("Please enter a valid number of month(s).");
    }else{
    Actions.bank_details({
        screen_route:"menu",
        module_endpoint:null,
        save_endpoint:"payment/paySubscription",
        params:{
          packageName:"basic",
          numberOfMonth:this.state.numberOfMonths,
          image:""
        },
        action:"service",
        memo:`Payment of NGN${returnComma(parseInt(this.state.numberOfMonths)* parseInt(this.props.subscription_fee))} for new service plan of ${this.state.numberOfMonths} Month(s).`,
        amount:parseInt(this.state.numberOfMonths)* parseInt(this.props.subscription_fee)
    });
}
}}
style={[mystyle.btn,{height:40,padding:5,width:"100%",justifyContent:"center",alignItems:"center",marginTop:50}]}>
<Text style={{fontSize:12,color:"white"}}>Subscribe Now</Text>
</TouchableOpacity>
</View>)}  
</View>
{this.state.kyUp?<View style={{width:width,height:180}}></View>:null}
</ScrollView>

<Loader 
{...this.state}
returnData={(d)=>{
this.setState(d);
if(this.state.success)
{
    Actions.goBack();
}
}} />
</View>)
    }
}
WhatsnewClass.defaultProps = {
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(WhatsnewClass);

