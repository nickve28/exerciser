import {DELETE_WORKOUT, USER_LOGIN_EXPIRED, USER_LOGIN_EXPIRE_END, DELETE_WORKOUT_NOTIFICATION_END,
  EXERCISE_NOT_DELETED, RESET_NOTIFICATIONS} from '../actions/index'
import _ from 'lodash'

const INITIAL_STATE = {
  showWorkoutDeleted: false,
  showLoginExpired: false,
  showNoExerciseDeleted: false,
}

export default (state = INITIAL_STATE, action) => {
  if (action.type === DELETE_WORKOUT) {
    return _.defaults({showWorkoutDeleted: true}, INITIAL_STATE)
  }
  if (action.type === USER_LOGIN_EXPIRED) {
    return _.defaults({showLoginExpired: true}, INITIAL_STATE)
  }
  if (action.type === EXERCISE_NOT_DELETED) {
    return _.defaults({showNoExerciseDeleted: true}, INITIAL_STATE)
  }
  if (action.type === USER_LOGIN_EXPIRE_END || action.type === DELETE_WORKOUT_NOTIFICATION_END || action.type === RESET_NOTIFICATIONS) {
    //a reset to stop notifications from lingering
    return INITIAL_STATE
  }
  return state
}
