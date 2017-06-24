import createReducer from '../../../reducers/api_reducer'

const exerciseConfig = {
  dataType: 'exercise',
  plural: 'exercises',
  actions: {
    list: 'FETCH_EXERCISES',
    get: 'FETCH_EXERCISE',
    create: 'CREATE_EXERCISE',
    update: 'UPDATE_EXERCISE',
    delete: 'DELETE_EXERCISE'
  },
  initialState: {
    entities: {}
  }
}

export default createReducer(exerciseConfig)

