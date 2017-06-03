import domHelper from '../helpers/dom_helper'
import {it, beforeEach, afterEach, describe} from 'mocha'

import React from 'react'
import chai from 'chai'
import sinon from 'sinon'
import chaiEnzyme from 'chai-enzyme'


import Workouts from '../../containers/workouts'

import {mountRender} from '../helpers/theme_helper'
import createStore from '../helpers/store_helper'


chai.use(chaiEnzyme())
const expect = chai.expect

describe('<Workouts />', () => {

  beforeEach(function () {
    domHelper()
    sinon.stub(localStorage, 'getItem').returns('123')
  })

  afterEach(() => {
    localStorage.getItem.restore()
  })

  describe('when a workout is created', () => {
    it('should render the created workout notification', () => {
      const store = createStore(
        {
          notifications: {
            showWorkoutCreated: true
          },
          authentication: {
            loginState: 'logged_in'
          },
          workouts: []
        })
      const wrapper = mountRender(<Workouts />, {store})

      const snackbar = wrapper.find('#snackbar-workout-created')
      expect(snackbar.prop('open')).to.eql(true)
      expect(snackbar.children().first().prop('message')).to.eql('Workout successfully created.')
    })
  })

  describe('when a workout is updated', () => {
    it('should render the updated workout notification', () => {
      const store = createStore(
        {
          notifications: {
            showWorkoutUpdated: true
          },
          authentication: {
            loginState: 'logged_in'
          },
          workouts: []
        })
      const wrapper = mountRender(<Workouts />, {store})

      const snackbar = wrapper.find('#snackbar-workout-updated')
      expect(snackbar.prop('open')).to.eql(true)
      expect(snackbar.children().first().prop('message')).to.eql('Workout successfully updated.')
    })
  })
})