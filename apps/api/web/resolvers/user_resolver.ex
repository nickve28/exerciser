defmodule Api.Resolvers.UserResolver do
  def authenticate(%{name: name, password: password}, _info) do
    User.Services.User.authenticate(%{name: name, password: password})
  end

  def authenticate(_, _) do
    {:error, "Please provider name and password"}
  end
end

