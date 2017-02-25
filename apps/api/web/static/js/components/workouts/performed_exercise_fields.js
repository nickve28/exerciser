import React from 'react'

import { SelectField, MenuItem } from 'material-ui'
import { Field } from 'redux-form'

import _ from 'lodash'

export default (props) => {
  const {
    fieldName, index, renderField, exercises, remove, onChange, fields
  } = props

  return (
    <li className='list-group-item list-group-item-gray' key={index}>
      <div className="form-group">
        <div>
          <label style={{marginRight: '5px'}}>Exercise #{index + 1}</label>
          <span className="pull-right glyphicon glyphicon-minus" onClick={remove} />
        </div>
        <Field className="form-control" name={`${fieldName}.exerciseId`} component={properties =>
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
        _.map(fields, field => {
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
