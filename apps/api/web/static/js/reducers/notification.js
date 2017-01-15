import {DELETE_WORKOUT} from '../actions/index'
import _ from 'lodash'

const INITIAL_STATE = {showWorkoutDeleted: false}

export default (state = INITIAL_STATE, action) => {
  if (action.type === DELETE_WORKOUT) {
    return {showWorkoutDeleted: true}
  }
  return state
}
