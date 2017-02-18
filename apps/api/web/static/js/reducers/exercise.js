import {FETCH_EXERCISES} from '../actions/index'

const INITIAL_STATE = {
  exercises: [],
  count: 0
}

export default (state = INITIAL_STATE, action = {}) => {
  if (action.type === FETCH_EXERCISES) {
    return {
      exercises: action.payload.exercises,
      count: action.payload.exerciseCount
    }
  }
  return state
}