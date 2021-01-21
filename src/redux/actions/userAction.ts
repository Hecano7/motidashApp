import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { Dispatch } from 'react';
import { BASE_URL } from '../../utils';

export interface UserModel {
  token: string;
}

export interface LoginAction {
  readonly type: 'ON_LOGIN';
  payload: UserModel;
}

export interface LogoutAction {
  readonly type: 'ON_LOGOUT';
  payload: UserModel;
}

export interface ErrorAction {
  readonly type: 'ON_ERROR';
  payload: any;
}

export type UserAction = LoginAction | LogoutAction | ErrorAction;

// we need to dispatch action
export const onLogin = (email: string, password: string) => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      const response = await axios.post<UserModel>(`${BASE_URL}session.json`, {
        "user_account": {
          email,
          password
        },
        "platform": "mobile-ios"
      });

      if (!response) {
        dispatch({
          type: 'ON_ERROR',
          payload: 'Login issue with API',
        });
      } else {
        const fakeUser = { email: email, password: password};
        AsyncStorage.setItem("account", JSON.stringify(fakeUser));
        dispatch({
          type: 'ON_LOGIN',
          payload: response.data,
        });
      }
    } catch (error) {
      dispatch({
        type: 'ON_ERROR',
        payload: error,
      });
    }
  };
};

export const onLogout = () => {
  return async (dispatch: Dispatch<UserAction>) => {
    console.log("onLogout");
    dispatch({
      type: 'ON_LOGIN',
      payload: { token: undefined},
    });
  };
};