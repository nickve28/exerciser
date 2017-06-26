import createApiReducer from '../../reducers/api_reducer'
import { expect } from 'chai'
import sinon from 'sinon'

describe('Api Reducer #List Specs', () => {
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

  const exercise2 = {
    name: 'exercise 2',
    id: 2,
    description: 'bar'
  }

  const reducer = createApiReducer(config)

  describe('#dataReducer', () => {
    it('should ignore non success actions', () => {
      const action = {
        type: 'FETCH_EXERCISES',
        status: 'pending',
        payload: null
      }

      const state = {
        data: {
          entities: {},
          count: 0,
          order: []
        }
      }

      expect(reducer({data: state}, action).data).to.deep.eq(state)
    })

    describe('#list', () => {
      describe('when no data exists', () => {
        it('should add the results to the entities', () => {
          const action = {
            type: 'FETCH_EXERCISES',
            status: 'success',
            payload: {
              exercises: [exercise, exercise2],
              exerciseCount: 2
            }
          }

          const state = {
            data: {
              entities: {},
              count: 0,
              order: []
            }
          }

          const expected = {
            1: exercise,
            2: exercise2
          }

          const { data: { entities } } = reducer(state, action)
          expect(entities).to.deep.eq(expected)
        })

        it('should fill the order', () => {
          const action = {
            type: 'FETCH_EXERCISES',
            status: 'success',
            payload: {
              exercises: [exercise, exercise2],
              exerciseCount: 2
            }
          }

          const state = {
            data: {
              entities: {},
              count: 0,
              order: []
            }
          }
          const expected = [1, 2]

          const { data: { order } } = reducer(state, action)
          expect(order).to.deep.eq(expected)
        })

        it('should populate the count', () => {
          const action = {
            type: 'FETCH_EXERCISES',
            status: 'success',
            payload: {
              exercises: [exercise, exercise2],
              exerciseCount: 2
            }
          }

          const state = {
            data: {
              entities: {},
              count: 0,
              order: []
            }
          }

          const { data: { count } } = reducer(state, action)
          expect(count).to.deep.eq(2)
        })
      })

      describe('when data exists', () => {
        it('should append the results to the entities', () => {
          const action = {
            type: 'FETCH_EXERCISES',
            status: 'success',
            payload: {
              exercises: [exercise2],
              exerciseCount: 2
            }
          }

          const state = {
            data: {
              entities: { 1: exercise },
              count: 1,
              order: [1]
            }
          }

          const expected = {
            1: exercise,
            2: exercise2
          }

          const { data: { entities } } = reducer(state, action)

          expect(entities).to.deep.eq(expected)
        })

        it('should overwrite the count', () => {
          const action = {
            type: 'FETCH_EXERCISES',
            status: 'success',
            payload: {
              exercises: [exercise2],
              exerciseCount: 2
            }
          }

          const state = {
            data: {
              entities: { 1: exercise },
              count: 1,
              order: [1]
            }
          }

          const { data: { count } } = reducer(state, action)
          expect(count).to.deep.eq(2)
        })

        it('should append the order', () => {
          const action = {
            type: 'FETCH_EXERCISES',
            status: 'success',
            payload: {
              exercises: [exercise2],
              exerciseCount: 2
            }
          }

          const state = {
            data: {
              entities: { 1: exercise },
              count: 1,
              order: [1]
            }
          }

          const expected = [1, 2]

          const { data: { order } } = reducer(state, action)
          expect(order).to.deep.eq(expected)
        })
      })
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
        type: 'FETCH_EXERCISES',
        status: 'success',
        payload: {
          exercises: [exercise, exercise2],
          exerciseCount: 2
        }
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
        type: 'FETCH_EXERCISES',
        status: 'success',
        payload: {
          exercises: [exercise, exercise2],
          exerciseCount: 2
        }
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
        type: 'FETCH_EXERCISES',
        status: 'success',
        payload: {
          exercises: [exercise, exercise2],
          exerciseCount: 2
        }
      }

      const { requests } = reducer(state, action)
      const request = requests[action.query]

      expect(request).to.exist
      expect(request.payload).to.deep.eq([1, 2])
    })
  })
})