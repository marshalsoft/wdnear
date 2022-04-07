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
import {returnAllNumbers,postDATA} from '../includes/func';

class CategoryClass extends PureComponent{
    componentDidMount()
    {
      if(this.props.Reducer.categoryList.length == 0)
      {
        this.getCategory();
      }
    }
     getCategory()
     {
       this.setState({loader:true});
       var x = [];
      postDATA("category/getAllCategory",{}).then((res)=>{
       if(res.success == 1)
       {
        for(var o in res.result)
        {
          x.push(res.result[o]);
        }
       }
        this.setState({loader:false},()=>{
        this.props.dispatch({type:"update",value:{categoryList:x}})
        });

      })
     }
    constructor(props)
    {
        super(props);
        this.state = {
          loader:false
        }
        this.getCategory.bind();
    }
 
componentWillUnmount()
{

}

render() 
{

  const colors = ["#fbc004","#68ff98","#04a2fb","#fa8dff","#444","red"];
return(<View style={mystyle.window} >
    <View style={{height:60,width:width,backgroundColor:mystyle.active.color,flexDirection:"row"}}>
         <TouchableOpacity 
         onPress={()=>{
          const Actions = this.props.navigation;
           Actions.goBack();
         }}
         style={{width:40,height:60,justifyContent:"center",alignItems:"center"}} >
           <Icon.MaterialIcons name="keyboard-arrow-left"  size={25} color="white" />
         </TouchableOpacity>
         <View style={{flex:1,justifyContent:"center",paddingLeft:10}}>
        <Text style={{fontSize:16,color:"#fff",fontWeight:"bold"}}>Categories</Text>
         </View>
         </View>
         {this.state.loader?<View style={{flex:1,justifyContent:"center",alignItems:"center",paddingBottom:70,paddingTop:40,flexDirection:"row"}} >
          <ActivityIndicator size="large" />
          <Text> Loading</Text>
         </View>
         :<ScrollView 
         
  keyboardShouldPersistTaps="always"

style={{flex:1}}>
           <View style={{flex:1,justifyContent:"center",alignItems:"center",paddingBottom:70,paddingTop:10}} >
         {this.props.Reducer.categoryList.map((a,i,self)=>{
         a.color = a.color == null?colors[Math.floor(Math.random() * colors.length)]:"transparent";
         return <TouchableOpacity
         onPress={()=>{
         Actions.search({searchTXT:a});
         }}
         activeOpacity={0.7}
         key={i} style={{height:90,justifyContent:"center",alignItems:"center",borderBottomWidth:0.5,borderBottomColor:"#ccc",flexDirection:"column",marginBottom:10,backgroundColor:a.color}} >
        <View  style={{height:90,justifyContent:"center",alignItems:"center",flexDirection:"column",backgroundColor:"rgba(0,0,0,0.2)"}} >
        <Image source={{uri:a.image}}  style={{width:width-20,height:90}} />
        <View style={{height:90,paddingLeft:20,width:width-20,justifyContent:"center",flexDirection:"column",position:"absolute",top:0,left:0}} >
        <Text style={{fontSize:14,color:"#fff",fontWeight:"bold"}}>{a.name}</Text>
        <View  style={{flexDirection:"row"}} >
        <Icon.MaterialCommunityIcons name="map-marker"  size={15} color="#fff" />
        <Text style={{fontSize:14,color:"#fff"}}>{a.count} Service</Text>
        </View>
        </View>
        </View>
         </TouchableOpacity>})}
           </View>
         </ScrollView>}
    </View>)
    }
}

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(CategoryClass);

