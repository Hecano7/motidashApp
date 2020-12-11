import React, { useContext , Component } from 'react'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppParamList } from './AppParamList';
import { Center } from './Center';
import { StyleSheet, Button, Text, View } from "react-native";
import { AuthContext } from './AuthProvider';
import Moticon from '../customIcon';

interface AppTabsProps {
  store: any
}

const Tabs = createBottomTabNavigator<AppParamList>();

function LeaderBoard() {
  return (
    <View style={{marginTop: -9, paddingBottom: 9}}>
      <Text style={{fontSize: 13, fontFamily: "OpenSans_400Regular", color: "grey"}}>Leader</Text>
      <Text style={{fontSize: 13, fontFamily: "OpenSans_400Regular", color: "grey"}}> Board </Text>
    </View>
      )
}

function History() {
  const { logout } = useContext(AuthContext);
  return (
    <Center>
      <Text>History</Text>
      <Button title='logout' onPress={() => logout()} />
    </Center>
      )
}

function Search() {
  return (
    <Center>
        <Moticon
          name='Bullseye-Pointer'
          size={28}
          color='green'
        />
            </Center>
   )
}

export const AppTabs: React.FC<AppTabsProps> = ({ }) => {


  return (
      <Tabs.Navigator tabBarOptions={{
          activeTintColor: 'white',
          iconStyle: {
            marginTop: 5
          },
          labelStyle: {
            fontSize: 13,
            fontWeight: "900",
           fontFamily: "OpenSans_400Regular",
           paddingBottom: 15,
          },
          style: {
            backgroundColor: '#2b2b2b',
            height: "14.5%",
          }
        }}>
        <Tabs.Screen
          name='Goals'
          component={History}
          options={{
            tabBarLabel: 'Goals',
            tabBarIcon: (
              { color, size }) => (
              <Moticon name='Bullseye-Pointer' size={30} color={color}/>
            ),
          }} />
        <Tabs.Screen
          name='ActionPlans'
          component={Search}
          options={{
            tabBarLabel: 'Action Plans',
            tabBarIcon: ({ color, size }) => (
              <Moticon name='Calendar-Check' size={30} color={color}/>
              ),
          }} />
        <Tabs.Screen
          name='Tracking'
          component={Search}
          options={{
            tabBarLabel: 'Tracking',
            tabBarIcon: ({ color, size }) => (
              <Moticon name='Tracking' size={30} color={color}/>
              ),
          }} />
        <Tabs.Screen
          name='Dashboard'
          component={Search}
          options={{
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Moticon name='Chart-Line' size={25} color={color}/>
              ),
          }} />
        <Tabs.Screen
          name='LeaderBoard'
          component={Search}
          options={{
            tabBarLabel: LeaderBoard,
            tabBarIcon: ({ color, size }) => (
              <Moticon name='LeaderBoard' size={30} color={color} />
              ),
          }} />
      </Tabs.Navigator>
  );
}

