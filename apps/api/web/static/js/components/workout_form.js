import React, {Component} from 'react'
import { Field, FieldArray } from 'redux-form'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {DatePicker, TextField, SelectField, MenuItem, RaisedButton} from 'material-ui'

import moment from 'moment'
import _ from 'lodash'
import Promise from 'bluebird'

const EMPTY_EXERCISE = {
  exercise_id: null,
  weight: null,
  reps: null,
  sets: null
}

class WorkoutForm extends Component {
  constructor(props) {
    super(props)

    this.renderPerformedExercises = this.renderPerformedExercises.bind(this)
  }

  renderPerformedExercises({fields}) {
    return (
      <span>
        <ul style={{marginBottom: '5px'}} className="list-group">
          {fields.map((fieldName, index) => {
            return (
              <li className='list-group-item list-group-item-gray' key={index}>
                <div className="form-group">
                  <div>
                    <label style={{marginRight: '5px'}}>Exercise #{index + 1}</label>
                    <span className="pull-right glyphicon glyphicon-minus" onClick={() => fields.remove(index)} />
                  </div>
                  <Field className="form-control" name={`${fieldName}.exercise_id`} component={properties =>
                    <div>
                      <SelectField
                        name="exercise_id"
                        value={properties.input.value.toString()}
                        onChange={(e, key, value) => properties.input.onChange(value)}
                        maxHeight={200}
                      >
                        {_.map(this.props.exercises, exercise => {
                          return <MenuItem name="exercise_list" value={exercise.id} key={exercise.id} primaryText={exercise.name} />
                        })}
                      </SelectField>

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

  renderField(fieldProps) {
    const { input, name, label, type, meta: { touched, error } } = fieldProps
    return (
      <div>
        <p><label style={{marginRight: '5px'}}>{label}</label></p>
        <TextField {...input} type={type} name={input.name} />
        {touched && <span className="error-text">{error}</span>}
      </div>
    )
  }

  render() {
    const {handleFormSubmit, handleLoadTemplate, exercises} = this.props

    return (
      <div>
        <div>
          <h3 style={{marginRight: '5px', display: 'inline-block'}}>New workout</h3>
          <span className="pull-right-xs">
            <small>
              <Link to="/workouts">Go Back</Link>
            </small>
          </span>
        </div>
        <small>
          <a href="javascript:void(0);" onClick={handleLoadTemplate}>Load most recent workout template</a>
        </small>

        <form className="form" onSubmit={handleFormSubmit}>
          <Field type="textarea" name="description" label="Description" component={this.renderField} />
          <label style={{marginRight: '5px'}}>Workout Date</label><br />
          <Field type="text" name="workout_date" component={properties =>
            <DatePicker
              name="workout_date"
              formatDate={formatDate}
              onChange={(val) => properties.input.onChange(val)}
              container="inline"
              mode="landscape"
              defaultDate={properties.input.value || moment().toDate()}
            />
          } />
          <FieldArray name="performedExercises" component={this.renderPerformedExercises} />
          <RaisedButton label="Create" primary={true} type="submit" />
      </form>
      </div>
    )
  }
}

function formatDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

export default WorkoutForm