import configuration from '../configs/index'
export const URL = `${configuration.apiHost}:${configuration.apiPort}/api/graphql`

import handleUnauthorized from './error'

import HttpTransport from 'lokka-transport-http'

export const FETCH_ME = 'FETCH_ME'

export const fetchMe = () => {
  const token = localStorage.getItem('auth_token')
  return dispatch => {
    const headers = {
      authorization: `Bearer ${token}`
    }
    const transport = new HttpTransport(URL, {headers})
    transport.send('{me { name, id } }').then(function (data) {

      return dispatch({
        type: FETCH_ME,
        payload: data.me
      })
    }).catch(err => handleUnauthorized(err, dispatch))
  }
}