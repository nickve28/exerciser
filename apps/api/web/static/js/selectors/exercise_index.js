import { createSelector } from 'reselect'

import _ from 'lodash'

const exerciseSelector = state => state.exercises.exercises

//eg: [{id: 1, name: 'a'}] => {1 => {id: 1, name: 'a'}}
const toViewModel = exercises => {
  return _.chain(exercises)
          .map(exercise => [exercise.id, exercise])
          .fromPairs()
          .value()
}


export default createSelector(
  exerciseSelector,
  toViewModel
)
