import {describe, it, before, after} from 'mocha'
import sinon from 'sinon'
import { should } from 'chai'

import { localStorage } from '../helpers/dom_helper'

import target from '../../actions/error'

should()

describe('Action error handler spec', () => {
  describe('When an unauthorized error is thrown', () => {
    let stub

    before(() => {
      stub = sinon.stub(localStorage, 'removeItem')
    })

    after(() => {
      stub.restore()
    })

    it('should clear the auth_token in localStorage', () => {
      const error = {
        code: 401,
        message: 'foo',
        details: []
      }

      const spy = sinon.stub()

      target(error, spy)
      localStorage.removeItem.should.have.been.calledWith('auth_token')
    })

    it('should dispatch a USER_LOGIN_EXPIRED event', () => {
      const error = {
        code: 401,
        message: 'foo',
        details: []
      }

      const spy = sinon.stub()

      target(error, spy)
      spy.should.have.been.calledWith({type: 'USER_LOGIN_EXPIRED'})
    })
  })
})