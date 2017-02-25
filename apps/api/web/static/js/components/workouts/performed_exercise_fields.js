import React, {Component} from 'react'

import { SelectField, MenuItem } from 'material-ui'
import { Field } from 'redux-form'

import _ from 'lodash'

export default class PerformedExerciseFields extends Component {
  constructor(props) {
    super(props)

    this.notifyChange = this.notifyChange.bind(this)
    this.state = {fields: []}
  }

  componentWillMount() {
    const {index, fields} = this.props
    const field = fields.get(index)
    if (field.exerciseId) {
      this.notifyChange(field.exerciseId)
      this.updateFields(field, field.exerciseId)
    }
  }

  notifyChange(id) {
    const exercise = this.props.exercises[id]
    if (exercise.type === 'strength') {
      return this.setState({fields: ['sets', 'reps', 'weight']})
    }
    return this.setState({fields: ['metric', 'amount', 'duration', 'mode']})
  }

  //this one mutates, careful
  updateFields(field, id) {
    const exercise = this.props.exercises[id]
    if (exercise.type === 'strength') {
      field.type = 'strength'
      return _.forEach(['metric', 'mode', 'amount', 'duration'], prop => delete field[prop])
    }
    field.type = 'endurance'
    return _.forEach(['weight', 'sets', 'reps'], prop => delete field[prop])
  }

  render() {
    const {fieldName, index, renderField, exercises, fields} = this.props //see if we can get the existing exercise here for template + edit


    return (
      <li className='list-group-item list-group-item-gray' key={index}>
        <div className="form-group">
          <div>
            <label style={{marginRight: '5px'}}>Exercise #{index + 1}</label>
            <span className="pull-right glyphicon glyphicon-minus" onClick={() => fields.remove(index)} />
          </div>
          <Field className="form-control" name={`${fieldName}.exerciseId`} component={properties =>
            <div>
              <SelectField
                name="exerciseId"
                value={properties.input.value.toString()}
                onChange={(e, key, value) => {
                  this.notifyChange(value) //should introduce a type param in views
                  const field = fields.get(index)
                  this.updateFields(field, value)
                  properties.input.onChange(value)}
                }
                maxHeight={200}
              >
                {_.map(_.values(exercises), exercise => {
                  return <MenuItem name="exercise_list" value={exercise.id} key={exercise.id} primaryText={exercise.name} />
                })}
              </SelectField>

              <div>
                {properties.meta.touched && <span className="error-text">{properties.meta.error}</span>}
              </div>
            </div>
          } />
        </div>
        {
          _.map(this.state.fields, field => {
            const label = _.capitalize(field)
            return <Field
              key={`${fieldName}.${field}`}
              name={`${fieldName}.${field}`}
              component={renderField}
              label={label}
            />
          })
        }
      </li>
    )
  }
}
