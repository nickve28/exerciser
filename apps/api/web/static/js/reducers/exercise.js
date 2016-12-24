import {FETCH_EXERCISES} from '../actions/index'

export default (state = [], action = {}) => {
  if (action.type === FETCH_EXERCISES) {
    return action.payload.exercises
  }
  return state
}