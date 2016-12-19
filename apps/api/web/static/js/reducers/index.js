import { combineReducers } from 'redux';

import {FETCH_EXERCISES, FETCH_ME, USER_LOGIN, FETCH_CATEGORIES} from '../actions/index'

function CategoryReducer(state = [], action) {
  if (action.type === FETCH_CATEGORIES) {
    return action.payload.categories
  }
  return state
}

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

function AuthenticationReducer(state = {token: null}, action) {
  if (action.type === USER_LOGIN) {
    localStorage.setItem('auth_token', action.payload.token)
    return {token: action.payload.token}
  }
  return {token: localStorage.getItem('auth_token')}
}

const reducers = combineReducers({
  exercises: ExerciseReducer,
  me: MeReducer,
  authentication: AuthenticationReducer,
  categories: CategoryReducer
})

export default reducers
