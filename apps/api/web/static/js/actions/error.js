import _ from 'lodash'
import {USER_LOGIN_EXPIRED, USER_LOGIN_EXPIRE_END} from './authentication'
import {EXERCISE_NOT_DELETED} from './exercise'
import {RESET_NOTIFICATIONS} from './index'

export default (error, dispatch) => {
  //no idea how lokka does error handling...
  const isUnauthorized = _.includes(error.toString(), '401')
  if (isUnauthorized) {
    localStorage.removeItem('auth_token')
    dispatch({type: USER_LOGIN_EXPIRED})

    //after 5 sec, send end of user expiry event
    setTimeout(function() {
      dispatch({type: USER_LOGIN_EXPIRE_END})
    }, 5000)
  }

  //now some real error handling
  _.forEach(error.errors, ({code, details}) => {
    const isWorkoutNotDeletedError = code === 422 && details.id === 'is used in a workout'
    if (isWorkoutNotDeletedError) {
      dispatch({
        type: EXERCISE_NOT_DELETED
      })
    }
  })
  setTimeout(() => {
    dispatch({
      type: RESET_NOTIFICATIONS
    })
  }, 5000)

  return error
}
