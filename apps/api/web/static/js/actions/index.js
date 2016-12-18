import HttpTransport from 'lokka-transport-http'
import axios from 'axios'
import _ from 'lodash'

const URL = 'http://localhost:4000/api/graphql'
const LOGIN_ENDPOINT = 'http://localhost:4000/api/login'

const transport = new HttpTransport(URL)


export const FETCH_EXERCISES = 'FETCH_EXERCISES'
export const SAVE_EXERCISE = 'SAVE_EXERCISE'
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
    transport.send(`{exercises { name, id, categories, description } }`).then(function (data) {
      return dispatch({
        type: FETCH_EXERCISES,
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
  const headers = {
    authorization: `Bearer ${token}`
  }
  return dispatch => {
    const transport = new HttpTransport(URL, {headers})
    return transport.send(`mutation {
      create_exercise(name: "${name}", categories: "${categories}", description: "${description}") {
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