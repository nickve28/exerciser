import sinon from 'sinon'
import {afterEach, after} from 'mocha'

import * as exerciseActions from '../../actions/exercise'

const fetchExercisesStub = sinon.stub(exerciseActions, 'fetchExercises')
const fetchCategoriesStub = sinon.stub(exerciseActions, 'fetchCategories')

after(() => {
  fetchExercisesStub.restore()
  fetchCategoriesStub.restore()
})

afterEach(() => {
  fetchExercisesStub.reset()
  fetchCategoriesStub.reset()
})

export default {
  fetchExercises: fetchExercisesStub,
  fetchCategories: fetchCategoriesStub
}