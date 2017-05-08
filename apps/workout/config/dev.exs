use Mix.Config

config :workout, Workout.Repo,
  adapter: Ecto.Adapters.Postgres,
  database: "workouts",
  username: "postgres",
  password: "postgres",
  hostname: "localhost"