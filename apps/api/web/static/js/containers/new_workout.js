import React, {Component} from 'react'
import { Field, reduxForm, FieldArray } from 'redux-form'
import {connect} from 'react-redux'
import Select from 'react-select'
import DatePicker from 'react-datepicker'

import {fetchExercises, saveWorkout} from '../actions/index'
import { browserHistory } from 'react-router';

import moment from 'moment'
import _ from 'lodash'

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
    this.props.fetchExercises()
  }

  renderPerformedExercises({fields, meta: { error }}) {
    return (
      <span>
        <ul style={{marginBottom: '5px'}} className="list-group">
          {fields.map((fieldName, index) => {
            const customLiClass = index % 2 === 0 ? 'list-group-item-gray' : 'list-group-item-light-gray'
            return (
              <li className={`list-group-item ${customLiClass}`} key={index}>
                <div className="form-group">
                  <label style={{marginRight: '5px'}}>Exercise #{index + 1}</label>
                  <Field className="form-control" name={`${fieldName}.exercise_id`} component={properties =>
                    <Select
                      options={mapExercises(this.props.exercises)}
                      onChange={params => properties.input.onChange(params.value)}
                      value={properties.input.value}
                  />
                  } />
                </div>
                <div className="form-group">
                  <label style={{marginRight: '5px'}}>Weight</label>
                  <Field className="form-control" name={`${fieldName}.weight`} component="input" />
                </div>
                <div className="form-group">
                  <label style={{marginRight: '5px'}}>Sets</label>
                  <Field className="form-control" name={`${fieldName}.sets`} component="input" />
                </div>
                <div className="form-group">
                  <label style={{marginRight: '5px'}}>Reps</label>
                  <Field className="form-control" name={`${fieldName}.reps`} component="input" />
                </div>
              </li>
            )
          })}
        </ul>
        <a href="#" style={{marginBottom: '5px'}} onClick={() => fields.push(EMPTY_EXERCISE)}>+ Add Exercise</a><br />
      </span>
    )
  }

  formSubmit(values) {
    let payload = _.cloneDeep(values)
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

  render() {
    const {handleSubmit} = this.props
    return (
      <div>
        <h3>New Workout</h3>
        <form className="form" onSubmit={handleSubmit(this.formSubmit)}>
          <div className="form-group">
            <label style={{marginRight: '5px'}}>description</label>
            <Field type="text" className="form-control" name="description" component="input" />
          </div>
          <div className="form-group">
            <label style={{marginRight: '5px'}}>workout_date</label><br />
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
  return _.pick(state, 'exercises')
}

function validate(data) {
  console.log(data); //eslint-disable-line no-console
  return true
}

NewWorkout = reduxForm({
  form: 'workout',
  validate
})(NewWorkout)

export default connect(mapStateToProps, {fetchExercises, saveWorkout})(NewWorkout)