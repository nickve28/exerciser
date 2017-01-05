defmodule Api.LoginController do
  @moduledoc false
  use Api.Web, :controller

  def authenticate(conn, %{"name" => name, "password" => password}) do
    user_with_token = User.Services.User.authenticate(%{name: name, password: password})
    user_data = case user_with_token do
      {:ok, user} -> user
      {:error, error} -> {:error, error}
    end
    render conn, %{data: user_data}
  end
end
