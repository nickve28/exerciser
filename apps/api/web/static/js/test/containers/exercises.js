import domHelper from '../helpers/dom_helper'
import actions from '../helpers/actions'

import React from 'react'
import chai from 'chai'
import sinon from 'sinon'
import chaiEnzyme from 'chai-enzyme'

import _ from 'lodash'

import Exercises from '../../containers/exercises'

import {mountRender} from '../helpers/theme_helper'
import createStore from '../helpers/store_helper'

chai.use(chaiEnzyme())
const expect = chai.expect

describe('<Exercises />', () => {
  beforeEach(function () {
    domHelper()
  })

  describe('when the noExerciseDeleted dialog should be shown', () => {
    it('should render the snackbar notification with the text why it cannot be deleted', () => {
      const store = createStore(
        {
          notifications: {
            showNoExerciseDeleted: true
          }
        })
      const wrapper = mountRender(<Exercises />, {store})

      const snackbar = wrapper.find('Snackbar')
      expect(snackbar.prop('open')).to.eql(true)
      expect(snackbar.prop('message')).to.eql('The exercise is used in workouts and can not be deleted')
    })
  })

  describe('when no noExerciseDeleted dialog should be shown', () => {
    it('should render the snackbar notification with the text why it cannot be deleted', () => {
      const store = createStore(
        {
          notifications: {
            showNoExerciseDeleted: false
          }
        })
      const wrapper = mountRender(<Exercises />, {store})

      const snackbar = wrapper.find('Snackbar')
      expect(snackbar.prop('open')).to.eql(false)
    })
  })
})