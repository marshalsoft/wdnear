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
    import Icon from '../includes/icons';
    import mystyle from '../includes/mystyle';
    import { Picker } from '@react-native-picker/picker';
    import {postDATA,getDATA,returnComma,calculateDistance} from '../includes/func';
const {width,height} = Dimensions.get("window");
import Loader from '../components/loader';
import Update from '../components/upgrade';
import Profile from './Tabs/profile';
import { connect } from 'react-redux';
import storage from '@react-native-firebase/storage';
import firebase from 'firebase'; 
import FS from 'rn-fetch-blob';
import Moment from 'moment';
import * as Animatable from 'react-native-animatable';
import FileViewer from 'react-native-file-viewer';
import CameraRoll from '@react-native-community/cameraroll';

import ReturnADS  from '../components/showADS';

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
 class HomeClass extends PureComponent{
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
              ads[rand].image = require("../images/placeholder2.png");
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
         this.getOffers();
         this.getEvents();
         this.getAds();
         DeviceEventEmitter.addListener("reload",(l)=>{
          if(l.action == "service")
          {
            this.getServices();
          }
          if(l.action == "offer")
          {
            this.getOffers();
          }
          if(l.action == "event")
          {
            this.getEvents();
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
         this.setState({refreshing:true})
         postDATA("store/getServices",{
          limit:12,
          page:this.state.setpage
      }).then((res)=>{
         console.log(res);
         this.setState({refreshing:false,isProcessing:false,showLoader:false},()=>{
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
         getOfferDetails(d)
         {
          console.log("store_id:".d);
          d.offer = true;
          this.setState({showLoader: true,isProcessing:true})
          postDATA("store/getServices",{store_id:d.store_id}).then((res)=>{
            console.log("offer:",res);
            // // return ;
          this.setState({showLoader: false,isProcessing:false},()=>{
          if(res.status)
          {
            try
            {
              //  console.log(list);
              var result = res.result.map((a,i)=>{
                a.images_list = a.images;
                a.product_name = a.name;
                a.lat = a.latitude == undefined?a.lat:a.latitude;
                a.lng = a.longitude == undefined?a.lng:a.longitude;
                a.distance_from_me = returnComma(parseFloat(calculateDistance(a.lat,this.props.Reducer.latitude,a.lng,this.props.Reducer.longitude)).toFixed(0));
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
             d = {...result[0],...d};
              Actions.view_product({productDetails:d});
            }catch(e){

            }
           
          }
           
          })

          })
         }
         getOffers()
         {
         this.setState({refreshing:true,nbrpages:1})
         postDATA("offer/getAllOffers",{
          limit:50,
          page:this.state.nbrpages
      }).then((res)=>{
         console.log(res);
         this.setState({refreshing:false},()=>{
        if(String(res.success).includes("1"))
        {
         console.log(res);
         var r = {nbrpages:0,current_page:1,per_page:12,first_nbr:0,nextpage:0,pages:[]};
         try
         {
           var pages = [];
           var dd = res.pagination;
           for(var i = 0;i < parseInt(dd.nbrpages);i++)
           {
           pages.push(`${i+1}`)
           }
           this.setState({offerPaging:pages});
         }catch(e){

         }
        var result = res.result.map((a,i)=>{
          a.images_list = a.images;
          a.product_name = a.name;
          a.lat = a.latitude == undefined?a.lat:a.latitude;
          a.lng = a.longitude == undefined?a.lng:a.longitude;
          delete a.name;
          a.distance_from_me = returnComma(parseFloat(calculateDistance(a.lat,this.props.Reducer.latitude,a.lng,this.props.Reducer.longitude)).toFixed(0));
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
        this.setState({OfferList:result})
        }
         })
          })
         }
         getEvents()
         {
         this.setState({refreshing:true})
         postDATA("event/getAllEvents",{limit:50,page:1}).then((res)=>{
         console.log(res);
         var r = {};
         if(String(res.success).includes("1"))
        {
          var r = {nbrpages:0,current_page:1,per_page:12,first_nbr:0,nextpage:0,pages:[]};
          if(res.pagination != undefined)
          {
            var pages = [];
            r.eventPaging = res.pagination;
            for(var i = 0;i < parseInt(r.nbrpages);i++)
            {
            pages.push(`${i+1}`)
            }
            this.setState({eventPaging:pages});
          }
         if(`${res.result[0]}` == undefined)
         {
          this.setState({EventList:res.result})
         }else{
           var evnt = [];
           for(var g in res.result)
           {
             evnt.push(res.result[g]);
           }
          this.setState({EventList:evnt.map((a,i)=>{
            console.log(a);
            console.log(`${a.images["200_200"]}`);
            if(a.images["200_200"] != undefined)
            {
              try{
                a.main_image = a.images["200_200"].url;
              }catch(e){
                a.main_image = null;
              }
            }else{
              a.main_image = null;
            }
            if(a.ticket != undefined)
            {
              try{
                a.lat = a.latitude == undefined?a.lat:a.latitude;
                a.lng = a.longitude == undefined?a.lng:a.longitude;
                a.distance_from_me = returnComma(parseFloat(calculateDistance(a.lat,this.props.Reducer.latitude,a.lng,this.props.Reducer.longitude)).toFixed(0));
                a.ticket = String(a.ticket).replace(/["]/g,"").replace(/['']/g,'"');
                // console.log(a.ticket);
                a.ticket = JSON.parse(a.ticket);
              }catch(e){
                a.ticket = [];
              }
            }
            return a;
          })},()=>{
         console.log(this.state.EventList);
          })
         }
        }
        this.setState({refreshing:false})
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
            EventList:[],
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
            offerPaging:[],
            eventPaging:[]
            }
            this.scrollX = new Animated.Value(0);
            this.getServices.bind();
            this.getOffers.bind();
            this.getEvents.bind();
            this.getOfferDetails.bind();
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
  <View style={{height:60,padding:10,width:width,backgroundColor:mystyle.active.color,flexDirection:"row"}}>
     <TouchableOpacity 
     onPress={()=>{
       Actions.drawerOpen();
     }}
     style={{width:40,height:35,justifyContent:"center",alignItems:"center"}} >
       <Icon.Feather name="menu"  size={25} color="white" />
     </TouchableOpacity>
      <View style={{flex:1,justifyContent:"center"}}>
        <Text style={{color:"white",fontSize:15,paddingLeft:15,fontWeight:"bold"}}>{setIndex == 0?'Service':setIndex == 1?'Offers':setIndex == 2?'Events':'Profile'}</Text>
      </View>
      {parseInt(this.props.Reducer.new_service_count)+parseInt(this.props.Reducer.chatcount) > 0?<TouchableOpacity
      onPress={()=>{
        this.getChatAlert(true);
            }} style={{width:30,marginHorizontal:5,flexDirection:"row",justifyContent:"center",alignItems:"center",height:"100%"}}>
        <Icon.FontAwesome name="bell-o" color="white" size={20} style={{marginHorizontal:2}} />
      {parseInt(this.props.Reducer.new_service_count)+parseInt(this.props.Reducer.chatcount) > 0?<Animatable.View animation="fadeOut" duration={1000} useNativeDriver iterationCount="infinite" style={{position:"absolute",top:-4,padding:2,right:0}}>
        <Text style={{color:"white"}}>{parseInt(this.props.Reducer.new_service_count)+parseInt(this.props.Reducer.chatcount)}</Text>
      </Animatable.View>:null}
      </TouchableOpacity>:null}
      <TouchableOpacity
      onPress={()=>{
        Actions.search();
      }} style={{width:30,marginHorizontal:5,flexDirection:"row",justifyContent:"center",alignItems:"center",height:"100%"}}>
        <Icon.Evilicons name="search" color="white" size={35} style={{marginHorizontal:2}} />
      </TouchableOpacity>
      <View style={{width:30,overflow:"hidden",marginHorizontal:5,flexDirection:"row",justifyContent:"center",alignItems:"center",height:"100%"}}>
      <Icon.Entypo name="dots-three-vertical" color="white" size={25} style={{marginHorizontal:2}} />
      <Picker
        mode="dropdown"
        onValueChange={(v,i)=>{
          if(i == 1)
          {
            Actions.category();
          }
          if(i == 2)
          {
            Actions.settings();
          }
          if(i == 3)
          {
            Alert.alert("Alert",`Are you sure you want to logout?`,
            [
            {text: 'No', onPress: () => {
            //  Actions.drawerClose();
            }, style: 'cancel'},
            {text: 'Yes', onPress: () => {
            AsyncStorage.clear();
            Actions.reset("login");
            }, style: 'cancel'}
            ],
            {cancelable:false})
          }
          this.setState({selectedCategory:v});
        }}
      selectedValue={this.state.selectedCategory}
      style={{width:80,color:"transparent",right:0,height:40,position:"absolute",backgroundColor: 'transparent',top:0}} 
      >
        {["Select","Categories","Settings","Logout"].map((a,i)=><Picker.Item key={i} label={a} value={a}/>)}
      </Picker>
      </View>
    </View>
  <View style={{width:width,height:height,flexDirection:"column",backgroundColor:"white"}}>
  <ScrollView 
keyboardShouldPersistTaps="always"
  nestedScrollEnabled
  style={{width:width,height:height-100,backgroundColor:"white"}}>
  <View style={{width:width,alignItems:"center",backgroundColor:mystyle.active.color,flexDirection:"column"}}>
    <Text style={{color:"white",fontSize:16}}>WeDeyNear</Text>
    </View>
  <View style={{width:width,height:50,flexDirection:"row"}}>
<TouchableOpacity
onPress={()=>{
  this.tabView.scrollTo({x:0,y:0,animated:true});
  this.setState({setIndex:0,refreshing:false});
}}
style={{backgroundColor:mystyle.active.color,flex:1,justifyContent:"center",alignItems:"center",borderBottomColor:"white",borderBottomWidth:this.state.setIndex == 0?1:0}}>
 <Icon.Entypo name="shop" color={this.state.setIndex == 0?"white":"rgba(255,255,255,0.3)"} size={25} style={{marginHorizontal:2}} />
 </TouchableOpacity>
 <TouchableOpacity onPress={()=>{
  this.tabView.scrollTo({x:width,y:0,animated:true});
  this.setState({setIndex:1,refreshing:false});
}} style={{backgroundColor:mystyle.active.color,flex:1,justifyContent:"center",alignItems:"center",borderBottomColor:"white",borderBottomWidth:this.state.setIndex == 1?1:0}}>
<Icon.FontAwesome5 name="percent" color={this.state.setIndex == 1?"white":"rgba(255,255,255,0.3)"} size={20} style={{marginHorizontal:2}} /> 
 </TouchableOpacity>
 <TouchableOpacity onPress={()=>{
  this.tabView.scrollTo({x:(width*2),y:0,animated:true});
  this.setState({setIndex:2,refreshing:false});
}} style={{backgroundColor:mystyle.active.color,flex:1,justifyContent:"center",alignItems:"center",borderBottomColor:"white",borderBottomWidth:this.state.setIndex == 2?1:0}}>
<Icon.AntDesign name="calendar" color={this.state.setIndex == 2?"white":"rgba(255,255,255,0.3)"} size={25} style={{marginHorizontal:2}} /> 
 </TouchableOpacity>
 <TouchableOpacity onPress={()=>{
  this.tabView.scrollTo({x:(width*3),y:0,animated:true});
  this.setState({setIndex:3,refreshing:false});
  if(String(this.props.Reducer.telephone).length < 8)
  {
    Alert.alert("Profile Update",`Your Mobile number is not valid, please update to increase your chance been viewed by clients and vendors, \nthanks.`, [
      {text: 'No', onPress: () => {
      
       }, style: 'cancel'},
   {text: 'Yes', onPress: () => {
 Actions.editprofile();
  }, style: 'cancel'}
     ],
     {cancelable:false})
    return ;
  }
}} style={{backgroundColor:mystyle.active.color,flex:1,justifyContent:"center",alignItems:"center",borderBottomColor:"white",borderBottomWidth:this.state.setIndex == 3?1:0}}>
<Icon.FontAwesome name="hdd-o" color={this.state.setIndex == 3?"white":"rgba(255,255,255,0.3)"} size={25} style={{marginHorizontal:2}} /> 
 </TouchableOpacity>
 </View>
  <ScrollView
  horizontal
  scrollEnabled={false}
  pagingEnabled
  ref={e=>this.tabView=e}
 style={{width:width,height:height,backgroundColor:"white"}}>
<View style={{width:width,height:height}}>
<ScrollView
nestedScrollEnabled
  refreshControl={
    <RefreshControl
    progressViewOffset={-20}
    refreshing={this.state.refreshing}
    onRefresh={()=>{
      this.setState({refreshing:true},()=>this.getServices());
      }}
    />}
 style={{width:width,height:height}}>
  {this.props.Reducer.services.length != 0?<View style={[mystyle.myalert,{}]}>
  <Text style={{fontSize:10}}>Swipe down to reload content</Text>
</View>:null}
{this.props.Reducer.services.length == 0?<View style={{flex:1}}>
<View style={[mystyle.myalert,{}]}>
  <Text>No service found!</Text>
</View>
</View>:null}
{this.props.Reducer.services.map((a,i)=><View key={i} style={{flexDirection:"column",width:width,alignItems:"center"}}>
  <TouchableOpacity 
 key={i}
 onPress={()=>{
a.offer = false;
console.log(a);
    Actions.view_product({productDetails:a});
  }}
  activeOpacity={0.9}
  style={[mystyle.card,{elevation:5,width:width-20,padding:0,minHeight:50,borderRadius:10,marginTop:10,alignSelf:"center",flexDirection:"column"}]}>
   <View style={{width:"100%",height:140,backgroundColor:"#444",marginBottom:5}}>
   <Image source={a.images.uri == null?require("../images/placeholder2.png"):a.images} style={{width:"100%",height:140}} resizeMode="cover" />
<View style={{width:"100%",height:140,backgroundColor:"#444",position:"absolute",top:0,left:0,backgroundColor:"rgba(0,0,0,0.2)"}}>
 </View>
   {a.featured != null?<View style={{position:"absolute",top:0,left:0,padding:5,width:70,backgroundColor:"#1664c0"}}>
   <Text style={[mystyle.whitetxt]}>{"featured"}</Text>
   </View>:null}
   <View style={{position:"absolute",bottom:0,left:0,padding:5,flexDirection:"row"}}>
   <Icon.FontAwesome name="star" color="#fbc004" size={20} />
   <Text style={{color:"white",marginHorizontal:2,fontSize:12}}>{a.category_name}</Text>
   </View>
   <TouchableOpacity 
   onPress={()=>{
 
     Actions.map({
       lt:a.latitude,
       lg:a.longitude,
       maptitle:a.name,
       mapaddress:a.address,
       mapimage:a.images
     })
   }}
   style={{position:"absolute",bottom:0,right:0,padding:5,alignSelf:"center",backgroundColor:mystyle.active.color,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
   <Icon.FontAwesome name="map-marker" color="white" style={{marginRight:5}}/>
   <Text style={[mystyle.whitetxt,{fontSize:10}]}>view in map ({a.distance_from_me}m)</Text>
   </TouchableOpacity>
   </View>
  <View style={{width:"100%",flexDirection:"column",padding:15,paddingVertical:10}}>
  <View style={{width:"100%"}}>
    <Text numberOfLines={1} style={[mystyle.title]} ellipsizeMode="tail">{a.product_name}</Text>
  </View>
  <View style={{width:"100%"}}>
    <Text numberOfLines={1} style={[mystyle.subtitle]}>{a.detail}</Text>
  </View>
  </View>
  </TouchableOpacity>
  {i == 1?<ReturnADS
  list={banner_150}
  size={80} />:i == 4?<ReturnADS
  list={[...banner_320,...banner_350]}
  size={320} />:null}
  </View>)}

{this.props.Reducer.services.length == 0?<View style={{flex:1}}>
   {["","",""].map((a,i)=><View key={i} style={[mystyle.card,{width:width-20,padding:10,minHeight:50,borderRadius:10,marginTop:10,alignSelf:"center",flexDirection:"column"}]}>
  <View style={{width:"100%",height:10,backgroundColor:"#f3f3f3",marginVertical:5}}>
  </View>
  <View style={{width:"100%",height:140,backgroundColor:"#f3f3f3",marginVertical:5}}>
  </View>
 <View style={{width:"100%",height:10,backgroundColor:"#f3f3f3",marginVertical:5}}>
 </View>
 <View style={{width:"100%",height:10,backgroundColor:"#f3f3f3",marginVertical:5}}>
</View>
</View>)}
</View>:null}
<ScrollView 
keyboardShouldPersistTaps="always"horizontal>
<View style={{width:width,flexDirection:"row",marginVertical:10,justifyContent:"center",alignItems:"center"}}>
{this.state.pages.map((a,i)=><TouchableOpacity 
key={i}
style={{padding:5,borderRadius:5,backgroundColor:this.state.setpage != (i+1)?"#ccc":mystyle.active.color,marginHorizontal:2,flexDirection:"row",justifyContent:"center",alignItems:"center",alignSelf:"center"}}
onPress={()=>{ 
  this.setState({setpage:parseInt(a)},()=>{
  this.getServices();
})
}} ><Text style={{color:this.state.setpage != parseInt(a)?"#000":"#fff",fontSize:12}}>{`${(i*this.state.per_page)+1}-${(i+1)*this.state.per_page}`}</Text></TouchableOpacity>)}
</View> 
   </ScrollView>
{this.props.Reducer.services.length != 0?<View style={{width:width,height:90}}></View>:null}
</ScrollView> 
</View>
<View style={{width:width,height:height}}>
<ScrollView
nestedScrollEnabled
  refreshControl={
    <RefreshControl
    // progressViewOffset={-20}
      refreshing={this.state.refreshing}
      onRefresh={()=>{
        this.setState({refreshing:true},()=>{
          this.getOffers();
        })
      }}
    />}
 style={{width:width,height:height}}>
  {this.state.OfferList.length != 0?<View style={[mystyle.myalert,{}]}>
  <Text style={{fontSize:10}}>Swipe down to reload content</Text>
</View>:null}
 {this.state.OfferList.length == 0?<View style={{flex:1}}>
  <View style={[mystyle.myalert,{}]}>
    <Text>No offer found!</Text>
  </View>
</View>:<View>
<FlatList 
scrollEnabled={false}
contentContainerStyle={{paddingBottom:10}}
keyExtractor={(item,index)=>`${index}`}
data={this.state.OfferList}
renderItem={({item,index})=>{
  var a = Moment(item?.date_end);
  var b = Moment().utc();
  var days = a.diff(b,'days');
  var expired = days < 0;
 
return expired?null:<TouchableOpacity 
 onPress={()=>{
    // Actions.view_product(item);
    // return;
 }}
 activeOpacity={0.9}
 style={[mystyle.card,{elevation:5,width:width-20,padding:0,minHeight:50,borderRadius:10,marginTop:10,alignSelf:"center",flexDirection:"column"}]}>
  <View style={{width:"100%",height:140,backgroundColor:"#444",marginBottom:5}}>
  <Image source={item?.images} style={{width:"100%",height:140}} resizeMode="cover" />
 <View style={{width:"100%",height:140,position:"absolute",top:0,left:0,backgroundColor:"rgba(0,0,0,0.2)"}}>
</View>
  <View style={{position:"absolute",left:0,top:0,padding:5,flexDirection:"row",backgroundColor:"#1170c7",width:56}}>
  <Text style={{color:"white",marginHorizontal:2,fontSize:10}}>featured</Text>
  </View>
  
  <View style={{position:"absolute",top:40,left:0,padding:5,flexDirection:"row"}}>
  <View style={{flex:1,flexDirection:"column"}}>
  <Text style={{color:"white",marginHorizontal:2}}>Initail Price</Text>
  <Text style={{color:"white",marginHorizontal:2,fontSize:20}}>NGN{returnComma(item?.actual_price)}</Text>
  </View>
  <View style={{flex:1,flexDirection:"column"}}>
  <Text style={{color:"white",marginHorizontal:2}}>Discounted Price</Text>
  <Text style={{color:"white",marginHorizontal:2,fontSize:20}}>NGN{returnComma(parseFloat(item?.actual_price) - (parseInt(item?.percent)/100)*parseFloat(item?.actual_price))}</Text>
  </View>
  </View>
  <View style={{position:"absolute",bottom:0,left:0,padding:5,flexDirection:"column",justifyContent:"center",width:"100%"}}>
  <View style={{flexDirection:"row"}}>
  <Text style={{color:"white",marginHorizontal:2}}>{item.percent}</Text>
  <Icon.FontAwesome name="percent" color="#ffffff" size={20} />
  <Text style={{color:"white",marginHorizontal:2}}> off</Text>
  <Text style={{color:"white",marginHorizontal:2}}> - ends - {Moment(item?.date_end).format("Do, MMM YYYY hh:mm a")}</Text>
</View>
<Animatable.Text animation="fadeOut" iterationCount="infinite" useNativeDriver style={{color:"yellow",fontSize:10}}>- {days} days to go -</Animatable.Text>
  </View>
  <View style={{position:"absolute",top:0,right:0,alignSelf:"center",backgroundColor:mystyle.active.color,flexDirection:"row"}}>
  <View style={{flex:1,padding:5,alignItems:"center"}}>
  <Text style={[mystyle.whitetxt,{fontSize:10}]}>offer in {item?.distance_from_me}m</Text>
  </View>
  <View style={{padding:5,width:60,backgroundColor:"#c4403c",alignItems:"center"}}>
  <Text style={[mystyle.whitetxt,{fontSize:10}]}>PROMO</Text>
  </View>
  </View>
  </View>
 <View style={{width:"100%",flexDirection:"row",padding:15,paddingVertical:10}}>
 <View style={{flex:1}}>
 <View style={{width:"100%"}}>
   <Text numberOfLines={1} style={[mystyle.title]} ellipsizeMode="tail">{item?.store_name}</Text>
 </View>
 <View style={{width:"100%"}}>
   <Text numberOfLines={1} ellipsizeMode="tail" style={[mystyle.subtitle]}>{String(item?.description).replace(/<[^>]*>?/gm, '')}</Text>
 </View>
 </View>
 <TouchableOpacity 
 onPress={()=>{
  // Linking.openURL("tel:"+this.props.support_phone)
  this.getOfferDetails(item);
}}
 style={{height:30,marginHorizontal:5,justifyContent:"center",alignItems:"center",width:70,backgroundColor:mystyle.active.color,borderRadius:40,elevation:3}}>
 <Text style={[mystyle.whitetxt,{fontSize:10}]}>More...</Text>
 </TouchableOpacity>
 </View>
 </TouchableOpacity>}
}
/>
<ScrollView 
keyboardShouldPersistTaps="always"horizontal>
<View style={{width:width,flexDirection:"row",marginVertical:10,justifyContent:"center",alignItems:"center"}}>
{this.state.offerPaging.map((a,i)=><TouchableOpacity 
style={{padding:5,borderRadius:5,backgroundColor:this.state.setpage != (i+1)?"#ccc":mystyle.active.color,marginHorizontal:2,flexDirection:"row",justifyContent:"center",alignItems:"center",alignSelf:"center"}}
onPress={()=>{ 
  this.setState({setOffpage:parseInt(a)},()=>{
  this.getOffers();
})
}} key={i} ><Text style={{color:this.state.setOffpage != parseInt(a)?"#000":"#fff",fontSize:12}}>{`${(i*this.state.per_page)+1}-${(i+1)*this.state.per_page}`}</Text>
</TouchableOpacity>)}
</View> 
   </ScrollView>
</View>}
{["","","",""].filter((a,i)=>i < (5-(OfferList.length+1))).map((a,i)=><View key={i} style={[mystyle.card,{width:width-20,padding:10,minHeight:50,borderRadius:10,marginTop:10,alignSelf:"center",flexDirection:"column"}]}>
  <View style={{width:"100%",height:10,backgroundColor:"#f3f3f3",marginVertical:5}}>
  </View>
  <View style={{width:"100%",height:140,backgroundColor:"#f3f3f3",marginVertical:5}}>
  </View>
 <View style={{width:"100%",height:10,backgroundColor:"#f3f3f3",marginVertical:5}}>
 </View>
 <View style={{width:"100%",height:10,backgroundColor:"#f3f3f3",marginVertical:5}}>
</View>
</View>)}
</ScrollView>
</View>
<View style={{width:width,height:height}}>
<ScrollView
  nestedScrollEnabled
   refreshControl={
    <RefreshControl
    progressViewOffset={-20}
      refreshing={this.state.refreshing}
      onRefresh={()=>{
        this.setState({refreshing:true},()=>this.getEvents())
      }}
    />}
 style={{width:width,height:height}}>
    {this.state.EventList.length != 0?<View style={[mystyle.myalert,{}]}>
  <Text style={{fontSize:10}}>Swipe down to reload content</Text>
</View>:null}
   {EventList.length == 0?<View style={{flex:1}}>
<View style={[mystyle.myalert,{}]}>
  <Text>No content found!</Text>
</View>
 {["","","",""].map((a,i)=><View key={i} style={[mystyle.card,{width:width-20,padding:10,minHeight:50,borderRadius:10,marginTop:10,alignSelf:"center",flexDirection:"column"}]}>
<View style={{width:"100%",height:10,backgroundColor:"#f3f3f3",marginVertical:5}}>
</View>
<View style={{width:"100%",height:140,backgroundColor:"#f3f3f3",marginVertical:5}}>
</View>
<View style={{width:"100%",height:10,backgroundColor:"#f3f3f3",marginVertical:5}}>
</View>
<View style={{width:"100%",height:10,backgroundColor:"#f3f3f3",marginVertical:5}}>
</View>
</View>)}
</View>:
   <View style={{padding:10,backgroundColor:"white"}}>
     <Text>Buy tickets to your favorite events</Text>
   </View>}
  <FlatList
  contentContainerStyle={{paddingBottom:150}}
  keyExtractor={(item,index)=>`key${index}`}
  data={EventList}
  renderItem={({item,index})=><View
  style={[mystyle.card,{elevation:5,width:width-20,padding:0,minHeight:50,borderRadius:10,marginTop:10,alignSelf:"center",flexDirection:"column"}]}>
   <View style={{width:"100%",height:140,backgroundColor:"#444",marginBottom:5}}>
   <Image source={item.main_image == null?require("../images/placeholder2.png"):{uri:item.main_image}} style={{width:"100%",height:140}} resizeMode="cover" />
  <View style={{width:"100%",height:140,position:"absolute",top:0,left:0,backgroundColor:"rgba(0,0,0,0.4)"}}>
  <View style={{flexDirection:"column",position:"absolute",position:"absolute",top:0,left:-13}}>
  {["","","","",""].map((d,o)=><View key={o} style={{width:20,height:20,borderRadius:30,backgroundColor:"rgba(255,255,255,0.7)",marginVertical:5}}></View>)}
 </View>
 <View style={{flexDirection:"column",position:"absolute",position:"absolute",top:0,right:-13}}>
  {["","","","",""].map((d,o)=><View key={o} style={{width:20,height:20,borderRadius:30,backgroundColor:"rgba(255,255,255,0.7)",marginVertical:5}}></View>)}
 </View>
 </View>
   <View style={{position:"absolute",bottom:0,left:0,padding:5,paddingLeft:20,flexDirection:"row"}}>
   <Icon.FontAwesome name="phone" color="#fbc004" size={20} />
   <Text style={{color:"white",marginHorizontal:2}}>{item?.tel}</Text>
   </View>
   <TouchableOpacity
   onPress={()=>{
   try
   {
     Actions.map({
       lt:item.lat,
       lg:item.lng,
       maptitle:item?.name,
       mapaddress:item?.address,
       mapimage:item?.main_image
     })
   }catch(e){}
    // alert(JSON.stringify(item.lng))
   }}
    style={{position:"absolute",bottom:0,right:0,padding:5,alignSelf:"center",backgroundColor:mystyle.active.color,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
   <Icon.FontAwesome name="map-marker" color="white" style={{marginRight:5}}/>
   <Text style={[mystyle.whitetxt,{fontSize:10}]}>view in map({item?.distance_from_me}m)</Text>
   </TouchableOpacity>
   </View>
   <View style={{width:"100%",flexDirection:"row"}}>
  <View style={{flex:1,flexDirection:"column",padding:15,paddingVertical:10}}>
  <View style={{width:"100%"}}>
    <Text numberOfLines={1} style={[mystyle.title]} ellipsizeMode="tail">{item?.name}</Text>
  </View>
  <View style={{width:"100%"}}>
    <Text numberOfLines={2} ellipsizeMode="tail" style={[mystyle.subtitle]}>{item?.description}</Text>
  </View>
  </View>
  <View style={{width:110}}>
  <TouchableOpacity 
  onPress={()=>{
    // console.log(item);
    // return ;
  item.actual_price = item?.service_price;
  // console.log(item);
  // return ;
   Actions.view_events({event_data:item});
  }}
  activeOpacity={0.5}
  style={[mystyle.btn,{width:90,paddingVertical:5,marginTop:10}]}
  >
<Text style={{fontSize:12,color:"white"}}>Book Now</Text>
  </TouchableOpacity>
  </View>
  </View>
  </View>}
  />
   </ScrollView>
   </View>
<View style={{width:width,height:height}}>
<Profile />
</View>
</ScrollView>

</ScrollView>
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
 </View>
{/* <VerifyBusinessView   /> */}
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
    export default connect(mapStateToProps)(HomeClass);
    