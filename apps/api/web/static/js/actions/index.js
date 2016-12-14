import HttpTransport from 'lokka-transport-http'

const URL = 'http://localhost:4000/api/graphql'
const transport = new HttpTransport(URL)

export const FETCH_EXERCISES = 'FETCH_EXERCISES'

export const fetchExercises = (token) => {
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