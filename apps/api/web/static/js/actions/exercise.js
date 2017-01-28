import handleErrors from './error'

import configuration from '../configs/index'
import {post} from '../helpers/request'
export const url = `${configuration.apiHost}:${configuration.apiPort}/api/graphql`

import _ from 'lodash'
import HttpTransport from 'lokka-transport-http'
const transport = new HttpTransport(url)

export const FETCH_EXERCISES = 'FETCH_EXERCISES'
export const SAVE_EXERCISE = 'SAVE_EXERCISE'
export const DELETE_EXERCISE = 'DELETE_EXERCISE'
export const FETCH_CATEGORIES = 'FETCH_CATEGORIES'
export const EXERCISE_NOT_DELETED = 'EXERCISE_NOT_DELETED'

export const fetchExercises = () => {
  const token = localStorage.getItem('auth_token')
  return dispatch => {
    const headers = {
      authorization: `Bearer ${token}`
    }
    return post(`{exercises { name, id, categories, description } }`, {headers, url}).then(function (data) {
      return dispatch({
        type: FETCH_EXERCISES,
        payload: data.exercises
      })
    }).catch(err => handleErrors(err, dispatch))
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
    const transport = new HttpTransport(url, {headers})
    return transport.send(`mutation {
      create_exercise(name: "${name}", categories: [${formatted_categories}], description: "${description}") {
        name, id
      }
    }`).then(function (data) {
      return dispatch({
        type: SAVE_EXERCISE,
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
      delete_exercise(id: ${id})
    }`, {url, headers}).then(data => {
      return dispatch({
        type: DELETE_EXERCISE,
        payload: data
      })
    }).catch(err => handleErrors(err, dispatch))
  }
}

export const fetchCategories = () => {
  const token = localStorage.getItem('auth_token')
  return dispatch => {
    const headers = {
      authorization: `Bearer ${token}`
    }
    const transport = new HttpTransport(url, {headers})
    transport.send(`{categories}`).then(function (data) {
      return dispatch({
        type: FETCH_CATEGORIES,
        payload: data.categories
      })
    }).catch(err => handleErrors(err, dispatch))
  }
}
