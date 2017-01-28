import React, {Component} from 'react'
import { Field, reduxForm } from 'redux-form'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import {fetchWorkoutTemplate, saveWorkout, fetchExercises} from '../actions/index'
import { browserHistory } from 'react-router';
import {validateWorkoutCreate, validatePExerciseCreate} from '../helpers/validator'
import { SubmissionError } from 'redux-form'

import moment from 'moment'
import _ from 'lodash'
import Promise from 'bluebird'

import WorkoutForm from '../components/workout_form'

const toDecimal = _.partialRight(parseInt, 10)

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
    return this.props.fetchExercises()
  }

  render() {
    return (
      <WorkoutForm
        handleFormSubmit={this.props.handleSubmit(this.handleFormSubmit)}
        handleLoadTemplate={this.handleLoadTemplate}
        action="Create"
        exercises={this.props.exercises}
        validate={validate}
      />
    )
  }

  handleLoadTemplate() {
    this.props.fetchWorkoutTemplate()
  }

  handleFormSubmit(values) {
    let payload = _.omit(values, 'id')
    const errors = validate(payload)

    if (!_.isEmpty(errors)) {
      throw new SubmissionError(errors)
    }

    if (!payload.workoutDate)
      payload.workoutDate = moment()

    payload.workoutDate = moment(payload.workoutDate).format('YYYY-MM-DD')
    payload.performedExercises = _.map(payload.performedExercises, pExercise => {
      return _.chain(pExercise)
              .pick(['exerciseId', 'weight', 'sets', 'reps'])
              .mapValues(toDecimal).value()
    }) //to int for all values

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
  const initialValues = state.workouts.workoutTemplate
  if (initialValues) {
    initialValues.workoutDate = moment(initialValues.workoutDate).toDate()
  }

  return {
    exercises: state.exercises.exercises,
    initialValues: initialValues
  }
}

NewWorkout = reduxForm({
  form: 'workout',
  fields: ['description', 'workoutDate', 'performedExercise'],
  validate
})(NewWorkout)

export default connect(mapStateToProps, {fetchWorkoutTemplate, saveWorkout, fetchExercises})(NewWorkout)
