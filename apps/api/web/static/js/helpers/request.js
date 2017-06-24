import axios from 'axios'
import _ from 'lodash'
import Promise from 'bluebird'

export const post = (payload, { url, headers }) => {
  return Promise.try(() => {
    return axios.post(url, { query: payload }, {headers})
  }).then(response => {
    const data = _.get(response, 'data.data')
    const errors = _.get(response, 'data.errors')

    if (!_.isEmpty(errors)) {
      throw errors
    }

    return data
  })
}