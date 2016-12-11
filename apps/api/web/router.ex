defmodule Api.Router do
  use Api.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/" do
    #todo authenticate plug, besides the login endpoint
    forward "/", Absinthe.Plug,
      schema: Api.Schema
  end

  # Other scopes may use custom stacks.
  # scope "/api", Api do
  #   pipe_through :api
  # end
end
