defmodule Api.Endpoint do
  @moduledoc false

  use Phoenix.Endpoint, otp_app: :api

  if code_reloading? do
    socket "/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket
    plug Phoenix.LiveReloader
    plug Phoenix.CodeReloader
  end

  plug Plug.RequestId
  plug Plug.Logger

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Poison

  plug Plug.MethodOverride
  plug Plug.Head

  #for some reason it refuses to load the config, so we use a manual workaround, while
  #still using a config
  cors_config = Application.get_env(:api, :cors_config)
  plug CORSPlug,
    origin: cors_config[:origin],
    methods: cors_config[:methods],
    credentials: cors_config[:credentials],
    max_age: cors_config[:max_age]

  plug Api.Router
end
