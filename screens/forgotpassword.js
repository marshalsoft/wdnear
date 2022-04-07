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
import Loader from '../components/loader';
import Country from '../includes/countries';
import {Emailvalidate,postDATA} from '../includes/func';

class ForgotClass extends PureComponent{
    componentDidMount()
    {
        
     }
    constructor(props)
    {
        super(props);
        this.state = {
            mobile:"",
            showLoader:false,
            isProcessing:true,
            errorInfo:"Please wait...",
            success:false,
            kyUp:false,
            firstname:"",
            lastname:"",
            email:""
        }
    }
 
componentWillUnmount()
{

}

render() 
{
const {email} = this.state;
const Actions = this.props.navigation;

return(<View style={[mystyle.window,{backgroundColor:"white"}]} >
<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
<TouchableOpacity onPress={()=>{
Actions.goBack();
}} style={[{width:60,height:60,justifyContent:"center",alignItems:"center",position:"absolute",top:0,left:0,zIndex:99}]}>
<Icon.MaterialIcons color={mystyle.active.color} name="keyboard-arrow-left" size={30} />
</TouchableOpacity>
<ScrollView 
keyboardShouldPersistTaps="always"style={{flex:1}} >
<View style={{width:width,minHeight:height,justifyContent:"center",alignItems:"center",flexDirection:"column"}} >

<View style={{justifyContent:"center",padding:10}}>
<Text style={[mystyle.active,{fontSize:16}]}>Reset password</Text>
</View>
<View style={[mystyle.regInput,{width:width-90}]}>
<TextInput 
    autoCapitalize={false}
    keyboardType="default"
    placeholder="Enter your email address..."
    onChangeText={(d)=>this.setState({email:String(d).trim()})}
    value={this.state.email}
    onFocus={()=>this.setState({kyUp:true})}
    onBlur={()=>this.setState({kyUp:false})}
    style={{fontSize:18,flex:1,textAlignVertical:"top",textAlign:"center",paddingHorizontal:10}}
    />
</View>
<View style={{width:width,marginTop:30,justifyContent:"center",alignItems:"center",flexDirection:"row"}} >
<TouchableOpacity onPress={()=>{
    if(String(this.state.email).trim() == "")
    {
       this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter your email addresss."})
    }else if(!Emailvalidate(String(this.state.email).trim()))
    {
    this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter a valid email."})
    }else{
    this.setState({showLoader:true,isProcessing:true,success:false,errorInfo:"Please wait..."})
    var data = {login:String(this.state.email).trim(),image:""};
    postDATA("user/forgotPassword",data).then((res)=>{
        res.message = "";
     if(res.errors != undefined)
     {
         var msg = "";
         for(var x in res.errors)
         {
            msg += `${res.errors[x]}\n `;
         }
         res.message = msg;
     }
     this.setState({showLoader:true,isProcessing:false,success:parseInt(res.success) == 1,errorInfo:parseInt(res.success) == 1?"A link has been sent to your email address, use the following link within the next day to reset your password.":res.message})
    })
    }
    }} style={[{width:70,height:70,backgroundColor:mystyle.active.color,justifyContent:"center",alignItems:"center",borderRadius:60,elevation:5}]}>
    <Icon.MaterialIcons name="keyboard-arrow-right" color={"white"} size={30} />
    </TouchableOpacity>
</View>
{this.state.kyUp?<View style={{height:210,width:width-50}}></View>:null}
</View>
</ScrollView>
</View>
<Country 
{...this.state}
returnData={(d)=>{
this.setState(d);
}} />
<Loader 
{...this.state}
returnData={(d)=>{
this.setState(d);
}} />
</View>)
    }
}
ForgotClass.defaultProps = {
    mobile:""
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(ForgotClass);

