
import React,{PureComponent, useState,useLayoutEffect, createElement} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  RefreshControl,
  WebView,
  Linking,
  ActivityIndicator
} from 'react-native';
// plugins
import * as Animatable from 'react-native-animatable'
// include files
import {connect} from 'react-redux';
import Icon from '../includes/icons';
const {width,height} = Dimensions.get("screen");
import Moment from 'moment';

// import WebView from 'react-native-webview';
class ChatBoard extends PureComponent{
    componentDidMount()
    {
     
    }
    constructor(props)
    {
        super(props)
        this.state = {
            selectedChats:[]
        }
        this.refObj = {}
    }
    
    returnString(url,me)
    {

      const color = "black";
      const sz = 14;
      return url.split(" ").map((a,i)=>{
        if(String(a).includes("\n"))
        {
         a = `${String(a).replace("\n","")}`;
        }
        if(a.trim() == "")
        {
          return null
        }else if(!isNaN(a.trim()))
        {
          return <TouchableOpacity key={i} onPress={()=>{
            Linking.openURL(`tel:${a}`)
          }} style={{alignSelf:"flex-start"}} ><Text style={{textDecorationLine:"underline",color:"blue",fontSize:sz,alignSelf:"center"}}>{a} </Text></TouchableOpacity>
        }else if(String(a).includes("@") && String(a).includes("."))
        {
        return <TouchableOpacity key={i} onPress={()=>{
          Linking.openURL(`mailto:${a}`)
        }} style={{alignSelf:"flex-start"}} ><Text style={{textDecorationLine:"underline",color:"blue",fontSize:sz,alignSelf:"center"}}>{a} </Text></TouchableOpacity>
        }else{
        return <Text key={i} style={{textDecorationLine:String(a).includes("@") && String(a).includes(".")?"underline":"none",color:color,fontSize:sz,alignSelf:"center"}}>{a} </Text>
        }
      })
    }
   
    render()
    {
        
        const {list,selectedKey,room,placeholder,id_user} = this.props;
        const {selectedChats} = this.state;
     return list.map((a,i,self)=>{
        this.setState({selectedChats:this.props.selectedKey})
        var avatar = String(a?.avatar?.uri).replace("/public/avatar.png","") == ""?placehoder_avatar:a.avatar
        a.avatar = avatar;
        a.selected = selectedChats.includes(a.key);

        var hasUrl = false;
        if(a.file == null || a.file == "")
        {
          a.file = {uri:""}
        }
        hasUrl = a.file.uri.replace("https:","http:").includes("image/png");
        // alert(JSON.stringify(a.file));
        //a?.file != ""?a.file.uri.replace("https:","http:").includes("http"):;
        return a?.deleted?<View key={i} style={{width:"100%",height:35,marginVertical:5}}>
          {a.id !== id_user?<View style={{padding:5,left:35,paddingHorizontal:15,position:"absolute",alignSelf:"center",flexDirection:"row",justifyContent:"center",alignItems:"center",borderWidth:0.5,borderRadius:20,borderColor:"#aaa",backgroundColor:"rgba(255,255,255,0.4)"}}>
          <Icon.FontAwesome name="info-circle" size={11} />
          <Text style={{fontSize:10,marginLeft:5}}>Deleted</Text>
          </View>:<View style={{padding:5,right:35,paddingHorizontal:15,position:"absolute",alignSelf:"center",flexDirection:"row",justifyContent:"center",alignItems:"center",borderWidth:0.5,borderRadius:20,borderColor:"#aaa",backgroundColor:"rgba(255,255,255,0.4)"}}>
          <Icon.FontAwesome 
          name="info-circle" size={11} 
          />
          <Text 
          style={{fontSize:10,marginLeft:5}}
          >Deleted</Text>
          </View>}
        </View>:<TouchableOpacity 
        activeOpacity={1}
     onLongPress={()=>{
       // ...selectedChats.filter((b,i)=>b != a.key),
         var l = [`${a.key}`];
         this.setState({selectedChats:l},()=>{
            this.props.selectedList(l);
         })
     }}
     onPress={()=>{
       if(selectedChats.length != 0)
       {
         var add = selectedChats.filter((b,i)=>b != `${a.key}`);
         var fl = selectedChats.filter((b,i)=>b == `${a.key}`);
        this.setState({selectedChats:fl.length == 1?add:[a.key,...selectedChats]},()=>{
            this.props.selectedList(fl.length == 1?add:[a.key,...selectedChats])
        })
      }
     }}
     key={i}
     style={{width:"100%",flexDirection:"column"}}>
         {a.selected?<View style={{width:"100%",height:"85%",marginTop:20,flexDirection:"row",marginBottom:5,backgroundColor:"rgba(0,0,0,0.1)",position:"absolute"}}>
         </View>:null}
         {a.showDate?<Text style={{padding:5,backgroundColor:"#999",borderRadius:10,paddingHorizontal:10,alignSelf:"center",fontSize:9,color:"white"}}>{Moment(a.date).format("Do MMMM YYYY")}</Text>:null}
         {a.id !== id_user?<View key={i} style={{width:"100%",padding:10,paddingTop:15,flexDirection:"row",marginBottom:5}}>
         <View style={{alignSelf:"center",marginRight:30,marginLeft:25,padding:2,paddingLeft:2,backgroundColor:"#fcd2d2",borderRadius:10,justifyContent:"center"}}>
         {a?.file?.uri !== "" && a?.type !== "chat"  && String(a?.type).toLowerCase() !== "text"?<View 
  style={{height:100}}>
<TouchableOpacity 
onPress={()=>{
  this.props.downloads(a)
}}
style={{width:130,overflow:"hidden",borderColor:"#eee",borderWidth:2,backgroundColor:"#444",borderRadius:10,height:100,justifyContent:"center",alignItems:"center"}}
 >
  {a.fileUploading?<ActivityIndicator size="small" color="orange" />:a?.type == "IMAGE"?hasUrl?<Image
    source={a?.file}
    style={{width:"100%",height:"100%"}}
    resizeMode="cover"
   />:<View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"#eee"}}>
     <Text>{a?.type}</Text>
     </View>:<View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"#eee"}}>
     <Text>{a?.type}</Text>
     </View>}
<View style={{backgroundColor:"white",padding:5,flexDirection:"row",justifyContent:"center",alignItems:"center",position:"absolute",bottom:0,width:"100%"}}>
  <Text style={{color:"#999",fontWeight:"bold",fontSize:10}}>{a?.type} File</Text>
  <View style={{width:15,justifyContent:"center",alignItems:"center",height:15,borderRadius:15,backgroundColor:"#eee",borderColor:"limegreen",borderWidth:1,position:"absolute",right:5}}>
<Text style={{fontSize:5,color:"black"}}>{a?.percentage}</Text>
  </View>
</View>
 </TouchableOpacity>
 </View>:null} 
 {a?.chatReply?<View 
 style={{width:"85%",marginLeft:"15%",backgroundColor:"#eee",opacity:0.8,borderRadius:10,flexDirection:"row",justifyContent:"center",alignItems:"center"}}
 >
 <View style={{height:"70%",width:2,backgroundColor:"#444",margin:5}}></View>
 <View style={{flex:1,flexDirection:"column"}}>
 <Text style={{fontSize:12,fontWeight:"bold",marginLeft:8}}>{a?.reply?.chatInfo?.nickName}</Text>
{a.reply.file != ""  && String(a?.type).toLowerCase() !== "text"?<View 
style={{width:100,height:100,opacity:0.7}}>
<View 
onPress={()=>{
  // this.props.downloads(a.reply)
}}
style={{width:130,overflow:"hidden",borderColor:"#eee",borderWidth:2,backgroundColor:"#444",borderRadius:15,height:100,justifyContent:"center",alignItems:"center"}}
 >
 {a.fileUploading?<ActivityIndicator size="small" color="orange" />:a?.type == "IMAGE"?hasUrl?<Image
    source={a?.file}
    style={{width:"100%",height:"100%"}}
    resizeMode="cover"
   />:<View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"#eee"}}>
     <Text>{a.type}</Text>
     </View>:<View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"#eee"}}>
     <Text>{a.type}</Text>
     </View>}
<View style={{backgroundColor:"white",padding:5,flexDirection:"row",justifyContent:"center",alignItems:"center",position:"absolute",bottom:0,width:"100%"}}>
  <Text style={{color:"#999",fontWeight:"bold",fontSize:10}}>{a?.reply.type} File</Text>
  <View style={{width:15,justifyContent:"center",alignItems:"center",height:15,borderRadius:15,backgroundColor:"#eee",borderColor:"limegreen",borderWidth:1,position:"absolute",right:5}}>
<Text style={{fontSize:5,color:"black"}}>100</Text>
  </View>
</View>
 </View>
 </View>:null}
 {a?.reply?.content !== ""?<Text style={{color:"#444",fontSize:sz,padding:5,paddingTop:0}}>{a?.reply?.content}</Text>:null}
 </View>
 </View>:null}   
 {/* <ReturnWebsite 
 content ={a.content}
 itemkey={a.key} 
 room={room}
 updateItem={()=>{
  this.props.updateItem(a.key);
}}
title={a?.hasWebsite?.title}
body={a?.hasWebsite?.body}
logo={a?.hasWebsite?.logo}
 /> */}
     <View style={{flexWrap:"wrap",flexDirection:"row",alignItems:"flex-start",justifyContent:"flex-start",paddingHorizontal:10}}>
       {!a?.chatReply && a?.file?.uri == ""?<Text style={{width:12}}></Text>:null}
       {a?.chatReply || a?.file != ""?this.returnString(`${a.content}`,true):this.returnString(`${a.content}`,true)}</View>
          </View>
          <View style={{flex:1,flexDirection:"row",alignItems:"center",justifyContent:"flex-end",paddingTop:30}}>
          </View>
          <TouchableOpacity
          ref={e=>this.refObj[`${i}`] = e}
          activeOpacity={0.9}
          onPress={()=>{
          this.refObj[`${i}`].measure((a,b, width, height, px, py)=>{
          //left
          this.props.showPreviewAvatar({showPreviewAvatar:avatar,x:-(px),y:-(py),width,height})
            })
          }}
          style={{overflow:"hidden",zIndex:999,backgroundColor:"#444",width:45,height:45,borderRadius:45,position:"absolute",top:0,left:10}}
          >
              <Image 
                style={{flex:1}}
                source={a?.avatar}
                resizeMode="cover"
              />
          </TouchableOpacity>
      </View>:<View key={i} style={{width:"100%",padding:10,flexDirection:"row",marginBottom:5,paddingTop:20,justifyContent:"flex-end",alignItems:"flex-end"}}>
      <View style={{flex:1,backgroundColor:"red",justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
      </View>
      <View style={{alignSelf:"center",marginRight:20,padding:2,backgroundColor:"#fcd2f7",borderRadius:20,paddingRight:a?.reply?2:15,justifyContent:"center",alignItems:"flex-end",overflow:"hidden"}}>
      {a?.file?.uri !== "" && a?.type !== "chat"  && String(a?.type).toLowerCase() !== "text"?<View 
  style={{width:100,height:100}}>
<TouchableOpacity 
activeOpacity={a?.file == "error"?1:0.5}
onPress={()=>{
  if(a?.file !== "error")
  {
    this.props.downloads(a)
  }
}}
style={{width:130,overflow:"hidden",borderColor:"#eee",borderWidth:2,backgroundColor:"#444",borderRadius:15,height:100,justifyContent:"center",alignItems:"center"}}
 >
  {String(a?.file?.uri).includes("content:")?<View 
  style={{width:"100%",height:"100%",justifyContent:"center",alignItems:"center"}}
  ><ActivityIndicator size="small" color="orange" 
  /></View>:a?.type == "IMAGE"?<Image
    source={a.file}
    style={{width:"100%",height:"100%"}}
    resizeMode="cover"
   />:a?.file == "error"?<Image
   source={require("../images/noimage.png")}
   style={{width:"100%",height:"100%"}}
   resizeMode="cover"
  />:a?.type !== "Text"?null:<View 
  style={{width:"100%",height:"100%",justifyContent:"center",alignItems:"center",backgroundColor:"#eee"}}
  >
   <Icon.FontAwesome name={`file-o`} size={35} color="rgba(0,0,0,0.2)"/>
    </View>}
<View style={{backgroundColor:"white",padding:5,flexDirection:"row",justifyContent:"center",alignItems:"center",position:"absolute",bottom:0,width:"100%"}}>
  <Text style={{color:"#999",fontWeight:"bold",fontSize:10}}>{a?.type} File</Text>
  <View style={{width:15,justifyContent:"center",alignItems:"center",height:15,borderRadius:15,backgroundColor:"#eee",borderColor:"limegreen",borderWidth:1,position:"absolute",right:5}}>
<Text style={{fontSize:5,color:"black"}}>{a?.percentage}</Text>
  </View>
</View>
 </TouchableOpacity>
 </View>:null} 
 {a?.chatReply?<View 
 style={{width:"100%",backgroundColor:"#eee",opacity:0.8,borderRadius:10,flexDirection:"row",justifyContent:"center",alignItems:"center"}}
 >
 <View style={{height:"70%",width:2,backgroundColor:"#444",margin:5}}></View>
 <View style={{flex:1,flexDirection:"column"}}>
 <Text style={{fontSize:12,fontWeight:"bold",marginRight:8}}>{a.reply.chatInfo.nickName}</Text>
 {a.reply.file != "" && String(a.reply?.type).toLowerCase() !== "text"?<View 
  style={{width:100,height:100,opacity:0.7}} >
<View 
onPress={()=>{
  this.props.downloads(a)
}}
style={{width:130,overflow:"hidden",borderColor:"#eee",borderWidth:2,backgroundColor:"#444",borderRadius:15,height:100,justifyContent:"center",alignItems:"center"}}
 >
  {a?.reply.type == "IMAGE"?hasUrl?<Image
    source={a.file}
    style={{width:"100%",height:"100%"}}
    resizeMode="cover"
   />:<ActivityIndicator 
   onLayout={()=>{
     
   }}
   size="small" color="orange" />:null}
<View style={{backgroundColor:"white",padding:5,flexDirection:"row",justifyContent:"center",alignItems:"center",position:"absolute",bottom:0,width:"100%"}}>
<Text style={{color:"#999",fontWeight:"bold",fontSize:10}}>{a?.reply.type} File</Text>
<View style={{width:15,justifyContent:"center",alignItems:"center",height:15,borderRadius:15,backgroundColor:"#eee",borderColor:"limegreen",borderWidth:1,position:"absolute",right:5}}>
<Text style={{fontSize:5,color:"black"}}>100</Text>
</View>
</View>
 </View>
 </View>:null}
 {a?.reply?.content !== ""?<Text style={{color:"#444",fontSize:12,padding:5,paddingTop:0}}>{a?.reply?.content}</Text>:null}
 </View>
 </View>:null}  
 {/* <ReturnWebsite 
 content={a.content}
 itemkey={a.key} 
 room={room}
 updateItem={(str)=>{
   this.props.updateItem(a.key,str);
 }}
 title={a?.hasWebsite?.title}
 body={a?.hasWebsite?.body}
 logo={a?.hasWebsite?.logo}
 /> */}
  {a?.content !== ""?<View style={{marginLeft:10,flexWrap:"wrap",flexDirection:"row",alignItems:"flex-start",justifyContent:"flex-start",paddingHorizontal:10}}>{this.returnString(`${a.content}`,true)}</View>:null}
          </View>
          <TouchableOpacity
           ref={e=>this.refObj[`${i}`] = e}
           activeOpacity={0.9}
           onPress={()=>{
             // right
            this.refObj[`${i}`].measure((a,b, width, height, px, py)=>{
            this.props.showPreviewAvatar({showPreviewAvatar:avatar,x:px,y:py,width,height})
              })
          }}
          style={{overflow:"hidden",zIndex:999,backgroundColor:"#444",width:45,height:45,borderRadius:45,position:"absolute",top:0,right:10,elevation:1}}
          >
              <Image 
                style={{flex:1}}
                source={a?.avatar}
                resizeMode="cover"
              />
          </TouchableOpacity>
      </View>
        }
 <View style={{flexDirection:"row",width:"100%"}}>  
 <View style={{flex:1,flexDirection:"column"}}>  
 <Text style={{borderRadius:10,paddingHorizontal:40,textAlign:a.id == id_user?"right":"left",fontSize:9,color:"black",marginTop:-15,fontWeight:"bold"}}>{a?.chatInfo?.nickName}</Text>
 <Text style={{borderRadius:10,paddingHorizontal:40,textAlign:a.id == id_user?"right":"left",fontSize:9,color:"black",marginTop:0,marginBottom:a.content == ""?10:0}}>{a?.time}</Text>
 </View>  
 </View>  
 </TouchableOpacity>})}
  }
 
 ChatBoard.defaultProps = {
  content:[],
   selectedList:()=>{},
   deselectList:()=>{},
   selectedKey:[],
   downloads:{},
   room:"",
   updateItem:()=>{},
   showPreviewAvatar:()=>{}
 }
 const mapStateToProps = (state) => {
    return state;
  };
  export default connect(mapStateToProps)(ChatBoard);

  const ReturnWebsite = ({content = "",updateItem,title,body})=>{ 
    
      var str = [];
      try {
        str = String(content).split(" ").filter((a,i)=>String(a).toLowerCase().includes("http:"));
      } catch (error) {
        
      }
      
      if(str.length > 0)
      {
      return <View 
      onLayout={()=>{
       updateItem(str);
      }}
      style={{width:"100%",minWidth:width/2,minHeight:30,borderRadius:5,overflow:"hidden",justifyContent:"center",flexDirection:"column"}}>
      <TouchableOpacity 
      onPress={()=>{
        Linking.openURL(str[0])
      }}
      activeOpacity={0.9}
style={{backgroundColor:"white",width:"100%",borderRadius:5,justifyContent:"center",flexDirection:"row"}}>
      
        <Image 
        source={{uri:this.props.logo}}
        style={{width:40,backgroundColor:"#444",height:40,margin:5}}
        resizeMode="stretch"
        />
        <View style={{flexDirection:"column",flex:1,justifyContent:"center"}}>
        <Text style={{fontSize:10}} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
        <Text style={{fontSize:9}} numberOfLines={1} ellipsizeMode="tail">{body}</Text>
        </View>
      </TouchableOpacity>
      </View>
      }
      return <View ></View>;
    }
 
  