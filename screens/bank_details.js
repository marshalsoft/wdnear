import React, {PureComponent} from 'react';
import {Platform,
    StyleSheet,
    Text, 
    View,
    Share,
    Clipboard,
    SafeAreaView,
    DeviceEventEmitter,
    FlatList,
    ToastAndroid,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Animated,
    Easing,
    Keyboard,
    Picker,
    Slider,
    ActivityIndicator,
    TimePickerAndroid,
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
    PanResponder,
    Modal, 
    Alert,
    TouchableNativeFeedbackBase} from 'react-native';
    import { connect } from 'react-redux';
    import mystyle  from '../includes/mystyle';
import { postDATA,postTEST,PasswordStrength,returnComma,getDATA,returnMobile,returnAllNumbers,returnMask} from '../includes/func';
import RNPaystack from 'react-native-paystack';
const {width,height} = Dimensions.get("window");
import Icon from '../includes/icons';
import Loader from '../components/loader';
import Country from '../includes/countries';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";

class CreditCardClass extends PureComponent{
    componentDidMount()
    {
        const Actions = this.props.navigation;
        RNPaystack.init({publicKey:String(this.props._pKey).trim()});
        if(this.state.cardlist.length == 0)
        {
            this.setState({cardlist:[{
                card_type:""
            }],loading:true})
        }
        if(this.props.settings)
        {
            Alert.alert("Billing",`To save your card  for future use, we will charge you a refundable amount NGN50, \nchoose "YES" to continue or "NO" to decline.`,
            [
             {text: 'No', onPress: () => {
                Actions.goBack();
              }, style: 'cancel'},
            {text: 'Yes', onPress: () => {
                this.setState({save_card:true})
            }, style: 'cancel'}
            ],
            {cancelable:false})
        }
        postDATA("payment/listCard",{
            user_id:parseInt(this.props.id_user),
            image:""
        }).then((res)=>{
            if(res.status)
            {
                this.setState({cardlist:res.result});
            }
            this.setState({loading:false});
        })
        console.log(this.props)
         this.getPaymentRef();
    }

  
    handleEventPayment(){
        const { 
            paymentTo,
            screen_route,
            module_endpoint,
            save_endpoint,         
            params,
            memo,
            amount,
            email_msg,
            id_user
            } = this.props;
            postDATA(save_endpoint,{
            user_id:parseInt(id_user),
            reference:this.state.paymentRef,
            ...params
            }).then((res)=>{
                if(res.status)
                {
                    postDATA(module_endpoint,{
                        ...params,
                        user_id:parseInt(id_user),
                        reference:this.state.paymentRef
                        })
                }
    this.setState({showLoader:true,errorInfo:`${res.result[0]} ${email_msg}`,isProcessing:false,success:res.status});

            })
           } 
 handleADSPayment = ()=>{
    const { 
        paymentTo,
        screen_route,
        module_endpoint,
        save_endpoint,         
        params,
        memo,
        amount,
        email_msg,
        id_user
        } = this.props;

        postDATA(save_endpoint,{
            user_id:parseInt(id_user),
            reference:this.state.paymentRef,
            ...params
            }).then((res)=>{
                if(res.status)
                {
                DeviceEventEmitter.emit("reload",{action:"ads"}) 
                postDATA(this.props.module_endpoint,{
                    ...params,
                    user_id:parseInt(id_user),
                    reference:this.state.paymentRef
                    })
                }
    this.setState({showLoader:true,errorInfo:`${res.result}`,isProcessing:false,success:res.status});
            })
       } 
       handleServicePayment = ()=>{
        const { 
            paymentTo,
            screen_route,
            module_endpoint,
            save_endpoint,         
            params,
            memo,
            amount,
            email_msg,
            id_user,
            more_images
            } = this.props;
    
            postDATA(save_endpoint,{
                user_id:parseInt(id_user),
                reference:this.state.paymentRef,
                ...params
                }).then((res)=>{
                    if(res.status)
                    {
                    DeviceEventEmitter.emit("reload",{action:"service"}) 
                    postDATA(module_endpoint,{
                        ...params,
                        user_id:parseInt(id_user),
                        reference:this.state.paymentRef
                        }).then((res)=>{
        this.setState({showLoader:true,errorInfo:`${res.result}`,isProcessing:false,success:res.status});
                            if(more_images != null && res.status)
                            {
                                more_images.store_id = parseInt(res.result[0].id_store);
                                postDATA("store/uploadStoreImages",more_images)  
                            }
                        })
                    }
                })
           } 
getPaymentRef()
{
    postDATA("payment/generateReference",{user_id:parseInt(this.props.id_user),image:""}).then((res)=>{
        if(res.status)
        {
            this.setState({paymentRef:res.result})
        }
    })
}
    chargeCard(){
    if(this.state.paymentRef == "")
    {
     this.getPaymentRef();
     alert("Oops please try again.");
    }else if(this.state.refNumber == this.state.paymentRef)
    {
     alert("Oops duplication transaction, try another payment");
     Actions.goBack();
    }else{
    const {number,cvc,expiry,type}= this.state.credit_card_details.values;
    var sxp = String(expiry).split("/");
    this.setState({showLoader:true,errorInfo:"Please wait...",isProcessing:true,success:false});
            var data = {
                cardNumber:number, 
                expiryMonth: sxp[0], 
                expiryYear:sxp[1], 
                cvc: cvc,
                email:this.props.email,
                amountInKobo:parseFloat(this.props.amount)*100,
                reference:this.state.paymentRef
              }
 RNPaystack.chargeCard(data).then(response => {
this.setState({refNumber:response.reference})
 const { 
    paymentTo,
    screen_route,
    module_endpoint,
    save_endpoint,         
    params,
    memo,
    amount,
    email_msg
    } = this.props;
    if(paymentTo === "event")
    {
       this.handleEventPayment();
    }else if(paymentTo == "ads"){
        this.handleADSPayment()
    }else if(paymentTo == "service"){
        this.handleServicePayment();
    }
   }).catch(error => {
   this.setState({showLoader:true,errorInfo:error.message,isProcessing:false,success:false});
    })
    
    }
    }
    
    constructor(props)
    {
        super(props);
        this.state = {
            loading:true,
            save_card:false,
            showLoader:false,
            isProcessing:true,
            errorInfo:"Please wait...",
            success:false,
            kyUp:false,
            card_type:"",
            account_number:"",
            account_name:"",
            credit_card_details:{
                valid:false,
                values:{
                    type:"",
                    number:"",
                    expiry:"",
                    cvv:""
                   }
            },
            refNumber:"001",
            cardlist:[],
            loadDelete:false,
            paymentRef:""
            }
            this.chargeCard.bind();
    }
 
componentWillUnmount()
{

}
onChange = (details)=>{
    // AlertBox(JSON.stringify(details));
    console.log(details)
    this.setState({credit_card_details:details});
    }
render() 
{
    const {
        endpoint,
        settings,
        params,memo} = this.props;
  const {cardlist,loadDelete} = this.state;
  console.log("memo:",memo)
  const Actions = this.props.navigation;
return(<View style={[mystyle.window,{backgroundColor:"white"}]} >
<View style={{width:width,height:height,justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
<View style={{width:width,height:50,justifyContent:"center",alignItems:"center",backgroundColor:"#f9f5f5",elevation:3,flexDirection:"row"}}>
<TouchableOpacity onPress={()=>{
Actions.goBack();
}} style={[{width:40,height:50,justifyContent:"center",alignItems:"center",position:"absolute",top:0,left:0,zIndex:99}]}>
<Icon.MaterialIcons color={"red"} name="keyboard-arrow-left" size={30} />
</TouchableOpacity>
<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
    <Text style={{color:"black",fontSize:18}}>{this.props.page_title}</Text>
</View>
<View style={{width:40,height:50}}>

</View>
</View>
<ScrollView 
keyboardShouldPersistTaps="always"
keyboardShouldPersistTaps={"always"}
ref={e=>this.Scrl=e}
onContentSizeChange={()=>{
    // this.Scrl.scrollToEnd({animated:true});
}}
style={{flex:1}} >
<View style={{width:width,alignItems:"center",flexDirection:"column",paddingBottom:70}} >
<View style={{paddingHorizontal:30,marginTop:20}}>
<Text style={{fontSize:16,color:"black",textAlign:"left"}}>{memo}</Text>
</View>
<View style={{width:width,alignItems:"center",flexDirection:"column",paddingTop:20,backgroundColor:"white",height:300}} >
<CreditCardInput 
onChange={this.onChange} 
/>
{cardlist.filter((a,i)=>a.selected).length != 0?<View style={{...StyleSheet.absoluteFill,alignItems:"center",flexDirection:"column",backgroundColor:"rgba(255,255,255,0.9)"}} >
</View>:null}
</View>

<View style={[mystyle.btn,{width:width-90,flexDirection:"column",padding:0,overflow:"hidden",width:150,flexDirection:"row",marginTop:80}]} >
<TouchableOpacity 
onPress={()=>{
 if(!this.state.credit_card_details.valid)
 {
Actions.goBack();
}else{
Alert.alert("Billing",`${this.props.memo}, \nchoose "YES" to continue or "NO" to decline.`,
[
{text: 'No', onPress: () => {
            
}, style: 'cancel'},
{text: 'Yes', onPress: () => {
 this.chargeCard();
}, style: 'cancel'}
],
{cancelable:false})
  }
}}
style={[mystyle.btn,{width:width-90,flexDirection:"row",justifyContent:"center",alignItems:"center"}]}>
<Text style={{color:"white",fontSize:12}}>{!this.state.credit_card_details.valid?"Cancel":"Proceed"}</Text>
 </TouchableOpacity>
</View>
{this.state.kyUp?<View style={{height:100,width:width-50}}></View>:null}
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
// isProcessing={false}
returnData={(d)=>{
if(this.state.success)
{
if(this.props.screen_route != "")
{
 Actions.jump(this.props.screen_route);       
}else{
 Actions.goBack();
}

}
this.setState(d);
}} />
</View>)
    }
}
CreditCardClass.defaultProps = {
    page_title:"Card Details",
    save_endpoint:null,
    memo:"",
    email_msg:"",
    params:{},
    amount:50*100,
    settings:false,
    screen_route:"",
    action:"",
    module_endpoint:null,
    more_images:null,
    paymentTo:""
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(CreditCardClass);

