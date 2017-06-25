import React from 'react'
import { SelectField, MenuItem } from 'material-ui'
import { map, keys } from 'lodash'

import MaterialLabel from './label'

const renderMenuItems = options => {
  return map(keys(options), key => {
    return (
      <MenuItem
        key={key}
        value={options[key]}
        primaryText={options[key]}
      />
    )
  })
}

export default props => {
  const { input, options, labelText, label, meta: { touched, error } } = props

  return <div>
    <MaterialLabel name={label} />
    <SelectField
      {...input}
      value={input.value}
      floatingLabelText={labelText}
      onChange={
        (event, index, value) => input.onChange(value)
      }
      errorText={touched && error}
    >
      {renderMenuItems(options)}
    </SelectField>
  </div>
}
