import Joi from 'joi'

const JOI_OPTIONS = {abortEarly: false, convert: true}

const CREATE_WORKOUT_SCHEMA = Joi.object().keys({
  workout_date: Joi.any(), //todo
  description: Joi.string().required(),
})

const CREATE_PERFORMED_EXERCISE_SCHEMA = Joi.object().keys({
  exercise_id: Joi.number().integer().required(),
  weight: Joi.number().required(),
  reps: Joi.number().integer().required(),
  sets: Joi.number().integer().required()
})

export const validateWorkoutCreate = (payload) => {
  return Joi.validate(payload, CREATE_WORKOUT_SCHEMA, JOI_OPTIONS)
}

export const validatePExerciseCreate = (payload) => {
  return Joi.validate(payload, CREATE_PERFORMED_EXERCISE_SCHEMA, JOI_OPTIONS)
}

