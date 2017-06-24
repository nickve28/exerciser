import createReducer from '../../../reducers/api_reducer'

import { FETCH_CATEGORIES } from '../actions/category'

const categoryConfig = {
  dataType: 'category',
  plural: 'categories',
  actions: {
    list: FETCH_CATEGORIES
  },
  initialState: {
    entities: {}
  }
}

export default createReducer(categoryConfig)

