import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import mystyle from '../includes/mystyle';
import Icons from '../includes/icons';
export default customBar = props=>{
  const color = props.focused?mystyle.active:mystyle.inactive;
    return(<TouchableOpacity 
      onPress={()=>{
      Actions[`${String(props.title).toLowerCase()}`]();
      }} style={[mystyle.container,{}]}>
      {props.title == "Home"?<Icons.AntDesign name="home" size={25} color={color.color} />:null}
      {props.title == "History"?<Icons.FontAwesome name="bars" size={25} color={color.color} />:null}
      {props.title == "Profile"?<View style={{width:60,height:60,justifyContent:"center",alignItems:"center",backgroundColor:"red",borderRadius:60,position:"absolute",bottom:8,elevation:3}}>
        <Icons.FontAwesome5 name="user-cog" size={25} color={props.focused?"white":"black"} />
      </View>:null}
      <Text style={[mystyle.tabtitle,{color:props.title == "Profile"?"white":color.color}]}>{props.title}</Text>
      </TouchableOpacity>);
  }