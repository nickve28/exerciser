import handleUnauthorized from './error'
import configuration from '../configs/index'

import _ from 'lodash'
import {post} from '../helpers/request'

export const FETCH_PROGRESS = 'FETCH_PROGRESS'

const url = `${configuration.apiHost}:${configuration.apiPort}/api/graphql`


export const fetchProgress = ({exerciseId, fromDate, untilDate}) => {
  const token = localStorage.getItem('auth_token')
  const filters = _.chain([
    fromDate ? `from: ${fromDate}` : null,
    untilDate ? `until: ${until}` : null,
    `exerciseId: ${exerciseId}`
  ]).compact()
    .join(', ')
    .value()

  const headers = {
    authorization: `Bearer ${token}`
  }

  const query = `{
    me {
      progress(${filters}) {
        exercise_id, progress {
          weight, sets, reps, date
        }
      }
    }
  }`

  return dispatch => {
    return post(query, {url, headers}).then(result => {
      console.log('result %j', result)
      dispatch({
        type: FETCH_PROGRESS,
        payload: result.me.progress
      })
    }).catch(err => {
      return handleUnauthorized(err, dispatch)
    })
  }
}