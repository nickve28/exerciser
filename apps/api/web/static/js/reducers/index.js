import { combineReducers } from 'redux';

import CategoryReducer from './category'
import ExerciseReducer from './exercise'
import {MeReducer, AuthenticationReducer} from './user'
import WorkoutReducer from './workout'
import NotificationReducer from './notification'

import { reducer as FormReducer } from 'redux-form'

const reducers = combineReducers({
  exercises: ExerciseReducer,
  me: MeReducer,
  authentication: AuthenticationReducer,
  categories: CategoryReducer,
  workouts: WorkoutReducer,
  notifications: NotificationReducer,
  form: FormReducer
})

export default reducers
