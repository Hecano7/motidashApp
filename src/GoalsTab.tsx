import React, { useEffect, useState } from 'react'
import { Text, View, SafeAreaView, TouchableWithoutFeedback, Keyboard, Alert, Button, RefreshControl } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState, onUserData } from '../src/redux';
import { Fontisto, Entypo, FontAwesome5, MaterialCommunityIcons, Ionicons, SimpleLineIcons, MaterialIcons } from '@expo/vector-icons';
import Moticon from '../customIcon';
import { FlatList, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { BASE_URL } from './utils';
import axios from 'axios';
import DraggableFlatList from "react-native-draggable-flatlist";

interface GoalsListProps {
  sheetRef,
  navigation,
  setSelectedGoal,
  setGoalTabNav
}

export const GoalsList: React.FC<GoalsListProps> = ({ setGoalTabNav, sheetRef, navigation, setSelectedGoal }) => {
  setGoalTabNav(navigation);
  const dispatch = useDispatch();
  const { user } = useSelector((state: ApplicationState) => state.userReducer);
  const { token } = user;
  const [goals, goalsRecieved] = useState([]);
  const { userGoals, error } = useSelector((state: ApplicationState) => state.loadUserDataReducer);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if ((userGoals[0] !== undefined)) {
      console.log(userGoals);
      goalsRecieved(JSON.parse(JSON.stringify(userGoals)));
    }
  }, [userGoals, error]);

  const activityCompleted = (activity, elm) => {
    const confirm = () => {
      const config = {
        method: 'get',
        url: `${BASE_URL}goals/objectives/${elm.id}/activities/${activity.id}/toggle_finished.json`,
        headers: {
          'token': token,
        },
        data: ""
      };

      axios(config)
        .then((response) => {
          console.log(JSON.stringify("Response: ", response.data));
        })
        .catch((error) => {
          console.log("Error: ", error);
        });

      setTimeout(function () { dispatch(onUserData(token)); }, 1000);
    };

    Alert.alert(
      'Checked',
      'Do you want to check as completed?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: confirm
        },
      ],
      { cancelable: false },
    );
  };

  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(onUserData(token));
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const dragList = ({ item, index, drag, isActive }) => {
    return (
        <View style={{ borderTopColor: '#D8D8D8', borderTopWidth: 1, paddingBottom: "5%", backgroundColor: "#F2F2F2" }}>
          {item.category == "core" ?
            <View style={{ flexDirection: "row", padding: "5%", paddingBottom: "0%", alignItems: "center", width: "95%" }}>
              <TouchableOpacity style={{ flexDirection: "row"}} onPress={() => { navigation.navigate('Goal', { goal: item }); setSelectedGoal(item.id) }}>
                <Fontisto name="star" size={24} color="#FFC756" style={{ marginRight: "3%", marginTop: "1%" }} />
                <Text style={{ fontSize: 24, fontFamily: "OpenSans_400Regular", width: "93%" }}>{item.name}</Text>
              </TouchableOpacity>
              <Entypo onLongPress={drag} name="dots-three-vertical" size={23} color="grey" style={{alignSelf: "flex-start", marginTop: "1.5%"}}/>
            </View>
            : null}
          {item.category == "context" ?
            <View style={{ flexDirection: "row", padding: "5%", paddingBottom: "0%", alignItems: "center", width: "95%" }}>
              <TouchableOpacity style={{ flexDirection: "row"}} onPress={() => { navigation.navigate('Goal', { goal: item }); setSelectedGoal(item.id) }}>
                <Text style={{ fontSize: 24, fontFamily: "OpenSans_400Regular", marginLeft: "10%", width: "93%" }}>{item.name}</Text>
              </TouchableOpacity>
              <Entypo onLongPress={drag} name="dots-three-vertical" size={23} color="grey" style={{alignSelf: "flex-start", marginTop: "1.5%"}}/>
            </View>
            : null}
          {item.category == "healthy_habits" ?
            <View style={{ flexDirection: "row", padding: "5%", paddingBottom: "0%", alignItems: "center", width: "95%" }}>
              <TouchableOpacity style={{ flexDirection: "row"}} onPress={() => { navigation.navigate('Goal', { goal: item }); setSelectedGoal(item.id) }}>
                <FontAwesome5 name="apple-alt" size={24} color="#48B0B1" style={{ marginRight: "3%", marginTop: "1%" }} />
                <Text style={{ fontSize: 24, fontFamily: "OpenSans_400Regular", width: "93%" }}>{item.name}</Text>
              </TouchableOpacity>
              <Entypo onLongPress={drag} name="dots-three-vertical" size={23} color="grey" style={{alignSelf: "flex-start", marginTop: "1.5%"}}/>
            </View>
            : null}
          <View style={{ flexDirection: "row", paddingLeft: "13.5%", marginTop: ".8%", marginBottom: "2.5%", alignItems: "center" }}>
            <View style={{ backgroundColor: "#D1EBEC", height: 5, width: "35%", borderRadius: 5, marginRight: "3%" }}>
              <View style={{ backgroundColor: "#48B0B1", height: "100%", width: `${item.completion}%`, borderRadius: 5 }} />
            </View>
            <Text style={{ fontSize: 14, fontFamily: "OpenSans_600SemiBold", color: "#48B0B1" }}>{item.completion % 1 == 0 ? item.completion : item.completion.toFixed(2)}%</Text>
          </View>
          {item.activities_pending.map(pen => {
            return (
              <View key={pen.id}>
                <View style={{ flexDirection: "row", paddingLeft: "13%", alignItems: "center", padding: "1.5%", marginRight: "2%" }}>
                  <MaterialIcons onPress={() => activityCompleted(pen, item)} name="check-box-outline-blank" size={24} color="black" style={{ marginRight: "2%" }} />
                  <Text style={{ fontSize: 20, fontFamily: "OpenSans_300Light", width: "90%" }}>{pen.name}</Text>
                </View>
                {pen.points == 0 && pen.deadline_at == null && pen.recurring == "" ?
                  null :
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
                    {pen.recurring == "weekly" ?
                      <View style={{ flexDirection: "row", alignItems: "center", marginRight: "2%", marginLeft: "2%" }}>
                        <Entypo name="cycle" size={20} color="black" />
                        <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "black" }}> WEEKLY</Text>
                      </View>
                      : null}
                    {pen.recurring == "monthly" ?
                      <View style={{ flexDirection: "row", alignItems: "center", marginRight: "2%", marginLeft: "2%" }}>
                        <Entypo name="cycle" size={20} color="black" />
                        <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "black" }}> MONTHLY</Text>
                      </View>
                      : null}
                    {pen.recurring == "quarterly" ?
                      <View style={{ flexDirection: "row", alignItems: "center", marginRight: "2%", marginLeft: "2%" }}>
                        <Entypo name="cycle" size={20} color="black" />
                        <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "black" }}> QUARTERLY</Text>
                      </View>
                      : null}
                    {pen.deadline_at !== null ?
                      <View style={{ flexDirection: "row", alignItems: "center", marginRight: "2%", marginLeft: "2%" }}>
                        <MaterialCommunityIcons name="calendar-month-outline" size={20} color="black" />
                        <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "black" }}> {pen.deadline_at}</Text>
                      </View>
                      : null}
                  </View>

                }
              </View>
            )
          })}
          {item.activities_overdue.length > 1 ?
            <TouchableOpacity onPress={() => { navigation.navigate('Goal', { goal: item }); setSelectedGoal(item.id) }} style={{ flexDirection: "row", paddingLeft: "13%", alignItems: "center", marginTop: "1%" }}>
              <Text style={{ fontSize: 15, fontFamily: "OpenSans_400Regular", color: "#F84B01" }}>{item.activities_overdue.length} OVERDUE ACTIVITIES </Text>
              <SimpleLineIcons name="arrow-right" size={14} color="#F84B01" />
            </TouchableOpacity>
            : null}
          {item.activities_overdue.length == 1 ?
            <TouchableOpacity onPress={() => { navigation.navigate('Goal', { goal: item }); setSelectedGoal(item.id) }} style={{ flexDirection: "row", paddingLeft: "13%", alignItems: "center", marginTop: "1%" }}>
              <Text style={{ fontSize: 15, fontFamily: "OpenSans_400Regular", color: "#F84B01" }}>{item.activities_overdue.length} OVERDUE ACTIVITY </Text>
              <SimpleLineIcons name="arrow-right" size={14} color="#F84B01" />
            </TouchableOpacity>
            : null}
          {item.activities_finished.length > 1 ?
            <TouchableOpacity onPress={() => { navigation.navigate('Goal', { goal: item }); setSelectedGoal(item.id) }} style={{ flexDirection: "row", paddingLeft: "13%", alignItems: "center", marginTop: "1%" }}>
              <Text style={{ fontSize: 15, fontFamily: "OpenSans_400Regular", color: "black" }}>{item.activities_finished.length} COMPLETED ACTIVITIES </Text>
              <SimpleLineIcons name="arrow-right" size={14} color="black" />
            </TouchableOpacity>
            : null}
          {item.activities_finished.length == 1 ?
            <TouchableOpacity onPress={() => { navigation.navigate('Goal', { goal: item }); setSelectedGoal(item.id) }} style={{ flexDirection: "row", paddingLeft: "13%", alignItems: "center", marginTop: "1%" }}>
              <Text style={{ fontSize: 15, fontFamily: "OpenSans_400Regular", color: "black" }}>{item.activities_finished.length} COMPLETED ACTIVITY </Text>
              <SimpleLineIcons name="arrow-right" size={14} color="black" />
            </TouchableOpacity>
            : null}
        </View>
    )
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ height: "15%", flexDirection: "row", paddingLeft: "5%", alignItems: "flex-end", paddingBottom: "3%" }}>
          <Moticon name='Bullseye-Pointer' size={30} color={"black"} style={{ marginRight: "3%", marginBottom: "2%" }} />
          <Text style={{ fontSize: 30, fontFamily: "OpenSans_600SemiBold" }}>Goals</Text>
        </View>
        {/* <ScrollView style={{ width: "100%" }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}> */}
        {/* <View onStartShouldSetResponder={() => true}> */}
        <View style={{ flex: 1 }}>
          <DraggableFlatList
            keyExtractor={(goal) => goal.id}
            data={goals}
            renderItem={dragList}
            onDragEnd={({ data }) => goalsRecieved(data)}
          />
        </View>
        {/* </ScrollView> */}
        <AntDesign name="pluscircle" size={64} color="black" style={{
          width: 80,
          height: 80,
          borderRadius: 30,
          position: 'absolute',
          bottom: 10,
          right: 10,
          color: "#48B0B1"
        }}
          onPress={() => sheetRef.current.snapTo(0)} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
};

interface GoalProps {
  navigation,
  route,
  updateRef,
  addActivityRef,
  activityRef,
  setCompleted,
  setSelectedActivity,
  autoPopulateWindow
}

export const Goal: React.FC<GoalProps> = ({ navigation, route, updateRef, addActivityRef, activityRef, setCompleted, setSelectedActivity, autoPopulateWindow }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: ApplicationState) => state.userReducer);
  const { token } = user;
  const { goal } = route.params;
  const [goalSelected, goalSelectedRecieved] = useState(goal);
  const { userGoals, error } = useSelector((state: ApplicationState) => state.loadUserDataReducer);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (userGoals) {
      for (let i = 0; i < JSON.parse(JSON.stringify(userGoals)).length; i++) {
        if (userGoals[i].id == goal.id) {
          goalSelectedRecieved(userGoals[i]);
        }
      }
    }
  }, [userGoals, error]);

  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(onUserData(token));
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={{ flex: 1 }}>
        <View key={goalSelected.id} style={{ height: "10%", alignItems: "center", flexDirection: "row", justifyContent: "space-between", paddingLeft: "6%", paddingRight: "6%" }}>
          <Ionicons name="ios-arrow-back" size={40} color="grey" onPress={() => { navigation.navigate('GoalsList') }} />
          <MaterialCommunityIcons name="settings" size={33} color="grey" onPress={() => { updateRef.current.snapTo(0); autoPopulateWindow("", goalSelected.id, "goal"); }} />
        </View>
        <View style={{ paddingLeft: "5%", paddingRight: "3%", marginTop: "3%" }} >
          {goalSelected.category == "core" ?
            <Text style={{ fontSize: 35, fontFamily: "OpenSans_600SemiBold" }}><Fontisto name="star" size={35} color="#FFC756" style={{ marginRight: "10%" }} /> {goalSelected.name}</Text>
            : null}
          {goalSelected.category == "context" ?
            <Text style={{ fontSize: 35, fontFamily: "OpenSans_600SemiBold" }}>{goalSelected.name}</Text>
            : null}
          {goalSelected.category == "healthy_habits" ?
            <Text style={{ fontSize: 35, fontFamily: "OpenSans_600SemiBold" }}><FontAwesome5 name="apple-alt" size={35} color="#48B0B1" style={{ marginRight: "10%" }} /> {goalSelected.name}</Text>
            : null}
        </View>
        <View style={{ flexDirection: "row", paddingLeft: "5%", alignItems: "center", marginTop: "3%" }}>
          <View style={{ backgroundColor: "#D1EBEC", height: 6, width: "35%", borderRadius: 5, marginRight: "3%" }}>
            <View style={{ backgroundColor: "#48B0B1", height: "100%", width: `${goalSelected.completion}%`, borderRadius: 5 }} />
          </View>
          <Text style={{ fontSize: 15, fontFamily: "OpenSans_600SemiBold", color: "#48B0B1" }}>{goalSelected.completion}%</Text>
        </View>
        <ScrollView style={{ width: "100%" }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          <View onStartShouldSetResponder={() => true}>
            <View style={{ marginBottom: "5%" }} onStartShouldSetResponder={() => true}>
              {goalSelected.activities_overdue.map(pen => {
                return (
                  <View key={pen.id}>
                    <Text style={{ fontSize: 16, fontFamily: "OpenSans_600SemiBold", width: "90%", color: "#F84B01", paddingLeft: "5%", paddingTop: "5%" }}>OVERDUE ACTIVITIES</Text>
                    {/* onPress={() => activityCompleted(pen, goalSelected)} */}
                    <TouchableOpacity onPress={() => { activityRef.current.snapTo(0); setCompleted(false); setSelectedActivity(pen.id); autoPopulateWindow(pen.id, goalSelected.id, "activities_overdue"); }} style={{ flexDirection: "row", paddingLeft: "5%", alignItems: "center", padding: 6, marginRight: "2%" }}>
                      <MaterialIcons name="check-box-outline-blank" size={33} color="black" style={{ marginRight: "2%", alignSelf: "flex-start" }} />
                      <Text style={{ fontSize: 25, fontFamily: "OpenSans_400Regular", width: "90%", color: "#F84B01" }}>{pen.name}</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: "row", paddingLeft: "14%", alignItems: "center", padding: 6 }}>
                      {pen.points > 0 ?
                        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#D1EBEC", borderRadius: 50, paddingLeft: 10, paddingRight: 10, padding: 2, marginRight: 4 }}>
                          <FontAwesome5 name="coins" size={14} color="#48B0B1" />
                          <Text style={{ fontSize: 14, fontFamily: "OpenSans_400Regular", color: "#48B0B1" }}>  {pen.points}  POINTS</Text>
                        </View>
                        : null}
                      {pen.recurring == "daily" ?
                        <View style={{ flexDirection: "row", alignItems: "center", marginRight: "2%", marginLeft: "2%" }}>
                          <Entypo name="cycle" size={20} color="black" />
                          <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "black" }}> DAILY</Text>
                        </View>
                        : null}
                      {pen.recurring == "weekly" ?
                        <View style={{ flexDirection: "row", alignItems: "center", marginRight: "2%", marginLeft: "2%" }}>
                          <Entypo name="cycle" size={20} color="black" />
                          <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "black" }}> WEEKLY</Text>
                        </View>
                        : null}
                      {pen.recurring == "monthly" ?
                        <View style={{ flexDirection: "row", alignItems: "center", marginRight: "2%", marginLeft: "2%" }}>
                          <Entypo name="cycle" size={20} color="black" />
                          <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "black" }}> MONTHLY</Text>
                        </View>
                        : null}
                      {pen.recurring == "quarterly" ?
                        <View style={{ flexDirection: "row", alignItems: "center", marginRight: "2%", marginLeft: "2%" }}>
                          <Entypo name="cycle" size={20} color="black" />
                          <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "black" }}> QUARTERLY</Text>
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
            {goalSelected.activities_pending.length > 0 ?
              <View style={{ borderTopColor: '#D8D8D8', borderTopWidth: 1, paddingTop: "5%", marginBottom: "5%" }}>
                {goalSelected.activities_pending.map(pen => {
                  return (
                    <View key={pen.id}>
                      <TouchableOpacity onPress={() => { activityRef.current.snapTo(0); setCompleted(false); setSelectedActivity(pen.id); console.log(pen); autoPopulateWindow(pen.id, goalSelected.id, "activities_pending"); }} style={{ flexDirection: "row", paddingLeft: "5%", alignItems: "center", padding: 6, marginRight: "2%" }}>
                        <MaterialIcons name="check-box-outline-blank" size={33} color="black" style={{ marginRight: "2%", alignSelf: "flex-start" }} />
                        <Text style={{ fontSize: 25, fontFamily: "OpenSans_400Regular", width: "90%" }}>{pen.name}</Text>
                      </TouchableOpacity>
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
                        {pen.recurring == "weekly" ?
                          <View style={{ flexDirection: "row", alignItems: "center", marginRight: "2%", marginLeft: "2%" }}>
                            <Entypo name="cycle" size={20} color="black" />
                            <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "black" }}> WEEKLY</Text>
                          </View>
                          : null}
                        {pen.recurring == "monthly" ?
                          <View style={{ flexDirection: "row", alignItems: "center", marginRight: "2%", marginLeft: "2%" }}>
                            <Entypo name="cycle" size={20} color="black" />
                            <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "black" }}> MONTHLY</Text>
                          </View>
                          : null}
                        {pen.recurring == "quarterly" ?
                          <View style={{ flexDirection: "row", alignItems: "center", marginRight: "2%", marginLeft: "2%" }}>
                            <Entypo name="cycle" size={20} color="black" />
                            <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "black" }}> QUARTERLY</Text>
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
            {goalSelected.activities_finished.length > 0 ?
              <View style={{ borderTopColor: '#D8D8D8', borderTopWidth: 1, opacity: 0.5 }}>
                <Text style={{ fontSize: 16, fontFamily: "OpenSans_700Bold", width: "90%", color: "black", paddingLeft: "5%", paddingTop: "5%" }}>COMPLETED ACTIVITIES</Text>
                {goalSelected.activities_finished.map(pen => {
                  return (
                    <View key={pen.id} >
                      <TouchableOpacity onPress={() => { activityRef.current.snapTo(0); setCompleted(true); setSelectedActivity(pen.id); autoPopulateWindow(pen.id, goalSelected.id, "activities_finished"); }} style={{ flexDirection: "row", paddingLeft: "5%", alignItems: "center", padding: 6, marginRight: "2%" }}>
                        <Ionicons name="md-checkbox-outline" size={34} color="black" style={{ marginRight: "2%", alignSelf: "flex-start" }} />
                        <Text style={{ fontSize: 25, fontFamily: "OpenSans_400Regular", width: "90%" }}> {pen.name}</Text>
                      </TouchableOpacity>
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
                        {pen.recurring == "weekly" ?
                          <View style={{ flexDirection: "row", alignItems: "center", marginRight: "2%", marginLeft: "2%" }}>
                            <Entypo name="cycle" size={20} color="black" />
                            <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "black" }}> WEEKLY</Text>
                          </View>
                          : null}
                        {pen.recurring == "monthly" ?
                          <View style={{ flexDirection: "row", alignItems: "center", marginRight: "2%", marginLeft: "2%" }}>
                            <Entypo name="cycle" size={20} color="black" />
                            <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "black" }}> MONTHLY</Text>
                          </View>
                          : null}
                        {pen.recurring == "quarterly" ?
                          <View style={{ flexDirection: "row", alignItems: "center", marginRight: "2%", marginLeft: "2%" }}>
                            <Entypo name="cycle" size={20} color="black" />
                            <Text style={{ fontSize: 16, fontFamily: "OpenSans_400Regular", color: "black" }}> QUARTERLY</Text>
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
          </View>
        </ScrollView>
        <AntDesign name="pluscircle" size={64} color="black" style={{
          width: 80,
          height: 80,
          borderRadius: 30,
          position: 'absolute',
          bottom: 10,
          right: 10,
          color: "#48B0B1"
        }}
          onPress={() => addActivityRef.current.snapTo(0)} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
