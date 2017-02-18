import React, {Component} from 'react'
import { Field, reduxForm } from 'redux-form'
import {connect} from 'react-redux'
import {Link} from 'react-router'

import {fetchWorkoutAndExercises, updateWorkout} from '../actions/index'
import { browserHistory } from 'react-router';
import {validateWorkoutCreate, validatePExerciseCreate} from '../helpers/validator'
import { SubmissionError } from 'redux-form'

import moment from 'moment'
import _ from 'lodash'

import WorkoutForm from '../components/workout_form'

const toDecimal = _.partialRight(parseInt, 10)

const EMPTY_EXERCISE = {
  exercise_id: null,
  weight: null,
  reps: null,
  sets: null
}

class EditWorkout extends Component {
  constructor(props) {
    super(props)

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.state = {errors: []}
  }

  componentDidMount() {
    return this.props.fetchWorkoutAndExercises(this.props.params.id)
  }

  render() {
    return (
      <WorkoutForm
        handleFormSubmit={this.props.handleSubmit(this.handleFormSubmit)}
        handleLoadTemplate={_.noop}
        action="Edit"
        exercises={this.props.exercises}
        validate={validate}
        errors={this.state.errors}
      />
    )
  }

  handleFormSubmit(values) {
    let payload = _.omit(values, 'id')
    const errors = validate(values)

    if (!_.isEmpty(errors)) {
      this.setState({errors})
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

    const id = this.props.params.id

    return this.props.updateWorkout(id, payload).then(() => {
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
    const err = "You can not assign an exercise multiple times"
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
  return errorMessages;
}

function mapStateToProps(state) {
  const initialValues = state.workouts.selectedWorkout
  if (initialValues) {
    initialValues.workoutDate = moment(initialValues.workoutDate).toDate()
  }

  return {
    exercises: state.exercises.exercises,
    initialValues: initialValues
  }
}

EditWorkout = reduxForm({
  form: 'workout',
  fields: ['description', 'workoutDate', 'performedExercise'],
  validate
})(EditWorkout)

export default connect(mapStateToProps, {fetchWorkoutAndExercises, updateWorkout})(EditWorkout)

