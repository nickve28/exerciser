import React, {Component} from 'react'
import { Field, reduxForm, FieldArray } from 'redux-form'
import {connect} from 'react-redux'
import Select from 'react-select'

import {fetchExercises} from '../actions/index'

import moment from 'moment'
import _ from 'lodash'

import PerformedExerciseFields from '../components/performed_exercise_fields'

const EMPTY_EXERCISE = {
  exercise_id: null,
  weight: null,
  reps: null,
  sets: null
}

class NewWorkout extends Component {
  constructor(props) {
    super(props)

    this.addExerciseToPayload = this.addExerciseToPayload.bind(this)
    this.renderPerformedExercises = this.renderPerformedExercises.bind(this)

    this.state = {description: '', workout_date: moment().format('YYYY-MM-DD'), performedExercises: []}
  }

  componentWillMount() {
    this.props.fetchExercises()
  }

  addExerciseToPayload() {
    const currentExercises = this.state.performedExercises
    const newExercises = _.concat(currentExercises, EMPTY_EXERCISE)
    const newState = _.defaults({performedExercises: newExercises}, this.state)
    return this.setState(newState)
  }


  renderPerformedExercises({fields, meta: { error }}) {
    return (
      <span>
        <ul style={{marginBottom: '5px'}}>
          {fields.map((fieldName, index) => {
            return (
              <li key={index}>
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

  render() {
    const {handleSubmit} = this.props
    return (
      <div>
        <h3>New Workout</h3>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{marginRight: '5px'}}>description</label>
            <Field type="text" className="form-control" name="description" component="input" />
          </div>
          <div className="form-group">
            <label style={{marginRight: '5px'}}>workout_date</label>
            <Field type="text" className="form-control" name="workout_date" component="input" />
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

export default connect(mapStateToProps, {fetchExercises})(NewWorkout)