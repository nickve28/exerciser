defmodule Api.Router do
  @moduledoc false

  use Api.Web, :router

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :authentication do
    plug Api.Plugs.Authentication
  end

  scope "/" do
    scope "/api" do
      pipe_through [:authentication, :api]

      forward "/graphiql", Absinthe.Plug.GraphiQL,
        schema: Api.Schema

      scope "/" do
        forward "/", Absinthe.Plug,
          schema: Api.Schema
      end
    end
  end
end
