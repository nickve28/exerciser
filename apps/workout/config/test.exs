use Mix.Config

config :workout, Workout.Repo,
  adapter: Ecto.Adapters.Postgres,
  database: "workouts_test",
  username: "postgres",
  password: "postgres",
  hostname: "localhost"

config :workout, Workout.ExerciseRepo,
  adapter: Ecto.Adapters.Postgres,
  database: "exercises_test",
  username: "postgres",
  password: "postgres",
  hostname: "localhost"