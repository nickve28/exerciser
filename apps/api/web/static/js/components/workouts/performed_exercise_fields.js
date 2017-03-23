import React from 'react'

import { SelectField, MenuItem } from 'material-ui'
import Delete from 'material-ui/svg-icons/action/delete'
import { Field } from 'redux-form'

import _ from 'lodash'

const FIELD_TYPE_MAPPING = {
  metric: 'text',
  mode: 'number',
  duration: 'number',
  amount: 'number',
  weight: 'number',
  sets: 'number',
  reps: 'number'
}

export default (props) => {
  const {
    fieldName, index, renderField, exercises, remove, onChange, fields
  } = props

  const deleteStyle = {
    float: 'right'
  }

  return (
    <li className='list-group-item list-group-item-gray' key={index}>
      <div className="form-group">
        <div>
          <label style={{marginRight: '5px'}}>Exercise #{index + 1}</label>
          <Delete style={deleteStyle} color="#7f8c8d" onClick={remove} />
        </div>
        <Field className="form-control" name={`${fieldName}.exerciseId`}component={properties =>
          <div>
            <SelectField
              name="exerciseId"
              value={properties.input.value.toString()}
              onChange={(e, key, value) => {
                properties.input.onChange(value)
                onChange(value)
              }}
              maxHeight={200}
            >
              {_.map(exercises, exercise => {
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
        _.map(fields, field => {
          const type = FIELD_TYPE_MAPPING[field] || 'text'
          const label = _.capitalize(field)
          return <Field
            key={`${fieldName}.${field}`}
            name={`${fieldName}.${field}`}
            component={renderField}
            type={type}
            label={label}
          />
        })
      }
    </li>
  )
}
