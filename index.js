import React, {PureComponent} from 'react';
import {AppRegistry,AsyncStorage,DeviceEventEmitter} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {NotifyAlert,sendLocalNotification} from './includes/fire';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
var chats = [];
var services = [];
import { Provider } from 'react-redux';
import configureStore from './includes/store';
// AsyncStorage.removeItem("chat");
NotifyAlert();
messaging().onMessage(async remoteMessage => {
    var data  = remoteMessage.data;
    console.log("remoteMessage:",data);
    // return;
    if(data.type == "chat")
    {
    AsyncStorage.getItem("chat").then((ch)=>{
      if(ch == null)
      {
     chats = [data];
     AsyncStorage.setItem("chat",JSON.stringify(chats))
    }else{
     chats = JSON.parse(ch);
     chats = [...chats,data];
    }
      AsyncStorage.setItem("chat",JSON.stringify(chats))
      PushNotification.setApplicationIconBadgeNumber(chats.length);
      DeviceEventEmitter.emit("chat",chats.length);
    })
    }else{
      AsyncStorage.getItem("new_service").then((ns)=>{
        if(ns == null)
        {
        services = [data];
       AsyncStorage.setItem("new_service",JSON.stringify(services))
      }else{
        services = JSON.parse(ns);
        services = [...services,data];
      }
        AsyncStorage.setItem("new_service",JSON.stringify(services))
        PushNotification.setApplicationIconBadgeNumber(services.length);
        DeviceEventEmitter.emit("new_service",services.length);
      })
    }
   sendLocalNotification(data);
  });
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    var data  = remoteMessage.data;
    if(data.type == "chat")
    {
    AsyncStorage.getItem("chat").then((ch)=>{
      if(ch == null)
      {
     chats = [data];
     AsyncStorage.setItem("chat",JSON.stringify(chats))
    }else{
     chats = JSON.parse(ch);
     chats = [...chats,data];
    }
      AsyncStorage.setItem("chat",JSON.stringify(chats))
      PushNotification.setApplicationIconBadgeNumber(chats.length);
      DeviceEventEmitter.emit("chat",chats.length);
    })
    }else{
      AsyncStorage.getItem("new_service").then((ns)=>{
        if(ns == null)
        {
          services = [data];
       AsyncStorage.setItem("new_service",JSON.stringify(services))
      }else{
        services = JSON.parse(ns);
        services = [...services,data];
      }
        AsyncStorage.setItem("new_service",JSON.stringify(services))
        PushNotification.setApplicationIconBadgeNumber(services.length);
        DeviceEventEmitter.emit("new_service",services.length);
      })
    }
   sendLocalNotification(data);
  });

const store = configureStore();
const ReduxOp = () =><Provider store={store}>
  <App />
</Provider>
AppRegistry.registerComponent(appName, () => ReduxOp);

