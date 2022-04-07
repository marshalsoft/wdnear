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
    import Loader from '../components/loader';

class EditServiceClass extends PureComponent{
    componentDidMount()
    {
     
     }
    constructor(props)
    {
        super(props);
        this.state = {
            ServiceList:[],
            post_name:"",
            post_address:"",
            showLoader:false,
            errorInfo:"",
            success:false
        }
    }
 
componentWillUnmount()
{

}

render() 
{
const {img,title} = this.props?.route?.params;
return(<View style={mystyle.window} >
   <ScrollView 
keyboardShouldPersistTaps="always"style={{flex:1}} >
<View style={{flexDirection:"column",width:width}}>
<View style={{flexDirection:"column",width:width,height:240,backgroundColor:"#ccc"}}>
 <Image source={img}  style={{width:width,height:240}} resizeMode="cover" />
 <View style={{flexDirection:"column",width:width,height:240,backgroundColor:"rgba(0,0,0,0.4)",position:"absolute"}}>
</View>
 <TouchableOpacity 
         onPress={()=>{
          const Actions = this.props.navigation;
           Actions.goBack();
         }}
         style={{width:50,height:60,justifyContent:"center",alignItems:"center",position:"absolute",top:0,left:0}} >
           <Icon.MaterialIcons name="keyboard-arrow-left"  size={30} color="white" />
         </TouchableOpacity> 
         <View style={{flexDirection:"column",position:"absolute",top:20,left:60}}>
        <Text style={{color:"white",fontWeight:"bold"}}>{String(title).toUpperCase()}</Text>
        </View>     
    </View>
<View style={{flexDirection:"column",width:width,padding:15}}>
<Text style={{color:"black",fontWeight:"bold"}}>Info</Text>
<Text style={{color:"black"}}>Name:</Text>
<View style={[mystyle.regInput,{width:width-50}]}>
<TextInput 
    keyboardType="default"
    placeholder="Name...."
    onChangeText={(d)=>this.setState({post_name:d})}
    value={this.state.post_name}
    onFocus={()=>this.setState({kyUp:true})}
    onBlur={()=>this.setState({kyUp:false})}
    style={{fontSize:18,flex:1,textAlignVertical:"top",textAlign:"left"}}
    />
</View>

<Text style={{color:"black"}}>Address:</Text>
<View style={[mystyle.regInput,{width:width-50}]}>
<TextInput 
    keyboardType="default"
    placeholder="Address..."
    multiline
    maxLength={100}
    onChangeText={(d)=>this.setState({post_address:d})}
    value={this.state.post_address}
    onFocus={()=>this.setState({kyUp:true})}
    onBlur={()=>this.setState({kyUp:false})}
    style={{fontSize:14,flex:1,textAlignVertical:"top",textAlign:"left",minHeight:80}}
    />
</View>

</View>
<View style={{flexDirection:"column",width:width-30,alignItems:"center"}}>
<TouchableOpacity 
     onPress={()=>{
        if(this.state.post_name == "")
        {
        this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter name, thanks."})
        }else if(this.state.post_address == "")
        {
        this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter address, thanks."})
        }else{
        this.setState({showLoader:true,isProcessing:true,success:false,errorInfo:"Please wait..."})
          setTimeout(()=>{
        this.setState({showLoader:true,isProcessing:true,success:false,errorInfo:"Api not ready"})
          },1000)
        }
    }} style={[{width:100,height:50,marginTop:20,backgroundColor:mystyle.active.color,justifyContent:"center",alignItems:"center",borderRadius:5,elevation:5,flexDirection:"row"}]}>
    <Text style={{color:"white",fontSize:18,marginHorizontal:10}}>Edit</Text>
    </TouchableOpacity>
  </View>
   </View>
   </ScrollView>
   <Loader 
{...this.state}
returnData={(d)=>{
this.setState(d);
}} />
    </View>)
    }
}
EditServiceClass.defaultProps = {
 img:{uri:null},
 name:""
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(EditServiceClass);

