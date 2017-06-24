import handleErrors from '../../../actions/error'

import configuration from '../../../configs/index'
import { post } from '../../../helpers/request'
export const url = `${configuration.apiHost}:${configuration.apiPort}/api/graphql`

import _ from 'lodash'
import HttpTransport from 'lokka-transport-http'

export const FETCH_EXERCISES = 'FETCH_EXERCISES'
export const FETCH_EXERCISE = 'FETCH_EXERCISE'
export const CREATE_EXERCISE = 'CREATE_EXERCISE'
export const DELETE_EXERCISE = 'DELETE_EXERCISE'
export const EXERCISE_NOT_DELETED = 'EXERCISE_NOT_DELETED'
export const UPDATE_EXERCISE = 'UPDATE_EXERCISE'

export const fetchExercises = () => {
  const payload = `{
    exercises {
      name, id, categories, description, type, metric
    },
    exerciseCount
  }`

  return {
    payload,
    type: FETCH_EXERCISES,
    status: 'pending'
  }
}

export const fetchExercise = (id) => {
  const query = `{
    exercise(id: ${id}) {
      name, id, categories, description, type, metric
    }
  }`

  return {
    type: FETCH_EXERCISE,
    payload: query,
    status: 'pending'
  }
}

export const saveExercise = ({name, description, categories, type, metric}) => {
  const token = localStorage.getItem('auth_token')
  const formatted_categories = _.chain(categories)
                                .map(category => `"${category}"`)
                                .join(',').value()
  const headers = {
    authorization: `Bearer ${token}`
  }
  return dispatch => {
    const transport = new HttpTransport(url, {headers})
    return transport.send(`mutation {
      createExercise(name: "${name}", categories: [${formatted_categories}], description: "${description}", type: "${type}", metric: "${metric}") {
        name, id, categories, metric, type, description
      }
    }`).then(function (data) {
      return dispatch({
        type: CREATE_EXERCISE,
        payload: data
      })
    }).catch(err => handleErrors(err, dispatch))
  }
}

export const updateExercise = ({id, description, categories}) => {
  const token = localStorage.getItem('auth_token')
  const formatted_categories = _.chain(categories)
                                .map(category => `"${category}"`)
                                .join(',').value()
  const headers = {
    authorization: `Bearer ${token}`
  }
  return dispatch => {
    return post(`mutation {
      updateExercise(id: ${id}, categories: [${formatted_categories}], description: "${description}") {
        name, id, description, categories, type, metric
      }
    }`, { url, headers }).then(function (data) {
      return dispatch({
        type: UPDATE_EXERCISE,
        payload: data
      })
    }).catch(err => handleErrors(err, dispatch))
  }
}

export const deleteExercise = (id) => {
  const token = localStorage.getItem('auth_token')
  return dispatch => {
    const headers = {
      authorization: `Bearer ${token}`
    }
    return post(`mutation {
      deleteExercise(id: ${id})
    }`, {url, headers}).then(data => {
      return dispatch({
        type: DELETE_EXERCISE,
        payload: data
      })
    }).catch(err => handleErrors(err, dispatch))
  }
}
