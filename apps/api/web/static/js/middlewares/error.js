import _ from 'lodash'

import {
  EXERCISE_NOT_DELETED,
  USER_LOGIN_EXPIRED,
  USER_LOGIN_EXPIRE_END,
  RESET_NOTIFICATIONS
} from '../actions/index'

const middleware = store => next => action => {
  if (action.status !== 'failed') {
    return next(action)
  }
  next(action)

  const dispatch = store.dispatch
  const error = action.error


  const isUnauthorized = _.some(_.castArray(error), err => err && err.code === 401)
  if (isUnauthorized) {
    localStorage.removeItem('auth_token')
    dispatch({ type: USER_LOGIN_EXPIRED })

    //after 5 sec, send end of user expiry event
    setTimeout(function() {
      dispatch({ type: USER_LOGIN_EXPIRE_END })
    }, 5000)
  }


  _.forEach(error, ({ code, details }) => {
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

export default middleware