import { combineReducers } from 'redux'

import ExerciseReducer from '../sections/exercises/reducers/exercise'
import CategoryReducer from '../sections/exercises/reducers/category'
import {MeReducer, AuthenticationReducer} from './user'
import WorkoutReducer from './workout'
import NotificationReducer from './notification'
import ProgressReducer from './progress'

import { reducer as FormReducer } from 'redux-form'

const reducers = combineReducers({
  exercises: ExerciseReducer,
  me: MeReducer,
  authentication: AuthenticationReducer,
  categories: CategoryReducer,
  workouts: WorkoutReducer,
  notifications: NotificationReducer,
  progress: ProgressReducer,
  form: FormReducer
})

export default reducers
