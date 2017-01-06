use Mix.Config

config :api, Api.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "notthebestsecreykeybasebutitsotherinproduction",
  render_errors: [view: Api.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Api.PubSub,
           adapter: Phoenix.PubSub.PG2]

config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :api, token_secret: System.get_env("TOKEN_SECRET")
config :api, cors_hosts: []

import_config "#{Mix.env}.exs"
