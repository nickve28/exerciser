import configuration from '../configs/index'
export const LOGIN_ENDPOINT = `${configuration.apiHost}:${configuration.apiPort}/api/login`

export const USER_LOGIN_PENDING = 'USER_LOGIN_PENDING'
export const USER_LOGIN = 'USER_LOGIN'
export const USER_LOGIN_FAILED = 'USER_LOGIN_FAILED'
export const USER_LOGIN_EXPIRED = 'USER_LOGIN_EXPIRED'
export const USER_LOGIN_EXPIRE_END = 'USER_LOGIN_EXPIRE_END'

import axios from 'axios'

export const loginUser = (user, password) => {
  return dispatch => {
    dispatch({type: USER_LOGIN_PENDING})

    const payload = {name: user, password: password}
    return axios.post(LOGIN_ENDPOINT, payload).then(function (loginData) {
      if (loginData.data.error) {
        return dispatch({
          type: USER_LOGIN_FAILED
        })
      }
      return dispatch({
        type: USER_LOGIN,
        payload: loginData.data
      })
    })
  }
}