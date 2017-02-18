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
export const UPDATE_WORKOUT = 'UPDATE_WORKOUT'

import {FETCH_EXERCISES} from './exercise'

export const updateWorkout = (id, {description, workoutDate, performedExercises}) => {
  const token = localStorage.getItem('auth_token')
  const formattedExercises = _.chain(performedExercises)
                               .map(({exerciseId, reps, sets, weight}) => `{exercise_id: ${exerciseId}, reps: ${reps}, weight: ${weight}, sets: ${sets}}`)
                               .join(',').value()
  const headers = {
    authorization: `Bearer ${token}`
  }
  return dispatch => {
    const transport = new HttpTransport(URL, {headers})
    return transport.send(`mutation {
      update_workout(id: ${id}, description: "${description}", workout_date: "${workoutDate}", performed_exercises: [${formattedExercises}]) {
        id
      }
    }`).then(function (data) {
      return dispatch({
        type: UPDATE_WORKOUT,
        payload: data
      })
    }).catch(err => handleUnauthorized(err, dispatch))
  }
}

export const fetchWorkouts = (limit = 10, offset = 0, {append} = {append: false}) => {
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
        workout_count,
      }
    }`).then(function (data) {
      const action = append ? FETCH_MORE_WORKOUTS : FETCH_WORKOUTS
      return dispatch({
        type: action,
        payload: data.me
      })
    }).catch(err => handleUnauthorized(err, dispatch))
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
            exercise_id, reps, weight, sets
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
      dispatch({
        type: FETCH_WORKOUT,
        payload: data.workout
      })

      const {exercises, exerciseCount} = data
      return dispatch({
        type: FETCH_EXERCISES,
        payload: {exercises, exerciseCount}
      })

    }).catch(err => handleUnauthorized(err, dispatch))
  }
}

export const saveWorkout = ({description, workoutDate, performedExercises}) => {
  const token = localStorage.getItem('auth_token')
  const formattedExercises = _.chain(performedExercises)
                               .map(({exerciseId, reps, sets, weight}) => `{exercise_id: ${exerciseId}, reps: ${reps}, weight: ${weight}, sets: ${sets}}`)
                               .join(',').value()
  const headers = {
    authorization: `Bearer ${token}`
  }
  return dispatch => {
    const transport = new HttpTransport(URL, {headers})
    return transport.send(`mutation {
      create_workout(description: "${description}", workout_date: "${workoutDate}", performed_exercises: [${formattedExercises}]) {
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
      setInterval(() => {
        dispatch({type: DELETE_WORKOUT_NOTIFICATION_END})
      }, 2000)

      return dispatch({
        type: DELETE_WORKOUT,
        payload: data
      })
    }).catch(err => handleUnauthorized(err, dispatch))
  }
}
