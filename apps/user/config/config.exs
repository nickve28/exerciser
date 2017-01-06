use Mix.Config

config :user, User.Repo,
  adapter: Ecto.Adapters.Postgres,
  database: "users",
  username: System.get_env("DB_USER"),
  password: System.get_env("DB_PASS"),
  hostname: System.get_env("DB_HOST")

config :user, salt: System.get_env("PW_SALT")
config :user, token_secret: System.get_env("USER_TOKEN_SECRET")

config :user,
  ecto_repos: [User.Repo]

import_config "#{Mix.env}.exs"