import React, {PureComponent} from 'react';
import {Alert,Modal,FlatList,AsyncStorage, Animated,Text, View, TouchableOpacity,Dimensions } from 'react-native';
import Icon from '../includes/icons';
import mystyle from '../includes/mystyle';
const {width,height} = Dimensions.get("window");
import {Picker} from '@react-native-picker/picker'
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';

function MyTabBar({ state, descriptors, navigation, position,Reducer }) {
    console.log("state:",Reducer);
const [selectedCategory,SeTselectedCategory] = React.useState("");
const [showDropDown,SeTshowDropDown] = React.useState(false);

    return (<View style={{flexDirection: 'column',width:width,backgroundColor:mystyle.active.color}}>
    <View style={{height:60,padding:10,width:width,flexDirection:"row"}}>
     <TouchableOpacity 
     onPress={()=>{
    //    Actions.drawerOpen();
     }}
     style={{width:40,height:35,justifyContent:"center",alignItems:"center"}} >
       <Icon.Feather name="menu"  size={25} color="white" />
     </TouchableOpacity>
     <View style={{flex:1,justifyContent:"center"}}>
        <Text style={{color:"white",fontSize:14,paddingLeft:15,fontWeight:"bold"}}>{state.routeNames[state.index]}</Text>
      </View>
      {parseInt(Reducer.new_service_count)+parseInt(Reducer.chatcount) > 0?<TouchableOpacity
      onPress={()=>{
        // this.getChatAlert(true);
            }} style={{width:30,marginHorizontal:5,flexDirection:"row",justifyContent:"center",alignItems:"center",height:"100%"}}>
        <Icon.FontAwesome name="bell-o" color="white" size={20} style={{marginHorizontal:2}} />
      {parseInt(Reducer.new_service_count)+parseInt(Reducer.chatcount) > 0?<Animatable.View animation="fadeOut" duration={1000} useNativeDriver iterationCount="infinite" style={{position:"absolute",top:-4,padding:2,right:0}}>
        <Text style={{color:"white"}}>{parseInt(Reducer.new_service_count)+parseInt(Reducer.chatcount)}</Text>
      </Animatable.View>:null}
      </TouchableOpacity>:null}
      <TouchableOpacity
      onPress={()=>{
        navigation.navigate("search");
      }} style={{width:30,marginHorizontal:5,flexDirection:"row",justifyContent:"center",alignItems:"center",height:"100%"}}>
        <Icon.Evilicons name="search" color="white" size={35} style={{marginHorizontal:2}} />
      </TouchableOpacity>
      <TouchableOpacity
      accessibilityRole="button"
      onPress={()=>{
        SeTshowDropDown(true);
      }} 
      style={{width:30,overflow:"hidden",marginHorizontal:5,flexDirection:"row",justifyContent:"center",alignItems:"center",height:"100%"}}>
      <Icon.Entypo name="dots-three-vertical" color="white" size={25} style={{marginHorizontal:2}} />
      </TouchableOpacity>
     </View>
     <View style={{width:"100%",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
    <Text style={{color:"white",fontSize:14,paddingBottom:5}}>WeDeyNear</Text>
    </View>
     <View style={{flexDirection: 'row',width:width,justifyContent:"center",alignItems:"center",borderTopWidth:0.5,borderTopColor:"white"}}>
      {state.routes.map((route, index) => {
           const { options } = descriptors[route.key];
           const label = options.tabBarLabel !== undefined
               ? options.tabBarLabel
               : options.title !== undefined
               ? options.title
               : route.name;
   
           const isFocused = state.index === index;
           const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
      
            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ name: route.name, merge: true });
            }
          };
      
          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };
      
          const inputRange = state.routes.map((_, i) => i);
          const opacity = position.interpolate({
            inputRange,
            outputRange: inputRange.map(i => (i === index ? 1 : 0)),
          });

          return <TouchableOpacity
          accessibilityRole="button"
        accessibilityState={isFocused ? {selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarTestID}
        onPress={onPress}
        onLongPress={onLongPress}
        style={{flex:1,justifyContent:"center",alignItems:"center",paddingVertical:5}}
          key={index}
  >
 {label == "Home"?<Icon.Entypo name="shop" color={isFocused?"white":"rgba(255,255,255,0.3)"} size={25} style={{marginHorizontal:2}} />
 :label == "Offer"?<Icon.FontAwesome5 name="percent" color={isFocused?"white":"rgba(255,255,255,0.3)"} size={20} style={{marginHorizontal:2}} /> 
 :label == "Events"?<Icon.AntDesign name="calendar" color={isFocused?"white":"rgba(255,255,255,0.3)"} size={20} style={{marginHorizontal:2}} /> 
 :<Icon.FontAwesome name="hdd-o" color={isFocused?"white":"rgba(255,255,255,0.3)"} size={25} style={{marginHorizontal:2}} />} 
</TouchableOpacity>
      })}
    </View>
    <Modal 
      visible={showDropDown}
      onRequestClose={()=>{
        SeTshowDropDown(false);
      }}
       animationType="fade"
       transparent={true}
       >
         <View style={{backgroundColor:"rgba(0,0,0,0.01)",width,height}} >
           <TouchableOpacity 
           onPress={()=>{
            SeTshowDropDown(false);
           }}
           style={{position:"absolute",width,height,top:0,left:0}}
           >

           </TouchableOpacity>
          <Animatable.View 
          animation={{
            from:{
              transform:[
                {translateX:150},
                {translateY:0}
              ],
              opacity:0
            },
            to:{
              transform:[
                {translateX:0},
                {translateY:0}
              ],
              opacity:1
            }
          }}
          duration={500}
          style={{backgroundColor:"white",overflow:"hidden",flexDirection:"column",elevation:2,borderRadius:5,minHeight:50,minWidth:90,alignSelf:"center",position:"absolute",top:15,right:5}}
          >
          <FlatList 
          data={["Menu","Categories","Settings","Logout"]}
          renderItem={({item,index})=>{
           
            if(index == 0)
            {
              return <View  
              style={{paddingVertical:10,backgroundColor:"#eee"}}
              >
            <Text style={{fontSize:12,marginHorizontal:15,color:"black",fontWeight:"bold"}}>{item}</Text>
              </View>
            }
            return <TouchableOpacity  
            onPress={()=>{
            if(index == 1)
          {
            navigation.navigate("category");
            SeTshowDropDown(false);
          }
          if(index == 2)
          {
            navigation.navigate("settings");
            SeTshowDropDown(false);
          }
          if(index == 3)
          {
            Alert.alert("Alert",`Are you sure you want to logout?`,
            [
            {text: 'No', onPress: () => {
            //  Actions.drawerClose();
            }, style: 'cancel'},
            {text: 'Yes', onPress: () => {
            AsyncStorage.clear();
            SeTshowDropDown(false);
            navigation.reset({
              index:0,
              routes:[{name:'login'}],
            })
            
            }, style: 'cancel'}
            ],
            {cancelable:false})
          }
            }}
            style={{paddingVertical:10}}
            >
          <Text style={{fontSize:12,marginHorizontal:15,color:"black"}}>{item}</Text>
            </TouchableOpacity>
          }}
          keyExtractor={(item,index)=>`${index}`}
          ItemSeparatorComponent={()=><View style={{width:"100%",backgroundColor:"#eee",height:0.5}}></View>}
          />
          </Animatable.View>
         </View>
       </Modal>
    </View>
  );
}
const mapStateToProps = (state)=>{
 return state;
}
export default connect(mapStateToProps)(MyTabBar);