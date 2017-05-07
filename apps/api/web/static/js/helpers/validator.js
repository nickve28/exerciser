import Joi from 'joi'
import _ from 'lodash'

const JOI_OPTIONS = {abortEarly: false, convert: true}

const CREATE_WORKOUT_SCHEMA = Joi.object().keys({
  workoutDate: Joi.any(), //todo
  description: Joi.string().required(),
})

const CREATE_PERFORMED_EXERCISE_SCHEMA = Joi.object().keys({ //todo: edit
  exerciseId: Joi.number().integer().required(),
  type: Joi.string(),
  weight: Joi.when('type', {
    is: Joi.string().valid('strength'),
    then: Joi.number().required(),
    else: Joi.forbidden()
  }),
  reps: Joi.when('type', {
    is: Joi.string().valid('strength'),
    then: Joi.number().integer().required(),
    else: Joi.forbidden()
  }),
  sets: Joi.when('type', {
    is: Joi.string().valid('strength'),
    then: Joi.number().integer().required(),
    else: Joi.forbidden()
  }),
  duration: Joi.when('type', {
    is: Joi.string().valid('endurance'),
    then: Joi.number().required(),
    else: Joi.forbidden()
  }),
  amount: Joi.when('type', {
    is: Joi.string().valid('endurance'),
    then: Joi.number().required(),
    else: Joi.forbidden()
  }),
  mode: Joi.when('type', {
    is: Joi.string().valid('endurance'),
    then: Joi.number().required(),
    else: Joi.forbidden()
  })
})

const CREATE_EXERCISE_SCHEMA = Joi.object().keys({
  name: Joi.string().required(),
  description: Joi.string().required(),
  categories: Joi.array().items(Joi.string()).min(1),
  type: Joi.string().required(),
  metric: Joi.string().required()
})

const UNIQUE_ID_SCHEMA = Joi.array().items(Joi.number().integer()).unique()

export const validateWorkoutCreate = (payload) => {
  return Joi.validate(payload, CREATE_WORKOUT_SCHEMA, JOI_OPTIONS)
}

export const validatePExerciseCreate = (payload) => {
  return Joi.validate(payload, CREATE_PERFORMED_EXERCISE_SCHEMA, _.defaults({allowUnknown: true}, JOI_OPTIONS))
}

export const validatePExerciseUnique = (ids) => {
  return Joi.validate(ids, UNIQUE_ID_SCHEMA, JOI_OPTIONS)
}

export const validateExerciseCreate = payload => {
  return Joi.validate(payload, CREATE_EXERCISE_SCHEMA, JOI_OPTIONS)
}