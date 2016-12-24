import { combineReducers } from 'redux';

import CategoryReducer from './category'
import ExerciseReducer from './exercise'
import {MeReducer, AuthenticationReducer} from './user'

const reducers = combineReducers({
  exercises: ExerciseReducer,
  me: MeReducer,
  authentication: AuthenticationReducer,
  categories: CategoryReducer
})

export default reducers
