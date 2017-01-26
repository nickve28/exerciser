import domHelper from '../helpers/dom_helper'

import React from 'react';
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'
import sinon from 'sinon'

import _ from 'lodash'

import LoginForm from '../../components/workout_form';
import {shallowRender} from '../helpers/theme_helper'

chai.use(chaiEnzyme())
const expect = chai.expect

describe('<WorkoutForm />', () => {
  describe('when action=Create', () => {
    it('should set the text to Create', () => {
      const wrapper = shallowRender(<LoginForm action="Create" />)
      const field = wrapper.find('h3')
      expect(field.text()).to.contain('Create')
    })

    it('should set the button text to Create', () => {
      const wrapper = shallowRender(<LoginForm action="Create" />)
      const field = wrapper.find('[type="submit"]')
      expect(field.prop('label')).to.eql('Create')
    })

    it('should show the load template link', () => {
      const wrapper = shallowRender(<LoginForm action="Create" />)
      const field = wrapper.find('small')
      expect(
        field.find('a').exists()
      ).to.eql(true)
    })

    it('should load the template when clicked', () => {
      const wrapper = shallowRender(<LoginForm action="Create" />)
      const field = wrapper.find('small').find('a')
      field.simulate('click')
    })
  })

  describe('when action=Edit', () => {
    it('should set the text to Edit', () => {
      const wrapper = shallowRender(<LoginForm action="Edit" />)
      const field = wrapper.find('h3')
      expect(field.text()).to.contain('Edit')
    })

    it('should set the button text to Edit', () => {
      const wrapper = shallowRender(<LoginForm action="Edit" />)
      const field = wrapper.find('[type="submit"]')
      expect(field.prop('label')).to.eql('Edit')
    })


    it('should not show the load template link', () => {
      const wrapper = shallowRender(<LoginForm action="Edit" />)
      const field = wrapper.find('small')
      expect(
        field.find('a').exists()
      ).to.eql(false)
    })
  })

  describe('when Create is called, and the user clicks Create', () => {
    let spy

    it('should call the submit callback', done => {
      const wrapper = shallowRender(<LoginForm action="Create" handleFormSubmit={done} />)
      const form = wrapper.find('form')

      form.simulate('submit')
    })
  })
})