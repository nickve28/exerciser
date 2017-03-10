defmodule Api.Resolvers.ExerciseResolver do
  @moduledoc false
  def list(args, _info) do
    handle_result(Exercises.Services.Exercise.list(args))
  end

  def get(%{id: id}, _info) do
    exercise = Exercises.Services.Exercise.get(id)
    handle_result(exercise)
  end

  def get_categories(_args, _info) do
    handle_result(Exercises.Services.Category.list)
  end

  def get(_, _), do: {:error, "No id specified"}

  def create(args, _info) do
    handle_result(Exercises.Services.Exercise.create(args))
  end

  def update(args, _info) do
    handle_result(Exercises.Services.Exercise.update(args))
  end

  def delete(%{id: id}, _info) do
    payload = %{id: String.to_integer(id)}
    handle_result(Exercises.Services.Exercise.delete(payload))
  end

  def count(_, _) do
    handle_result(Exercises.Services.Exercise.count)
  end

  defp handle_result({:ok, result}), do: {:ok, result}

  defp handle_result({:error, {:enotfound, message, _}}), do: {:error, %{message: message, code: 404, details: []}}

  defp handle_result({:error, {:invalid, _, details}}) do
    detail_map = Enum.into(details, %{})
    {:error, %{message: "The request was deemed invalid. Refer to the error details", code: 400, details: detail_map}}
  end

  defp handle_result({:error, {:unprocessable, message, details}}) do
    detail_map = Enum.into(details, %{})
    {:error, %{message: message, code: 422, details: detail_map}}
  end

  defp handle_result(_) do
    {:error, %{message: "Something went wrong", code: 500, details: []}}
  end
end
