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
    KeyboardAvoidingView,
    BackHandler,
    Image,
    Modal } from 'react-native';
    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';
    import * as EvalEmail from 'email-validator';
    import { postDATA } from '../includes/func';
    import { Picker } from '@react-native-picker/picker';
const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import Loader from '../components/loader';
import * as Animatable from 'react-native-animatable';
import Country from '../includes/countries';

class RegisterTwoCLass extends PureComponent{
searchLocation(d)
{
this.setState({add_location:d,loading:true},()=>{
    var x = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${d}&key=${this.props.Reducer.googleKey}`;
   console.log(x);
    fetch(x).then((res)=>res.json()).then((res)=>{
   console.log(res);
    this.setState({loading:false,listLocation:res.predictions}); 
})  
})
}
getLatlng(address)
{
 this.setState({showLoader:true,isProcessing:true},()=>{
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${this.props.googleKey}`).then((res)=>res.json()).then((res)=>{
        if(res.status === "OK")
        {
            res.results = res.results[0];
            res.results = res.results.geometry.location;
        }else{
            res.errorInfo = "Oops! we cannot get you location, tyr again later."
        }
    this.setState({showLoader:res.status === "OK"?false:true,isProcessing:false,bussines_address:res.status === "OK"?address:"",...res.results}); 
        console.log(res);
      }) 
 });
}

    componentDidMount()
    {
        this.setState({
            // bussines_email:this.props.email,
            bussines_address:this.props.Reducer.address
        })
        if(this.props.Reducer.categoryList.length == 0)
        {
        this.getCategory();
        }else{
         this.setState({loading:false})
        }
    }
     getCategory()
     {
       this.setState({loading:true});
      postDATA("category/getAllCategory",{}).then((res)=>{
       var x = [];
       if(res.success == 1)
       {
        for(var o in res.result)
        {
          x.push(res.result[o]);
        }
       }
        this.setState({loading:false},()=>{
         this.props.dispatch({type:"update",value:{categoryList:res.success == 1?x:[]}});
        })
      })
     }
    constructor(props)
    {
        super(props);
        this.state = {
            mobile:"",
            showLoader:false,
            showAddress:false,
            isProcessing:true,
            loading:true,
            errorInfo:"Please wait...",
            success:false,
            kyUp:false,
            firstname:"",
            lastname:"",
            email:"",
            lat:"",
            lng:"",
            bussines_category:"",
            bussines_name:"",
            bussines_address:"",
            bussines_email:"",
            bussines_website:"",
            country:"",
            province:"",
            add_location:"",
            showCountryList:false,
            password:"",
            confirm_password:"",
            listLocation:[],
            category_index:0
        }
        this.getCategory.bind();
 }
 
componentWillUnmount()
{

}

render() 
{
const {
    bussines_category,
    bussines_address,
    bussines_email,
    bussines_name,
    password,
    confirm_password,
    category_index,
    bussines_website,
    listLocation
} = this.state;

return(<KeyboardAvoidingView 
    behavior="padding"
    keyboardVerticalOffset={40} style={[mystyle.window,{backgroundColor:"white"}]} >
<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
<TouchableOpacity onPress={()=>{
const Actions = this.props.navigation;
Actions.goBack();
}} style={[{width:60,height:60,justifyContent:"center",alignItems:"center",position:"absolute",top:0,left:0,zIndex:99}]}>
<Icon.MaterialIcons color={mystyle.active.color} name="keyboard-arrow-left" size={30} />
</TouchableOpacity>
<ScrollView 
keyboardShouldPersistTaps="always"
ref={e=>this.sceR=e}
style={{flex:1,paddingTop:80}} >
<View style={{width:width,justifyContent:"center",alignItems:"center",flexDirection:"column",minHeight:height-300}} >
<View style={{width:width,justifyContent:"center",alignItems:"center",flexDirection:"column"}} >
<View style={[mystyle.regInput,{width:width-90,height:45,justifyContent:"center",alignItems:"flex-start"}]}>
{this.state.loading?<ActivityIndicator color="red" size="small" style={{marginLeft:20}} />:<Picker 
mode="dropdown"
    onValueChange={(d,i)=>{
    if(i == 0)
    {
    ToastAndroid.show("Select another item..",ToastAndroid.LONG);
    return ;
    }
    console.log(this.props.Reducer.categoryList[i-1].id_category);
    this.setState({bussines_category:d,category_index:this.props.Reducer.categoryList[i-1].id_category});
    }}
    selectedValue={this.state.bussines_category}
    style={{marginLeft:20,width:"90%"}}
    >
{[{name:"Select Category"},...this.props.Reducer.categoryList].map((a,i)=><Picker.Item key={i}
label={a.name} value={a.name}
/>)}
</Picker>}
</View>
<View style={[mystyle.regInput,{width:width-90}]}>
<TextInput 
    keyboardType="default"
    placeholder="Name of Service /Business"
    onChangeText={(d)=>this.setState({bussines_name:d})}
    value={this.state.bussines_name}
    style={{fontSize:16,flex:1,paddingLeft:20,textAlignVertical:"center",textAlign:"left"}}
    />
</View>
<TouchableOpacity
    onPress={()=>{
    this.setState({showAddress:true});
    }}
style={[mystyle.regInput,{width:width-90,minHeight:40,justifyContent:"center",alignItems:"flex-start",paddingHorizontal:20,paddingVertical:10}]}>
<Text style={{paddingRight:20,fontSize:16}}>{this.state.bussines_address}</Text>
<Icon.Evilicons name="arrow-down" style={{position: "absolute",top:8,right:10}} size={30} />
</TouchableOpacity>
<View style={[mystyle.regInput,{width:width-90}]}>
<TextInput 
    keyboardType="default"
    placeholder="Business email"
    autoCapitalize="none"
    onChangeText={(d)=>this.setState({bussines_email:String(d).replace(/[ ]/g,'')})}
    value={this.state.bussines_email}
    onFocus={()=>this.setState({kyUp:true})}
    onBlur={()=>this.setState({kyUp:false})}
    style={{fontSize:16,paddingLeft:20,width:"100%",textAlignVertical:"center",textAlign:"left"}}
    />
</View>
<View style={[mystyle.regInput,{width:width-90}]}>
<TextInput 
    keyboardType="default"
    placeholder={`Business website(optional) `}
    onChangeText={(d)=>this.setState({bussines_website:d})}
    value={this.state.bussines_website}
    onFocus={()=>this.setState({kyUp:true})}
    onBlur={()=>this.setState({kyUp:false})}
    style={{fontSize:16,flex:1,paddingLeft:20,textAlignVertical:"center",textAlign:"left"}}
    />
</View>
</View>
<View style={{height:100,width:width,alignItems:"center"}}>
    <TouchableOpacity onPress={()=>{
    var data = {
        category:this.state.category_index,
        reg_name:this.state.bussines_name,
        reg_address:this.state.bussines_address,
        reg_email:this.state.bussines_email,
        reg_website:this.state.bussines_website,
        cardType:"",
        account_no:"",
        account_name:"",
        business_lat:this.state.lat,
        business_lng:this.state.lng
    }
    
      if(data.category == 0 )
      {
      this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please select business category, thanks."})
      }else if(data.reg_name == "" )
      {
      this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter business name, thanks."})
      }else if(data.reg_address == "")
      {
      this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter business address, thanks."})
      }else if(data.reg_email == "")
      {
      this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter business email, thanks."})
      }else if(!EvalEmail.validate(String(data.reg_email).replace(/[ ]/g,'')))
      {
      this.setState({showLoader:true,isProcessing:false,success:false,errorInfo:"Please enter a valid email, thanks."})
      }else{
        data.screen_route = "menu";
        const Actions = this.props.navigation;
        Actions.navigate("reg3",data);
       }
    }} style={[{width:width-60,height:50,marginTop:10,backgroundColor:mystyle.active.color,justifyContent:"center",alignItems:"center",borderRadius:60,elevation:5}]}>
    <Text style={{color:"white",fontWeight:"bold",fontSize:18}}>{this.props.Reducer.typeAuth != "vendor"?"Next":"Submit"}</Text>
    </TouchableOpacity>
</View>
</View>
</ScrollView>
</View>
<Modal 
style={{backgroundColor:"white"}}
visible={this.state.showAddress}
onRequestClose={()=>{
this.setState({showAddress:false});
}}
>
<View style={{backgroundColor:"white",width,flexDirection:"column",alignItems:"center",height}}>
<View style={{width,alignItems:"center",flexDirection:"row"}}>
<View style={[mystyle.regInput,{width:width-60,height:50}]}>
<TextInput 
 keyboardType="default"
 placeholder="Search location..."
 autoFocus
 onChangeText={(d)=>this.searchLocation(d)}
 value={this.state.add_location}
 style={{color:"#000",fontSize:14,flex:1,textAlign:"left",paddingLeft:50}}
    />
    <Icon.Evilicons name="search" style={{position:"absolute",left:10,top:15,fontSize:30}} />
</View>
<TouchableOpacity
onPress={()=>{
    this.setState({showAddress:false});
}}
style={{width:40,height:50,marginLeft:-5,alignItems:"center",justifyContent:"center"}}>
<Icon.AntDesign name="close" size={30} />
</TouchableOpacity>
</View>
<View style={{width:width,alignItems:"center",flexDirection:"column"}}>
{this.state.loading?<View style={{padding:10,justifyContent:"flex-start",alignItems:"center",flexDirection:"row",width}}>
 <ActivityIndicator color={mystyle.active.color} />
 <Text style={{fontSize:12,marginLeft:5}}>loading...</Text>
 </View>:listLocation.length == 0?<View style={[mystyle.myalert,{alignItems:"center"}]} >
 <View style={{height:30,width:50,justifyContent:"center",alignItems:"center"}} >
  <Icon.Ionicons name="ios-information-circle-outline" size={20} />
</View>
<Text>No location found !</Text>
</View>:null}    
<FlatList 
scrollEnabled={false}
data={listLocation}
renderItem={({item,index})=><TouchableOpacity 
style={{flexDirection:"row",width:width,height:60,borderBottomWidth:0.5,borderBottomColor:"#444",alignItems:"center"}}
onPress={()=>{
this.getLatlng(item.description);
this.setState({showAddress:false});
}}
>
<View style={{width:40,height:50,alignItems:"center",justifyContent:"center"}}>
<Icon.FontAwesome name="map-marker" size={20} />
</View>
<View style={{flexDirection:"column",flex:1,flexWrap:"wrap",paddingRight:20}}>
<Text style={{width:width,fontSize:12}} >{item.description}</Text>
</View>
<View style={{width:60,height:50,justifyContent:"center",alignItems:"center"}}>
<Icon.MaterialIcons name="keyboard-arrow-right" size={15} />
</View>
</TouchableOpacity>}
/>
</View>
</View>
</Modal>
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
</KeyboardAvoidingView>)
    }
}
RegisterTwoCLass.defaultProps = {
    regname:"",
    email:"",
    country:"",
    province:""
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(RegisterTwoCLass);

