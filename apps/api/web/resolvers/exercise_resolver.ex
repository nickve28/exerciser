defmodule Api.Resolvers.ExerciseResolver do
  def list(args, _info) do
    reply(Exercises.Services.Exercise.list(args))
  end

  def get(%{id: id}, _info) do
    exercise = Exercises.Services.Exercise.get(id)
    reply(exercise)
  end

  def get_categories(_args, _info) do
    reply(Exercises.Services.Category.list)
  end

  def get(_, _), do: {:error, "No id specified"}

  def create(args, _info) do
    reply(Exercises.Services.Exercise.create(args))
  end

  defp reply({:error, error}), do: {:error, error}

  defp reply({:ok, exercise}), do: {:ok, exercise}
end

