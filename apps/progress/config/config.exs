use Mix.Config

config :progress, user_repo: Progress.Repositories.User
config :progress, workout_repo: Progress.Repositories.Workout

import_config "#{Mix.env}.exs"

