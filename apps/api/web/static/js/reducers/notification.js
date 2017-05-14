import {DELETE_WORKOUT, USER_LOGIN_EXPIRED, USER_LOGIN_EXPIRE_END, DELETE_WORKOUT_NOTIFICATION_END,
  EXERCISE_NOT_DELETED, RESET_NOTIFICATIONS, SAVE_WORKOUT, SAVE_WORKOUT_NOTIFICATION_END, UPDATE_WORKOUT_NOTIFICATION_END,
  UPDATE_WORKOUT } from '../actions/index'
import _ from 'lodash'

const END_NOTIFICATIONS = [USER_LOGIN_EXPIRE_END, DELETE_WORKOUT_NOTIFICATION_END, RESET_NOTIFICATIONS,
  SAVE_WORKOUT_NOTIFICATION_END, UPDATE_WORKOUT_NOTIFICATION_END]

const INITIAL_STATE = {
  showWorkoutDeleted: false,
  showLoginExpired: false,
  showNoExerciseDeleted: false,
  showWorkoutCreated: false,
  showWorkoutUpdated: false
}

export default (state = INITIAL_STATE, action) => {
  if (action.type === UPDATE_WORKOUT) {
    return _.defaults({showWorkoutUpdated: true}, INITIAL_STATE)
  }
  if (action.type === SAVE_WORKOUT) {
    return _.defaults({showWorkoutCreated: true}, INITIAL_STATE)
  }
  if (action.type === DELETE_WORKOUT) {
    return _.defaults({showWorkoutDeleted: true}, INITIAL_STATE)
  }
  if (action.type === USER_LOGIN_EXPIRED) {
    return _.defaults({showLoginExpired: true}, INITIAL_STATE)
  }
  if (action.type === EXERCISE_NOT_DELETED) {
    return _.defaults({showNoExerciseDeleted: true}, INITIAL_STATE)
  }
  if (_.includes(END_NOTIFICATIONS, action.type)) {
    //a reset to stop notifications from lingering
    return INITIAL_STATE
  }
  return state
}
