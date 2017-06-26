import createReducer from '../../../reducers/api_reducer'

import {
  FETCH_WORKOUTS,
  FETCH_WORKOUT,
  SAVE_WORKOUT,
  UPDATE_WORKOUT,
  DELETE_WORKOUT
} from 'actions/workout'

const workoutConfig = {
  dataType: 'workout',
  plural: 'workouts',
  actions: {
    list: FETCH_WORKOUTS,
    get: FETCH_WORKOUT,
    create: SAVE_WORKOUT,
    update: UPDATE_WORKOUT,
    delete: DELETE_WORKOUT
  },
  initialState: {
    entities: {},
    order: [],
    count: 0
  }
}

export default createReducer(workoutConfig)
