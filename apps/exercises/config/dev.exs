use Mix.Config

config :exercises, Exercises.Repo,
  adapter: Ecto.Adapters.Postgres,
  database: "exercises",
  username: "postgres",
  password: "",
  hostname: "localhost"
