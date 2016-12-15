import HttpTransport from 'lokka-transport-http'
import axios from 'axios'

const URL = 'http://localhost:4000/api/graphql'
const LOGIN_ENDPOINT = 'http://localhost:4000/api/login'

const transport = new HttpTransport(URL)


export const FETCH_EXERCISES = 'FETCH_EXERCISES'
export const FETCH_ME = 'FETCH_ME'
export const USER_LOGIN = 'USER_LOGIN'

export const fetchExercises = () => {
  const token = localStorage.getItem('auth_token')
  return dispatch => {
    const headers = {
      authorization: `Bearer ${token}`
    }
    const transport = new HttpTransport(URL, {headers})
    transport.send(`{exercises { name, id, category, description } }`).then(function (data) {
      return dispatch({
        type: FETCH_EXERCISES,
        payload: data
      })
    });
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
    });
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