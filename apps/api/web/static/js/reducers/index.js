import { combineReducers } from 'redux'

import CategoryReducer from './category'
import {MeReducer, AuthenticationReducer} from './user'
import WorkoutReducer from './workout'
import NotificationReducer from './notification'
import ProgressReducer from './progress'

import { reducer as FormReducer } from 'redux-form'

import createReducer from './api_reducer'

const exerciseConfig = {
  dataType: 'exercise',
  plural: 'exercises',
  actions: {
    list: 'FETCH_EXERCISES',
    get: 'FETCH_EXERCISE',
    create: 'CREATE_EXERCISE',
    update: 'UPDATE_EXERCISE',
    delete: 'DELETE_EXERCISE'
  },
  initialState: {
    entities: {}
  }
}

const reducers = combineReducers({
  exercises: createReducer(exerciseConfig),
  me: MeReducer,
  authentication: AuthenticationReducer,
  categories: CategoryReducer,
  workouts: WorkoutReducer,
  notifications: NotificationReducer,
  progress: ProgressReducer,
  form: FormReducer
})

export default reducers
