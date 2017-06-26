import { values, includes, map, chain, upperFirst, omit, get, reject } from 'lodash'
import { combineReducers } from 'redux'

export default config => {
  const toKeyStore = entities =>
    chain(entities)
    .map(entity => [entity.id, entity])
    .fromPairs().value()

  const allActions = values(config.actions)
  const createFieldName = `create${upperFirst(config.dataType)}`
  const updateFieldName = `update${upperFirst(config.dataType)}`
  const deleteField = `delete${upperFirst(config.dataType)}`

  const removeElement = (arr, e) => {
    return reject(arr, element => element == e) //intentional 2 == for now, API quirk
  }

  ///// DATA REDUCER

  const dataReducer = (state = config.initialState, action) => {
    if (action.status !== 'success') {
      return state
    }

    //List
    if (action.type === config.actions.list) {
      return {
        ...state,
        order: [...state.order, ...map(action.payload[config.plural], 'id')],
        count: action.payload[`${config.dataType}Count`] || action.payload[`${config.dataType}_count`],
        entities: { ...state.entities, ...toKeyStore(action.payload[config.plural]) }
      }
    }

    // Get
    if (action.type === config.actions.get) {
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload[config.dataType].id]: action.payload[config.dataType]
        }
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
        order: removeElement(state.order, action.payload[deleteField]),
        count: state.count - 1,
        entities: omit(state.entities, action.payload[deleteField])
      }
    }
    return state
  }

  //// REQUEST REDUCER
  const requestReducer = (state = {}, action) => {
    if (action.type === config.actions.list) {

      const payload = action.status === 'failed' ?
        action.error :
        map(get(action, `payload.${config.plural}`), 'id')

      const result = {
        payload,
        status: action.status,
        type: action.type,
        timestamp: new Date()
      }

      return {
        ...state,
        [action.query]: result
      }
    }

    if (action.type === config.actions.delete) {
      const result = {
        payload: [action.payload[deleteField]],
        status: action.status,
        type: action.type,
        timestamp: new Date()
      }

      return {
        ...state,
        [action.query]: result
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
        [action.query]: result
      }
    }
    return state
  }

  return combineReducers({ data: dataReducer, requests: requestReducer })
}