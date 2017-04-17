use Mix.Config

config :workout, Workout.Repo,
  adapter: Ecto.Adapters.Postgres,
  database: "workouts_test",
  username: "postgres",
  password: "postgres",
  hostname: "localhost"

config :workout,
  exercise_repo: Workout.Repositories.MockExercise