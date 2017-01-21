import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchWorkoutAndExercises} from '../actions/index'
import _ from 'lodash'

import {Link} from 'react-router'

class WorkoutDetail extends Component {
  componentWillMount() {
    this.props.fetchWorkoutAndExercises(this.props.params.id)
  }
  render() {
    const workout = this.props.workout
    if (!workout) {
      return <div>Loading...</div>
    }

    return (
      <div>
        <div>
          <div style={{marginBottom: '10px'}} />
          <h3 style={{marginRight: '5px', display: 'inline'}}>Details for the workout</h3>
          <span className="float-right">
            <span>
              <Link to={`/workouts/${workout.id}/edit`}>Edit</Link>
              {"  |  "}
              <Link to="/workouts">Go Back</Link>
            </span>
          </span>
        </div>
        <ul className="list-group">
          <li className="list-group-item">Workout Date: {workout.workout_date.toString()}</li>
          <li className="list-group-item">{workout.description}</li>
          <li className="list-group-item">
            <p>Exercises performed</p>
            {_.map(workout.performed_exercises, exercise => {
              return (
                <ul key={exercise.id} className="list-group" style={{marginTop: '5px'}}>
                  <li className="list-group-item">Name: {exercise.name}</li>
                  <li className="list-group-item">Sets: {exercise.sets}</li>
                  <li className="list-group-item">Reps: {exercise.reps}</li>
                  <li className="list-group-item">Weight: {exercise.weight}</li>
                </ul>
              )
            })}
          </li>
        </ul>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    workout: state.workouts.selectedWorkout
  }
}

export default connect(mapStateToProps, {fetchWorkoutAndExercises})(WorkoutDetail)
