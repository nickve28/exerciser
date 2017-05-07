import moment from 'moment'
import _ from 'lodash'

const PERFORMED_EXERCISE_PROPS = ['exerciseId', 'weight', 'sets', 'reps', 'mode', 'amount', 'duration']

const toDecimal = _.partialRight(parseInt, 10)

export default (workoutPayload) => {
  const payload = _.cloneDeep(workoutPayload)

  if (!payload.workoutDate)
    payload.workoutDate = moment()

  payload.workoutDate = moment(payload.workoutDate).format('YYYY-MM-DD')
  payload.performedExercises = _.map(payload.performedExercises, pExercise => {
    let filteredExercise = _.pick(pExercise, PERFORMED_EXERCISE_PROPS)
    return _.reduce(_.keys(filteredExercise), (memo, prop) => {
      if (_.isNull(pExercise[prop])) {
        return memo
      }

      memo[prop] = toDecimal(filteredExercise[prop])
      return memo
    }, {})
  }) //to int for all values
  return payload
}

