import { pick, isNull, some, values, includes } from 'lodash'
import { post } from '../helpers/request'

import configuration from '../configs/index'
const url = `${configuration.apiHost}:${configuration.apiPort}/api/graphql`

const isFewerThanCacheTime = (timestamp, cacheMinutes) => {
  const timeOfRequest = timestamp.getTime()
  const currentTime = new Date().getTime()
  const fiveMinuteWindow = 1000 * 60 * cacheMinutes

  return fiveMinuteWindow > (currentTime - timeOfRequest)
}

export default config => {
  return store => next => action => {
    const responseFields = config.actions[action.type]
    if (!responseFields || action.status !== 'pending') {
      return next(action)
    }

    //check if we did a recent success request, then no further action is required
    const { requests } = store.getState()[config.plural]
    const request = requests[action.type]

    const isRecentSuccessRequest =
      request &&
      request.type === action.type &&
      request.status === 'success' &&
      isFewerThanCacheTime(request.timestamp, config.cacheTime)
    console.log("action", action);

    console.log("isRecentSuccessRequest", isRecentSuccessRequest);


    const shouldCache =
      includes(config.cache, action.type)
    console.log("shouldCache", shouldCache);


    if (shouldCache && isRecentSuccessRequest) {
      return true
    }

    //Dispatch action and start API request
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
          error: (error instanceof Error) ? error.message : error,
          type: action.type,
          status: 'failed'
        }
        return store.dispatch(failedAction)
      })
  }
}