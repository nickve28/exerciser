use Mix.Config

config :api, Api.Endpoint,
  http: [port: 4001],
  server: false

config :api, token_secret: "mytoken_secret"

config :logger, level: :warn
