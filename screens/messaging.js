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
import ReturnADS  from '../components/showADS';

class TermsClass extends PureComponent{
    componentDidMount()
    {
     
     }
     
    constructor(props)
    {
        super(props);
        this.state = {
            searchTXT:"",
            loading:false
        }
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
return(<View style={[mystyle.window,{backgroundColor:"white",alignItems:"center"}]} >
    <View style={{height:60,width:width,backgroundColor:mystyle.active.color,flexDirection:"row"}}>
         <TouchableOpacity 
         onPress={()=>{
           Actions.goBack();
         }}
         style={{width:40,height:60,justifyContent:"center",alignItems:"center"}} >
           <Icon.MaterialIcons name="keyboard-arrow-left"  size={25} color="white" />
         </TouchableOpacity>
         <View style={{flex:1,justifyContent:"center",paddingLeft:10}}>
        <Text style={{fontSize:16,color:"#fff",fontWeight:"bold"}}>Messaging</Text>
         </View>
         </View>
   <ScrollView 
keyboardShouldPersistTaps="always"style={{flex:1}} >
   <View style={{flexDirection:"column",width:width,alignItems:"center"}}>
   <View style={[mystyle.regInput,{justifyContent:"center",width:width-40,height:50,elevation:3,overflow:"hidden",marginBottom:0}]}>
        <Icon.Evilicons name="search" size={40} style={{position:"absolute",top:10,left:10}} />
        <TextInput 
        placeholder="Search messages..."
        style={{width:"60%",marginLeft:40}}
        onChangeText={(d)=>{
        //  this.searchServices(d); 
        }}
        value={this.state.searchTXT}
        />
        {this.state.searchTXT != ""?<TouchableOpacity 
        onPress={()=>{
          this.setState({searchTXT:""})
        }}
        style={{position:"absolute",right:10}}>
          <Icon.AntDesign name="closecircle" size={20}/>
        </TouchableOpacity>:null}
        </View>
      {this.state.loading?<View style={{padding:5,paddingHorizontal:20,flexDirection:"row",justifyContent:"flex-start",alignItems:"flex-start",width:"100%"}}>
     <ActivityIndicator size="small" color="red" />
     <Text style={{marginLeft:6,fontSize:12}}>Fetching...</Text>
     </View>:null}
    <View style={[{width:width,height:1,flexDirection:"row",borderColor:"#444",borderBottomWidth:0.5,padding:10}]}>
    </View>
    <ReturnADS
        list={banner_150}
        size={80}
        />
    {["",""].map((a,i)=><TouchableOpacity key={i}
    onPress={()=>{
     Actions.chat();
    }} style={[{width:width,justifyContent:"center",flexDirection:"row",borderColor:"#444",borderBottomWidth:0.5,padding:10}]}>
    <View 
   style={{width:50,height:50,justifyContent:"center",alignItems:"center",borderRadius:50,borderColor:"#444",backgroundColor:"white",borderWidth:0.5,marginVertical:5}} >
   <Icon.AntDesign name="user"  size={20} color="black" />
  </View>
  <View 
   style={{flex:1,height:50,justifyContent:"center",marginHorizontal:10}} >
    <Text style={{color:"black",fontSize:16}}></Text>
    <Text style={{color:"black",fontSize:12}}></Text>
    </View>
    <View 
   style={{width:80,height:50,justifyContent:"center",alignItems:"center",paddingRight:10}} >
    <Text style={{color:"black",fontSize:12}}></Text>
   </View>
    </TouchableOpacity>)}
   </View>
   </ScrollView>
    </View>)
    }
}
TermsClass.defaultProps = {
 
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(TermsClass);

