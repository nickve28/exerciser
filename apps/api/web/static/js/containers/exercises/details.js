import React, { Component } from 'react'

import { connect } from 'react-redux'
import { fetchExercise, fetchCategories, updateExercise } from '../../actions/index'

import getCategories from 'selectors/get_categories'

import _ from 'lodash'
import Promise from 'bluebird'

import ExerciseDetailData from '../../components/exercises/detail_data'

class ExerciseDetails extends Component {
  constructor(props) {
    super(props)

    this.handleUpdate = this.handleUpdate.bind(this)
  }

  componentDidMount() {
    const { exercise } = this.props

    if (!exercise) {
      return Promise.join(
        this.props.fetchExercise(this.props.params.id),
        this.props.fetchCategories()
      )
    }
  }

  handleUpdate(payload) {
    const { exercise } = this.props
    const newPayload = { ...exercise, ...payload }

    return this.props.updateExercise(newPayload)
  }

  render() {
    const { exercise, categories } = this.props

    if (_.isEmpty(exercise)) {
      return <div>Loading...</div>
    }
    return <ExerciseDetailData
      categories={categories}
      exercise={exercise}
      handleUpdate={this.handleUpdate}
    />
  }
}

const mapStateToProps = (state, props) => {
  const { id } = props.params

  return {
    exercise: state.exercises.data.entities[id],
    categories: getCategories(state)
  }
}

export default connect(
  mapStateToProps, { fetchExercise, fetchCategories, updateExercise }
)(ExerciseDetails)