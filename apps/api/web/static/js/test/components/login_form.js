import React from 'react';
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'

import LoginForm from '../../components/login_form';
import {shallowRender} from '../helpers/theme_helper'

chai.use(chaiEnzyme())
const expect = chai.expect

describe('<LoginForm />', () => {
  it('renders and sets an empty username/password', () => {
    const wrapper = shallowRender(<LoginForm />)
    const expected = {username: '', password: ''}
    expect(wrapper.state()).to.eql(expected)
  })

  describe('when the username changes', function () {
    it('should change the username state', function () {
      const wrapper = shallowRender(<LoginForm />)
      const expected = {username: 'foo', password: ''}

      const field = wrapper.find({name: 'username'})
      field.simulate('change', {target: {value: 'foo'}})

      expect(wrapper.state()).to.eql(expected)
    })
  })

  describe('when the password changes', function () {
    it('should change the password state', function () {
      const wrapper = shallowRender(<LoginForm />)
      const expected = {username: '', password: 'bar'}

      const field = wrapper.find({name: 'password'})
      field.simulate('change', {target: {value: 'bar'}})

      expect(wrapper.state()).to.eql(expected)
    })
  })
})