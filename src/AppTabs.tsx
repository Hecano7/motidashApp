import React, { useContext, Component, useEffect, useState } from 'react'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppParamList } from './AppParamList';
import { Center } from './Center';
import { StyleSheet, Button, Text, View, CheckBox, SafeAreaView } from "react-native";
import { AuthContext } from './AuthProvider';
import Moticon from '../customIcon';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../src/redux';
import { Fontisto, Entypo, FontAwesome5, MaterialCommunityIcons, SimpleLineIcons, Ionicons, Octicons } from '@expo/vector-icons';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';


interface AppTabsProps {
  store: any
}

const Tabs = createBottomTabNavigator<AppParamList>();

function LeaderBoard() {
  return (
    <View style={{ marginTop: -9, paddingBottom: 9 }}>
      <Text style={{ fontSize: 13, fontFamily: "OpenSans_400Regular", color: "grey" }}>Leader</Text>
      <Text style={{ fontSize: 13, fontFamily: "OpenSans_400Regular", color: "grey" }}> Board </Text>
    </View>
  )
}

function GoalsList({ navigation }) {
  const [goals, goalsRecieved] = useState([]);
  const { userGoals, error } = useSelector((state: ApplicationState) => state.loadUserDataReducer);
  useEffect(() => {
    if (userGoals[0] !== undefined) {
      goalsRecieved(JSON.parse(JSON.stringify(userGoals)));
    }
  }, [userGoals, error]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ height: "15%", flexDirection: "row", paddingLeft: "6%", alignItems: "flex-end", paddingBottom: "3%" }}>
        <Moticon name='Bullseye-Pointer' size={30} color={"black"} style={{ marginRight: "3%", marginBottom: "2%" }} />
        <Text style={{ fontSize: 30, fontFamily: "OpenSans_600SemiBold" }}>Goals</Text>
      </View>
      <ScrollView style={{ width: "100%" }}>
        {goals.map(elm => {
          console.log(elm.activities_pending)
          return (
            <View key={elm} style={{ borderTopColor: '#D8D8D8', borderTopWidth: 1, paddingBottom: "5%" }}>
              <TouchableOpacity style={{ flexDirection: "row", padding: "5%", alignItems: "center" }} onPress={() => { navigation.navigate('Goal', { goal: elm }) }}>
                <Fontisto name="star" size={24} color="#FFC756" style={{ marginRight: "3%" }} />
                <Text style={{ fontSize: 22, fontFamily: "OpenSans_400Regular" }}>{elm.name}</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: "row", paddingLeft: "14%", alignItems: "center" }}>
                <View style={{ backgroundColor: "#D1EBEC", height: 5, width: "35%", borderRadius: 5, marginRight: "3%" }}>
                  <View style={{ backgroundColor: "#48B0B1", height: "100%", width: `${elm.completion}%`, borderRadius: 5 }} />
                </View>
                <Text style={{ fontSize: 14, fontFamily: "OpenSans_600SemiBold", color: "#48B0B1" }}>{elm.completion}%</Text>
              </View>
              {elm.activities_pending.map(pen => {
                console.log(pen)
                return (
                  <View key={pen}>
                    <View style={{ flexDirection: "row", paddingLeft: "14%", alignItems: "center", padding: 6, marginRight: "2%" }}>
                      <CheckBox style={{ height: 19, width: 19, borderColor: "black", marginRight: "2%", marginTop: "2%", borderRadius: 2, borderWidth: 1.16 }}></CheckBox>
                      <Text style={{ fontSize: 21, fontFamily: "OpenSans_300Light", width: "90%" }}>{pen.name}</Text>
                    </View>
                    <View style={{ flexDirection: "row", paddingLeft: "14%", alignItems: "center", padding: 6 }}>
                      {pen.points > 0 ?
                        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#D1EBEC", borderRadius: 50, paddingLeft: 10, paddingRight: 10, padding: 2, marginRight: 4 }}>
                          <FontAwesome5 name="coins" size={14} color="#48B0B1" />
                          <Text style={{ fontSize: 14, fontFamily: "OpenSans_600SemiBold", color: "#48B0B1" }}>  {pen.points}  POINTS</Text>
                        </View>
                        : null}
                      {pen.recurring == "daily" ?
                        <View style={{ flexDirection: "row", alignItems: "center", marginRight: "2%", marginLeft: "2%" }}>
                          <Entypo name="cycle" size={20} color="black" />
                          <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "black" }}> DAILY</Text>
                        </View>
                        : null}
                      {pen.deadline_at != null ?
                        <View style={{ flexDirection: "row", alignItems: "center", marginRight: "2%", marginLeft: "2%" }}>
                          <MaterialCommunityIcons name="calendar-month-outline" size={20} color="black" />
                          <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "black" }}> {pen.deadline_at}</Text>
                        </View>
                        : null}
                    </View>
                  </View>
                )
              })}
              { elm.activities_overdue.length > 1 ?
                <TouchableOpacity style={{ flexDirection: "row", paddingLeft: "14%", alignItems: "center" }}>
                  <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "#F84B01" }}>{elm.activities_overdue.length} OVERDUE ACTIVITIES </Text>
                  <SimpleLineIcons name="arrow-right" size={15} color="#F84B01" />
                </TouchableOpacity>
                : null}
              { elm.activities_overdue.length == 1 ?
                <TouchableOpacity style={{ flexDirection: "row", paddingLeft: "14%", alignItems: "center" }}>
                  <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "#F84B01" }}>{elm.activities_overdue.length} OVERDUE ACTIVITY </Text>
                  <SimpleLineIcons name="arrow-right" size={15} color="#F84B01" />
                </TouchableOpacity>
                : null}
              { elm.activities_finished.length > 1 ?
                <TouchableOpacity style={{ flexDirection: "row", paddingLeft: "14%", alignItems: "center" }}>
                  <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "black" }}>{elm.activities_finished.length} COMPLETED ACTIVITIES </Text>
                  <SimpleLineIcons name="arrow-right" size={15} color="black" />
                </TouchableOpacity>
                : null}
              { elm.activities_finished.length == 1 ?
                <TouchableOpacity style={{ flexDirection: "row", paddingLeft: "14%", alignItems: "center" }}>
                  <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "black" }}>{elm.activities_finished.length} COMPLETED ACTIVITY </Text>
                  <SimpleLineIcons name="arrow-right" size={15} color="black" />
                </TouchableOpacity>
                : null}
            </View>
          )
        })}
      </ScrollView>
      <TouchableOpacity style={{ backgroundColor: "#48B0B1", height: 60, width: 60, borderRadius: 100, justifyContent: "center", alignItems: "center", zIndex: 1, alignSelf: "flex-end", marginBottom: "5%", marginRight: "5%" }} onPress={() => { console.log("hit") }}>
        <Octicons name="plus-small" size={60} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

function Goal({ navigation, route }) {
  const { goal } = route.params;
  console.log(goal);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ height: "10%", alignItems: "center", flexDirection: "row", justifyContent: "space-between", paddingLeft: "6%", paddingRight: "6%" }}>
        <Ionicons name="ios-arrow-back" size={40} color="grey" onPress={() => { navigation.navigate('GoalsList') }} />
        <MaterialCommunityIcons name="settings" size={33} color="grey" />
      </View>
      <View style={{ paddingLeft: "5%", paddingRight: "3%", marginTop: "3%" }} >
        <Text style={{ fontSize: 35, fontFamily: "OpenSans_600SemiBold" }}><Fontisto name="star" size={35} color="#FFC756" style={{ marginRight: "10%" }} /> {goal.name}</Text>
      </View>
      <View style={{ flexDirection: "row", paddingLeft: "5%", alignItems: "center", marginTop: "3%" }}>
        <View style={{ backgroundColor: "#D1EBEC", height: 6, width: "35%", borderRadius: 5, marginRight: "3%" }}>
          <View style={{ backgroundColor: "#48B0B1", height: "100%", width: `${goal.completion}%`, borderRadius: 5 }} />
        </View>
        <Text style={{ fontSize: 15, fontFamily: "OpenSans_600SemiBold", color: "#48B0B1" }}>{goal.completion}%</Text>
      </View>
      <View style={{marginBottom: "5%"}}>
      <Text style={{ fontSize: 16, fontFamily: "OpenSans_600SemiBold", width: "90%", color: "#F84B01", paddingLeft: "5%", paddingTop: "5%" }}>OVERDUE ACTIVITIES</Text>
      {goal.activities_overdue.map(pen => {
                console.log(pen)
                return (
                  <View key={pen}>
                    <View style={{ flexDirection: "row", paddingLeft: "5%", alignItems: "center", padding: 6, marginRight: "2%" }}>
                      <CheckBox style={{ height: 19, width: 19, borderColor: "#F84B01", marginRight: "2%", marginTop: "2%", borderRadius: 2, borderWidth: 1.16 }}></CheckBox>
                      <Text style={{ fontSize: 25, fontFamily: "OpenSans_400Regular", width: "90%", color: "#F84B01" }}>{pen.name}</Text>
                    </View>
                    <View style={{ flexDirection: "row", paddingLeft: "14%", alignItems: "center", padding: 6 }}>
                      {pen.points > 0 ?
                        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#D1EBEC", borderRadius: 50, paddingLeft: 10, paddingRight: 10, padding: 2, marginRight: 4 }}>
                          <FontAwesome5 name="coins" size={14} color="#48B0B1" />
                          <Text style={{ fontSize: 14, fontFamily: "OpenSans_400Regular", color: "#48B0B1" }}>  {pen.points}  POINTS</Text>
                        </View>
                        : null}
                      {pen.recurring == "daily" ?
                        <View style={{ flexDirection: "row", alignItems: "center", marginRight: "2%", marginLeft: "2%" }}>
                          <Entypo name="cycle" size={20} color="#F84B01" />
                          <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "#F84B01" }}> DAILY</Text>
                        </View>
                        : null}
                      {pen.deadline_at != null ?
                        <View style={{ flexDirection: "row", alignItems: "center", marginRight: "2%", marginLeft: "2%" }}>
                          <MaterialCommunityIcons name="calendar-month-outline" size={20} color="#F84B01" />
                          <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "#F84B01" }}> {pen.deadline_at}</Text>
                        </View>
                        : null}
                    </View>
                  </View>
                )
              })}
          </View>
          {goal.activities_pending.length > 0 ?
      <View style={{ borderTopColor: '#D8D8D8', borderTopWidth: 1, paddingTop: "5%", marginBottom: "5%"}}>
      {goal.activities_pending.map(pen => {
                console.log(pen)
                return (
                  <View key={pen}>
                    <View style={{ flexDirection: "row", paddingLeft: "5%", alignItems: "center", padding: 6, marginRight: "2%" }}>
                      <CheckBox style={{ height: 19, width: 19, borderColor: "black", marginRight: "2%", marginTop: "2%", borderRadius: 2, borderWidth: 1.16 }}></CheckBox>
                      <Text style={{ fontSize: 25, fontFamily: "OpenSans_400Regular", width: "90%" }}>{pen.name}</Text>
                    </View>
                    <View style={{ flexDirection: "row", paddingLeft: "14%", alignItems: "center", padding: 6 }}>
                      {pen.points > 0 ?
                        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#D1EBEC", borderRadius: 50, paddingLeft: 10, paddingRight: 10, padding: 2, marginRight: 4 }}>
                          <FontAwesome5 name="coins" size={14} color="#48B0B1" />
                          <Text style={{ fontSize: 14, fontFamily: "OpenSans_600SemiBold", color: "#48B0B1" }}>  {pen.points}  POINTS</Text>
                        </View>
                        : null}
                      {pen.recurring == "daily" ?
                        <View style={{ flexDirection: "row", alignItems: "center", marginRight: "2%", marginLeft: "2%" }}>
                          <Entypo name="cycle" size={20} color="black" />
                          <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "black" }}> DAILY</Text>
                        </View>
                        : null}
                      {pen.deadline_at != null ?
                        <View style={{ flexDirection: "row", alignItems: "center", marginRight: "2%", marginLeft: "2%" }}>
                          <MaterialCommunityIcons name="calendar-month-outline" size={20} color="black" />
                          <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "black" }}> {pen.deadline_at}</Text>
                        </View>
                        : null}
                    </View>
                  </View>
                )
              })}
        </View>
        : null}
        {goal.activities_finished.length > 0 ?
        <View style={{ borderTopColor: '#D8D8D8', borderTopWidth: 1, opacity: 0.5}}>
        <Text style={{ fontSize: 16, fontFamily: "OpenSans_700Bold", width: "90%", color: "black", paddingLeft: "5%", paddingTop: "5%" }}>COMPLETED ACTIVITIES</Text>
      {goal.activities_finished.map(pen => {
                console.log(pen)
                return (
                  <View key={pen} >
                    <View style={{ flexDirection: "row", paddingLeft: "5%", alignItems: "center", padding: 6, marginRight: "2%" }}>
                      <CheckBox che style={{ height: 19, width: 19, borderColor: "black", marginRight: "2%", marginTop: "2%", borderRadius: 2, borderWidth: 1.16 }}></CheckBox>
                      <Text style={{ fontSize: 25, fontFamily: "OpenSans_400Regular", width: "90%" }}>{pen.name}</Text>
                    </View>
                    <View style={{ flexDirection: "row", paddingLeft: "14%", alignItems: "center", padding: 6 }}>
                      {pen.points > 0 ?
                        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#D1EBEC", borderRadius: 50, paddingLeft: 10, paddingRight: 10, padding: 2, marginRight: 4 }}>
                          <FontAwesome5 name="coins" size={14} color="#48B0B1" />
                          <Text style={{ fontSize: 14, fontFamily: "OpenSans_600SemiBold", color: "#48B0B1" }}>  {pen.points}  POINTS</Text>
                        </View>
                        : null}
                      {pen.recurring == "daily" ?
                        <View style={{ flexDirection: "row", alignItems: "center", marginRight: "2%", marginLeft: "2%" }}>
                          <Entypo name="cycle" size={20} color="black" />
                          <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "black" }}> DAILY</Text>
                        </View>
                        : null}
                      {pen.deadline_at != null ?
                        <View style={{ flexDirection: "row", alignItems: "center", marginRight: "2%", marginLeft: "2%" }}>
                          <MaterialCommunityIcons name="calendar-month-outline" size={20} color="black" />
                          <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "black" }}> {pen.deadline_at}</Text>
                        </View>
                        : null}
                    </View>
                  </View>
                )
              })}
        </View>
        : null}
    </SafeAreaView>
  )
}

function GoalsTab() {
  const GoalsStack = createStackNavigator();
  return (
    <GoalsStack.Navigator initialRouteName="GoalsList">
      <GoalsStack.Screen name="GoalsList" options={{ header: () => null }} component={GoalsList} />
      <GoalsStack.Screen name="Goal" options={{ header: () => null }} component={Goal} />
    </GoalsStack.Navigator>
  );
}

function Search() {
  const { logout } = useContext(AuthContext);
  return (
    <Center>
      <Button title='logout' onPress={() => logout()} />
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
    <Tabs.Navigator
      lazy={false}
      tabBarOptions={{
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
        component={GoalsTab}
        options={{
          tabBarLabel: 'Goals',
          tabBarIcon: (
            { color, size }) => (
            <Moticon name='Bullseye-Pointer' size={30} color={color} />
          ),
        }} />
      <Tabs.Screen
        name='ActionPlans'
        component={Search}
        options={{
          tabBarLabel: 'Action Plans',
          tabBarIcon: ({ color, size }) => (
            <Moticon name='Calendar-Check' size={30} color={color} />
          ),
        }} />
      <Tabs.Screen
        name='Tracking'
        component={Search}
        options={{
          tabBarLabel: 'Tracking',
          tabBarIcon: ({ color, size }) => (
            <Moticon name='Tracking' size={30} color={color} />
          ),
        }} />
      <Tabs.Screen
        name='Dashboard'
        component={Search}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Moticon name='Chart-Line' size={25} color={color} />
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

