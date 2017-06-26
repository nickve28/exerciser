import createApiReducer from '../../reducers/api_reducer'
import { expect } from 'chai'
import sinon from 'sinon'

describe('Api Reducer #Create Specs', () => {
  const config = {
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
      entities: {},
      order: [],
      count: 0
    }
  }

  const exercise = {
    name: 'exercise 1',
    id: 1,
    description: 'foo'
  }

  const reducer = createApiReducer(config)

  describe('#dataReducer', () => {
    it('should update the existing entity', () => {
      const action = {
        type: 'UPDATE_EXERCISE',
        payload: { updateExercise: exercise },
        status: 'success'
      }

      const state = {
        data: {
          entities: { 1: { ...exercise, name: 'my test' } },
          count: 0,
          order: []
        }
      }

      const { data: { entities } } = reducer(state, action)
      expect(entities).to.deep.eq({ 1: exercise })
    })
  })

  describe('#requestsReducer', () => {
    let clock

    before(() => {
      clock = sinon.useFakeTimers()
    })

    after(() => {
      clock.restore()
    })

    it('should append the timestamp to the result', () => {
      const state = {
        requests: {}
      }

      const action = {
        type: 'UPDATE_EXERCISE',
        status: 'success',
        payload: { updateExercise: exercise }
      }

      const { requests } = reducer(state, action)
      const request = requests[action.query]

      expect(request).to.exist
      expect(request.timestamp).to.deep.eq(new Date())
    })

    it('should store the status', () => {
      const state = {
        requests: {}
      }

      const action = {
        type: 'UPDATE_EXERCISE',
        status: 'success',
        payload: { updateExercise: exercise }
      }

      const { requests } = reducer(state, action)
      const request = requests[action.query]

      expect(request).to.exist
      expect(request.status).to.eq('success')
    })

    it('should store the response payload', () => {
      const state = {
        requests: {}
      }

      const action = {
        type: 'UPDATE_EXERCISE',
        status: 'success',
        payload: { updateExercise: exercise }
      }

      const { requests } = reducer(state, action)
      const request = requests[action.query]

      expect(request).to.exist
      expect(request.payload).to.deep.eq([1])
    })
  })
})