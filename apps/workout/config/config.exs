use Mix.Config

config :workout, Workout.Repo,
  adapter: Ecto.Adapters.Postgres,
  database: "workouts",
  username: System.get_env("DB_USER"),
  password: System.get_env("DB_PASS"),
  hostname: System.get_env("DB_HOST")

config :workout,
  ecto_repos: [Workout.Repo]

config :workout,
  timezone: "Europe/Amsterdam"

config :workout,
  exercise_repo: Workout.Repositories.Exercise

import_config "#{Mix.env}.exs"