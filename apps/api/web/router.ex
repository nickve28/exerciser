defmodule Api.Router do
  @moduledoc false

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
      #Deprecated
      scope "/login", Api do
        pipe_through [:api]
        post "/", LoginController, :authenticate
      end

      forward "/graphiql", Absinthe.Plug.GraphiQL,
        schema: Api.Schema

      scope "/" do
        #pipe_through [:authentication]


        forward "/", Absinthe.Plug,
          schema: Api.Schema
      end
    end

    scope "/" do
      pipe_through [:browser]
      get "/*any", Api.PageController, :index
    end
  end

  # Other scopes may use custom stacks.
  # scope "/api", Api do
  #   pipe_through :api
  # end
end
