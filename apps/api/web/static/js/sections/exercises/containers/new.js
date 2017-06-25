import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import Title from 'components/title'

import { fetchCategories } from '../actions/category'
import { saveExercise } from '../actions/exercise'

import getCategories from 'selectors/get_categories'

import ExerciseForm from '../containers/form'

//recompose, something with old props vs new props pending vs success compare
const NewExercise = ({
  categories,
  fetchCategories,
  saveExercise
}) => {
  fetchCategories()

  return <div className="content">
    <Title title="Create exercise">
      <Link className="pull-right" to="/">Go back</Link>
    </Title>
    <ExerciseForm
      categories={categories}
      handleFormSubmit={saveExercise}
    />
  </div>
}

const mapStateToProps = state => ({
  categories: getCategories(state)
})

export default connect(
  mapStateToProps,
  { fetchCategories, saveExercise }
)(NewExercise)