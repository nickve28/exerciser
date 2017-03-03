import React from 'react'

import {Link} from 'react-router'
import ChipInput from 'material-ui-chip-input'

import _ from 'lodash'

export default ({exercise, categories, handleUpdate}) => {
  return (
    <div>
      <div>
        <div style={{marginBottom: '10px'}} />

        <div style={{marginBottom: '50px'}}>
          <h3 style={{display: 'inline'}}>{exercise.name}</h3>
          <Link className="pull-right" to="/">Go back</Link>
        </div>
      </div>
      <div>
        <p>{exercise.description}</p>
        <p>This exercise is a {_.capitalize(exercise.type)} type exercise</p>
        <p>
          <strong>Categories</strong>
        </p>
        <ChipInput
          dataSource={categories}
          onRequestAdd={category => handleUpdate({categories: _.concat(exercise.categories, category)})}
          onRequestDelete={category => handleUpdate({categories: _.without(exercise.categories, category)})}
          value={exercise.categories}
        />
      </div>
    </div>
  )
}
