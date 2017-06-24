import _ from 'lodash'
import { USER_LOGIN_EXPIRED, USER_LOGIN_EXPIRE_END } from './authentication'
import { EXERCISE_NOT_DELETED } from './index'
import { RESET_NOTIFICATIONS}  from './index'

export default (error, dispatch) => {
  const isUnauthorized = _.some(_.castArray(error), err => err && err.code === 401)
  if (isUnauthorized) {
    localStorage.removeItem('auth_token')
    dispatch({type: USER_LOGIN_EXPIRED})

    //after 5 sec, send end of user expiry event
    setTimeout(function() {
      dispatch({type: USER_LOGIN_EXPIRE_END})
    }, 5000)
  }

  //now some real error handling
  _.forEach(error.errors, ({ code, details }) => {
    const isWorkoutNotDeletedError = code === 422 && _.has(details, 'performed_exercises')
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
