use Mix.Config

config :workout, Workout.Repo,
  adapter: Ecto.Adapters.Postgres,
  database: "workouts",
  username: System.get_env("DB_USER"),
  password: System.get_env("DB_PASS"),
  hostname: System.get_env("DB_HOST")

config :workout, Workout.ExerciseRepo, #todo remove later
  adapter: Ecto.Adapters.Postgres,
  database: "exercises",
  username: System.get_env("DB_USER"),
  password: System.get_env("DB_PASS"),
  hostname: System.get_env("DB_HOST")


config :workout,
  ecto_repos: [Workout.Repo]

config :workout,
  timezone: "Europe/Amsterdam"

config :workout,
  exercise_repo: Workout.Repositories.Exercise

config :workout, api_token: "55476a0d8ff88f1f28e9e7724cbdc825db1d729b"

import_config "#{Mix.env}.exs"