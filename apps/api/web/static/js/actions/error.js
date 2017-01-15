import _ from 'lodash'
import {USER_LOGIN_EXPIRED, USER_LOGIN_EXPIRE_END} from './authentication'

export default (error, dispatch) => {
  //no idea how lokka does error handling...
  const isUnauthorized = _.includes(error.toString(), '401')
  if (isUnauthorized) {
    localStorage.removeItem('auth_token')
    dispatch({type: USER_LOGIN_EXPIRED})

    //after 5 sec, send end of user expiry event
    setTimeout(function() {
      dispatch({type: USER_LOGIN_EXPIRE_END})
    }, 5000);
  }
  return error
}
