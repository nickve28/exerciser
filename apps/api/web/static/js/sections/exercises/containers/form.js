import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { partial } from 'lodash'

import MaterialCreateButton from 'components/material/form/create_button'
import MaterialField from 'components/material/form/field'
import MaterialChipInput from 'components/material/form/chip_input'
import MaterialSelect from 'components/material/form/select'

import { required, minimum } from 'helpers/validations'

const EXERCISE_TYPES = {
  strength: 'strength',
  endurance: 'endurance'
}

const ExerciseForm = props => {
  const {
    handleSubmit,
    handleFormSubmit,
    categories,
    pristine,
    submitting
  } = props

  return <form onSubmit={handleSubmit(handleFormSubmit)}>
    <Field
      type="text"
      name="name"
      label="name"
      placeholder="Name of the exercise"
      component={MaterialField}
      validate={required}
    />

    <Field
      type="textarea"
      multiLine={true}
      rows={2}
      name="description"
      label="description"
      placeholder="A clear description of what this exercise does"
      component={MaterialField}
      validate={required}
    />

    <Field
      type="text"
      name="type"
      label="type"
      options={EXERCISE_TYPES}
      component={MaterialSelect}
      validate={required}
    />

    <Field
      type="text"
      name="metric"
      label="metric"
      component={MaterialField}
      placeholder="metric of measurement, eg: kg"
      validate={required}
    />

    <Field
      name="categories"
      label="categories"
      component={MaterialChipInput}
      suggestions={categories}
      placeholder="Exercise categories, eg: biceps"
      validate={partial(minimum, 1)}
    />

    <MaterialCreateButton label="Create" disabled={pristine || submitting} />
  </form>
}


export default reduxForm({
  form: 'new_exercise'
})(ExerciseForm)