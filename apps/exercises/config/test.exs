use Mix.Config

config :exercises, Exercises.Repo,
  adapter: Ecto.Adapters.Postgres,
  database: "exercises_test",
  username: "postgres",
  password: "",
  hostname: "localhost"