import createApiReducer from '../../reducers/api_reducer'
import { expect } from 'chai'
import sinon from 'sinon'

describe('Api Reducer #Get Specs', () => {
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
    it('should add the exercise to the entities', () => {
      const action = {
        type: 'FETCH_EXERCISE',
        payload: { exercise },
        status: 'success'
      }

      const state = {
        data: {
          entities: {},
          count: 0,
          order: []
        }
      }

      const { data: { entities } } = reducer(state, action)
      expect(entities).to.deep.eq({ 1: exercise })
    })

    it('should append the exercise to existing entities', () => {
      const action = {
        type: 'FETCH_EXERCISE',
        payload: { exercise },
        status: 'success'
      }

      const state = {
        data: {
          entities: {2: { ...exercise, id: 2 }},
          count: 0,
          order: []
        }
      }

      const { data: { entities } } = reducer(state, action)
      expect(entities).to.deep.eq({ 1: exercise, 2: { ...exercise, id: 2 } })
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
        type: 'FETCH_EXERCISE',
        status: 'success',
        payload: { exercise }
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
        type: 'FETCH_EXERCISE',
        status: 'success',
        payload: { exercise }
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
        type: 'FETCH_EXERCISE',
        status: 'success',
        payload: { exercise }
      }

      const { requests } = reducer(state, action)
      const request = requests[action.query]

      expect(request).to.exist
      expect(request.payload).to.deep.eq([1])
    })
  })
})