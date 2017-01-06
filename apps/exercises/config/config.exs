use Mix.Config

config :exercises, Exercises.Repo,
  adapter: Ecto.Adapters.Postgres,
  database: "exercises",
  username: System.get_env("DB_USER"),
  password: System.get_env("DB_PASS"),
  hostname: System.get_env("DB_HOST")

config :exercises,
  ecto_repos: [Exercises.Repo]

config :exercises, api_token: "55476a0d8ff88f1f28e9e7724cbdc825db1d729b"

import_config "#{Mix.env}.exs"