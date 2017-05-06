import React, {Component} from 'react'
import { Field, FieldArray } from 'redux-form'
import {Link} from 'react-router'
import {TextField, RaisedButton, FloatingActionButton} from 'material-ui'
import ContentSave from 'material-ui/svg-icons/content/save'
import ContentCopy from 'material-ui/svg-icons/content/content-copy'

import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import PerformedExerciseFields from './workouts/performed_exercise_fields'
import NewWorkoutAction from './workouts/new_workout_action'

import MediaQuery from 'react-responsive'

const SMALL_DEVICE_QUERY = '(max-device-width: 1024px)'
const LARGE_DEVICE_QUERY = '(min-device-width: 1024px)'

import DatePicker from './datepicker'

import moment from 'moment'
import _ from 'lodash'

const EMPTY_EXERCISE = {
  exerciseId: null,
  weight: null,
  reps: null,
  sets: null,
  mode: null,
  amount: null,
  duration: null
}

const STRENGTH_FIELDS = ['weight', 'sets', 'reps']
const ENDURANCE_FIELDS = ['amount', 'duration', 'mode']

const decideFields = (exercise) => {
  if (_.isEmpty(exercise)) return []
  if (exercise.type === 'strength') return STRENGTH_FIELDS
  return ENDURANCE_FIELDS
}

const loadTemplate = handler => {
  return (
    <ContentCopy
      onClick={handler}
      style={{display: 'inline-block', marginLeft: '2px'}}
    />
  )
}

class WorkoutForm extends Component {
  constructor(props) {
    super(props)

    this.renderPerformedExercises = this.renderPerformedExercises.bind(this)
    this.onExerciseChange = this.onExerciseChange.bind(this)
    this.renderSaveBtn = this.renderSaveBtn.bind(this)
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
    const orderedExercises = _.map(this.props.exerciseOrder, exerciseId => this.props.exercises[exerciseId])

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
              exercises={orderedExercises}
              renderField={this.renderField}
              remove={() => fields.remove(index)}
              currentValue={currentValue}
              onChange={(exerciseId) => this.onExerciseChange(exerciseId, index, fields)}
              fields={fieldsToRender}
            />
          })}
        </ReactCSSTransitionGroup>
        <NewWorkoutAction onClick={() => fields.push(EMPTY_EXERCISE)} />
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

  renderSaveBtn() {
    return (
      <div>
        <MediaQuery query={SMALL_DEVICE_QUERY}>
          <FloatingActionButton className="save-workout-btn" type="submit">
            <ContentSave />
          </FloatingActionButton>
        </MediaQuery>

        <MediaQuery query={LARGE_DEVICE_QUERY}>
          <RaisedButton style={{marginTop: '10px'}} label={this.props.action} primary={true} type="submit" />
        </MediaQuery>
      </div>
    )
  }

  render() {
    const {handleFormSubmit, handleLoadTemplate, action, errors} = this.props
    const loadTemplateTxt = action === 'Create' ? loadTemplate(handleLoadTemplate) : ''

    return (
      <div>
        <div style={{marginBottom: '10px'}} />
        <div>
          <h3 style={{display: 'inline'}}>{action} Workout</h3>
          {loadTemplateTxt}
          <span className="float-right">
            <Link to="/workouts">Go Back</Link>
          </span>
        </div>

        <form className="form" onSubmit={handleFormSubmit}>
          <Field type="textarea" name="description" label="Description" component={this.renderField} />
          <label style={{marginRight: '5px'}}>Workout Date</label><br />
          <Field type="text" name="workoutDate" component={properties =>
            <DatePicker
              onChange={(e, val) => properties.input.onChange(val)}
              formatDate={formatDate}
              defaultDate={properties.input.value || moment().toDate()}
              name="workoutDate"
            />
          } />

          <FieldArray name="performedExercises" component={this.renderPerformedExercises} />
          {this.renderError(errors, 'uniqueExerciseError')}
          {this.renderSaveBtn()}
      </form>
      </div>
    )
  }
}

function formatDate(date) {
  return moment(date).format('YYYY-MM-DD')
}

export default WorkoutForm