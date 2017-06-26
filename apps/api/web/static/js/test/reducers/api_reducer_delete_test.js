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
    it('should remove the exercise from the entities', () => {
      const action = {
        type: 'DELETE_EXERCISE',
        payload: { deleteExercise: 1 },
        status: 'success'
      }

      const state = {
        data: {
          entities: { 1: exercise },
          count: 1,
          order: [1]
        }
      }

      const { data: { entities } } = reducer(state, action)
      expect(entities).to.deep.eq({})
    })

    it('should decrease the count', () => {
      const action = {
        type: 'DELETE_EXERCISE',
        payload: { deleteExercise: 1 },
        status: 'success'
      }

      const state = {
        data: {
          entities: { 1: exercise },
          count: 1,
          order: [1]
        }
      }

      const { data: { count } } = reducer(state, action)
      expect(count).to.deep.eq(0)
    })

    it('should remove the id from the order', () => {
      const action = {
        type: 'DELETE_EXERCISE',
        payload: { deleteExercise: 1 },
        status: 'success'
      }

      const state = {
        data: {
          entities: { 1: exercise },
          count: 1,
          order: [1]
        }
      }

      const { data: { order } } = reducer(state, action)
      expect(order).to.deep.eq([])
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
        type: 'DELETE_EXERCISE',
        status: 'success',
        payload: { deleteExercise: 1 }
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
        type: 'DELETE_EXERCISE',
        status: 'success',
        payload: { deleteExercise: 1 }
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
        type: 'DELETE_EXERCISE',
        status: 'success',
        payload: { deleteExercise: 1 }
      }

      const { requests } = reducer(state, action)
      const request = requests[action.query]

      expect(request).to.exist
      expect(request.payload).to.deep.eq([1])
    })
  })
})