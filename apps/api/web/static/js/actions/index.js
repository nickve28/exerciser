import HttpTransport from 'lokka-transport-http'
import axios from 'axios'
import _ from 'lodash'

const URL = 'http://localhost:4000/api/graphql'
const LOGIN_ENDPOINT = 'http://localhost:4000/api/login'

const transport = new HttpTransport(URL)


export const FETCH_EXERCISES = 'FETCH_EXERCISES'
export const FETCH_CATEGORIES = 'FETCH_CATEGORIES'
export const FETCH_WORKOUTS = 'FETCH_WORKOUTS'
export const FETCH_WORKOUT = 'FETCH_WORKOUT'
export const SAVE_WORKOUT = 'SAVE_WORKOUT'
export const SAVE_EXERCISE = 'SAVE_EXERCISE'
export const DELETE_EXERCISE = 'DELETE_EXERCISE'
export const FETCH_ME = 'FETCH_ME'
export const USER_LOGIN = 'USER_LOGIN'

const handleUnauthorized = (error, foo) => {
  //no idea how lokka does error handling...
  const isUnauthorized = _.includes(error.toString(), '401')
  if (isUnauthorized) {
    localStorage.removeItem('auth_token')
  }
  throw error
}

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
        payload: data
      })
    }).catch(handleUnauthorized)
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
    }).catch(handleUnauthorized)
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
        payload: data
      })
    }).catch(handleUnauthorized)
  }
}

export const fetchMe = () => {
  const token = localStorage.getItem('auth_token')
  return dispatch => {
    const headers = {
      authorization: `Bearer ${token}`
    }
    const transport = new HttpTransport(URL, {headers})
    transport.send(`{me { name, id } }`).then(function (data) {

      return dispatch({
        type: FETCH_ME,
        payload: data
      })
    }).catch(handleUnauthorized)
  }
}

export const loginUser = (user, password) => {
  return dispatch => {
    const payload = {name: user, password: password}
    axios.post(LOGIN_ENDPOINT, payload).then(function (loginData) {
      return dispatch({
        type: USER_LOGIN,
        payload: loginData.data
      })
    })
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
    }).catch(handleUnauthorized)
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
    }).catch(handleUnauthorized)
  }
}

export const fetchWorkoutsAndExercises = (limit = 10, offset = 0) => {
  const token = localStorage.getItem('auth_token')
  return dispatch => {
    const headers = {
      authorization: `Bearer ${token}`
    }
    const transport = new HttpTransport(URL, {headers})
    transport.send(`{
      workouts(limit: ${limit}, offset: ${offset}) {
        workout_date, performed_exercises {
          exercise_id, reps, weight, sets
        }, description, id },
      exercises {
        id, name, description, categories
      }
    }`).then(function (data) {
      return dispatch({
        type: FETCH_WORKOUTS,
        payload: data
      })
    }).catch(handleUnauthorized)
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
    }).catch(handleUnauthorized)
  }
}