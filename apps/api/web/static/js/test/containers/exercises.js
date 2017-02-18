import domHelper from '../helpers/dom_helper'
import '../helpers/actions'
import {it, beforeEach, describe} from 'mocha'

import React from 'react'
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'

import Exercises from '../../containers/exercises'

import {mountRender} from '../helpers/theme_helper'
import createStore from '../helpers/store_helper'

chai.use(chaiEnzyme())
const expect = chai.expect

describe('<Exercises />', () => {
  beforeEach(function () {
    domHelper()
  })

  it('should show the exercise count on the title', () => {
    const store = createStore(
      {
        exercises:  {
          exercises: [],
          count: 0
        },
        notifications: {
          showNoExerciseDeleted: false
        }
      })
    const wrapper = mountRender(<Exercises />, {store})

    const title = wrapper.find('h3')
    expect(title.text()).to.eql('Exercises (0)')
  })

  describe('when the noExerciseDeleted dialog should be shown', () => {
    it('should render the snackbar notification with the text why it cannot be deleted', () => {
      const store = createStore(
        {
          notifications: {
            showNoExerciseDeleted: true
          },
          exercises: {
            exercises: [],
            count: 0
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
          },
          exercises: {
            exercises: [],
            count: 0
          }
        })
      const wrapper = mountRender(<Exercises />, {store})

      const snackbar = wrapper.find('Snackbar')
      expect(snackbar.prop('open')).to.eql(false)
    })
  })
})