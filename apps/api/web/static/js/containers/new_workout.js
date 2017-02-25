import React, {Component} from 'react'
import { reduxForm } from 'redux-form'
import {connect} from 'react-redux'

import {fetchWorkoutTemplate, saveWorkout, fetchExercises} from '../actions/index'
import { browserHistory } from 'react-router'
import {validateWorkoutCreate, validatePExerciseCreate, validatePExerciseUnique} from '../helpers/validator'
import { SubmissionError } from 'redux-form'

import exerciseIndex from '../selectors/exercise_index'

import moment from 'moment'
import _ from 'lodash'

import WorkoutForm from '../components/workout_form'

const PERFORMED_EXERCISE_PROPS = ['exerciseId', 'weight', 'sets', 'reps', 'metric', 'mode', 'amount', 'duration']

const toDecimal = _.partialRight(parseInt, 10)

class NewWorkout extends Component {
  constructor(props) {
    super(props)

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleLoadTemplate = this.handleLoadTemplate.bind(this)
    this.state = {errors: []}
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
        errors={this.state.errors}
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
      this.setState({errors})
      throw new SubmissionError(errors)
    }

    if (!payload.workoutDate)
      payload.workoutDate = moment()

    payload.workoutDate = moment(payload.workoutDate).format('YYYY-MM-DD')
    payload.performedExercises = _.map(payload.performedExercises, pExercise => {
      let filteredExercise = _.pick(pExercise, PERFORMED_EXERCISE_PROPS)
      return _.reduce(_.keys(filteredExercise), (memo, prop) => {
        if (prop === 'metric') {
          memo[prop] = filteredExercise[prop]
          return memo
        }
        memo[prop] = toDecimal(filteredExercise[prop])
        return memo
      }, {})
    }) //to int for all values

    this.props.saveWorkout(payload).then(() => {
      browserHistory.push('/workouts') //best way to navigate..
    })
  }

}

function validate(data) {
  const topLevelErrors = validateWorkoutCreate(_.omit(data, 'performedExercises'))
  const exerciseErrors = _.map(data.performedExercises, validatePExerciseCreate)
  const exerciseIds = _(data.performedExercises)
    .map('exerciseId')
    .compact()
    .map(id => toDecimal(id)) //the 2nd parameter of map is causing trouble
    .value()

  const exerciseUniqueError = validatePExerciseUnique(exerciseIds).error

  const errorMessages = _.reduce(_.get(topLevelErrors, 'error.details'), (memo, {message, path}) => {
    memo[path] = _.replace(message, /"/g, '')
    return memo
  }, {})

  if (exerciseUniqueError) {
    const err = 'You can not assign an exercise multiple times'
    errorMessages.uniqueExerciseError = err
  }

  const someErrorsPresentInExercises = _.some(exerciseErrors, ({error}) => error)

  if (someErrorsPresentInExercises) {
    errorMessages.performedExercises = _.map(exerciseErrors, ({error}) => {
      return _.reduce(_.get(error, 'details'), (memo, {message, path}) => {
        memo[path] = _.replace(message, /"/g, '')
        return memo
      }, {})
    })
  }
  return errorMessages
}

function mapStateToProps(state) {
  const initialValues = state.workouts.workoutTemplate
  if (initialValues) {
    initialValues.workoutDate = moment(initialValues.workoutDate).toDate()
  }

  return {
    exercises: exerciseIndex(state),
    initialValues: initialValues
  }
}

NewWorkout = reduxForm({ //eslint-disable-line
  form: 'workout',
  fields: ['description', 'workoutDate', 'performedExercise'],
  validate
})(NewWorkout)

export default connect(mapStateToProps, {fetchWorkoutTemplate, saveWorkout, fetchExercises})(NewWorkout)
