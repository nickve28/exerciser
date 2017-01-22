import handleUnauthorized from './error'

import configuration from '../configs/index'
export const URL = `${configuration.apiHost}:${configuration.apiPort}/api/graphql`

import _ from 'lodash'
import HttpTransport from 'lokka-transport-http'
const transport = new HttpTransport(URL)

export const FETCH_EXERCISES = 'FETCH_EXERCISES'
export const SAVE_EXERCISE = 'SAVE_EXERCISE'
export const DELETE_EXERCISE = 'DELETE_EXERCISE'
export const FETCH_CATEGORIES = 'FETCH_CATEGORIES'

export const fetchExercises = () => {
  const token = localStorage.getItem('auth_token')
  return dispatch => {
    const headers = {
      authorization: `Bearer ${token}`
    }
    const transport = new HttpTransport(URL, {headers})
    return transport.send(`{exercises { name, id, categories, description } }`).then(function (data) {
      return dispatch({
        type: FETCH_EXERCISES,
        payload: data.exercises
      })
    }).catch(err => handleUnauthorized(err, dispatch))
  }
}

export const saveExercise = ({name, description, categories}) => {
  const token = localStorage.getItem('auth_token')
  const formatted_categories = _.chain(categories)
                                .map(category => `"${category}"`)
                                .join(',').value()
  const headers = {
    authorization: `Bearer ${token}`
  }
  return dispatch => {
    const transport = new HttpTransport(URL, {headers})
    return transport.send(`mutation {
      create_exercise(name: "${name}", categories: [${formatted_categories}], description: "${description}") {
        name, id
      }
    }`).then(function (data) {
      return dispatch({
        type: SAVE_EXERCISE,
        payload: data
      })
    }).catch(err => handleUnauthorized(err, dispatch))
  }
}

export const deleteExercise = (id) => {
  const token = localStorage.getItem('auth_token')
  return dispatch => {
    const headers = {
      authorization: `Bearer ${token}`
    }
    const transport = new HttpTransport(URL, {headers})
    return transport.send(`mutation {
      delete_exercise(id: ${id})
    }`).then(function (data) {
      return dispatch({
        type: DELETE_EXERCISE,
        payload: data
      })
    }).catch(err => handleUnauthorized(err, dispatch))
  }
}

export const fetchCategories = () => {
  const token = localStorage.getItem('auth_token')
  return dispatch => {
    const headers = {
      authorization: `Bearer ${token}`
    }
    const transport = new HttpTransport(URL, {headers})
    transport.send(`{categories}`).then(function (data) {
      return dispatch({
        type: FETCH_CATEGORIES,
        payload: data.categories
      })
    }).catch(err => handleUnauthorized(err, dispatch))
  }
}
