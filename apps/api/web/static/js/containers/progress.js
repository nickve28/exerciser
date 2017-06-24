import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchProgress, fetchExercises} from '../actions/index'

import _ from 'lodash'
import moment from 'moment'

import SelectExercise from '../components/exercises/select'
import SelectDateRange from '../components/select_date_range'
import ProgressData from '../components/progress/progress'

class Progress extends Component {
  constructor(props) {
    super(props)

    this.state = {exerciseId: null, from: null, until: null}

    this.onSelect = this.onSelect.bind(this)
  }

  componentDidMount() {
    this.props.fetchExercises()
  }

  onSelect(payload) {
    this.setState(payload)
    const requestPayload = _.chain(payload)
      .defaults(payload, this.state)
      .mapKeys((value, key) => {
        if (key === 'from') return 'fromDate'
        if (key === 'until') return 'untilDate'
        return key
      }).value()

    if (!requestPayload.from) {
      requestPayload.fromDate = moment().subtract(3, 'months').format('YYYY-MM-DD')
    }

    this.props.fetchProgress(requestPayload)
  }

  render() {
    const { progress, exercises } = this.props

    const progressData = _.get(progress, 'progress', [])
    const exerciseType = _.get(progress, 'exerciseType')
    const startDate = _.get(_.last(progressData), 'date')
    const endDate = _.get(_.first(progressData), 'date')

    if (_.isEmpty(exercises)) {
      return <div>Loading...</div>
    }

    return (
      <div>
        <div style={{marginBottom: '10px'}} />

        <div style={{marginBottom: '50px'}}>
          <h3 style={{display: 'inline'}}>Progress</h3>
        </div>

        <SelectExercise exercises={exercises}
          selectedExercise={this.state.exerciseId}
          onSelect={exerciseId => this.onSelect({exerciseId})}
        />
        <div style={{marginBottom: '20px'}} />

        <SelectDateRange startDate={startDate} endDate={endDate} onSelect={this.onSelect} />

        <div style={{marginTop: '50px'}} />
        <ProgressData exerciseType={exerciseType} progress={progress} />
      </div>
    )
  }
}

const mapStateToProps = ({ progress, exercises }) => {
  return { progress, exercises: exercises.data.entities }
}

export default connect(mapStateToProps, {fetchProgress, fetchExercises})(Progress)

