import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchWorkoutAndExercises} from '../actions/index'
import _ from 'lodash'

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
        <h3>Details for the workout</h3>
        <ul className="list-group">
          <li className="list-group-item">Workout Date: {workout.workout_date}</li>
          <li className="list-group-item">{workout.description}</li>
          <li className="list-group-item">
            <p>Exercises performed</p>
            {_.map(workout.performed_exercises, exercise => {
              return (
                <p key={exercise.id}>
                  <ul className="list-group">
                    <li className="list-group-item">Name: {exercise.name}</li>
                    <li className="list-group-item">Sets: {exercise.sets}</li>
                    <li className="list-group-item">Reps: {exercise.reps}</li>
                    <li className="list-group-item">Weight: {exercise.weight}</li>
                  </ul>
                </p>
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
