defmodule Api.Resolvers.UserResolver do
  @moduledoc false
  def authenticate(%{name: name, password: password}, _info) do
    User.Services.User.authenticate(%{name: name, password: password})
  end

  def authenticate(_, _) do
    {:error, "Please provide name and password"}
  end

  def get(_args, %{context: %{user_id: user_id}}) do
    user = User.Services.User.get(user_id)
    case user do
      {:error, :enotfound} -> {:error, "No user found"}
      {:error, reason} -> {:error, reason}
      {:ok, user_data} -> {:ok, user_data}
    end
  end
end

