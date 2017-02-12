import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchProgress, fetchExercises} from '../actions/index'

import _ from 'lodash'

import SelectExercise from '../components/exercises/select'

class Progress extends Component {
  constructor(props) {
    super(props)

    this.state = {selectedExercise: null}
  }

  componentDidMount() {
    this.props.fetchExercises()
  }

  onSelect(selectedExercise) {
    this.setState({selectedExercise})
    this.props.fetchProgress({exerciseId: selectedExercise})
  }

  render() {
    const {progress, exercises} = this.props
    const exerciseOverview = exercises.exercises;

    if (_.isEmpty(exerciseOverview)) {
      return <div>Loading...</div>
    }
    return (
      <div>
        <div style={{marginBottom: '10px'}} />

        <div style={{marginBottom: '50px'}}>
          <h3 style={{display: 'inline'}}>Progress</h3>
        </div>
        <SelectExercise exercises={exerciseOverview}
          selectedExercise={this.state.selectedExercise}
          onSelect={selectedExercise => this.onSelect(selectedExercise)}
        />
        <p>
          {JSON.stringify(this.props.progress || {})}
        </p>
      </div>
    )
  }
}

const mapStateToProps = ({progress, exercises}) => {
  return {progress, exercises}
}

export default connect(mapStateToProps, {fetchProgress, fetchExercises})(Progress)

