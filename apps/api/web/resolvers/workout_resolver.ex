defmodule Api.Resolvers.WorkoutResolver do
  @moduledoc false
  def list(args,  %{context: %{user_id: user_id}}) do
    payload = %{user_id: user_id}
    |> Map.merge(Map.take(args, [:limit, :offset]))

    Workout.Services.Workout.list(payload)
    |> handle_result
  end

  def get(%{id: id}, _) do
    Workout.Services.Workout.get(%{id: id})
    |> handle_result
  end

  def create(args, %{context: %{user_id: user_id}}) do
    payload = Map.merge(args, %{user_id: user_id})
    Workout.Services.Workout.create(payload)
    |> handle_result
  end

  def update(args, %{context: %{user_id: user_id}}) do
    payload = Map.merge(args, %{user_id: user_id})
    Workout.Services.Workout.update(payload)
    |> handle_result
  end

  def delete(%{id: id}, _) do
    Workout.Services.Workout.delete(%{id: id})
    |> handle_result
  end

  def count(_, %{context: %{user_id: user_id}}) do
    Workout.Services.Workout.count(%{user_id: user_id})
    |> handle_result
  end

  defp handle_result({:ok, result}), do: {:ok, result}

  defp handle_result({:error, {:enotfound, message, _}}), do: {:error, %{message: message, code: 404, details: []}}

  defp handle_result({:error, {:invalid, _, details}}) do
    detail_map = Enum.into(details, %{})
    {:error, %{message: "The request was deemed invalid. Refer to the error details", code: 400, details: detail_map}}
  end

  defp handle_result(err) do
    {:error, %{message: "Something went wrong", code: 500, details: []}}
  end
end