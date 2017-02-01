defmodule Api.LoginController do
  @moduledoc false
  use Api.Web, :controller

  def authenticate(conn, %{"name" => name, "password" => password}) do
    user_with_token = User.Services.User.authenticate(%{name: name, password: password})
    case user_with_token do
      {:ok, user} -> render conn, %{data: user}
      {:error, {:unauthorized, message, details}} ->
        details_map = Enum.into(details, %{})
        error = %{code: 401, message: message, details: details_map}
        conn
        |> put_status(401)
        |> render(%{data: error})
      _ ->
        conn
        |> put_status(500)
        |> render(%{data: %{code: 500, message: "Internal Server error", details: []}})
    end
  end
end
