import handleErrors from './error'

import configuration from '../configs/index'
import {post} from '../helpers/request'
export const url = `${configuration.apiHost}:${configuration.apiPort}/api/graphql`

import _ from 'lodash'
import HttpTransport from 'lokka-transport-http'

export const FETCH_EXERCISES = 'FETCH_EXERCISES'
export const FETCH_EXERCISE = 'FETCH_EXERCISE'
export const SAVE_EXERCISE = 'SAVE_EXERCISE'
export const DELETE_EXERCISE = 'DELETE_EXERCISE'
export const FETCH_CATEGORIES = 'FETCH_CATEGORIES'
export const EXERCISE_NOT_DELETED = 'EXERCISE_NOT_DELETED'
export const UPDATE_EXERCISE = 'UPDATE_EXERCISE'

export const fetchExercises = () => {
  const token = localStorage.getItem('auth_token')
  return dispatch => {
    const headers = {
      authorization: `Bearer ${token}`
    }
    return post('{exercises { name, id, categories, description, type, metric }, exerciseCount }', {headers, url}).then(function (data) {
      return dispatch({
        type: FETCH_EXERCISES,
        payload: data
      })
    }).catch(err => handleErrors(err, dispatch))
  }
}

export const fetchExercise = (id) => {
  const token = localStorage.getItem('auth_token')
  return dispatch => {
    const headers = {
      authorization: `Bearer ${token}`
    }
    return post(`{exercise(id: ${id}) { name, id, categories, description, type, metric } }`, {headers, url}).then(function (data) {
      return dispatch({
        type: FETCH_EXERCISE,
        payload: data.exercise
      })
    }).catch(err => handleErrors(err, dispatch))
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
      create_exercise(name: "${name}", categories: [${formatted_categories}], description: "${description}", type: "${type}", metric: "${metric}") {
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
      update_exercise(id: ${id}, categories: [${formatted_categories}], description: "${description}") {
        name, id, description, categories, type, metric
      }
    }`, {url, headers}).then(function (data) {
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
    transport.send('{categories}').then(function (data) {
      return dispatch({
        type: FETCH_CATEGORIES,
        payload: data.categories
      })
    }).catch(err => handleErrors(err, dispatch))
  }
}
