import HttpTransport from 'lokka-transport-http'
import axios from 'axios'
import _ from 'lodash'

import configuration from '../configs/index'
export const URL = `${configuration.apiHost}:${configuration.apiPort}/api/graphql`
export const LOGIN_ENDPOINT = `${configuration.apiHost}:${configuration.apiPort}/api/login`

export {
  FETCH_WORKOUT, FETCH_WORKOUTS, FETCH_MORE_WORKOUTS, FETCH_WORKOUT_TEMPLATE, SAVE_WORKOUT, DELETE_WORKOUT,
  UPDATE_WORKOUT,
  fetchWorkoutAndExercises, fetchWorkoutsAndExercises, fetchWorkoutTemplateAndExercises,
  saveWorkout, deleteWorkout, updateWorkout
} from './workout'

export {FETCH_ME, fetchMe} from './user'

export {
  FETCH_EXERCISES, SAVE_EXERCISE, DELETE_EXERCISE, FETCH_CATEGORIES,
  fetchExercises, saveExercise, deleteExercise, fetchCategories
} from './exercise'

export {
  USER_LOGIN, USER_LOGIN_EXPIRED, USER_LOGIN_PENDING, USER_LOGIN_FAILED, USER_LOGIN_EXPIRE_END,
  loginUser

} from './authentication'


