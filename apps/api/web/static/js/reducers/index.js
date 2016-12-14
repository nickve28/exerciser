import { combineReducers } from 'redux';

import {FETCH_EXERCISES, FETCH_ME} from '../actions/index'

function ExerciseReducer(state = [], action = {}) {
  if (action.type === FETCH_EXERCISES) {
    return action.payload.exercises
  }
  return state
}

function MeReducer(state = {}, action) {
  if (action.type === FETCH_ME) {
    return action.payload.me
  }
  return state
}

const reducers = combineReducers({
  exercises: ExerciseReducer,
  me: MeReducer
})

export default reducers
