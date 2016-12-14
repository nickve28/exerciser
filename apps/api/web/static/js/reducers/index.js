import { combineReducers } from 'redux';

import {FETCH_EXERCISES} from '../actions/index'

function ExerciseReducer(state = [], action = {}) {
  if (action.type === FETCH_EXERCISES) {
    return action.payload.exercises
  }
  return state
}

const reducers = combineReducers({
  exercises: ExerciseReducer
})

export default reducers
