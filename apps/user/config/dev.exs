use Mix.Config

config :user, User.Repo,
  adapter: Ecto.Adapters.Postgres,
  database: "users",
  username: "postgres",
  password: "postgres",
  hostname: "localhost"

config :user, salt: "$2a$12$OwMtd.uRLWHZ.EZphqKDCO"
config :user, token_secret: "mytoken_secret"
config :user, refresh_token_secret: "myrefreshtoken_secret"