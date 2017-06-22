import configuration from '../configs/index'
export const LOGIN_ENDPOINT = `${configuration.apiHost}:${configuration.apiPort}/api/graphql`

export const USER_LOGIN_PENDING = 'USER_LOGIN_PENDING'
export const USER_LOGIN = 'USER_LOGIN'
export const USER_LOGIN_EXPIRED = 'USER_LOGIN_EXPIRED'
export const USER_LOGIN_EXPIRE_END = 'USER_LOGIN_EXPIRE_END'

export const loginUser = (user, password) => {
  const query = `mutation {
    login(username: "${user}", password: "${password}") {
      id, token
    }
  }`
  return { payload: query , type: USER_LOGIN_PENDING }
}