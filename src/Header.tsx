import React from 'react'
import { Image , Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { TouchableOpacity } from 'react-native-gesture-handler';

interface HeaderProps {
  title: any,
  navigation: any
}

export const Header: React.FC<HeaderProps> = ({ title , navigation }) => {
  

    return (
      <View style={{backgroundColor: '#2b2b2b', height: "25%", flexDirection: "row"}} >
        <TouchableOpacity  style={{flexDirection: "row", marginTop: "2%"}} onPress={() => {navigation.navigate("StartUp")}}>
        <AntDesign name="left" size={25} color="white" style={{marginTop: "20%", marginRight: "2%", marginLeft: "5%"}} />
        <Image
          style={{height: "64%", width: "30%", marginTop: "20%"}}
          source={require('./img/MotidashLogo.png')}
        />
        </TouchableOpacity>
      <View style={{
          flex: 1,
          alignSelf: 'flex-end',
          position: 'absolute',
          marginBottom: "30%",
          marginLeft: "6%"
        }}>
      <Text style={{color: "white", fontSize: 30, fontFamily: "OpenSans_300Light"}}>{title}</Text>
      </View>
    </View>
    );
}