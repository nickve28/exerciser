import {FETCH_CATEGORIES} from '../actions/index'

export default (state = [], action) => {
  if (action.type === FETCH_CATEGORIES) {
    return action.payload
  }
  return state
}