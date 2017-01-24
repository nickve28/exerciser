import domHelper from '../helpers/dom_helper'

import React from 'react';
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'

import _ from 'lodash'

import Login from '../../containers/login';

import {shallowRender, mountRender} from '../helpers/theme_helper'
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