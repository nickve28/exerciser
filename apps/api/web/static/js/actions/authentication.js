import _ from 'lodash'

import configuration from '../configs/index'
export const LOGIN_ENDPOINT = `${configuration.apiHost}:${configuration.apiPort}/api/graphql`

export const USER_LOGIN_PENDING = 'USER_LOGIN_PENDING'
export const USER_LOGIN = 'USER_LOGIN'
export const USER_LOGIN_FAILED = 'USER_LOGIN_FAILED'
export const USER_LOGIN_EXPIRED = 'USER_LOGIN_EXPIRED'
export const USER_LOGIN_EXPIRE_END = 'USER_LOGIN_EXPIRE_END'

import axios from 'axios'

export const loginUser = (user, password) => {
  return dispatch => {
    dispatch({type: USER_LOGIN_PENDING})

    const query = `mutation {
      login(username: "${user}", password: "${password}") {
        id, token
      }
    }`

    return axios.post(LOGIN_ENDPOINT, { query }).then(response => {
      //improve once we have middleware for axios
      const payload = _.get(response, 'data.data.login', null)
      if (!payload) {
        throw Error('Authentication failed')
      }

      return dispatch({
        payload,
        type: USER_LOGIN
      })
    }).catch(() => {
      return dispatch({
        type: USER_LOGIN_FAILED
      })
    })
  }
}