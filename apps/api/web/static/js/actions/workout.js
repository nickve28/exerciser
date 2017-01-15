import handleUnauthorized from './error'

import configuration from '../configs/index'
export const URL = `${configuration.apiHost}:${configuration.apiPort}/api/graphql`

import _ from 'lodash'
import HttpTransport from 'lokka-transport-http'
const transport = new HttpTransport(URL)

export const FETCH_WORKOUTS = 'FETCH_WORKOUTS'
export const FETCH_MORE_WORKOUTS = 'FETCH_MORE_WORKOUTS'
export const FETCH_WORKOUT = 'FETCH_WORKOUT'
export const SAVE_WORKOUT = 'SAVE_WORKOUT'
export const FETCH_WORKOUT_TEMPLATE = 'FETCH_WORKOUT_TEMPLATE'
export const DELETE_WORKOUT = 'DELETE_WORKOUT'

export const fetchWorkoutsAndExercises = (limit = 10, offset = 0, {append} = {append: false}) => {
  const token = localStorage.getItem('auth_token')
  return dispatch => {
    const headers = {
      authorization: `Bearer ${token}`
    }
    const transport = new HttpTransport(URL, {headers})
    transport.send(`{
      me {
        workouts(limit: ${limit}, offset: ${offset}) {
          workout_date, performed_exercises {
            exercise_id, reps, weight, sets
          }, description, id },
      },
      exercises {
        id, name, description, categories
      }
    }`).then(function (data) {
      const action = append ? FETCH_MORE_WORKOUTS : FETCH_WORKOUTS
      return dispatch({
        type: action,
        payload: data
      })
    }).catch(err => handleUnauthorized(err, dispatch))
  }
}

export const fetchWorkoutTemplateAndExercises = () => {
  const token = localStorage.getItem('auth_token')
  return dispatch => {
    const headers = {
      authorization: `Bearer ${token}`
    }
    const transport = new HttpTransport(URL, {headers})
    transport.send(`{
      me {
        workouts(limit: 1) {
          workout_date, performed_exercises {
            exercise_id, reps, weight, sets
          }, description, id },
      },
      exercises {
        id, name, description, categories
      }
    }`).then(function (data) {
      return dispatch({
        type: FETCH_WORKOUT_TEMPLATE,
        payload: data
      })
    }).catch(err => handleUnauthorized(err, dispatch))
  }
}

export const fetchWorkoutAndExercises = (id) => {
  const token = localStorage.getItem('auth_token')
  return dispatch => {
    const headers = {
      authorization: `Bearer ${token}`
    }
    const transport = new HttpTransport(URL, {headers})
    transport.send(`{
      workout(id: ${id}) {
        workout_date, performed_exercises {
          exercise_id, reps, weight, sets
        }, description, id },
      exercises {
        id, name, description, categories
      }
    }`).then(function (data) {
      return dispatch({
        type: FETCH_WORKOUT,
        payload: data
      })
    }).catch(err => handleUnauthorized(err, dispatch))
  }
}

export const saveWorkout = ({description, workout_date, performed_exercises}) => {
  const token = localStorage.getItem('auth_token')
  const formatted_exercises = _.chain(performed_exercises)
                               .map(({exercise_id, reps, sets, weight}) => `{exercise_id: ${exercise_id}, reps: ${reps}, weight: ${weight}, sets: ${sets}}`)
                               .join(',').value()
  const headers = {
    authorization: `Bearer ${token}`
  }
  return dispatch => {
    const transport = new HttpTransport(URL, {headers})
    return transport.send(`mutation {
      create_workout(description: "${description}", workout_date: "${workout_date}", performed_exercises: [${formatted_exercises}]) {
        id
      }
    }`).then(function (data) {
      return dispatch({
        type: SAVE_WORKOUT,
        payload: data
      })
    }).catch(err => handleUnauthorized(err, dispatch))
  }
}

export const deleteWorkout = (id) => {
  const token = localStorage.getItem('auth_token')
  return dispatch => {
    const headers = {
      authorization: `Bearer ${token}`
    }
    const transport = new HttpTransport(URL, {headers})
    return transport.send(`mutation {
      delete_workout(id: ${id})
    }`).then(function (data) {
      return dispatch({
        type: DELETE_WORKOUT,
        payload: data
      })
    }).catch(err => handleUnauthorized(err, dispatch))
  }
}
