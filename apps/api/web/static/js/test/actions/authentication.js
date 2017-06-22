import { describe, it, afterEach, beforeEach } from 'mocha'
import { expect } from 'chai'

import { loginUser } from '../../actions/authentication'

import moxios from 'moxios'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import authenticationMiddleware from '../../middlewares/authenticate'
import { AuthenticationReducer } from '../../reducers/user'

const rootReducer = combineReducers({
  authentication: AuthenticationReducer
})


describe('Authentication Action specs', () => {
  let store

  beforeEach(() => {
    moxios.install()
  })

  afterEach(() => {
    moxios.uninstall()
  })

  describe('when authentication fails', () => {
    beforeEach(() => {
      const errors = [
        {code: 401, details: [], message: 'in field login'}
      ]

      moxios.stubRequest('http://localhost:4000/api/graphql', {
        status: 200,
        responseText: JSON.stringify({
          data: {
            login: null
          },
          errors
        })
      })
    })

    it('should not update the token', done => {
      const testMiddleware = storez => next => action => {
        next(action)

        if (action.type === 'USER_LOGIN' && action.status === 'failed') {
          const { authentication } = storez.getState()
          expect(authentication.token).to.eq(null)
          done()
        }
      }
      store = createStore(rootReducer, applyMiddleware(authenticationMiddleware, testMiddleware))


      store.dispatch(loginUser('Nick', 'tester'))
    })
  })

  describe('when authentication succeeds', () => {
    beforeEach(() => {
      moxios.stubRequest('http://localhost:4000/api/graphql', {
        status: 200,
        responseText: JSON.stringify({
          data: {
            login: {
              token: '123',
              id: '4'
            }
          }
        })
      })
    })

    it('should put the token in the store', done => {
      const testMiddleware = storez => next => action => {
        next(action)

        if (action.type === 'USER_LOGIN' && action.status === 'success') {
          const { authentication } = storez.getState()
          expect(authentication.token).to.eq('123')
          done()
        }
      }
      store = createStore(rootReducer, applyMiddleware(authenticationMiddleware, testMiddleware))


      store.dispatch(loginUser('Nick', 'tester'))
    })
  })
})
