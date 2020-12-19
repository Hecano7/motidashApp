import { combineReducers } from 'redux';
import { UserReducer } from './userReducer';
import { LoadUserDataReducer } from './loadUserDataReducer';

const rootReducer = combineReducers({
  userReducer: UserReducer,
  loadUserDataReducer: LoadUserDataReducer,
  //some more reducer will come
});

export type ApplicationState = ReturnType<typeof rootReducer>;

export { rootReducer };