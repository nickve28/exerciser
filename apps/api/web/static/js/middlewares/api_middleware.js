import { pick, isNull, some, values } from 'lodash'
import { post } from '../helpers/request'

import configuration from '../configs/index'
const url = `${configuration.apiHost}:${configuration.apiPort}/api/graphql`

export default config => {
  return store => next => action => {
    const responseFields = config.actions[action.type]
    if (!responseFields || action.status !== 'pending') {
      return next(action)
    }
    next(action)

    const token = store.getState().authentication.token
    const headers = {
      authorization: `Bearer ${token}`
    }

    return post(action.payload, { url, headers })
      .then(response => {
        const payload = pick(response, config.actions[action.type], null)
        if (some(values(payload), isNull)) {
          throw new Error('No result returned')
        }

        const successAction = {
          payload: response,
          type: action.type,
          status: 'success'
        }

        return store.dispatch(successAction)
      }).catch(error => {
        const failedAction = {
          type: action.type,
          status: 'failed',
          error: error.toJSON()
        }
        return store.dispatch(failedAction)
      })
  }
}