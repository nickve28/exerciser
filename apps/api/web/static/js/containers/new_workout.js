import React, {Component} from 'react'
import { Field, reduxForm } from 'redux-form'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import {fetchWorkoutTemplateAndExercises, saveWorkout, fetchExercises} from '../actions/index'
import { browserHistory } from 'react-router';
import {validateWorkoutCreate, validatePExerciseCreate} from '../helpers/validator'
import { SubmissionError } from 'redux-form'

import moment from 'moment'
import _ from 'lodash'
import Promise from 'bluebird'

import WorkoutForm from '../components/workout_form'

const EMPTY_EXERCISE = {
  exercise_id: null,
  weight: null,
  reps: null,
  sets: null
}

class NewWorkout extends Component {
  constructor(props) {
    super(props)

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleLoadTemplate = this.handleLoadTemplate.bind(this)
  }

  componentDidMount() {
    this.props.fetchExercises()
  }

  render() {
    return (
      <WorkoutForm
        handleFormSubmit={this.props.handleSubmit(this.handleFormSubmit)}
        handleLoadTemplate={this.handleLoadTemplate}
        exercises={this.props.exercises}
        validate={validate}
      />
    )
  }

  handleLoadTemplate() {
    this.props.fetchWorkoutTemplateAndExercises()
  }

  handleFormSubmit(values) {
    let payload = _.cloneDeep(values)
    const errors = validate(values)

    if (!_.isEmpty(errors)) {
      throw new SubmissionError(errors)
    }
    if (!payload.workout_date) payload.workout_date = moment()
    payload.workout_date = moment(payload.workout_date).format('YYYY-MM-DD')
    payload.performed_exercises = _.map(payload.performedExercises, ({exercise_id, reps, weight, sets}) => {
      return {
        exercise_id: parseInt(exercise_id, 10),
        reps: parseInt(reps, 10),
        weight: parseInt(weight, 10),
        sets: parseInt(sets, 10)
      }
    })
    payload = _.omit(payload, 'performedExercises')
    this.props.saveWorkout(payload).then(() => {
      browserHistory.push('/workouts') //best way to navigate..
    })
  }

}

function validate(data) {
  const topLevelErrors = validateWorkoutCreate(_.omit(data, 'performedExercises'))
  const exerciseErrors = _.map(data.performedExercises, validatePExerciseCreate)

  const errorMessages = _.reduce(_.get(topLevelErrors, 'error.details'), (memo, {message, path}) => {
    memo[path] = _.replace(message, /"/g, '')
    return memo
  }, {})

  const someErrorsPresentInExercises = _.some(exerciseErrors, ({error}) => error)

  if (someErrorsPresentInExercises) {
    errorMessages.performedExercises = _.map(exerciseErrors, ({error}) => {
      return _.reduce(_.get(error, 'details'), (memo, {message, path}) => {
        memo[path] = _.replace(message, /"/g, '')
        return memo
      }, {})
    })
  }
  return errorMessages;
}

function mapStateToProps(state) {
  let initialValues = state.workouts.workoutTemplate

  if (initialValues) {
    //todo fix value of performed_exercises
    initialValues.workout_date = moment(initialValues.workout_date).toDate()
    initialValues.performedExercises = initialValues.performed_exercises
    initialValues = _.omit(initialValues, ['performed_exercises', 'id'])
  }

  return {
    exercises: state.exercises,
    initialValues: initialValues
  }
}

NewWorkout = reduxForm({
  form: 'workout',
  fields: ['description', 'workout_date', 'performedExercise'],
  validate
})(NewWorkout)

export default connect(mapStateToProps, {fetchWorkoutTemplateAndExercises, saveWorkout, fetchExercises})(NewWorkout)
