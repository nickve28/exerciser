import React, {Component} from 'react'
import { Field, FieldArray } from 'redux-form'
import {Link} from 'react-router'
import {DatePicker, TextField, RaisedButton} from 'material-ui'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import PerformedExerciseFields from './workouts/performed_exercise_fields'

import moment from 'moment'
import _ from 'lodash'

const EMPTY_EXERCISE = {
  exerciseId: null,
  weight: null,
  reps: null,
  sets: null,
  mode: null,
  metric: null,
  amount: null,
  duration: null
}

class WorkoutForm extends Component {
  constructor(props) {
    super(props)

    this.renderPerformedExercises = this.renderPerformedExercises.bind(this)
  }


  renderPerformedExercises({fields}) {
    return (
      <span>
        <ReactCSSTransitionGroup
          component="ul"
          className="list-group"
          style={{marginBottom: '5px'}}
          transitionName="listitem"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {fields.map((fieldName, index) => {
            return <PerformedExerciseFields
              key={index}
              index={index}
              fieldName={fieldName}
              exercises={this.props.exercises}
              renderField={this.renderField}
              fields={fields}
            />
          })}
        </ReactCSSTransitionGroup>
        <a className="add-exercise" href="javascript:void(0);" style={{marginBottom: '5px'}} onClick={() => fields.push(EMPTY_EXERCISE)}>+ Add Exercise</a><br />
      </span>
    )
  }

  renderField(fieldProps) {
    const { input, label, type, meta: { touched, error } } = fieldProps
    return (
      <div>
        <p><label style={{marginRight: '5px'}}>{label}</label></p>
        <TextField {...input} type={type} name={input.name} />
        {touched && <span className="error-text">{error}</span>}
      </div>
    )
  }

  renderError(error, key) {
    if (!_.get(error, key)) { return '' }
    return <div className="error-text">{error[key]}</div>
  }

  render() {
    const {handleFormSubmit, handleLoadTemplate, action, errors} = this.props
    const loadTemplateTxt = action === 'Create' ? <a href="javascript:void(0);" onClick={handleLoadTemplate}>Load most recent workout template</a> : ''

    return (
      <div>
        <div style={{marginBottom: '10px'}} />
        <div>
          <h3 style={{display: 'inline'}}>{action} Workout</h3>
          <span className="float-right">
            <Link to="/workouts">Go Back</Link>
          </span>
        </div>
        <small>
          {loadTemplateTxt}
        </small>

        <form className="form" onSubmit={handleFormSubmit}>
          <Field type="textarea" name="description" label="Description" component={this.renderField} />
          <label style={{marginRight: '5px'}}>Workout Date</label><br />
          <Field type="text" name="workoutDate" component={properties =>
            <DatePicker
              name="workoutDate"
              formatDate={formatDate}
              onChange={(e, val) =>  {
                //e = empty event, 2nd arg = date
                properties.input.onChange(val)
              }}
              container="inline"
              mode="landscape"
              defaultDate={properties.input.value || moment().toDate()}
            />
          } />

          <FieldArray name="performedExercises" component={this.renderPerformedExercises} />
          {this.renderError(errors, 'uniqueExerciseError')}
          <RaisedButton style={{marginTop: '10px'}} label={this.props.action} primary={true} type="submit" />
      </form>
      </div>
    )
  }
}

function formatDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

export default WorkoutForm