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
import { postDATA,PasswordStrength,returnComma,getDATA,returnMobile,returnAllNumbers,returnMask} from '../includes/func';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';

class RatingsClass extends PureComponent{
    componentDidMount()
    {
     
      }
    constructor(props)
    {
        super(props);
        this.state = {
            loading:true,
            showRating:false,
            ratings:[],
            showRat:true,
            selectedIndex:0,
            submitedValue:[],
            done:false,
            msg:"",
            starlist:[]
        }
    }
 sendRating()
 {
     var data = {
         image:"",
        store_id:parseInt(this.props.id_store),
        user_id:parseInt(this.props.id_user),
        rate:this.state.selectedIndex+1,
        review:JSON.stringify(this.state.submitedValue.filter((a,i)=>isNaN(a)))
      }
      console.log(data);
    //   return;
   this.setState({loading:true,showLoader:true,msg:"",done:false})
  postDATA("store/rateService",data).then((res)=>{
  console.log(res);
   this.setState({loading:false,msg:res.status?"Your rating was sucessful.":res.message,done:res.status})
  })
 }
componentWillUnmount()
{

}

render() 
{
const {showLoader,loading,done,msg,showRating,showRat,selectedIndex,submitedValue,starlist} = this.state;
    return(<View style={{justifyContent:"center",alignSelf:"center",flexDirection:"column",width:"100%"}}>
        <Text style={{width:"100%",textAlign:"center",fontSize:10}}>{this.props.text}</Text>
        <View style={{flexDirection:"row",width:"100%",justifyContent:"center",alignSelf:"center"}}>
         {["","","","",""].map((a,i)=><TouchableOpacity 
         onPress={()=>{
             this.setState({showRating:true,rate:a,showRat:true,submitedValue:[],selectedIndex:0})
         }}
         key={i}
         style={{marginHorizontal:2}}
         >
            <Icon.FontAwesome name="star" color={i <= parseInt(this.props.rating)?"#ffa300":"#ccc"} size={25}/>
         </TouchableOpacity>)}   
        </View>
        <Modal 
    visible={showRating}
    onRequestClose={()=>{
     this.setState({showRating:showLoader,showLoader:false})
    }}
   animationType="slide"
   transparent={true}
    >
   <ScrollView 
keyboardShouldPersistTaps="always"style={{flex:1,backgroundColor:"rgba(0,0,0,0.2)"}}>
  <View  style={{alignItems:"center",flex:1,justifyContent:"center",padding:15}}>
 <View style={[mystyle.card,{width:width-60,flexDirection:"column"}]}>
 <View  style={{alignItems:"center",width:width-60,justifyContent:"center"}}>
 <View  style={{alignItems:"center",padding:10,justifyContent:"center",backgroundColor:mystyle.active.color,height:120,width:width-60}}>
 <Text style={{color:"white",textAlign:"center",marginHorizontal:15}}>Tap on the stars below to rating the service</Text>
 {showRat?<View  style={{alignItems:"center",justifyContent:"center",height:50}}>
<LottieView source={require("../json/rating.json")} 
autoPlay
loop={false}
speed={2}
hardwareAccelerationAndroid
autoSize
style={{width:width,height:190}} 
onAnimationFinish={()=>{
    this.setState({showRat:false})
}}
/>
</View>:<View style={{flexDirection:"row"}}>
 {["","","","",""].map((a,i,self)=><TouchableOpacity 
  onPress={()=>{
   this.setState({selectedIndex:i,submitedValue:[i]})
  }}
  key={i}
  style={{margin:2,marginVertical:10}}
  >
  <Icon.FontAwesome name="star" color={selectedIndex <= (self.length-1) && selectedIndex >= i?"yellow":"white"} size={26}/>
  </TouchableOpacity>)}   
  </View>}
      </View>
<View  style={{alignItems:"center",width:width-60,justifyContent:"center",flexDirection:"column"}}>
<Text style={{color:"black",textAlign:"center",marginHorizontal:15,marginTop:15}}>I want report the service</Text>
<View  style={{alignItems:"center",justifyContent:"center",flexDirection:"column",padding:15,width:width-60,height:440}}>
 {[
     {tag:"I think it's a scam or phishing",sub:"Ex: someone asks for personal information or money or posts suspicious links"},
     {tag:"I think it's discriminatory, or supports discrimination or advocates",sub:"Ex: discriminates based off of age or sex"},
     {tag:"I think it's harassing or offensive",sub:"Ex: threats of violence or unwelcome advances"},
     {tag:"I think it shows or promotes extreme terrorism or violence",sub:"Ex: torture, rape or abuse, terrorist acts, or recruitment for terrorism"}
     ].map((a,i)=><Animatable.View
     animation="slideInRight"
     easing="ease-in-out-back"
     duration={500*(i+1)}
     useNativeDriver
     key={i} ><TouchableOpacity
     onPress={()=>{
        this.setState({selectedIndex:starlist.length,submitedValue:submitedValue.includes(a.tag)?submitedValue.filter((b,i)=>a.tag != b):[...submitedValue,a.tag]})
       }}
     style={[mystyle.card,{width:"100%",alignItems:"center",justifyContent:"center",flexDirection:"row",height:80,overflow:"hidden",marginBottom:10,elevation:3,borderWidth:0.1,backgroundColor:submitedValue.includes(a.tag)?"#ecfff7":"white"}]}>
<View style={{width:40,alignItems:"center",justifyContent:"center"}}>
{submitedValue.includes(a.tag)?<Icon.AntDesign name="checkcircle" size={20} color="limegreen" />:<Icon.Evilicons name="arrow-right" size={30} />}
</View>
<View style={{flex:1,flexDirection:"column"}}>
<Text style={{color:"#444",textAlign:"left",fontWeight:"bold"}}>{a.tag}</Text>
<Text style={{color:"#444",textAlign:"left",fontSize:12}}>{a.sub}</Text>
</View>
</TouchableOpacity>
</Animatable.View>)}
<TouchableOpacity
style={{backgroundColor:mystyle.active.color,width:150,height:40,alignItems:"center",justifyContent:"center",elevation:3,borderRadius:50,marginVertical:10}}
onPress={()=>{
  this.sendRating();
}}
>
 <Text style={{color:"white"}}>Submit</Text>   
</TouchableOpacity>

      </View>
      </View>
      <TouchableOpacity
   onPress={()=>{
    this.setState({showRating:false})
    }}  
     style={{width:20,height:20,justifyContent:"center",alignItems:"center",position:"absolute",top:5,right:5,backgroundColor:"white",elevation:3,borderRadius:40}}>
    <Icon.AntDesign
     name="close" 
    color="red"
     size={20} />
</TouchableOpacity>
{showLoader?<View style={{...StyleSheet.absoluteFill,backgroundColor:"rgba(0,0,0,0.2)",justifyContent:"center",alignItems:"center",elevation:4}}>
{loading?<ActivityIndicator size="large" color="red"/>:<View style={{...StyleSheet.absoluteFill,backgroundColor:"white",justifyContent:"center",alignItems:"center",padding:20}}>
{done?<Icon.Feather name="check-circle" size={40} color="limegreen" />:<Icon.AntDesign name="closecircleo" size={40} color="red" />}
<Text style={{textAlign:"center",fontSize:16}}>{this.state.msg}</Text>
<TouchableOpacity
style={{backgroundColor:mystyle.active.color,width:150,height:40,alignItems:"center",justifyContent:"center",elevation:3,borderRadius:50,marginVertical:20}}
onPress={()=>{
    this.setState({showLoader:false})
}}
>
 <Text style={{color:"white"}}>Close</Text>   
</TouchableOpacity>
</View>}
</View>:null}
</View>
 
      </View>
      
      </View>
      </ScrollView>
         </Modal>
      </View>
)
    }
}
RatingsClass.defaultProps = {
    text:"Tap on the stars to rate this service",
    rating:0
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(RatingsClass);

