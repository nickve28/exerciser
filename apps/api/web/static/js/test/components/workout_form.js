import React from 'react';
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'

import LoginForm from '../../components/workout_form';
import {shallowRender} from '../helpers/theme_helper'

chai.use(chaiEnzyme())
const expect = chai.expect

describe('<WorkoutForm />', () => {
  describe('when action=create', function () {
    it('should set the text to create', function () {
      const wrapper = shallowRender(<LoginForm action="create" />)
      const field = wrapper.find('h3')
      expect(field.text()).to.contain('create')
    })

    it('should set the button text to create', function () {
      const wrapper = shallowRender(<LoginForm action="create" />)
      const field = wrapper.find('[type="submit"]')
      expect(field.prop('label')).to.eql('create')
    })
  })

  describe('when action=edit', function () {
    it('should set the text to edit', function () {
      const wrapper = shallowRender(<LoginForm action="edit" />)
      const field = wrapper.find('h3')
      expect(field.text()).to.contain('edit')
    })

    it('should set the button text to edit', function () {
      const wrapper = shallowRender(<LoginForm action="edit" />)
      const field = wrapper.find('[type="submit"]')
      expect(field.prop('label')).to.eql('edit')
    })
  });
})