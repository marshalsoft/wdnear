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
import * as Animatable from 'react-native-animatable';
import {returnAllNumbers} from '../includes/func';

class VerifyScreenClass extends PureComponent{
    componentDidMount()
    {
        
     }
    constructor(props)
    {
        super(props);
        this.state = {
            code1:"",
            code2:"",
            code3:"",
            code4:"",
            showLoader:false,
            isProcessing:true,
            errorInfo:"Please wait...",
            success:false
        }
    }
 
componentWillUnmount()
{

}

render() 
{
  const Actions = this.props.navigation;
const {code1,code2,code3,code4} = this.state;
return(<View style={[mystyle.window,{backgroundColor:"#e53934"}]} >
    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
    <TouchableOpacity onPress={()=>{
        Actions.goBack();
    }} style={[{width:60,height:60,justifyContent:"center",alignItems:"center",position:"absolute",top:0,left:0,zIndex:99}]}>
    <Icon.MaterialIcons color="white" name="keyboard-arrow-left" size={30} />
    </TouchableOpacity>
    <View style={{width:width,marginTop:30,justifyContent:"center",alignItems:"center",flexDirection:"row"}} >
</View>
<View >
    <Text style={{color:"white",fontSize:18,marginBottom:20}}>Enter verification code</Text>
</View>
<View style={[mystyle.codewrp,{marginTop:15,width:width-90}]}>
        <TextInput 
        maxLength={1} 
        value={this.state.code1} 
        ref={code=>this.code1 = code}
        onChangeText={(text)=>{
        text.length == 1 && text != ""?this.code2.focus():null;
        this.setState({code1:returnAllNumbers(text),
            code2:text.length == 1?"":this.state.code2})
        }}
        onFocus={()=>{
          this.setState({code1:""})
        }}
          keyboardType="phone-pad" 
           placeholder="0"
           style={[mystyle.codeInner,{}]} 
           underlineColorAndroid="transparent" />

         <TextInput  maxLength={1} ref={code=>this.code2 = code} value={this.state.code2} 
         onChangeText={(text)=>{
          text.length == 1 && text != ""?this.code3.focus():null;
          this.setState({code2:returnAllNumbers(text),code3:text.length == 1?"":this.state.code3,keyb:true,isProcessing:false})
           
          }}
          onFocus={()=>{
            this.setState({code2:""})
          }}
          onKeyPress={({nativeEvent})=>{
            if(nativeEvent.key == "Backspace" && this.state.code2 == "")
            {
              this.code1.focus();
            }
            }}
          keyboardType="phone-pad"     
          placeholder="0"
          style={[mystyle.codeInner,{}]} 
           underlineColorAndroid="transparent" />
         <TextInput maxLength={1} ref={code=>this.code3 = code} 
         value={this.state.code3} 
         onChangeText={(text)=>{
          text.length == 1 && text != ""?this.code4.focus():null;
          this.setState({code3:returnAllNumbers(text),code4:text.length == 1?"":this.state.code4,keyb:true,isProcessing:false})
          }}
          onFocus={()=>{
            this.setState({code3:""})
          }}
          onKeyPress={({nativeEvent})=>{
            if(nativeEvent.key == "Backspace" && this.state.code3 == "")
            {
              this.code2.focus();
            }
            }}
          keyboardType="phone-pad" 
          placeholder="0"
          style={[mystyle.codeInner,{}]} 
          underlineColorAndroid="transparent" />
         <TextInput maxLength={1} value={this.state.code4} 
         ref={code=>this.code4 = code} 
         onChangeText={(text)=>{
          this.setState({code4:returnAllNumbers(text)}) 
          }}
          onFocus={()=>{
            this.setState({code4:""})
          }}
          onKeyPress={({nativeEvent})=>{
            if(nativeEvent.key == "Backspace" && this.state.code4 == "")
            {
              this.code3.focus();
            }
            }}
          keyboardType="phone-pad"  
          placeholder="0"
          style={[mystyle.codeInner,{}]}         
          underlineColorAndroid="transparent" />  
   </View>    
<View style={{width:width,marginTop:60,justifyContent:"center",alignItems:"center",flexDirection:"row"}} >
<TouchableOpacity 
onPress={()=>{
if(String(`${code1}${code2}${code3}${code4}`) == "")
{
  this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter verification code, thanks."})
}else if(String(`${code1}${code2}${code3}${code4}`).length != 4)
{
  this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter code 4 digit code, thanks."})
}else{
  Actions.register({mobile:this.props.mobile});
}
    }} style={[{width:70,height:70,backgroundColor:"white",justifyContent:"center",alignItems:"center",borderRadius:60,elevation:5}]}>
<Icon.MaterialIcons name="keyboard-arrow-right" color={mystyle.active.color} size={30} />
</TouchableOpacity>
</View>
</View>
<Loader 
{...this.state}
returnData={(d)=>{
this.setState(d);
}}
    />
</View>)
    }
}
VerifyScreenClass.defaultProps = {
 mobile:""
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(VerifyScreenClass);

