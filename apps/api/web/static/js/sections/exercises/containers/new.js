import React from 'react'
import { connect } from 'react-redux'

import { fetchCategories } from '../actions/category'

import getCategories from 'selectors/get_categories'

import ExerciseForm from '../components/form'

const NewExercise = ({ categories, fetchCategories }) => {
  fetchCategories()

  return <ExerciseForm categories={categories} />
}

const mapStateToProps = state => ({ categories: getCategories(state) })

export default connect(
  mapStateToProps,
  { fetchCategories }
)(NewExercise)