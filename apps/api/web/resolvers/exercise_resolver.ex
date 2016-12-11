defmodule Api.Resolvers.ExerciseResolver do
  def get(%{id: id}, _info) do
    exercise = Exercises.Services.Exercise.get(id)
    reply(exercise)
  end

  defp reply(nil), do: {:error, "Not found"}

  defp reply(exercise), do: {:ok, exercise}

  def get(_, _), do: {:error, "No id specified"}
end

