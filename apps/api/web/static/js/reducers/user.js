import {FETCH_ME, USER_LOGIN, USER_LOGIN_PENDING, USER_LOGIN_FAILED,
        USER_LOGIN_EXPIRED} from '../actions/index'

export const MeReducer = (state = {}, action) => {
  if (action.type === FETCH_ME) {
    return action.payload.me
  }
  return state
}

export const AuthenticationReducer = (state = {token: null}, action) => {
  if (action.type === USER_LOGIN_PENDING) {
    return {
      loginState: 'logging_in'
    }
  }

  if (action.type === USER_LOGIN) {
    if (!action.payload.error)
      localStorage.setItem('auth_token', action.payload.token)
    return {
      token: action.payload.token,
      loginState: 'logged_in'
    }
  }

  if (action.type === USER_LOGIN_FAILED) {
    localStorage.removeItem('auth_token')
    return {
      loginState: 'login_failure'
    }
  }

  if (action.type === USER_LOGIN_EXPIRED) {
    localStorage.removeItem('auth_token')
    return {
      loginState: 'logged_out'
    }
  }

  return {
    token: localStorage.getItem('auth_token'),
    loginState: 'logged_in'
  }
}