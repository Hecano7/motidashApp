import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useState, useEffect } from 'react'
import { Text, StyleSheet, View, Image, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { AuthParamList } from './AuthParamList';
import { AuthContext } from './AuthProvider';
import { Header } from './Header';
import { useSelector, useDispatch } from 'react-redux';
import { ApplicationState, onLogin, onUserData } from '../src/redux';

interface AuthStackProps { store: any };

const Stack = createStackNavigator<AuthParamList>();

function StartUp({ navigation }) {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.container}>
      <View style={styles.first}>
        <Image
          style={{ height: "38%", width: "29%", marginTop: "10%" }}
          source={require('./img/MotidashLogo.png')}
        />
      </View>
      <View style={{ flex: 1.4, justifyContent: "flex-end", marginBottom: 10 }}>
        <Text style={styles.second}>Welcome to Motidash</Text>

        <Text style={styles.third}>For Sales Leaders looking for new ways to boost team performance, Motidash motivates salespeople to spend more time on prospecting, discovery, follow-up - and anything else they need to do to reach thier goals.</Text>
      </View>
      <View style={{ flex: .8 }}>
        <View style={{ flex: 1, paddingTop: 10 }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Register');
            }}
            style={styles.button} >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: "white", fontFamily: "OpenSans_600SemiBold", fontSize: 20 }}>Sign up</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SignIn');
            }}
            style={styles.register}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: "white", fontFamily: "OpenSans_600SemiBold", fontSize: 20 }}>I already have an account</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </TouchableWithoutFeedback>
  )
};

function Register({ navigation }:
  { navigation: StackNavigationProp<AuthParamList, 'Register'> }) {

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={{flex: 1}}>
      <Header title="Register your account" navigation={navigation} />
          <View style={{ flex: 4, paddingTop: "2%" }}>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <Text style={styles.label}>Name</Text>
              <TextInput style={styles.input} />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <Text style={styles.label}>Password</Text>
              <TextInput style={styles.input} />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: "5%" }}>
              <Text style={styles.label}>Password (again)</Text>
              <TextInput style={styles.input} />
            </View>
          </View>

          <View style={{ flex: 1.4 }}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity style={styles.buttonTwo} >
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: "white", fontWeight: "500", fontSize: 22 }}>Create my account</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, paddingLeft: "5%", fontFamily: "OpenSans_400Regular" }}>By tapping "Create my account" you agree to Motidash's <Text style={{ color: '#47AFB0' }}>Terms of Service</Text> and <Text style={{ color: '#47AFB0' }}>Privacy Policy</Text>.</Text>
            </View>
          </View>
     </View>
     </TouchableWithoutFeedback>
  )
};


function SignIn({ navigation }:
  { navigation: StackNavigationProp<AuthParamList, 'SignIn'> }) {
  const { login } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [load, loading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, error } = useSelector((state: ApplicationState) => state.userReducer);
  const { token } = user;
  useEffect(() => {
    if (token !== undefined) {
      console.log("Token: ", token);
      console.log(user);
      loading(false);
      dispatch(onUserData(token));
      login();
    };
    if (error !== undefined && token !== undefined) {
      // console.log(error);
      alert("Incorrect username or password");
      loading(false);
    }
    //do nothing
  }, [user, error]);

  const onTapLogin = () => {
    loading(true);
    dispatch(onLogin(email, password));
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={{ flex: 1 }}>
      <Header title="Log into your account" navigation={navigation} />
          <View style={{ flex: 4 }}>

            <View style={{ flex: 2, justifyContent: 'flex-end' }}>
              <Text style={styles.label} >Email</Text>
              <TextInput style={styles.input} placeholder="" autoCapitalize="none" onChangeText={setEmail} />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 30 }}>
              <Text style={styles.label}>Password</Text>
              <TextInput placeholder="" style={styles.input} autoCapitalize="none" onChangeText={setPassword} secureTextEntry={true} />
            </View>
          </View>

          <View style={{ flex: 1.6, paddingBottom: 30 }}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity style={styles.buttonTwo} onPress={onTapLogin}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: "white", fontWeight: "500", fontSize: 22 }}>Login</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginTop: 10 }}>
              <TouchableOpacity
                style={styles.forgotPassword}
              >
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: "#47AFB0", fontFamily: "OpenSans_600SemiBold", fontSize: 20 }}>I forgot my password</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
      {load && <ActivityIndicator animating={true} color={"#47AFB0"} style={styles.loading} />}
    </View>
    </TouchableWithoutFeedback>
  )
};

export const AuthStack: React.FC<AuthStackProps> = ({ }) => {
  return (
    <Stack.Navigator initialRouteName="StartUp">
      <Stack.Screen name="StartUp" options={{ header: () => null }} component={StartUp} />
      <Stack.Screen name="SignIn" options={{ header: () => null }} component={SignIn} />
      <Stack.Screen name="Register" options={{ header: () => null }} component={Register} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2b2b2b" },
  first: { flex: 1.2, alignItems: "center", justifyContent: "center" },
  second: { color: "white", paddingLeft: "5%", fontSize: 33, fontFamily: "OpenSans_300Light", paddingBottom: "2%" },
  third: { color: "white", alignItems: "center", justifyContent: "center", fontSize: 22, paddingLeft: "5%", fontFamily: "OpenSans_400Regular" },
  button: { backgroundColor: "#47AFB0", padding: "5%", marginLeft: "5%", marginRight: "5%", fontSize: 4, borderRadius: 14 },
  buttonTwo: { backgroundColor: "#47AFB0", padding: "5%", marginLeft: "5%", marginRight: "5%", fontSize: 4, borderRadius: 14 },
  register: { borderColor: "white", borderWidth: 3, padding: "4%", marginLeft: "5%", marginRight: "5%", marginTop: 1, fontSize: 4, borderRadius: 14 },
  forgotPassword: { borderColor: "#47AFB0", borderWidth: 3, padding: "4%", marginLeft: "5%", marginRight: "5%", fontSize: 4, borderRadius: 14 },
  input: { height: 50, borderColor: '#D8D8D8', borderWidth: 1.133, marginLeft: "5%", marginRight: "5%", fontSize: 20, paddingLeft: 15 },
  label: { paddingLeft: "5%", fontSize: 20, fontFamily: "OpenSans_400Regular" },
  loading: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, opacity: 0.5, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }
});
