use Mix.Config

config :user, User.Repo,
  adapter: Ecto.Adapters.Postgres,
  database: "users_test",
  username: "postgres",
  password: "",
  hostname: "localhost"