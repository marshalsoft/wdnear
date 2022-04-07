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
import ReturnADS  from '../components/showADS';
import { Picker } from '@react-native-picker/picker';
class HistoryClass extends PureComponent{
    componentDidMount()
    {
        // this.setState({historyList:["","","","","","","","","",""]})
     this.getHistory();
      }
    constructor(props)
    {
        super(props);
        this.state = {
            loading:true,
            showLogin:false,
            historyList:[]
        }
    }
 getHistory()
 {
   this.setState({loading:true})
  getDATA("payment/getHistory",{user_id:parseInt(this.props.id_user)}).then((res)=>{
  console.log(res);
   this.setState({loading:false})
    if(res.status)
    {
      this.setState({historyList:res.result.map((a,i)=>{
        a.totalAmount = a.amount;
        return a;
      })})
    }
  })
 }
 
componentWillUnmount()
{

}

render() 
{
  const banner_150 = this.props.adsList.filter((a,i)=>String(a.banner_size) == "150")
  const banner_320 = this.props.adsList.filter((a,i)=>String(a.banner_size) == "320")
  const banner_350 = this.props.adsList.filter((a,i)=>String(a.banner_size) == "350")
  const Actions = this.props.navigation;
  
    return(<View style={mystyle.window} >
        <View style={{height:50,width:width,backgroundColor:mystyle.active.color,flexDirection:"row"}}>
        <TouchableOpacity onPress={()=>{
Actions.goBack();
}} style={[{width:40,height:50,justifyContent:"center",alignItems:"center"}]}>
<Icon.MaterialIcons color={"white"} name="keyboard-arrow-left" size={30} />
</TouchableOpacity>  
            <View style={{flex:1,justifyContent:"center"}}>
              <Text style={{color:"white",fontSize:15,paddingLeft:15,fontWeight:"bold"}}>Payment History</Text>
            </View>
      <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center",height:40,width:80,overflow:"hidden"}}>
        {/* <Text>filter</Text>
        <Icon.AntDesign name="filter" size={20} style={{marginHorizontal:5}} />
      <Picker 
      mode="dropdown"
      style={{width:60,position:"absolute",right:-15}}>
        {["Service","Save card","Credit","Debit"].map((a,i)=><Picker.Item key={i} value={a} label={a} />)}
      </Picker> */}
      </View>
          </View>
         <ScrollView 
keyboardShouldPersistTaps="always"
         scrollEnabled={this.state.historyList.length == 0?false:true}
         style={{flex:1,padding:10}}>
         {this.state.historyList.length == 0?<View style={[mystyle.myalert,{width:width-40,height:40,borderRadius:10,marginTop:0,justifyContent:"center",alignItems:"center"}]}>
         {!this.state.loading?<View style={[mystyle.myalert,{width:width-40,height:40,borderRadius:10,marginTop:0,justifyContent:"center",alignItems:"center"}]}>
             <Icon.Ionicons name="ios-information-circle-outline"  style={{marginHorizontal:10}} size={20} />
             <View style={{flex:1}}>
             <Text>You don't have any payment History!</Text>
             </View>
             </View>:
             <View style={{flexDirection:"row",alignItems:"flex-start"}}>
               <ActivityIndicator size="small" color={mystyle.active.color} />
             <Text>Please wait...</Text>
               </View>}
         </View>:null}
         <ReturnADS
        list={banner_150}
        size={80}
        />
         {this.state.historyList.length == 0?<View style={{flex:1}}>

         {["","","","","","","",""].map((a,i)=><View key={i} style={[mystyle.card,{width:width-40,padding:10,minHeight:50,borderRadius:10,marginBottom:10,alignSelf:"center",flexDirection:"column"}]}>
             <View style={{width:"100%",height:10,backgroundColor:"#f3f3f3",marginVertical:5}}>

             </View>
             <View style={{width:"100%",height:10,backgroundColor:"#f3f3f3",marginVertical:5}}>

</View>
  </View>)}
         </View>:<View  style={{flex:1,flexDirection:"column"}}>
{this.state.historyList.map((a,i)=><View key={i} style={[mystyle.card,{width:width-40,padding:10,minHeight:50,borderRadius:10,marginTop:10,alignSelf:"center",flexDirection:"column",borderBottomWidth:2,borderBottomColor:"#ccc"}]}>
<Text style={{fontSize:16,fontWeight:"bold"}}>NGN{returnComma((a.totalAmount))}</Text>
<Text style={{fontSize:14}}>{a.card_reference}</Text>
<Text>{a.description}</Text>
<Text style={{fontSize:14}}>XXXX-XXXX-XXXX-{a.last_4}</Text>
<Text style={{fontSize:14}}>{a.date}</Text>
<TouchableOpacity 
onPress={()=>{
  console.log(a);
Actions.receipt(a)
}}
style={[mystyle.btn,{width:120,position:"absolute",bottom:40,right:0}]}
>
  <Text style={{color:"white",fontSize:10}}>Generate Receipt</Text>
</TouchableOpacity>
</View>)}
{["","","","","","","",""].filter((a,i,self)=>i < (self.length - this.state.historyList.length)).map((a,i)=><View key={i} style={[mystyle.card,{width:width-40,padding:10,minHeight:50,borderRadius:10,marginTop:10,alignSelf:"center",flexDirection:"column"}]}>
 <View style={{width:"100%",height:10,backgroundColor:"#f3f3f3",marginVertical:5}}>
</View>
<View style={{width:"100%",height:10,backgroundColor:"#f3f3f3",marginVertical:5}}>
</View>

 </View>)}
 </View>}
 <View style={{width:"100%",height:70}}>
</View>
        </ScrollView>
      </View>
)
    }
}
HistoryClass.defaultProps = {
 
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(HistoryClass);

