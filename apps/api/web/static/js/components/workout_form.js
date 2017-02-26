import React, {Component} from 'react'
import { Field, FieldArray } from 'redux-form'
import {Link} from 'react-router'
import {DatePicker, TextField, RaisedButton} from 'material-ui'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import PerformedExerciseFields from './workouts/performed_exercise_fields'

import MediaQuery from 'react-responsive'

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

const STRENGTH_FIELDS = ['weight', 'sets', 'reps']
const ENDURANCE_FIELDS = ['metric', 'amount', 'duration', 'mode']

const decideFields = (exercise) => {
  if (!exercise) return []
  if (exercise.type === 'strength') return STRENGTH_FIELDS
  return ENDURANCE_FIELDS
}

class WorkoutForm extends Component {
  constructor(props) {
    super(props)

    this.renderPerformedExercises = this.renderPerformedExercises.bind(this)
    this.onExerciseChange = this.onExerciseChange.bind(this)
  }

  onExerciseChange(exerciseId, index, fields) {
    fields.remove(index)
    const {type} = _.get(this, 'props.exercises', {})[exerciseId]
    const newExercise = _.defaults({exerciseId, type}, EMPTY_EXERCISE)
    setTimeout(() => {
      fields.insert(index, newExercise)
    }, 50) //this is for now needed, due to: https://github.com/erikras/redux-form/issues/2466 which is not available currently
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
            const currentValue = fields.get(index)
            const fieldsToRender = decideFields(currentValue)
            return <PerformedExerciseFields
              key={index}
              index={index}
              fieldName={fieldName}
              exercises={this.props.exercises}
              renderField={this.renderField}
              remove={() => fields.remove(index)}
              currentValue={currentValue}
              onChange={(exerciseId) => this.onExerciseChange(exerciseId, index, fields)}
              fields={fieldsToRender}
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
        <TextField {...input}
          type={type}
          name={input.name}
          errorText= {touched && error}
        />
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
            <MediaQuery minWidth={1024}>
              {isMatch => {
                let mode = isMatch ? 'landscape' : 'portrait'
                let container = isMatch ? 'inline' : 'dialog'
                return <DatePicker
                  name="workoutDate"
                  formatDate={formatDate}
                  onChange={(e, val) =>  {
                    //e = empty event, 2nd arg = date
                    properties.input.onChange(val)
                  }}
                  container={container}
                  mode={mode}
                  defaultDate={properties.input.value || moment().toDate()}
                />
              }}
            </MediaQuery>
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