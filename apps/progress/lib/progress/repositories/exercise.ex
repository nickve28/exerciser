defmodule Progress.Repositories.Exercise do
  @moduledoc """
    A repository for fetching exercise data
  """

  @doc """
    Finds an exercise by its id.
  """
  def get(id) when is_integer(id), do: Exercises.Services.Exercise.get(id)
end