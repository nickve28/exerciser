import React from 'react'
import { pick } from 'lodash'

import { TextField } from 'material-ui'

import MaterialLabel from './label'

const OPTIONS = ['multiLine', 'rows']

export default props => {
  const { input, label, type, meta: { touched, error }, placeholder } = props

  const additionalOptions = pick(props, OPTIONS)
  return (
    <div>
      <MaterialLabel name={label} />
      <TextField
        {...input}
        {...additionalOptions}
        placeholder={placeholder}
        type={type}
        name={input.name}
        errorText= {touched && error}
      />
    </div>
  )
}