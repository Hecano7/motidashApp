import React, { useContext, useState } from 'react'
import  AsyncStorage  from "@react-native-community/async-storage";
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState, onLogout } from '../src/redux';

type User = null | { username: string }

export const AuthContext = React.createContext<{
  user : User,
  login: () => void
  logout: () => void
}>({
  user: null,
  login: () => {},
  logout: () => {}
});

interface AuthProviderProps {}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  // const { user, error } = useSelector((state: ApplicationState) => state.userReducer);
  const dispatch = useDispatch();
  const [user, setUser] = useState<User>(null);
    return <AuthContext.Provider value={{
      user,
      login: () => {
        const fakeUser = { username: 'bob'};
        setUser(fakeUser);
        AsyncStorage.setItem("user", JSON.stringify(fakeUser));
      },
      logout: () => {
        setUser(null);
        dispatch(onLogout());
        // console.log("userGoals: ",AsyncStorage.getItem("user"));
        AsyncStorage.removeItem("user");
        AsyncStorage.removeItem("account");
        AsyncStorage.getItem("user")
        .then(userString => console.log(userString))
        .catch(err => {
          console.log(err);
        });
      }
    }}>{children}
    </AuthContext.Provider>;
}