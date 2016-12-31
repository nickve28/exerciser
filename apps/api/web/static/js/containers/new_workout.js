import React, {Component} from 'react'
import { Field, reduxForm, FieldArray } from 'redux-form'
import {connect} from 'react-redux'
import Select from 'react-select'
import DatePicker from 'react-datepicker'

import {fetchWorkoutsAndExercises, saveWorkout, fetchExercises} from '../actions/index'
import { browserHistory } from 'react-router';
import {validateWorkoutCreate, validatePExerciseCreate} from '../helpers/validator'
import { SubmissionError } from 'redux-form'

import moment from 'moment'
import _ from 'lodash'
import Promise from 'bluebird'

const EMPTY_EXERCISE = {
  exercise_id: null,
  weight: null,
  reps: null,
  sets: null
}

class NewWorkout extends Component {
  constructor(props) {
    super(props)

    this.renderPerformedExercises = this.renderPerformedExercises.bind(this)
    this.formSubmit = this.formSubmit.bind(this)
  }

  componentWillMount() {
    return this.props.fetchExercises()
  }

  renderPerformedExercises({fields}) {
    return (
      <span>
        <ul style={{marginBottom: '5px'}} className="list-group">
          {fields.map((fieldName, index) => {
            const customLiClass = index % 2 === 0 ? 'list-group-item-gray' : 'list-group-item-light-gray'
            return (
              <li className={`list-group-item ${customLiClass}`} key={index}>
                <div className="form-group">
                  <div>
                    <label style={{marginRight: '5px'}}>Exercise #{index + 1}</label>
                    <span className="pull-right glyphicon glyphicon-minus" onClick={() => fields.remove(index)} />
                  </div>
                  <Field className="form-control" name={`${fieldName}.exercise_id`} component={properties =>
                    <div>
                      <Select
                        options={mapExercises(this.props.exercises)}
                        onChange={params => properties.input.onChange(params.value)}
                        value={properties.input.value.toString()} //todo all API output should be either integer or string
                      />
                      <div>
                        {properties.meta.touched && <span className="error-text">{properties.meta.error}</span>}
                      </div>
                    </div>
                  } />
                </div>
                <Field name={`${fieldName}.weight`} component={this.renderField} label="Weight" />
                <Field name={`${fieldName}.sets`} component={this.renderField} label="Sets" />
                <Field name={`${fieldName}.reps`} component={this.renderField} label="Reps" />
              </li>
            )
          })}
        </ul>
        <a href="javascript:void(0);" style={{marginBottom: '5px'}} onClick={() => fields.push(EMPTY_EXERCISE)}>+ Add Exercise</a><br />
      </span>
    )
  }

  formSubmit(values) {
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

  renderField(fieldProps) {
    const { input, name, label, type, meta: { touched, error } } = fieldProps

    return (
      <div className="form-group">
        <label style={{marginRight: '5px'}}>{label}</label>
        <input {...input} type={type} className="form-control" name={name} />
        {touched && <span className="error-text">{error}</span>}
      </div>
    )
  }

  loadTemplate() {
    this.props.fetchWorkoutsAndExercises(1);
  }

  render() {
    const {handleSubmit} = this.props

    return (
      <div>
        <div>
          <strong style={{marginRight: '5px'}}>New workout</strong>
          <span className="pull-right-xs">
            <a href="javascript:void(0);" onClick={() => this.loadTemplate()}>Load most recent workout template</a>
          </span>
        </div>
        <form className="form" onSubmit={handleSubmit(this.formSubmit)}>
          <Field type="textarea" className="form-control" name="description" label="Description" component={this.renderField} />
          <div className="form-group">
            <label style={{marginRight: '5px'}}>Workout Date</label><br />
            <Field type="text" className="form-control" name="workout_date" component={properties =>
              <DatePicker
                className="form-control"
                selected={properties.input.value || moment()}
                onChange={(val) => properties.input.onChange(val)}
              />
            } />
          </div>
          <FieldArray name="performedExercises" component={this.renderPerformedExercises} />
          <button className="btn btn-primary" type="submit">Create</button>
      </form>
      </div>
    )
  }
}


function mapExercises(exercises) {
  return _.map(exercises, exercise => {
    return {value: exercise.id, label: exercise.name}
  })
}

function mapStateToProps(state) {
  const initialValues = _.cloneDeep(_.first(state.workouts.workouts))
  if (initialValues) {
    //todo fix value of performed_exercises
    initialValues.workout_date = moment(initialValues.workout_date)
    initialValues.performedExercises = initialValues.performed_exercises
  }


  return {
    exercises: state.exercises,
    initialValues: initialValues
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

NewWorkout = reduxForm({
  form: 'workout',
  fields: ['description', 'workout_date', 'performedExercise'],
  validate
})(NewWorkout)

export default connect(mapStateToProps, {fetchWorkoutsAndExercises, saveWorkout, fetchExercises})(NewWorkout)