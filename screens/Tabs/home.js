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
    RefreshControl,
    ScrollView,
    Animated,
    Easing,
    Keyboard,
    Image,
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
    Modal, 
    DeviceEventEmitter,
    PermissionsAndroid,
    Alert} from 'react-native';
    import Icon from '../../includes/icons';
    import mystyle from '../../includes/mystyle';
    import {postDATA,getDATA,returnComma,calculateDistance} from '../../includes/func';
const {width,height} = Dimensions.get("window");
import Loader from '../../components/loader';
import Update from '../../components/upgrade';
import { connect } from 'react-redux';
import storage from '@react-native-firebase/storage';
import firebase from 'firebase'; 
import FS from 'rn-fetch-blob';
import Moment from 'moment';
import FileViewer from 'react-native-file-viewer';
import CameraRoll from '@react-native-community/cameraroll';

import ReturnADS  from '../../components/showADS';

if(!firebase.apps.length){
  firebase.initializeApp({
    apiKey:"AIzaSyAxk6-y3UFwM0pP1deA_FDtxOjvwqXFmBg",
    authDomain:"wedeynear-dcf63.firebaseapp.com",
    databaseURL:"https://wedeynear-dcf63.firebaseio.com",
    projectId:"wedeynear-dcf63",
    storageBucket:"wedeynear-dcf63.appspot.com",
    messagingSenderId:"568520040394",
    appId:"1:568520040394:web:f1d90e467ba1aaca773933",
    measurementId:"G-9PHHQVN26E"
  });
}
 class HomeTabClass extends PureComponent{
  getChatAlert(o){
    const Actions = this.props.navigation;
  AsyncStorage.getItem("chat").then((c)=>{
    if(c !== null)
    {
     var chat = JSON.parse(c);
    if(chat.length != 0)
    {
     this.props.dispatch({type:"update",value:{chatcount:chat.length,notifications:chat}})
    if(o)
    {
      Actions.navigate("notify",{chat:chat});
    }else{
     Alert.alert("Chat alert",`You have ${chat.length} unread chat${chat.length > 1?'s':''}.`,
    [
    {text: 'Cancel', onPress: () => {
    //  Actions.drawerClose();
    }, style: 'cancel'},
    {text: 'Open', onPress: () => {
      Actions.navigate("notify",{chat:chat});
    }, style: 'cancel'}
  ],
  {cancelable:false}) 
  }
    }else{
      this.getServiceAlert();
    }
    }else{
      this.getServiceAlert();
    }
   })
  }
  getServiceAlert()
  {
    const Actions = this.props.navigation;
    AsyncStorage.getItem("new_service").then((s)=>{
      if(s !== null)
      {
        var serv = JSON.parse(s);
        if(serv.length != 0)
        {
       this.props.dispatch({type:"update",value:{new_service_count:serv.length}})
        Alert.alert("New service alert",`You have ${serv.length} new service${serv.length > 1?'s':''} added.`,
        [
        {text: 'Cancel', onPress: () => {
        //  Actions.drawerClose();
        }, style: 'cancel'},
        {text: 'Open', onPress: () => {
          this.setState({showLoader: true,isProcessing:true});
          this.getServices().then((ar)=>{
            var itm = ar[0];
            console.log(itm);
          Actions.view_product({productDetails:itm});
          this.setState({showLoader: false,isProcessing:false});
          })
        }, style: 'cancel'}
      ],
      {cancelable:false})  
      }
    }
    })
  }
        componentDidMount()
        {
          const Actions = this.props.navigation;
          this.dbOnline = firebase.database().ref(`onoff@${this.props.id_user}`);
          this.dbOnline.update({
            status: "online"
          });
          this.dbOnline.onDisconnect().update({
          status: "offline"
          });
          this.getChatAlert(false);
          this.db = firebase.database().ref(`fcmToken`);
          AsyncStorage.getItem("fcmToken").then((e)=>{
            if(e == null)
            {
            this.db.child(this.props.Reducer.id_user).push({fcmToken:""});
            }else{
            this.db.child(this.props.Reducer.id_user).update({fcmToken:e});
            }
            this.setState({fcmToken:e});
            });
          DeviceEventEmitter.addListener("chat",(count)=>{
            this.props.dispatch({type:"update",value:{chatcount:count}})
          });
          DeviceEventEmitter.addListener("new_service",(count)=>{
            this.props.dispatch({type:"update",value:{new_service_count:count}})
          });
          DeviceEventEmitter.addListener("ads",(data)=>{
            var ads = this.props.Reducer.adsList.filter((a,i)=>parseInt(a.banner_size) >= 300);
            if(ads.length != 0)
            {
            var rand  = Math.floor(Math.random() * Math.floor(ads.length));
            try{
              ads[rand].image = {uri:ads[rand].banner_image["200_200"].url};
            }catch(e)
            {
              ads[rand].image = require("../../images/placeholder2.png");
            }
            this.props.dispatch({type:"update",value:{adsImage:ads[rand]}})                    
          }
          });
          DeviceEventEmitter.addListener("uploadVideo",(data)=>{
          console.log("uploadVideo: ",data);
          data.forEach((a,i)=>{
          console.log(`upload:${i}`,a);
          this.UploadFile(a);
          })
          })
         this.setState({isProcessing:true,showLoader:true,success:false,errorTxt:"Please wait..."})
         this.getServices();
         this.getAds();
         DeviceEventEmitter.addListener("reload",(l)=>{
          if(l.action == "service")
          {
            this.getServices();
          }
          if(l.action == "ads")
          {
            this.getAds();
          }
         })
         if(this.props.typeAuth == "client")
         {
          this.props.dispatch({type:"update",value:{showADS:false,showPrompt:true}})     
           Alert.alert("Account Upgrade!","Are you a Vendor selling a product(s) or offering service(s)? \nIf so, please take a few minutes to update your profile to Vendor status by simply going into your User Profile page and switch to a Become Vendor or tap on 'UPGRADE ACCOUNT'.",
           [{text: 'UPGRADE ACCOUNT',onPress:() =>{
             Actions.navigate("reg2");
          this.props.dispatch({type:"update",value:{showADS:false,showPrompt:false}})     
           }},
           {text:'Cancel', onPress:() =>{
          this.props.dispatch({type:"update",value:{showADS:false,showPrompt:false}})     
           }}],
           {cancelable: false})
         }else{
        setTimeout(()=>{
          DeviceEventEmitter.emit("showVerifyBusiness",{});
        },2000)
          this.props.dispatch({type:"update",value:{showADS:false,showPrompt:false}})     
        }
        }
      
        getAds()
        {
          postDATA("campaign/getAdverts",{
            country:this.props.Reducer.country,
            city:this.props.Reducer.city
          }).then((res)=>{
    // alert(JSON.stringify(res));
    console.log("adsList",res)
            if(res.status)
            {
              try {
                if(res.result.length != 0){
                  this.props.dispatch({type:"update",value:{adsList:res.result}})
                } 
              } catch (error) {
              }
            }
          })
        }
         UploadFile(data)
         {
          const db = firebase.database().ref(`product@${data.id_store}`);
          storage().ref(data.videoID).putFile(data.update_path).then((snapshot) => {
            console.log("snapshot:",snapshot);
            var updates = {};
            if(snapshot.state == "success")
            {
            let imageRef = storage().ref('/' + snapshot.metadata.fullPath);
            imageRef.getDownloadURL().then((url) => {
              updates[`${data.path}/${data.videoID}/uri`] = url;
             console.log(updates);
             db.update(updates);
              }).catch((e) =>{
                console.log('getting downloadURL of image error => ', e);
              });
            }else{
          //     updates[this.dbupdate_path] = snapshot.metadata.fullPath;
          //     console.log(updates);
          //     this.db.update(updates);
            }
            }).catch((e)=>{
          //     console.log("error:",e);
            })
         }
         getServices()
         {
           return new Promise((resolve,reject)=>{
         postDATA("store/getServices",{
          limit:12,
          page:this.state.nbrpages
      }).then((res)=>{
         console.log(res);
         this.setState({refreshing:false,loadMore:false,isProcessing:false,showLoader:false},()=>{
        if(res.status)
        {
        //  console.log(list);
        var r = {nbrpages:0,current_page:1,per_page:12,first_nbr:0,nextpage:0,pages:[]};
        
        try{
          var pages = [];
          r = res.pagination;
          for(var i = 0;i < parseInt(r.nbrpages);i++)
          {
          pages.push(`${i+1}`)
          }
          // console.log(pages);
          this.setState({...r,pages:pages});
        }catch(e){

        }
        var result = res.result.map((a,i)=>{
          a.images_list = a.images;
          a.product_name = a.name;
          a.lat = a.latitude == undefined?a.lat:a.latitude;
          a.lng = a.longitude == undefined?a.lng:a.longitude;
          a.distance_from_me = returnComma(parseFloat(calculateDistance(a.lat,this.props.Reducer.latitude,a.lng,this.props.longitude)).toFixed(0));
          delete a.name;
          if(a.images)
          {
            if(a.images.length > 0)
            {
              if(a.images[0]["200_200"] != undefined)
              {
                a.images = {uri:a.images[0]["200_200"].url}
              }else{
              a.images = {uri:null}
              }
            }else{
              a.images = {uri:null}
            }
          }
          return a;
        })
        this.props.dispatch({type:"update",value:{services:result}})
        // AsyncStorage.getItem("notify").then((s)=>{
        // if(s == null)
        // {
        //   AsyncStorage.setItem("notify","1");
       
        // this.setState({nbrpages:this.state.nbrpages+1})
        // }
        resolve(result);
      // })
      }
         })
          })
        })
         }
       
         componentWillUnmount()
         {
          clearInterval(this.inval);
         }
          constructor(props)
          {
            super(props);
            this.state = {
            setIndex:0,
            OfferList:[],
            chatArray:[],
            slideIndex:0,
            slideIndex2:0,
            showLoader:true,
            isProcessing:true,
            refreshing:false,
            errorInfo:"Please wait...",
            success:false,
            selectedCategory:"",
            current_page: 1,
            per_page: 1,
            count: 0,
            first_nbr: 0,
            nbrpages: 1,
            nextpage:-1,
            setpage:1,
            fcmToken:"",
            pages:[],
            loadMore:false
            }
            this.scrollX = new Animated.Value(0);
            this.getServices.bind();
          }
      shareProduct(d)
      {
                // alert(JSON.stringify(d))
                const url = 'https://play.google.com/store/apps/details?id=com.wedeynear';
                const title = `Hey buddy! Check out this ${d.title}`;
                const message = `Hey buddy! Check out the best of ${d.title} at wedeynearKoncept App e-payment method avaliable, Delivery within 4 days - Order yours now.`;
                const icon = 'data:<data_type>/<file_extension>;base64,<base64_data>';
                const options = Platform.select({
                  ios: {
                    activityItemSources: [
                      { // For sharing url with custom title.
                        placeholderItem: { type: 'url', content: url },
                        item: {
                          default: { type: 'url', content: url },
                        },
                        subject: {
                          default: title,
                        },
                        linkMetadata: { originalUrl: url, url, title },
                      },
                      { // For sharing text.
                        placeholderItem: { type: 'text', content: message },
                        item: {
                          default: { type: 'text', content: message },
                          message: null, // Specify no text to share via Messages app.
                        },
                        linkMetadata: { // For showing app icon on share preview.
                          title: message
                        },
                      },
                      { // For using custom icon instead of default text icon at share preview when sharing with message.
                        placeholderItem: {
                          type: 'url',
                          content: icon
                        },
                        item: {
                          default: {
                            type: 'text',
                            content: `${message} ${url}`
                          },
                        },
                        linkMetadata: {
                          title: message,
                          icon: icon
                        }
                      },
                    ],
                  },
                  default: {
                    title:title,
                    subject:title,
                    message:`${message} ${url}`,
                  },
                });
                
                // ShareObj.open(options);
      }
      writeFile(uri,id_store)
      {
      const { config, fs,android,ios } = FS;
      var path = fs.dirs.DocumentDir + `/product_image${id_store}.png`;
      console.log(path);
      fs.exists(path).then((exist) => {
          if(exist)
          {
            FileViewer.open(path);
          }else{
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
          'title': 'App Permission',
          'message': `WeDeyNear app needs access to store file.`
      }).then((granted)=>{
        if(granted === "granted"){ 
      //  console.log(fs);
      //  console.log(path);
      //  console.log(d.pdf);
      // return ;
      this.setState({showLoader:true,isProcessing:true});
      config({
        fileCache: true,
        appendExt: 'png',
        path:path
      }).fetch('GET',uri).then((res)=>{
        CameraRoll.save(res.data, 'photo')
        .then((res) => {
        console.log(res)
        //  console.log(res.path())
        FileViewer.open(res);
      this.setState({showLoader:false,isProcessing:false})
        })
        .catch(err => {
          Alert.alert(
            'Save remote Image',
            'Failed to save Image: ' + err.message,
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
        }).finally(() => this.setState({showLoader: false,isProcessing:false}));
      })
      .catch(error => {
      this.setState({showLoader: false,isProcessing:false});
      Alert.alert(
        'Save remote Image',
        'Failed to save Image: ' + error.message,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false}
      );
      });
        // android.actionViewIntent(res.path(),'image/png');
      }else{
      alert("Access denied");
      }
      })
          }
        })
      }


 render()
 {
  const {
    showLoader,
    loadMore,
    isProcessing,
    errorInfo,
    success,
    OfferList,
    setIndex,
    EventList,
    selectedCategory,
    current_page,
    per_page,
    count,
    first_nbr,
    nbrpages,
    nextpage,
    setpage
  } = this.state;
  const banner_150 = this.props.Reducer.adsList.filter((a,i)=>String(a.banner_size) == "150")
  const banner_320 = this.props.Reducer.adsList.filter((a,i)=>String(a.banner_size) == "320")
  const banner_350 = this.props.Reducer.adsList.filter((a,i)=>String(a.banner_size) == "350")
// problem
  const ShowScreen = ["signup_login","login","new_service","edit_service","advert","bank_details","success","edit_product","code_verify","chat","event_type","event_more","advert","reg3","payment"].indexOf("k") == - 1;
  const Actions = this.props.navigation;
  return(<View 
  onLayout={()=>{
    try {
   setInterval(()=>{
     try {
      const banner_full = this.props.Reducer.adsList.filter((a,i)=>parseInt(a.banner_size) > 400)
      var ran = Math.floor(Math.random() * banner_full.length);
      var a = banner_full[ran];
      a.image = {uri:a.banner_image["200_200"].url};
      if(!["profile","register","reg2","reg3","chat","editprofile","advert","view_events","subscribe","payment"].includes(Actions.currentScene))
      {
      this.props.dispatch({type:"update",value:{showADS:true,adsImage:a,showPrompt:false}})
      }
     } catch (error) {
       
     }
     this.getAds();
   },120000) 
    } catch (error) {
      
    }
  }}
  style={mystyle.window}>
<View style={{width:width,flex:1,flexDirection:"column"}}>
{this.props.Reducer.services.length != 0?<View style={[mystyle.myalert,{}]}>
  <Text style={{fontSize:10}}>Swipe down to reload content</Text>
</View>:null}
{this.props.Reducer.services.length == 0?<View style={{flex:1}}>
<View style={[mystyle.myalert,{}]}>
  <Text>No service found!</Text>
</View>
</View>:null}
<FlatList
 refreshControl={
  <RefreshControl
  progressViewOffset={-20}
  refreshing={this.state.refreshing}
  onRefresh={()=>{
    this.setState({refreshing:true},()=>this.getServices());
    }}
  />}
contentContainerStyle={{flex:1}}
data={this.props.Reducer.services}
renderItem={({item,index})=>{

return <View style={{flexDirection:"column",width:width,alignItems:"center"}}>
  <TouchableOpacity 
 onPress={()=>{
item.offer = false;
console.log(item);
    this.props.navigation.navigate("view_product",{productDetails:item});
  }}
  activeOpacity={0.9}
  style={[mystyle.card,{elevation:5,width:width-20,padding:0,minHeight:50,borderRadius:10,marginTop:10,alignSelf:"center",flexDirection:"column"}]}>
   <View style={{width:"100%",height:140,backgroundColor:"#444",marginBottom:5}}>
   <Image source={item.images.uri == null?require("../../images/placeholder2.png"):item.images} style={{width:"100%",height:140}} resizeMode="cover" />
<View style={{width:"100%",height:140,backgroundColor:"#444",position:"absolute",top:0,left:0,backgroundColor:"rgba(0,0,0,0.2)"}}>
 </View>
   {item.featured != null?<View style={{position:"absolute",top:0,left:0,padding:5,width:70,backgroundColor:"#1664c0"}}>
   <Text style={[mystyle.whitetxt]}>{"featured"}</Text>
   </View>:null}
   <View style={{position:"absolute",bottom:0,left:0,padding:5,flexDirection:"row"}}>
   <Icon.FontAwesome name="star" color="#fbc004" size={20} />
   <Text style={{color:"white",marginHorizontal:2,fontSize:12}}>{item.category_name}</Text>
   </View>
   <TouchableOpacity 
   onPress={()=>{
    this.props.navigation.navigate("map",{
       lt:a.latitude,
       lg:a.longitude,
       maptitle:a.name,
       mapaddress:a.address,
       mapimage:a.images
     })
   }}
   style={{position:"absolute",bottom:0,right:0,padding:5,alignSelf:"center",backgroundColor:mystyle.active.color,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
   <Icon.FontAwesome name="map-marker" color="white" style={{marginRight:5}}/>
   <Text style={[mystyle.whitetxt,{fontSize:10}]}>view in map ({item.distance_from_me}m)</Text>
   </TouchableOpacity>
   </View>
  <View style={{width:"100%",flexDirection:"column",padding:15,paddingVertical:10}}>
  <View style={{width:"100%"}}>
    <Text numberOfLines={1} style={[mystyle.title]} ellipsizeMode="tail">{item.product_name}</Text>
  </View>
  <View style={{width:"100%"}}>
    <Text numberOfLines={1} style={[mystyle.subtitle]}>{item.detail}</Text>
  </View>
  </View>
  </TouchableOpacity>
  {index == 1?<ReturnADS
  list={banner_150}
  size={80} />:index == 4?<ReturnADS
  list={[...banner_320,...banner_350]}
  size={320} />:null}
  </View>}}
  ListFooterComponent={()=><View  style={{width:"100%",justifyContent:"center",alignItems:"center",backgroundColor:"white"}} >
   {loadMore?<View style={{width:"100%",justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
    <ActivityIndicator color={"red"} size="small" />
    <Text style={{fontSize:10,color:"red"}}> Loading more items...</Text>
  </View>:null}
  </View>}
  onEndReached={()=>{
    this.setState({loadMore:true,nbrpages:this.state.nbrpages+10},()=>this.getServices()); 
  }}
  onEndReachedThreshold={1}
/>
</View>
<Modal 
visible={this.props.Reducer.showADS && this.props.Reducer.adsList.length != 0 && ShowScreen}
onRequestClose={()=>{
  this.props.dispatch({type:"update",value:{showADS:false,showPrompt:false}})
}}
transparent={true}

>
<View 
style={{width,height,backgroundColor:"rgba(0,0,0,0.7)",justifyContent:"center",alignItems:"center"}}
>

{this.props.Reducer.adsImage.title == ''?<ActivityIndicator 
  color={mystyle.active.color}
/>:<ScrollView 
keyboardShouldPersistTaps="always"style={{flex:1,marginTop:50}}>
<View 
style={{width,minHeight:height-50,justifyContent:"center",alignItems:"center"}}
>
<View 
style={[mystyle.card,{minHeight:parseInt(this.props.Reducer.adsImage.banner_size),width:width-10,padding:0,borderRadius:10,alignItems:"center",marginBottom:40}]}
>
<View 
style={{padding:5,flexDirection:"column",width:width-20,backgroundColor:"rgba(255,255,255,0.5)",borderRadius:20}}
>
<Text style={{color:"black",fontSize:10}}>Advertisement</Text>
<TouchableOpacity 
onPress={()=>{
  this.props.dispatch({type:"update",value:{showADS:false,showPrompt:false}})
}}
style={{position:"absolute",top:2,right:1,borderRadius:20,padding:2,backgroundColor:"rgba(0,0,0,0.2)"}}
>
<Icon.AntDesign name="close" color="red" size={12}/>
</TouchableOpacity>
</View>
<Image source={this.props.Reducer?.adsImage?.image}  style={{height:parseInt(this.props.Reducer.adsImage.banner_size),width:width-20,backgroundColor:"#999"}} 
resizeMode="cover"

/>
<View style={{width:"100%",flexDirection:"column"}}>
<Text style={{padding:10,paddingBottom:0,fontSize:15,color:"black",fontWeight:"bold"}}>{this.props.Reducer.adsImage.title}</Text>
<Text style={{padding:10,paddingBottom:0,fontSize:12,color:"black",paddingTop:0}}>{this.props.Reducer.adsImage.description}</Text>
<View style={{width:"100%",marginTop:10,backgroundColor:"#ebebeb",flexDirection:"column"}}>
<View style={{flexDirection:"column",paddingHorizontal:10}} >
<TouchableOpacity
onPress={()=>{
  Linking.openURL("mailto:"+this.props.Reducer.adsImage.email)
}}
 style={{padding:5,flexDirection:"row",alignItems:"center"}}>
 <Icon.Evilicons name="envelope" size={20} style={{marginHorizontal:2}} />
  <Text style={{color:mystyle.active.color,textDecorationLine:"underline"}}>{this.props.Reducer.adsImage.email}</Text>
</TouchableOpacity>
<TouchableOpacity
onPress={()=>{
  Linking.openURL("tel:"+this.props.Reducer.adsImage.telephone)
}}
style={{padding:5,flexDirection:"row",alignItems:"center"}}>
 <Icon.FontAwesome name="phone" size={20} style={{marginHorizontal:2}} />
  <Text style={{color:mystyle.active.color,textDecorationLine:"underline"}}>{this.props.Reducer.adsImage.telephone}</Text>
</TouchableOpacity>
{this.props.Reducer.adsImage.website != null?<TouchableOpacity
onPress={()=>{
  Linking.openURL("http://"+String(this.props.Reducer.adsImage.website).replace("http://",""))
}}
style={{padding:5,flexDirection:"row",alignItems:"center"}}>
 <Icon.FontAwesome name="globe" size={20} style={{marginHorizontal:2}} />
  <Text style={{color:mystyle.active.color,textDecorationLine:"underline"}}>{this.props.Reducer.adsImage.website}</Text>
</TouchableOpacity>:null}
</View>
<Text style={{padding:10,fontSize:10,color:"#999",width:"100%",textAlign:"right"}}>created: {Moment(this.props.Reducer.adsImage.created_at).format("Do, MMM YYYY")}</Text>
</View>
</View>
</View>
</View>
</ScrollView>}
</View>
</Modal>
 <Loader 
{...this.state}
returnData={(d)=>{
this.setState(d);
}} />
<Update />
</View>)
        }
    }
    const mapStateToProps = (state) => {
        return state;
      };
    export default connect(mapStateToProps)(HomeTabClass);
    