import React, { useContext, useEffect, useState } from 'react'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppParamList } from './AppParamList';
import { Center } from './Center';
import { Goal, GoalsList } from './GoalsTab';
import { Button, Text, View, SafeAreaView, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import { AuthContext } from './AuthProvider';
import Moticon from '../customIcon';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState, onLogin, onUserData } from '../src/redux';
import { Fontisto, Entypo, FontAwesome5, MaterialCommunityIcons, SimpleLineIcons, Ionicons, FontAwesome, EvilIcons, Feather } from '@expo/vector-icons';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import BottomSheet from 'reanimated-bottom-sheet';
import AsyncStorage from '@react-native-community/async-storage';
import { BASE_URL } from './utils';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import CalendarPicker from 'react-native-calendar-picker';
import moment from "moment";
import { useScrollToTop } from '@react-navigation/native';

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

function GoalsTab({load, setGoalTabNav, sheetRef, updateRef, addActivityRef, setSelectedGoal, activityRef, setCompleted, setSelectedActivity, autoPopulateWindow }) {
  const GoalsStack = createStackNavigator();
  return (
    <GoalsStack.Navigator initialRouteName="GoalsList">
      <GoalsStack.Screen name="GoalsList" options={{ header: () => null }} >
        {(props) => <GoalsList  {...props} load={load} sheetRef={sheetRef} setSelectedGoal={setSelectedGoal} setGoalTabNav={setGoalTabNav} />}
      </GoalsStack.Screen>
      <GoalsStack.Screen name="Goal" options={{ header: () => null }} >
        {(props) => <Goal  {...props} load={load} updateRef={updateRef} activityRef={activityRef} addActivityRef={addActivityRef} setCompleted={setCompleted} setSelectedActivity={setSelectedActivity} autoPopulateWindow={autoPopulateWindow} />}
      </GoalsStack.Screen>
    </GoalsStack.Navigator>
  );
}

function Search() {
  const { logout } = useContext(AuthContext);
  return (
    <View
      style={{
        height: "100%",
        backgroundColor: 'papayawhip',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Button
        title="Logout"
        onPress={() => logout()}
      />
    </View>
  )
}

export const AppTabs: React.FC<AppTabsProps> = ({ }) => {
  const { user, error } = useSelector((state: ApplicationState) => state.userReducer);
  const { userGoals } = useSelector((state: ApplicationState) => state.loadUserDataReducer);
  const { token } = user;

  useEffect(() => {
    if (token !== undefined) {
      dispatch(onUserData(token));
    };
    if (token == undefined) {
      reload();
    };
    //do nothing
  }, [user, error]);

  const dispatch = useDispatch();
  
  const reload = () => {
    AsyncStorage.getItem('account')
      .then(userString => {
        if (userString) {
          dispatch(onLogin(JSON.parse(userString).email, JSON.parse(userString).password));
        }
      })
      .catch(err => {
        console.log(err);
      });
    // dispatch(onLogin(email, password));
  };

  const [load, loading] = useState(false);
  const [goalTabNav, setGoalTabNav] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [firstText, setFirstText] = useState('');
  const [secondText, setSecondText] = useState('core goal.');
  const [thirdText, setThirdText] = useState('Activities added here are most likely to lead to closing buisness and reach sales goals.');
  const [categoryText, setCategoryText] = useState('core');
  const [first, setFirst] = useState('#48B0B1');
  const [second, setSecond] = useState('white');
  const [third, setThird] = useState('white');
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState(moment().format("MM-DD-YYYY"));
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [toggle, setToggle] = useState('recurring');
  const [completed, setCompleted] = useState(false);

  const addNewGoal = () => {
    const data = JSON.stringify({ "okr_objective": { "name": firstText, "category": categoryText } });

    const config = {
      method: 'post',
      url: `${BASE_URL}goals/objectives.json`,
      headers: {
        'token': token,
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });

    sheetRef.current.snapTo(2);
    
    dispatch(onUserData(token));

    loading(true);

    setTimeout(function(){ loading(false); }, 2000);
  };

  const updateGoal = () => {
    let data = new FormData();
    data.append('okr_objective[name]', firstText);
    if(categoryText == "core"){
    data.append('okr_objective[category]', 'core');
    };
    if(categoryText == "context"){
    data.append('okr_objective[category]', 'context');
    };
    if(categoryText == "healthy_habits"){
    data.append('okr_objective[category]', 'healthy_habits');
    };

    let config = {
      method: 'patch',
      url: `${BASE_URL}goals/objectives/${selectedGoal}.json`,
      headers: { 
        'token': token, 
      },
      data : data
    };

    axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });

    updateRef.current.snapTo(2);

    goalTabNav.navigate('GoalsList');

    dispatch(onUserData(token));
    
    loading(true);

    setTimeout(function(){ loading(false); }, 2000);

  };

  const removeGoal = () => {
    let config = {
      method: 'delete',
      url: `${BASE_URL}goals/objectives/${selectedGoal}.json`,
      headers: { 
        'token': token, 
      },
      data : ""
    };

    axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });

    updateRef.current.snapTo(2);

    goalTabNav.navigate('GoalsList');
    
    dispatch(onUserData(token));
        
    loading(true);

    setTimeout(function(){ loading(false); }, 2000);
  };

  const completeGoal = () => {
    let config = {
      method: 'get',
      url: `${BASE_URL}goals/objectives/${selectedGoal}/toggle_finished.json`,
      headers: { 
        'token': token
      }
    };
    
    axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });

    updateRef.current.snapTo(2);

    goalTabNav.navigate('GoalsList');
        
    dispatch(onUserData(token));
    
    loading(true);

    setTimeout(function(){ loading(false); }, 2000);
  };

  const addNewActivity = () => {
    console.log(selectedGoal);
    let data = new FormData();
    data.append('okr_activity[name]', firstText);
    if (toggle == "date") {
      data.append('okr_activity[deadline_at]', selectedStartDate);
    } else {
      data.append('okr_activity[recurring]', selectedValue);
    };

    const config = {
      method: 'post',
      url: `${BASE_URL}goals/objectives/${selectedGoal}/activities.json`,
      headers: {
        'token': token,
        'Content-Type': 'application/json'
      },
      data: data
    };
    console.log(typeof selectedStartDate);

    axios(config)
      .then((response) => {
        console.log("Response: ", JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log("Error: ", error);
      });

    addActivityRef.current.snapTo(2);
    
    dispatch(onUserData(token));
        
    loading(true);

    setTimeout(function(){ loading(false); }, 2000);
  };

  const updateActivity = () => {
    let data = new FormData();
    data.append('okr_activity[name]', firstText);
    if (toggle == "date") {
      data.append('okr_activity[deadline_at]', selectedStartDate);
    } else {
      data.append('okr_activity[recurring]', selectedValue);
    };

    console.log(toggle);

    const config = {
      method: 'patch',
      url: `${BASE_URL}goals/objectives/${selectedGoal}/activities/${selectedActivity}.json`,
      headers: {
        'token': token,
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then((response) => {
        console.log("Response: ", JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log("Error: ", error);
      });

    activityRef.current.snapTo(2);
        
    loading(true);

    setTimeout(function(){ loading(false); }, 2000);

    dispatch(onUserData(token));
  };

  const activityCompleted = (activityId, goalId) => {
    console.log("Activity Id: ", activityId)
    console.log("goal Id: ", goalId)
    const config = {
      method: 'get',
      url: `${BASE_URL}goals/objectives/${goalId}/activities/${activityId}/toggle_finished.json`,
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

    activityRef.current.snapTo(2);

    dispatch(onUserData(token));
        
    loading(true);

    setTimeout(function(){ loading(false); }, 2000);
  };

  const removeActivity = (activityId, goalId) => {
    let config = {
      method: 'delete',
      url: `${BASE_URL}goals/objectives/${goalId}/activities/${activityId}.json`,
      headers: {
        'token': token,
      },
      data: ""
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });

    activityRef.current.snapTo(2);

    dispatch(onUserData(token));

    loading(true);

    setTimeout(function(){ loading(false); }, 2000);

  };

  const autoPopulateWindow = (activityId, goalId, window) => {
    let userGoal = JSON.parse(JSON.stringify(userGoals));

    if (window == "goal") {
      for (let i = 0; i < userGoal.length; i++) {
        if (userGoals[i].id == goalId) {
            setFirstText(userGoals[i].name);
            if(userGoal[i].category == "core"){
              select("first");
            };
            if(userGoal[i].category == "context"){
              select("second");
            };
            if(userGoal[i].category == "healthy_habits"){
              select("third");
            };
          }
      }
    };
    if (window == "activities_finished") {
      for (let i = 0; i < userGoal.length; i++) {
        if (userGoals[i].id == goalId) {
          for (let n = 0; n < userGoal[i].activities_finished.length; n++) {
            if (userGoal[i].activities_finished[n].id == activityId) {
              setFirstText(userGoal[i].activities_finished[n].name);
              if (userGoal[i].activities_finished[n].recurring !== null) {
                setToggle("recurring");
                select("fourth");
                setSelectedValue(userGoal[i].activities_finished[n].recurring);
              };
              if (userGoal[i].activities_finished[n].deadline_at !== null) {
                let split = userGoal[i].activities_finished[n].deadline_at.split("/");
                setSelectedStartDate(`${split[0]}-${split[1]}-${split[2]}`);
                setToggle("date");
                select("fith");
              };
              if (userGoal[i].activities_finished[n].deadline_at !== null && userGoal[i].activities_finished[n].recurring !== null) {
                select("sixth");
                setToggle("both");
              }
            }
          }
        }
      }
    };
    if (window == "activities_overdue") {
      for (let i = 0; i < userGoal.length; i++) {
        if (userGoals[i].id == goalId) {
          for (let n = 0; n < userGoal[i].activities_overdue.length; n++) {
            if (userGoal[i].activities_overdue[n].id == activityId) {
              setFirstText(userGoal[i].activities_overdue[n].name);
              if (userGoal[i].activities_overdue[n].recurring !== null) {
                setToggle("recurring");
                select("fourth");
                setSelectedValue(userGoal[i].activities_overdue[n].recurring);
              };
              if (userGoal[i].activities_overdue[n].deadline_at !== null) {
                let split = userGoal[i].activities_overdue[n].deadline_at.split("/");
                setSelectedStartDate(`${split[0]}-${split[1]}-${split[2]}`);
                setToggle("date");
                select("fith");
              };
              if (userGoal[i].activities_overdue[n].deadline_at !== null && userGoal[i].activities_overdue[n].recurring !== null) {
                select("sixth");
                setToggle("both");
              }
            }
          }
        }
      }
    };
    if (window == "activities_pending") {
      for (let i = 0; i < userGoal.length; i++) {
        if (userGoals[i].id == goalId) {
          for (let n = 0; n < userGoal[i].activities_pending.length; n++) {
            if (userGoal[i].activities_pending[n].id == activityId) {
              setFirstText(userGoal[i].activities_pending[n].name);
              if (userGoal[i].activities_pending[n].recurring !== null) {
                setToggle("recurring");
                select("fourth");
                setSelectedValue(userGoal[i].activities_pending[n].recurring);
              };
              if (userGoal[i].activities_pending[n].deadline_at !== null) {
                let split = userGoal[i].activities_pending[n].deadline_at.split("/");
                setSelectedStartDate(`${split[0]}-${split[1]}-${split[2]}`);
                setToggle("date");
                select("fith");
              };
              if (userGoal[i].activities_pending[n].deadline_at !== null && userGoal[i].activities_pending[n].recurring !== null) {
                select("sixth");
                setToggle("both");
              }
            }
          }
        }
      }
    }
  };

  const select = (x) => {
    if (x == "first") {
      setFirst("#48B0B1")
      setSecond("white")
      setThird("white")
      setSecondText("core goal.")
      setCategoryText("core")
      setThirdText("Activities added here are most likely to lead to closing buisness and reach sales goals.")
    }
    if (x == "second") {
      setFirst("white")
      setSecond("#48B0B1")
      setThird("white")
      setSecondText("context goal.")
      setCategoryText("context")
      setThirdText("Activities that are added here are necessary but do not directly lead to closing more business or reaching sales goals.")
    }
    if (x == "third") {
      setFirst("white")
      setSecond("white")
      setThird("#48B0B1")
      setSecondText("healthy habit goal.")
      setCategoryText("healthy_habits")
      setThirdText("Activities that are added here are crucial for keeping your mental and physical health in check, empowering you to achieve your professional goals.")
    }
    if (x == "fourth") {
      setFirst("#48B0B1")
      setThird('white')
      setToggle("recurring")
    }
    if (x == "fith") {
      setFirst("white")
      setThird('#48B0B1')
      setToggle("date")
    }
    if (x == "sixth") {
      setFirst('#48B0B1')
      setThird('#48B0B1')
      setToggle("both")
    }
  };

  const onCloseWindow = () => {
    setFirstText("");
    select("first");
    select("fourth");
  };

  const sheetRef = React.useRef(null);
  const updateRef = React.useRef(null);
  const addActivityRef = React.useRef(null);
  const calendarRef = React.useRef(null);
  const activityRef = React.useRef(null);

  const onStartWindow = (window) => {
    useScrollToTop(window);
  };

  const addGoal = () => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ backgroundColor: 'white', height: "100%" }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", borderBottomColor: '#D8D8D8', borderBottomWidth: 1, height: "10%", width: "100%", paddingLeft: "2%" }}>
          <Entypo name="cross" size={40} color="black" onPress={() => sheetRef.current.snapTo(2)} />
          <Text style={{ fontSize: 20, fontFamily: "OpenSans_600SemiBold" }}>Add new goal</Text>
          <View style={{ width: "14%" }} />
        </View>
        <Text style={{ fontSize: 22, fontFamily: "OpenSans_600SemiBold", marginLeft: "5%", marginTop: "5%" }}>Goal</Text>
        <TextInput
          value={firstText}
          onChangeText={setFirstText}
          style={{ borderColor: '#D8D8D8', borderWidth: 1, margin: "5%", height: "15%", padding: "5%", paddingTop: "5%", marginTop: 0, fontSize: 20, overflow: "scroll" }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: "center", height: "12%", width: "100%" }}>
          <TouchableOpacity onPress={() => select("first")} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: first, borderRadius: 12, height: "85%", paddingLeft: "4.5%", paddingRight: "4.5%" }}>
            <FontAwesome name="star" size={18} color="black" />
            <Text style={{ fontSize: 12, fontFamily: "OpenSans_600SemiBold" }}> CORE</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => select("second")} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: second, borderRadius: 12, height: "85%", paddingLeft: "4.5%", paddingRight: "4.5%" }}>
            <EvilIcons name="star" size={23} color="black" />
            <Text style={{ fontSize: 12, fontFamily: "OpenSans_600SemiBold" }}>CONTEXT</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => select("third")} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: third, borderRadius: 12, height: "85%", paddingLeft: "4.5%", paddingRight: "4.5%" }}>
            <MaterialCommunityIcons name="food-apple-outline" size={20} color="black" />
            <Text style={{ fontSize: 12, fontFamily: "OpenSans_600SemiBold" }}>HEALTHY HABITS</Text>
          </TouchableOpacity>
        </View>
        <View style={{ margin: "5%", backgroundColor: "#D0EBEA", borderRadius: 10, height: "30%", padding: "5%" }}>
          <Text style={{ fontFamily: "OpenSans_400Regular", fontSize: 20 }}>This is a <Text style={{ fontFamily: "OpenSans_600SemiBold", fontSize: 20 }}>{secondText}</Text></Text>

          <Text style={{ fontFamily: "OpenSans_400Regular", fontSize: 20, marginTop: "6%" }}>{thirdText}</Text>
        </View>
        <TouchableOpacity onPress={addNewGoal} style={{ backgroundColor: "#47AFB0", padding: "5%", marginLeft: "5%", marginRight: "5%", borderRadius: 14, justifyContent: 'center', alignItems: 'center' }} >
          <Text style={{ color: "white", fontWeight: "500", fontSize: 22 }}>Create goal</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );

  const editGoal = () => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ backgroundColor: 'white', height: "100%" }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", borderBottomColor: '#D8D8D8', borderBottomWidth: 1, height: "10%", width: "100%", paddingLeft: "2%" }}>
          <Entypo name="cross" size={40} color="black" onPress={() => updateRef.current.snapTo(2)} />
          <Text style={{ fontSize: 20, fontFamily: "OpenSans_600SemiBold" }}>Update goal</Text>
          <View style={{ width: "14%" }} />
        </View>
        <ScrollView automaticallyAdjustContentInsets={true} contentContainerStyle={{ height: 820 }} showsVerticalScrollIndicator={true}>
          <SafeAreaView>
            <Text style={{ fontSize: 22, fontFamily: "OpenSans_600SemiBold", marginLeft: "5%", marginTop: "5%" }}>Goal</Text>
            <TextInput multiline={true} value={firstText} onChangeText={setFirstText} style={{ borderColor: '#D8D8D8', borderWidth: 1, margin: "5%", height: "15%", padding: "5%", paddingTop: "5%", marginTop: 0, fontSize: 20, overflow: "scroll" }} />
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: "center", height: "10%", width: "100%" }}>
              <TouchableOpacity onPress={() => select("first")} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: first, borderRadius: 12, height: "85%", paddingLeft: "4.5%", paddingRight: "4.5%" }}>
                <FontAwesome name="star" size={18} color="black" />
                <Text style={{ fontSize: 12, fontFamily: "OpenSans_600SemiBold" }}> CORE</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => select("second")} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: second, borderRadius: 12, height: "85%", paddingLeft: "4.5%", paddingRight: "4.5%" }}>
                <EvilIcons name="star" size={23} color="black" />
                <Text style={{ fontSize: 12, fontFamily: "OpenSans_600SemiBold" }}>CONTEXT</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => select("third")} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: third, borderRadius: 12, height: "85%", paddingLeft: "4.5%", paddingRight: "4.5%" }}>
                <MaterialCommunityIcons name="food-apple-outline" size={20} color="black" />
                <Text style={{ fontSize: 12, fontFamily: "OpenSans_600SemiBold" }}>HEALTHY HABITS</Text>
              </TouchableOpacity>
            </View>

            <View style={{ margin: "5%", backgroundColor: "#D0EBEA", borderRadius: 10, height: "30%", padding: "5%" }}>
              <Text style={{ fontFamily: "OpenSans_400Regular", fontSize: 20 }}>This is a <Text style={{ fontFamily: "OpenSans_600SemiBold", fontSize: 20 }}>{secondText}</Text></Text>
              <Text style={{ fontFamily: "OpenSans_400Regular", fontSize: 20, marginTop: "6%" }}>{thirdText}</Text>
            </View>

            <TouchableOpacity onPress={updateGoal} style={{ backgroundColor: "#FCC755", padding: "5%", marginLeft: "5%", marginRight: "5%", marginBottom: "5%", borderRadius: 30, justifyContent: 'center', alignItems: 'center' }} >
              <Text style={{ color: "white", fontWeight: "500", fontSize: 22 }}>Update goal</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "90%", alignSelf: "center", marginBottom: "5%" }}>
              <TouchableOpacity onPress={completeGoal} style={{ backgroundColor: "#47AFB0", padding: "9%", paddingRight: "2%", paddingLeft: "2%", borderRadius: 14, justifyContent: 'center', alignItems: 'center' }} >
                <Text style={{ color: "white", fontWeight: "500", fontSize: 20 }}>Mark completed <Feather name="check" size={24} color="white" /></Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: "#47AFB0", padding: "13%", borderRadius: 14, justifyContent: 'center', alignItems: 'center' }} >
                <Text style={{ color: "white", fontWeight: "500", fontSize: 20 }}>Share</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={removeGoal} style={{ borderColor: "#F97459", borderWidth: 3, padding: "4%", marginLeft: "5%", marginRight: "5%", marginBottom: "10%", marginTop: 1, borderRadius: 14, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: "#F97459", fontFamily: "OpenSans_600SemiBold", fontSize: 20 }}>Remove</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );

  const addActivity = () => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ backgroundColor: backgroundColor, height: "100%" }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", borderBottomColor: '#D8D8D8', borderBottomWidth: 1, height: "10%", width: "100%", paddingLeft: "2%" }}>
          <Entypo name="cross" size={40} color="black" onPress={() => addActivityRef.current.snapTo(2)} />
          <Text style={{ fontSize: 20, fontFamily: "OpenSans_600SemiBold" }}>Add new activity</Text>
          <View style={{ width: "14%" }} />
        </View>
        <Text style={{ fontSize: 22, fontFamily: "OpenSans_600SemiBold", marginLeft: "5%", marginTop: "5%" }}>Activity</Text>
        <TextInput
          value={firstText}
          onChangeText={setFirstText}
          style={{ borderColor: '#D8D8D8', borderWidth: 1, margin: "5%", height: "15%", padding: "5%", paddingTop: "5%", marginTop: 0, fontSize: 20, overflow: "scroll" }}
          placeholder="Add an activity for this objective?"
        />
        <View style={{ flexDirection: 'row', justifyContent: "center", alignItems: "center", height: "12%", width: "50%", alignSelf: "center" }}>
          <TouchableOpacity onPress={() => select("fourth")} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: first, borderRadius: 12, height: "85%", paddingLeft: "3%", paddingRight: "3%" }}>
            <Entypo name="cycle" size={19} color="black" />
            <Text style={{ fontSize: 12, fontFamily: "OpenSans_600SemiBold" }}> ACTIVITY IS RECURRING</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => select("fith")} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: third, borderRadius: 12, height: "85%", paddingLeft: "3%", paddingRight: "3%" }}>
            <MaterialCommunityIcons name="calendar-month-outline" size={20} color="black" />
            <Text style={{ fontSize: 12, fontFamily: "OpenSans_600SemiBold" }}> ACTIVITY HAS A DEADLINE</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ fontFamily: "OpenSans_600SemiBold", fontSize: 20, width: "90%", alignSelf: "center", marginTop: "5%", height: "10%" }}>How often would you like to complete this activity?</Text>
        <View style={{ height: "15%", width: "90%", borderColor: 'black', borderWidth: 1, marginTop: "5%", marginBottom: "10%", alignSelf: "center", overflow: "hidden" }}>
          <TouchableOpacity style={{ height: "100%", alignContent: "center" }} onPress={() => { calendarRef.current.snapTo(0); setBackgroundColor('#F2F2F2'); }}>
            {toggle == "recurring" ?
              <Picker
                selectedValue={selectedValue}
                style={{ height: "100%", width: "100%", justifyContent: "center" }}
                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue.toString())}
              >
                <Picker.Item label="" value="" />
                <Picker.Item label="Everyday" value="daily" />
                <Picker.Item label="Every Week" value="weekly" />
                <Picker.Item label="Every Month" value="monthly" />
                <Picker.Item label="Every Quarter" value="quarterly" />
              </Picker>
              : null}
            {toggle == "date" ?
              <Text style={{ alignSelf: "center", marginVertical: "10%", fontWeight: "500", fontSize: 25, height: "100%" }}>{selectedStartDate.replace(/-/g, "/")}</Text>
              : null}
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={addNewActivity} style={{ backgroundColor: "#FCC755", alignContent: "center", width: "90%", padding: "5%", borderRadius: 30, justifyContent: 'center', alignItems: 'center', alignSelf: "center", }} >
          <Text style={{ color: "white", fontWeight: "500", fontSize: 22 }}>Create activity</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );

  const calendarContent = () => (
    <View style={{ backgroundColor: 'white', height: "100%" }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", height: "15%", width: "100%", paddingLeft: "2%", borderBottomColor: '#D8D8D8', borderBottomWidth: 1, }}>
        <Entypo name="cross" size={40} color="black" onPress={() => { calendarRef.current.snapTo(2); setBackgroundColor('white') }} />
        <Text style={{ fontSize: 20, fontFamily: "OpenSans_600SemiBold" }}>Calendar</Text>
        <View style={{ width: "14%" }} />
      </View>
      <View style={{ marginTop: "5%" }}>
        <CalendarPicker
          onDateChange={(x) => { setSelectedStartDate(x.format("MM-DD-YYYY").toString()); setTimeout(() => { calendarRef.current.snapTo(2); }, 900); setBackgroundColor('white'); console.log(x.format("YYYY-MM-DD").toString()) }}
          width={350}
        />
      </View>
    </View>
  );

  const editActivity = () => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ backgroundColor: 'white', height: "100%" }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", borderBottomColor: '#D8D8D8', borderBottomWidth: 1, height: "10%", width: "100%", paddingLeft: "2%" }}>
          <Entypo name="cross" size={40} color="black" onPress={() => activityRef.current.snapTo(2)} />
          <Text style={{ fontSize: 20, fontFamily: "OpenSans_600SemiBold" }}>Update activity</Text>
          <View style={{ width: "14%" }} />
        </View>
        <ScrollView automaticallyAdjustContentInsets={true} contentContainerStyle={{ height: toggle !== "both" ? (completed == true ? 650 : 870) : 910 }} showsVerticalScrollIndicator={true}>
          <SafeAreaView>
            <Text style={{ fontSize: 22, fontFamily: "OpenSans_600SemiBold", marginLeft: "5%", marginTop: "5%" }}>Activity</Text>
            <TextInput multiline={true} value={firstText} onChangeText={setFirstText} style={{ borderColor: '#D8D8D8', borderWidth: 1, margin: "5%", height: toggle !== "both" ? "15%" : "10%", padding: "5%", paddingTop: "5%", marginTop: 0, fontSize: 20, overflow: "scroll" }} />
            <View style={{ flexDirection: 'row', justifyContent: "center", alignItems: "center", height: toggle !== "both" ? "12%" : "8%", width: "50%", alignSelf: "center" }}>

              <TouchableOpacity onPress={() => select("fourth")} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: first, borderRadius: 12, height: "85%", paddingLeft: "3%", paddingRight: "3%" }}>
                <Entypo name="cycle" size={19} color="black" />
                <Text style={{ fontSize: 12, fontFamily: "OpenSans_600SemiBold" }}> ACTIVITY IS RECURRING</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => select("fith")} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: third, borderRadius: 12, height: "85%", paddingLeft: "3%", paddingRight: "3%" }}>
                <MaterialCommunityIcons name="calendar-month-outline" size={20} color="black" />
                <Text style={{ fontSize: 12, fontFamily: "OpenSans_600SemiBold" }}> ACTIVITY HAS A DEADLINE</Text>
              </TouchableOpacity>
            </View>
            {toggle !== "both" ?
              <View style={{ height: "35%" }}>
                <Text style={{ fontFamily: "OpenSans_600SemiBold", fontSize: 20, width: "90%", alignSelf: "center", marginTop: "5%", height: "30%" }}>How often would you like to complete this activity?</Text>
                <View style={{ height: "40%", width: "90%", borderColor: 'black', borderWidth: 1, marginTop: "5%", marginBottom: "1%", alignSelf: "center", overflow: "hidden" }}>
                  <TouchableOpacity style={{ height: "100%", alignContent: "center" }} onPress={() => { calendarRef.current.snapTo(0); setBackgroundColor('#F2F2F2'); }}>
                    {toggle == "recurring" ?
                      <Picker
                        selectedValue={selectedValue}
                        style={{ height: "100%", width: "100%", justifyContent: "center" }}
                        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue.toString())}
                      >
                        <Picker.Item label="" value="" />
                        <Picker.Item label="Everyday" value="daily" />
                        <Picker.Item label="Every Week" value="weekly" />
                        <Picker.Item label="Every Month" value="monthly" />
                        <Picker.Item label="Every Quarter" value="quarterly" />
                      </Picker>
                      : null}
                    {toggle == "date" ?
                      <Text style={{ alignSelf: "center", marginVertical: "10%", fontWeight: "500", fontSize: 25, height: "100%" }}>{selectedStartDate.replace(/-/g, "/")}</Text>
                      : null}
                  </TouchableOpacity>
                </View>
              </View>
              :
              <View style={{ height: "45%" }}>
                <Text style={{ fontFamily: "OpenSans_600SemiBold", fontSize: 20, width: "90%", alignSelf: "center", marginTop: "5%", height: "15%" }}>How often would you like to complete this activity?</Text>
                <View style={{ height: "25%", width: "90%", borderColor: 'black', borderWidth: 1, marginTop: "5%", marginBottom: "1%", alignSelf: "center", overflow: "hidden" }}>
                  <TouchableOpacity style={{ height: "100%", alignContent: "center" }} onPress={() => { calendarRef.current.snapTo(0); setBackgroundColor('#F2F2F2'); }}>
                    <Picker
                      selectedValue={selectedValue}
                      style={{ height: "100%", width: "100%", justifyContent: "center" }}
                      onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue.toString())}
                    >
                      <Picker.Item label="" value="" />
                      <Picker.Item label="Everyday" value="daily" />
                      <Picker.Item label="Every Week" value="weekly" />
                      <Picker.Item label="Every Month" value="monthly" />
                      <Picker.Item label="Every Quarter" value="quarterly" />
                    </Picker>
                  </TouchableOpacity>
                </View>
                <Text style={{ fontFamily: "OpenSans_600SemiBold", fontSize: 20, width: "90%", alignSelf: "center", marginTop: "5%", height: "8%" }}>Deadline</Text>
                <View style={{ height: "25%", width: "90%", borderColor: 'black', borderWidth: 1, marginTop: "5%", marginBottom: "1%", alignSelf: "center", overflow: "hidden" }}>
                  <TouchableOpacity style={{ height: "100%", alignContent: "center" }} onPress={() => { calendarRef.current.snapTo(0); setBackgroundColor('#F2F2F2'); }}>
                    <Text style={{ alignSelf: "center", marginVertical: "10%", fontWeight: "500", fontSize: 25, height: "100%" }}>{selectedStartDate.replace(/-/g, "/")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }

            <TouchableOpacity onPress={updateActivity} style={{ backgroundColor: "#FCC755", padding: "5%", marginLeft: "5%", marginRight: "5%", marginBottom: "5%", borderRadius: 30, justifyContent: 'center', alignItems: 'center' }} >
              <Text style={{ color: "white", fontWeight: "500", fontSize: 22 }}>Update activity</Text>
            </TouchableOpacity>

            {completed == false ?
              <View style={{ flexDirection: "row", justifyContent: "space-between", width: "90%", alignSelf: "center", marginBottom: "5%" }}>
                <TouchableOpacity onPress={() => activityCompleted(selectedActivity, selectedGoal)} style={{ backgroundColor: "#47AFB0", padding: "9%", paddingRight: "2%", paddingLeft: "2%", borderRadius: 14, justifyContent: 'center', alignItems: 'center' }} >
                  <Text style={{ color: "white", fontWeight: "500", fontSize: 20 }}>Mark completed <Feather name="check" size={24} color="white" /></Text>
                </TouchableOpacity>
              </View>
              : null}

            <TouchableOpacity onPress={() => removeActivity(selectedActivity, selectedGoal)} style={{ borderColor: "#F97459", borderWidth: 3, padding: "4%", marginLeft: "5%", marginRight: "5%", marginBottom: "10%", marginTop: 1, borderRadius: 14, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: "#F97459", fontFamily: "OpenSans_600SemiBold", fontSize: 20 }}>Remove</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );


  return (
    <View style={{ flex: 1 }}>
      <Tabs.Navigator
        lazy={true}
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
          options={{
            tabBarLabel: 'Goals',
            tabBarIcon: (
              { color, size }) => (
              <Moticon name='Bullseye-Pointer' size={30} color={color} />
            ),
          }}>
          {(props) => <GoalsTab  {...props} load={load} setGoalTabNav={setGoalTabNav} sheetRef={sheetRef} updateRef={updateRef} addActivityRef={addActivityRef} activityRef={activityRef} setSelectedGoal={setSelectedGoal} setCompleted={setCompleted} setSelectedActivity={setSelectedActivity} autoPopulateWindow={autoPopulateWindow} />}
        </Tabs.Screen>
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
            tabBarIcon: ({ color }) => (
              <Moticon name='LeaderBoard' size={30} color={color} />
            ),
          }} />
      </Tabs.Navigator>
      <BottomSheet
        ref={sheetRef}
        snapPoints={["85%", 0, 0]}
        renderContent={addGoal}
        initialSnap={2}
        enabledGestureInteraction={true}
        enabledContentTapInteraction={false}
        onCloseEnd={onCloseWindow}
      />
      <BottomSheet
        ref={updateRef}
        snapPoints={["85%", 0, 0]}
        renderContent={editGoal}
        initialSnap={2}
        enabledInnerScrolling={true}
        enabledContentGestureInteraction={true}
        enabledGestureInteraction={true}
        enabledContentTapInteraction={false}
        // onOpenStart={() => onStartWindow(updateRef)}
        onCloseEnd={onCloseWindow}
      />
      <BottomSheet
        ref={addActivityRef}
        snapPoints={["85%", 0, 0]}
        renderContent={addActivity}
        initialSnap={2}
        enabledGestureInteraction={true}
        enabledContentTapInteraction={false}
        onCloseEnd={onCloseWindow}
      />
      <BottomSheet
        ref={activityRef}
        snapPoints={["85%", 0, 0]}
        renderContent={editActivity}
        initialSnap={2}
        enabledInnerScrolling={true}
        enabledContentGestureInteraction={true}
        enabledGestureInteraction={true}
        enabledContentTapInteraction={false}
        // onOpenStart={() => onStartWindow(activityRef)}
        onCloseEnd={onCloseWindow}
      />
      <BottomSheet
        ref={calendarRef}
        snapPoints={["55%", 0, 0]}
        renderContent={calendarContent}
        initialSnap={2}
        enabledGestureInteraction={true}
        enabledContentTapInteraction={false}
        onCloseEnd={onCloseWindow}
      />
    </View>
  );
}
