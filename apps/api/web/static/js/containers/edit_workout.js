import React, {Component} from 'react'
import { reduxForm } from 'redux-form'
import {connect} from 'react-redux'

import {fetchWorkout, fetchExercises, updateWorkout} from '../actions/index'
import { browserHistory } from 'react-router'
import {validateWorkoutCreate, validatePExerciseCreate, validatePExerciseUnique} from '../helpers/validator'
import { SubmissionError } from 'redux-form'

import moment from 'moment'
import _, { values } from 'lodash'
import Promise from 'bluebird'

import WorkoutForm from '../components/workout_form'

import preparePayload from '../helpers/prepare_workout_payload'

const toDecimal = _.partialRight(parseInt, 10)

class EditWorkout extends Component {
  constructor(props) {
    super(props)

    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.state = {errors: []}
  }

  componentDidMount() {
    //const fetchWorkouts = this.props.fetchWorkout(this.props.params.id)

    if (_.isEmpty(this.props.exercises)) {
      return this.props.fetchExercises()
    }
  }

  render() {
    return (
      <WorkoutForm
        handleFormSubmit={this.props.handleSubmit(this.handleFormSubmit)}
        handleLoadTemplate={_.noop}
        action="Edit"
        exercises={this.props.exercises}
        exerciseOrder={this.props.exerciseOrder}
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

    const updateWorkoutPayload = preparePayload(payload)

    const id = this.props.params.id
    return this.props.updateWorkout(id, updateWorkoutPayload).then(() => {
      browserHistory.push('/workouts') //best way to navigate..
    })
  }

}

function validate(data) {
  const topLevelErrors = validateWorkoutCreate(_.omit(data, ['performedExercises', 'id']))
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

function mapStateToProps(state, props) {
  const exercises = state.exercises.data.entities

  if (_.isEmpty(exercises)) {
    return {
      exercises: [],
      exerciseOrder: [],
      initialValues: {}
    }
  }

  const initialValues = state.workoutFetch.data.entities[props.params.id]
  if (initialValues) {
    initialValues.workoutDate = moment(initialValues.workoutDate).toDate()
    initialValues.performedExercises = _.map(initialValues.performedExercises, pExercise => {
      return _.merge({}, pExercise, {type: exercises[pExercise.exerciseId].type})
    })
  }

  return {
    exercises: exercises,
    exerciseOrder: state.exercises.data.order,
    initialValues: initialValues
  }
}

EditWorkout = reduxForm({ //eslint-disable-line
  form: 'workout',
  fields: ['description', 'workoutDate', 'performedExercise'],
  validate
})(EditWorkout)

export default connect(mapStateToProps, {fetchWorkout, fetchExercises, updateWorkout})(EditWorkout)

