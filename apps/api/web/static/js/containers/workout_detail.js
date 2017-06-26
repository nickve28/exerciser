import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchWorkout, fetchExercises} from '../actions/index'
import _ from 'lodash'

import {Link} from 'react-router'
//import workoutSelector from '../selectors/workout_selector'

import StrengthExerciseDetails from '../components/workouts/strength_exercise_details'
import EnduranceExerciseDetails from '../components/workouts/endurance_exercise_details'

import Promise from 'bluebird'

class WorkoutDetail extends Component {
  componentWillMount() {
    const { workout } = this.props

    let fetchWorkouts = true
    if (!workout) {
      fetchWorkouts = this.props.fetchWorkout(this.props.params.id)
    }

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
          <h3 style={{marginRight: '5px', display: 'inline'}}>Workout details</h3>
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
              const {type, exerciseId} = exercise
              const Details = type === 'strength' ? StrengthExerciseDetails : EnduranceExerciseDetails
              return (
                <Details key={exerciseId} exercise={exercise} />
              )
            })}
          </li>
        </ul>
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  const exercises = state.exercises.data.entities || {}

  const workout = state.workoutFetch.data.entities[props.params.id]
  //also temp..
  if (workout) {
    workout.performedExercises = workout.performedExercises.map(
      pE => ({ ...pE, ...exercises[pE.exerciseId] })
    )
  }

  return {
    workout, exercises
  }
}

export default connect(mapStateToProps, {fetchWorkout, fetchExercises})(WorkoutDetail)
