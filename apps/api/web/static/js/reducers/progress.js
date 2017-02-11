import {FETCH_PROGRESS} from '../actions/index'

export default (state = {}, action) => {
  if (action.type === FETCH_PROGRESS) {
    return action.payload
  }
  return state
}