use Mix.Config

config :exercises, Exercises.Repo,
  adapter: Ecto.Adapters.Postgres,
  database: "exercises_test",
  username: "postgres",
  password: "postgres",
  hostname: "localhost"

config :exercises, workout_repo: Exercises.Repositories.MockWorkout