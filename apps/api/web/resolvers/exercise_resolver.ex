defmodule Api.Resolvers.ExerciseResolver do
  def get(%{id: id}, _info) do
    exercise = Exercises.Services.Exercise.get(id)
    reply(exercise)
  end

  def get(_, _), do: {:error, "No id specified"}

  defp reply({:error, error}), do: {:error, error}

  defp reply({:ok, exercise}), do: {:ok, exercise}
end

