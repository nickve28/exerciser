import React from 'react'
import ChipInput from 'material-ui-chip-input'
import { pick } from 'lodash'

import MaterialLabel from './label'

const OPTIONS = ['onChange']

export default props => {
  const { suggestions, label, input, placeholder, meta: { touched, error } } = props

  return <div>
    <MaterialLabel name={label} />
    <ChipInput
      {...pick(props, OPTIONS)}
      dataSource={suggestions}
      placeholder={placeholder}
      onChange={input.onChange}
      errorText={touched && error}
    />
  </div>
}

