defmodule Progress.Repositories.User do
  @moduledoc """
    A repository for fetching user data
  """

  @doc """
    Finds an user by its id.
  """
  def get(id) when is_integer(id), do: User.Services.User.get(id)
end