import axios from 'axios';
import { Dispatch } from 'react';
import { BASE_URL } from '../../utils';

export interface UserDataModel {
  indexOf(goal: any);
  data: any
}

export interface UserDataAction {
  readonly type: 'ON_USERGOALS';
  payload: UserDataModel;
}

export interface FailedAction {
  readonly type: 'ON_FAILED';
  payload: any;
}

export type LoadUserDataAction = UserDataAction | FailedAction;

// we need to dispatch action
export const onUserData = (token: string) => {
  
  return async (dispatch: Dispatch<LoadUserDataAction>) => {
    try {
      const [goals] = await Promise.all<UserDataModel>([
        axios.get(`${BASE_URL}goals/objectives.json`,{method: 'get',headers: {'token': token},data : ""})
      ]);

      if (!goals) {
        dispatch({
          type: 'ON_FAILED',
          payload: 'Login issue with API',
        });
      } else {
        dispatch({
          type: 'ON_USERGOALS',
          payload: goals.data,
        });
      }
    } catch (error) {
      dispatch({
        type: 'ON_FAILED',
        payload: error,
      });
    }
  };
};
