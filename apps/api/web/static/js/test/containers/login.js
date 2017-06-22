import domHelper from '../helpers/dom_helper'
import { it, beforeEach, describe } from 'mocha'

import React from 'react'
import chai from 'chai'
import sinon from 'sinon'
import chaiEnzyme from 'chai-enzyme'


import Login from '../../containers/login'
import {Snackbar} from 'material-ui'

import {mountRender} from '../helpers/theme_helper'
import createStore from '../helpers/store_helper'


chai.use(chaiEnzyme())
const expect = chai.expect

describe('<Login />', () => {
  beforeEach(function () {
    domHelper()
  })

  describe('when the user is logged out and notification contains showLoginExpired state true', () => {
    it('should render the snackbar notification with the open set to true', () => {
      const store = createStore(
        {
          notifications: {
            showLoginExpired: true
          },
          authentication: {
            loginState: 'logged_out'
          }
        })
      const wrapper = mountRender(<Login />, {store})

      const snackbar = wrapper.find('Snackbar')
      expect(snackbar.prop('open')).to.eql(true)
    })

    xit('should not re-render the snackbar when state changes', () => {
      const store = createStore(
        {
          notifications: {
            showLoginExpired: true
          },
          authentication: {
            loginState: 'logged_out'
          }
        })

      const spy = sinon.spy(Snackbar.prototype, 'componentWillReceiveProps')
      const wrapper = mountRender(<Login />, {store})

      const nameField = wrapper.find('[name="username"]')
      nameField.simulate('change', {target: {value: 'foo'}})

      expect(spy.callCount).to.eql(0)
    })
  })

  describe('when the user is logged out and notification contains showLoginExpired state false', () => {
    it('should render the snackbar notification with the open set to false', () => {
      const store = createStore(
        {
          notifications: {
            showLoginExpired: false
          },
          authentication: {
            loginState: 'logged_out'
          }
        })
      const wrapper = mountRender(<Login />, {store})

      const snackbar = wrapper.find('Snackbar')
      expect(snackbar.prop('open')).to.eql(false)
    })
  })
})