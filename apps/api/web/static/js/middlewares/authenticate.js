import { get } from 'lodash'
import { USER_LOGIN_PENDING, USER_LOGIN } from '../actions/authentication'

import { post } from '../helpers/request'

import configuration from '../configs/index'
const url = `${configuration.apiHost}:${configuration.apiPort}/api/graphql`

const middleware = store => next => action => {
  if (action.type !== USER_LOGIN_PENDING) {
    return next(action)
  }

  const pendingAction = { ...action, type: USER_LOGIN, status: 'pending' }
  store.dispatch(pendingAction) //dispatch original pending action

  return post(action.payload, { url })
    .then(response => {
      const payload = get(response, 'login', null)
      if (!payload) {
        throw Error('Authentication failed')
      }

      return store.dispatch({
        payload,
        type: USER_LOGIN,
        status: 'success'
      })
    }).catch(error => {
      return store.dispatch({
        error,
        type: USER_LOGIN,
        status: 'failed'
      })
    })
}

export default middleware