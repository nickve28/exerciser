import {DELETE_WORKOUT, USER_LOGIN_EXPIRED, USER_LOGIN_EXPIRE_END} from '../actions/index'
import _ from 'lodash'

const INITIAL_STATE = {showWorkoutDeleted: false, showLoginExpired: false}

export default (state = INITIAL_STATE, action) => {
  if (action.type === DELETE_WORKOUT) {
    return _.defaults({showWorkoutDeleted: true}, INITIAL_STATE)
  }
  if (action.type === USER_LOGIN_EXPIRED) {
    return _.defaults({showLoginExpired: true}, INITIAL_STATE)
  }
  if (action.type === USER_LOGIN_EXPIRE_END) {
    //a reset to stop notifications from lingering
    return INITIAL_STATE
  }
  return state
}
