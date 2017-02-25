defmodule Progress.Repositories.Exercise do
  def get(id) when is_integer(id), do: Exercises.Services.Exercise.get(id)
end