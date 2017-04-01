use Mix.Config

config :exercises, Exercises.Repo,
  adapter: Ecto.Adapters.Postgres,
  database: "exercises",
  username: "postgres",
  password: "postgres",
  hostname: "localhost"
