import { combineReducers } from 'redux';

import CategoryReducer from './category'
import ExerciseReducer from './exercise'
import {MeReducer, AuthenticationReducer} from './user'
import WorkoutReducer from './workout'

const reducers = combineReducers({
  exercises: ExerciseReducer,
  me: MeReducer,
  authentication: AuthenticationReducer,
  categories: CategoryReducer,
  workouts: WorkoutReducer
})

export default reducers
