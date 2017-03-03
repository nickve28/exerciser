import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchWorkout, fetchExercises} from '../actions/index'
import _ from 'lodash'

import {Link} from 'react-router'
import workoutSelector from '../selectors/workout_selector'

import Promise from 'bluebird'

class WorkoutDetail extends Component {
  componentWillMount() {
    const fetchWorkouts = this.props.fetchWorkout(this.props.params.id)

    let fetchExercises = true
    if (_.isEmpty(this.props.exercises)) {
      fetchExercises = this.props.fetchExercises()
    }
    return Promise.join(fetchWorkouts, fetchExercises)
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
              {'  |  '}
              <Link to="/workouts">Go Back</Link>
            </span>
          </span>
        </div>
        <ul className="list-group">
          <li className="list-group-item">Workout Date: {workout.workoutDate.toString()}</li>
          <li className="list-group-item">{workout.description}</li>
          <li className="list-group-item">
            <p>Exercises performed</p>
            {_.map(workout.performedExercises, exercise => {
              return (
                <ul key={exercise.exerciseId} className="list-group" style={{marginTop: '5px'}}>
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
    workout: workoutSelector(state),
    exercises: state.exercises.exercises
  }
}

export default connect(mapStateToProps, {fetchWorkout, fetchExercises})(WorkoutDetail)
