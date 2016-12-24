import {FETCH_ME, USER_LOGIN} from '../actions/index'

export const MeReducer = (state = {}, action) => {
  if (action.type === FETCH_ME) {
    return action.payload.me
  }
  return state
}

export const AuthenticationReducer = (state = {token: null}, action) => {
  if (action.type === USER_LOGIN) {
    localStorage.setItem('auth_token', action.payload.token)
    return {token: action.payload.token}
  }
  return {token: localStorage.getItem('auth_token')}
}