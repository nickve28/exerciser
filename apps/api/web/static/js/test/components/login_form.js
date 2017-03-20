import '../helpers/dom_helper'
import {describe, it} from 'mocha'

import React from 'react'
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'

import _ from 'lodash'

import LoginForm from '../../components/login_form'
import {shallowRender} from '../helpers/theme_helper'

chai.use(chaiEnzyme())
const expect = chai.expect

describe('<LoginForm />', () => {

  it('renders and sets an empty username/password', () => {
    const wrapper = shallowRender(<LoginForm />)
    const expected = {username: '', password: ''}
    expect(wrapper.state()).to.eql(expected)
  })

  describe('when the username changes', () => {
    it('should change the username state', () => {
      const wrapper = shallowRender(<LoginForm />)
      const expected = {username: 'foo', password: ''}

      const field = wrapper.find({name: 'username'})
      field.simulate('change', {target: {value: 'foo'}})

      expect(wrapper.state()).to.eql(expected)
    })
  })

  describe('when the password changes', () => {
    it('should change the password state', () => {
      const wrapper = shallowRender(<LoginForm />)
      const expected = {username: '', password: 'bar'}

      const field = wrapper.find({name: 'password'})
      field.simulate('change', {target: {value: 'bar'}})

      expect(wrapper.state()).to.eql(expected)
    })
  })

  describe('when clicking enter', () => {
    it('should trigger the login callback', (done) => {
      const cb = (username, password) => {
        expect(username).to.eql('foo')
        expect(password).to.eql('bar')
        done()
      }

      const wrapper = shallowRender(<LoginForm loginUser={cb} />)

      wrapper.find({name: 'password'}).simulate('change', {target: {value: 'bar'}})
      wrapper.find({name: 'username'}).simulate('change', {target: {value: 'foo'}})

      wrapper.find('form').first().simulate('submit', {preventDefault: _.noop})
    })
  })
})