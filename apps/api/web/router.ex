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

  pipeline :authentication do
    plug Api.Plugs.Authentication
  end

  scope "/" do
    scope "/api" do

      #Since I want to handle auth as hook, besides this endpoint. Login is a separate rest endpoint
      scope "/login", Api do
        pipe_through [:api]
        post "/", LoginController, :authenticate
      end

      scope "/" do
        pipe_through [:authentication]
        forward "/graphiql", Absinthe.Plug.GraphiQL,
          schema: Api.Schema

        forward "/", Absinthe.Plug,
          schema: Api.Schema
      end
    end
  end

  # Other scopes may use custom stacks.
  # scope "/api", Api do
  #   pipe_through :api
  # end
end
