import handleUnauthorized from './error'

import configuration from '../configs/index'
export const URL = `${configuration.apiHost}:${configuration.apiPort}/api/graphql`

import _ from 'lodash'
import HttpTransport from 'lokka-transport-http'

export const FETCH_WORKOUTS = 'FETCH_WORKOUTS'
export const FETCH_MORE_WORKOUTS = 'FETCH_MORE_WORKOUTS'
export const FETCH_WORKOUT = 'FETCH_WORKOUT'
export const SAVE_WORKOUT = 'SAVE_WORKOUT'
export const FETCH_WORKOUT_TEMPLATE = 'FETCH_WORKOUT_TEMPLATE'
export const DELETE_WORKOUT = 'DELETE_WORKOUT'
export const DELETE_WORKOUT_NOTIFICATION_END = 'DELETE_WORKOUT_NOTIFICATION_END'
export const UPDATE_WORKOUT_NOTIFICATION_END = 'UPDATE_WORKOUT_NOTIFICATION_END'
export const SAVE_WORKOUT_NOTIFICATION_END = 'SAVE_WORKOUT_NOTIFICATION_END'
export const UPDATE_WORKOUT = 'UPDATE_WORKOUT'

const NOTIFICATION_TIMER = 3000

const toFields = pExercise => {
  const fieldString = _.chain(pExercise)
    .keys()
    .reduce((memo, prop) => {
      if (_.isNull(pExercise[prop])) {
        return memo
      }
      let value = pExercise[prop]
      if (_.isString(value)) {
        value = `"${value}"`
      }

      return _.concat(memo, `${prop}: ${value}`)
    }, []).join(', ').value()
  return `{${fieldString}}`
}

export const updateWorkout = (id, {description, workoutDate, performedExercises}) => {
  const token = localStorage.getItem('auth_token')
  const formattedExercises = _.chain(performedExercises)
                               .map(toFields)
                               .join(',').value()
  const headers = {
    authorization: `Bearer ${token}`
  }
  return dispatch => {
    const transport = new HttpTransport(URL, {headers})
    const query = `mutation {
      updateWorkout(id: ${id}, description: "${description}", workoutDate: "${workoutDate}", performedExercises: [${formattedExercises}]) {
        id, description, workoutDate, performedExercises {
          exerciseId, weight, sets, reps, amount, duration
        }
      }
    }`
    return transport.send(query).then(function (data) {
      setTimeout(() => {
        dispatch({type: UPDATE_WORKOUT_NOTIFICATION_END})
      }, NOTIFICATION_TIMER)

      return dispatch({
        query,
        status: 'success',
        type: UPDATE_WORKOUT,
        payload: data
      })
    }).catch(err => handleUnauthorized(err, dispatch))
  }
}

export const fetchWorkouts = (limit = 10, offset = 0) => {
  const query = `{
    me {
      workouts(limit: ${limit}, offset: ${offset}) {
        workoutDate, performedExercises {
          exerciseId, reps, weight, sets,
          mode, duration, amount
        }, description, id },
      workoutCount,
    }
  }`
  return {
    query,
    type: FETCH_WORKOUTS,
    status: 'pending'
  }
}

export const fetchWorkoutTemplate = () => {
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
            exercise_id, reps, weight, sets,
            mode, duration, amount
          }, description, id },
      }
    }`).then(function (data) {
      return dispatch({
        type: FETCH_WORKOUT_TEMPLATE,
        payload: data.me.workouts
      })
    }).catch(err => handleUnauthorized(err, dispatch))
  }
}

export const fetchWorkout = (id) => {
  const query = `{
    workout(id: ${id}) {
      workoutDate, performedExercises {
        exerciseId, reps, weight, sets,
        mode, duration, amount
      }, description, id }
  }`

  return {
    query,
    type: FETCH_WORKOUT,
    status: 'pending'
  }
}

export const saveWorkout = (payload) => {
  const {description, workoutDate, performedExercises} = payload
  const token = localStorage.getItem('auth_token')
  const formattedExercises = _.chain(performedExercises)
                               .map(toFields)
                               .join(',').value()
  const headers = {
    authorization: `Bearer ${token}`
  }
  return dispatch => {
    const transport = new HttpTransport(URL, {headers})
    const query = `mutation {
      createWorkout(description: "${description}", workoutDate: "${workoutDate}", performedExercises: [${formattedExercises}]) {
        id, description, workoutDate, performedExercises {
          exerciseId, weight, sets, reps, amount, duration
        }
      }
    }`
    return transport.send(query).then(function (data) {
      setTimeout(() => {
        dispatch({type: SAVE_WORKOUT_NOTIFICATION_END})
      }, NOTIFICATION_TIMER)

      return dispatch({
        query,
        status: 'success',
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
    const query = `mutation {
      deleteWorkout(id: ${id})
    }`
    return transport.send(query).then(function (data) {
      setTimeout(() => {
        dispatch({type: DELETE_WORKOUT_NOTIFICATION_END})
      }, NOTIFICATION_TIMER)

      return dispatch({
        query,
        status: 'success',
        type: DELETE_WORKOUT,
        payload: data
      })
    }).catch(err => handleUnauthorized(err, dispatch))
  }
}
