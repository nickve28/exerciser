import React, {Component} from 'react'

import {connect} from 'react-redux'
import {fetchExercise} from '../../actions/index'

import _ from 'lodash'

class ExerciseDetails extends Component {
  componentDidMount() {
    const id = this.props.params.id
    const exerciseNotPresent = !_.get(this.props.exercises, id)
    if (exerciseNotPresent) {
      return this.props.fetchExercise(id)
    }
  }

  render() {
    const selectedExercise = _.get(this.props.exercises, this.props.params.id)
    if (_.isEmpty(selectedExercise)) {
      return <div>Loading...</div>
    }
    return <div>Loaded</div>
  }
}

const mapStateToProps = state => {
  return {
    exercises: state.exercises.exercises
  }
}

export default connect(mapStateToProps, {fetchExercise})(ExerciseDetails)