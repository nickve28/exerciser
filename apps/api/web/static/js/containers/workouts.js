import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchWorkoutsAndExercises} from '../actions/index'

import _ from 'lodash'

import WorkoutEntry from '../components/workout_entry'

class Workouts extends Component {
  componentWillMount() {
    this.props.fetchWorkoutsAndExercises()
  }

  render() {
    const {workouts} = this.props
    return (
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Workout Date</th>
              <th>Description</th>
              <th>Exercises</th>
              <th>-</th>
            </tr>
          </thead>
          <tbody>
            {
              _.map(workouts, (workout) => {
                return <WorkoutEntry key={workout.id} workout={workout} />
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    workouts: state.workouts.workouts
  }
}

export default connect(mapStateToProps, {fetchWorkoutsAndExercises})(Workouts)