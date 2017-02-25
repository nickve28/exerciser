use Mix.Config

config :progress, user_repo: Progress.Repositories.User
config :progress, workout_repo: Progress.Repositories.Workout
config :progress, exercise_repo: Progress.Repositories.Exercise

import_config "#{Mix.env}.exs"

