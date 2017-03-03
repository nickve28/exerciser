import React, {Component} from 'react'

import {connect} from 'react-redux'
import {fetchExercise, fetchCategories} from '../../actions/index'

import _ from 'lodash'
import Promise from 'bluebird'

import ExerciseDetailData from '../../components/exercises/detail_data'

class ExerciseDetails extends Component {
  constructor(props) {
    super(props)

    //this.handleUpdate = this.handleUpdate.bind(this)
  }

  componentDidMount() {
    const id = this.props.params.id
    const exerciseNotPresent = !_.get(this.props.exercises, id)
    if (exerciseNotPresent) {
      return Promise.join(
        this.props.fetchExercise(id),
        this.props.fetchCategories()
      )
    }
  }

  /*handleUpdate(payload) {
    const selectedExercise = _.get(this.props.exercises, this.props.params.id)
    const newPayload = _.defaults(payload, selectedExercise)
  }*/

  render() {
    const selectedExercise = _.get(this.props.exercises, this.props.params.id)
    if (_.isEmpty(selectedExercise)) {
      return <div>Loading...</div>
    }
    return <ExerciseDetailData
      categories={_.values(this.props.categories)}
      exercise={selectedExercise}
      handleUpdate={_.noop}
    />
  }
}

const mapStateToProps = state => {
  return {
    exercises: state.exercises.exercises
  }
}

export default connect(mapStateToProps, {fetchExercise, fetchCategories})(ExerciseDetails)