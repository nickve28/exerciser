import { values, includes, map, chain, upperFirst } from 'lodash'
import { combineReducers } from 'redux'

export default config => {
  const toKeyStore = entities =>
    chain(entities)
    .map(entity => [entity.id, entity])
    .fromPairs().value()

  const allActions = values(config.actions)
  const createFieldName = `create${upperFirst(config.dataType)}`
  const updateFieldName = `update${upperFirst(config.dataType)}`

  ///// DATA REDUCER

  const dataReducer = (state = config.initialState, action) => {
    //List
    if (action.type === config.actions.list) {
      return {
        ...state,
        order: map(action.payload[config.plural], 'id'),
        count: action.payload[`${config.dataType}Count`] || action.payload[`${config.dataType}_count`],
        entities: toKeyStore(action.payload[config.plural])
      }
    }

    if (action.type === config.actions.get) {
      return {
        ...state,
        entities: { ...state.entities, [action.payload.id]: action.payload }
      }
    }

    //Create
    if (action.type === config.actions.create) {
      return {
        ...state,
        order: [ action.payload[createFieldName].id, ...state.order ],
        count: state.count + 1,
        entities: { ...state.entities, [action.payload[createFieldName].id]: action.payload[createFieldName] }
      }
    }

    //Update
    if (action.type === config.actions.update) {

      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload[updateFieldName].id]: action.payload[updateFieldName]
        }
      }
    }

    //Delete
    if (action.type === config.actions.delete) {
      return {
        ...state,
        order: state.order.splice(state.order.indexOf(action.payload.id), 1),
        count: state.count - 1,
        entities: { ...state.entities, [action.payload.id]: action.payload }
      }
    }
    return state
  }

  //// REQUEST REDUCER
  const requestReducer = (state = {}, action) => {
    if (action.type === config.actions.list) {
      const result = {
        status: action.status,
        payload: map(action.payload[config.plural], 'id'),
        type: action.type,
        timestamp: new Date()
      }

      return {
        ...state,
        [action.type]: result
      }
    }

    if (includes(allActions, action.type)) {
      const result = {
        status: action.status,
        payload: map(action.payload, 'id'),
        type: action.type,
        timestamp: new Date()
      }

      return {
        ...state,
        [action.type]: result
      }
    }
    return state
  }

  return combineReducers({data: dataReducer, requests: requestReducer })
}