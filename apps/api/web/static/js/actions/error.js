import _ from 'lodash'
import {USER_LOGIN_EXPIRED} from './authentication'

export default (error, dispatch) => {
  //no idea how lokka does error handling...
  const isUnauthorized = _.includes(error.toString(), '401')
  if (isUnauthorized) {
    localStorage.removeItem('auth_token')
    dispatch({type: USER_LOGIN_EXPIRED})
  }
  return error
}
