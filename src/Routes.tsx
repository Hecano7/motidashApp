import React, { useContext, useEffect, useState } from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import  AsyncStorage  from "@react-native-community/async-storage";
import { Center } from './Center';
import { AuthContext } from './AuthProvider';
import { AppTabs } from './AppTabs';
import { AuthStack } from './AuthStack';
import { Provider } from "react-redux";
import { store } from './redux'


interface RoutesProps {}



export const Routes: React.FC<RoutesProps> = ({}) => {
  const { user , login } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // check if user is loged in
    AsyncStorage.getItem('account')
    .then(userString => {
      if (userString) {
        // decode it
        // login();
      }
      setLoading(false);
    })
    .catch(err => {
      console.log(err);
    });
  }, [])

  if (loading) {
    return(
    <Center>
      <ActivityIndicator size="large"/>
    </Center>
    );
  }

  return (
      <NavigationContainer >
        {user ? (
            <AppTabs store={store}/>
        ) : (
          <AuthStack store={store}/>
        )}
      </NavigationContainer>
  );
}