  
import { LoadUserDataAction, UserDataModel } from '../actions/loadUserDataAction';

type UserDataState = {
  userGoals: UserDataModel;
  error: string | undefined;
};

const initialState = {
  userGoals: {} as UserDataModel,
  error: undefined,
};

const LoadUserDataReducer = (state: UserDataState = initialState, action: LoadUserDataAction) => {
  switch (action.type) {
    case 'ON_USERGOALS':
      return {
        ...state,
        userGoals: action.payload,
      };
    case 'ON_FAILED':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export { LoadUserDataReducer };