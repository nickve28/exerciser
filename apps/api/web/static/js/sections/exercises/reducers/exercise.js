import createReducer from '../../../reducers/api_reducer'

import {
  FETCH_EXERCISE,
  FETCH_EXERCISES,
  CREATE_EXERCISE,
  UPDATE_EXERCISE,
  DELETE_EXERCISE
} from '../actions/exercise'

const exerciseConfig = {
  dataType: 'exercise',
  plural: 'exercises',
  actions: {
    list: FETCH_EXERCISES,
    get: FETCH_EXERCISE,
    create: CREATE_EXERCISE,
    update: UPDATE_EXERCISE,
    delete: DELETE_EXERCISE
  },
  initialState: {
    entities: {},
    order: [],
    count: 0
  }
}

export default createReducer(exerciseConfig)

