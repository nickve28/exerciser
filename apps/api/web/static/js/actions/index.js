import configuration from '../configs/index'
export const URL = `${configuration.apiHost}:${configuration.apiPort}/api/graphql`
export const LOGIN_ENDPOINT = `${configuration.apiHost}:${configuration.apiPort}/api/login`

export const RESET_NOTIFICATIONS = 'RESET_NOTIFICATIONS'

export {
  FETCH_WORKOUT, FETCH_WORKOUTS, FETCH_MORE_WORKOUTS, FETCH_WORKOUT_TEMPLATE, SAVE_WORKOUT, DELETE_WORKOUT,
  UPDATE_WORKOUT, DELETE_WORKOUT_NOTIFICATION_END,
  fetchWorkout, fetchWorkouts, fetchWorkoutTemplate,
  saveWorkout, deleteWorkout, updateWorkout
} from './workout'

export {FETCH_ME, fetchMe} from './user'

export {
  FETCH_EXERCISES, SAVE_EXERCISE, DELETE_EXERCISE, FETCH_CATEGORIES, EXERCISE_NOT_DELETED,
  fetchExercises, saveExercise, deleteExercise, fetchCategories
} from './exercise'

export {
  USER_LOGIN, USER_LOGIN_EXPIRED, USER_LOGIN_PENDING, USER_LOGIN_FAILED, USER_LOGIN_EXPIRE_END,
  loginUser

} from './authentication'

export {
  FETCH_PROGRESS,
  fetchProgress
} from './progress'


