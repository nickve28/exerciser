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
  const formatted_categories = _.chain(categories)
                                .map(category => `"${category}"`)
                                .join(',').value()
  const payload = `mutation {
    createExercise(name: "${name}", categories: [${formatted_categories}], description: "${description}", type: "${type}", metric: "${metric}") {
      name, id, categories, metric, type, description
    }
  }`

  return {
    payload,
    type: CREATE_EXERCISE,
    status: 'pending'
  }
}

export const updateExercise = ({id, description, categories}) => {
  const formatted_categories = _.chain(categories)
                                .map(category => `"${category}"`)
                                .join(',').value()
  const payload = `mutation {
    updateExercise(id: ${id}, categories: [${formatted_categories}], description: "${description}") {
      name, id, description, categories, type, metric
    }
  }`

  return {
    payload,
    type: UPDATE_EXERCISE,
    status: 'pending'
  }
}

export const deleteExercise = (id) => {
  const payload = `mutation {
    deleteExercise(id: ${id})
  }`
  return {
    payload,
    type: DELETE_EXERCISE,
    status: 'pending'
  }
}
