import { FETCH_CATEGORIES } from '../actions/categories'

export default (state = [], action) => {
  if (action.type === FETCH_CATEGORIES && action.status === 'success') {
    return action.payload.categories
  }
  return state
}