import '../helpers/dom_helper'
import {describe, it, before, afterEach} from 'mocha'

import React from 'react'
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import _ from 'lodash'

import SelectExercise from '../../components/exercises/select'
import {shallowRender} from '../helpers/theme_helper'

import {exercises} from '../helpers/stubs/index'

chai.use(chaiEnzyme())
chai.use(sinonChai)
const expect = chai.expect

describe('<SelectExercise />', () => {

  it('renders a select form with the specified exercises', () => {
    const wrapper = shallowRender(
      <SelectExercise
        exercises={exercises}
        selectedExercise={null}
        onSelect={_.noop}
      />
    )
    const select = wrapper.find('SelectField')
    expect(select.children().length).to.eql(2)

    expect(select.children().first().prop('value')).to.eql(1)
    expect(select.children().first().prop('primaryText')).to.eql('Barbell Bench Press')

    expect(select.children().last().prop('value')).to.eql(2)
    expect(select.children().last().prop('primaryText')).to.eql('Squats')
  })

  describe('When the value changes', () => {
    let onSelect

    before(() => {
      onSelect = sinon.spy()
    })

    afterEach(() => {
      onSelect.reset()
    })

    it('should call the onSelect function when the value changes', () => {
      const wrapper = shallowRender(
        <SelectExercise
          exercises={exercises}
          selectedExercise={null}
          onSelect={onSelect}
        />
      )
      wrapper.simulate('change', null, 0, 1)
      expect(onSelect).to.have.been.calledWith(1)
    })
  })

  describe('when selectedExercise is set', () => {
    it('should set the value to that exercise', () => {
      const wrapper = shallowRender(
        <SelectExercise
          exercises={exercises}
          selectedExercise={_.last(exercises).id}
          onSelect={_.noop}
        />
      )

      expect(wrapper.find('SelectField').prop('value')).to.eql(2)
    })
  })
})