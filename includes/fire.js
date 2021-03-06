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
   Alert,
   AsyncStorage,
   DeviceEventEmitter,
    Modal } from 'react-native';
import PushNotification from 'react-native-push-notification';
import Moment from 'moment';
import firebase from 'firebase'; 

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey:"AIzaSyAxk6-y3UFwM0pP1deA_FDtxOjvwqXFmBg",
    authDomain:"wedeynear-dcf63.firebaseapp.com",
    databaseURL:"https://wedeynear-dcf63.firebaseio.com",
    projectId:"wedeynear-dcf63",
    storageBucket:"wedeynear-dcf63.appspot.com",
    messagingSenderId:"568520040394",
    appId:"1:568520040394:web:f1d90e467ba1aaca773933",
    measurementId: "G-9PHHQVN26E",

  });
}

export async function NotifyAlert()
{
    PushNotification.configure({
        senderID:"wedeynear001",
        popInitialNotification:true,
        requestPermissions:true
    });
  
}

export function sendNotification(key,data)
{
    // Defined in above step
    var bb = JSON.stringify({
      to:key,
      collapse_key:"type_a",
      type:data.type,
      priority: "high",
      data:data})
      console.log("push chat:",bb);
    return fetch("https://fcm.googleapis.com/fcm/send", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization':'key=AAAAhF5vX8o:APA91bFim4A0_Bn0odzi_DzWE6FE5A4TTIlhG1EwpxHhigW7NT-5CPkDDed98bdLkINhsE_hLNwGVmWVAYAhlqedjwd-c9n6ZKzCusN2J4_oR4XFtCLulPRPeGb67EPO8iYeXi2YliIy'
      },
      body: bb
    }).then((res)=>res.text()).then((res)=>{
      console.log(res);
    });
    // Defined in next step
}
export function sendLocalNotification(data)
{
  var id = new Date().getTime();
  var notfData = {
    /* Android Only Properties */
    showWhen: true, // (optional) default: true
    autoCancel: true, // (optional) default: true
    largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
    largeIconUrl: "ic_launcher", // (optional) default: undefined
    smallIcon: "ic_launcher", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
    color: "red", // (optional) default: system default
    vibrate: true, // (optional) default: true
    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    ongoing: false, // (optional) set whether this is an "ongoing" notification
    priority: "high", // (optional) set notification priority, default: high
    visibility: "private", // (optional) set notification visibility, default: private
    importance: "high", // (optional) set notification importance, default: high
    ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)
    channelId: id, // (optional) custom channelId, if the channel doesn't exist, it will be created with options passed above (importance, vibration, sound). Once the channel is created, the channel will not be update. Make sure your channelId is different if you change these options. If you have created a custom channel, it will apply options of the channel.
    onlyAlertOnce: false, // (optional) alert will open only once with sound and notify, default: false
    
    when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
    usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
    timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null
  
    messageId:id, // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module. 
    invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
  
    /* iOS only properties */
    alertAction: "view", // (optional) default: view
    category: "", // (optional) default: empty string
  
    /* iOS and Android properties */
    id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
    message: data.body == undefined?"WeDeyNear Notification":data.body, // (required)
    userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
    playSound: true, // (optional) default: true
    soundName: "default", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    title:data.title == undefined?"WeDeyNear notification":data.title,
    body:data.body == undefined?"You have a notification from WeDeyNear app":data.body,
    subText:Moment().format("Do MMM, YYYY hh:mm A"),
    permissions: {
      alert: true,
      badge: true,
      sound: true
    },
     popInitialNotification: true,
    requestPermissions: true,
    data:data
  }
  if(data.bigText != undefined)
  {
    notfData.bigText = data.bigText;
  }

  if(data.ticker != undefined)
  {
    notfData.ticker = data.ticker;
  }
  if(data.bigPictureUrl != undefined)
  {
    notfData.bigPictureUrl = data.bigPictureUrl;
  }
  if(data.btn == undefined)
  {
    notfData.actions = data.btn;
  }
  console.log("notfData",notfData);
  PushNotification.localNotification(notfData);

}

