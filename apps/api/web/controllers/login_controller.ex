defmodule Api.LoginController do
  @moduledoc false
  use Api.Web, :controller

  def authenticate(conn, %{"name" => name, "password" => password}) do
    user_with_token = User.Services.User.authenticate(%{name: name, password: password})
    user_data = case user_with_token do
      {:ok, user} -> user
      {:error, {:unauthorized, message, details}} ->
        details_map = Enum.into(details, %{})
        %{code: 401, message: message, details: details_map}
      _ -> {:error, %{code: 500, message: "Internal Server error", details: []}}
    end
    render conn, %{data: user_data}
  end
end
