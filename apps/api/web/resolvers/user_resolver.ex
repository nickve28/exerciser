defmodule Api.Resolvers.UserResolver do
  def authenticate(%{name: name, password: password}, _info) do
    User.Services.User.authenticate(%{name: name, password: password})
  end

  def authenticate(_, _) do
    {:error, "Please provider name and password"}
  end

  def get(_args, %{context: %{user_id: user_id}}) do
    user = User.Services.User.get(user_id)
    case user do
      nil -> {:error, "No user found"}
      {:error, reason} -> {:error, reason}
      _ -> {:ok, user}
    end
  end
end

