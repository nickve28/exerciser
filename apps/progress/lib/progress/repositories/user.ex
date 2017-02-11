defmodule Progress.Repositories.User do
  def get(id) when is_integer(id), do: User.Services.User.get(id)
end