import React from 'react'
import { connect } from 'react-redux'

import Title from 'components/title'

import { fetchCategories } from '../actions/category'

import getCategories from 'selectors/get_categories'

import ExerciseForm from '../components/form'

const NewExercise = ({ categories, fetchCategories }) => {
  fetchCategories()

  return <div className="content">
    <Title title="Create exercise" />
    <ExerciseForm categories={categories} />
  </div>
}

const mapStateToProps = state => ({ categories: getCategories(state) })

export default connect(
  mapStateToProps,
  { fetchCategories }
)(NewExercise)