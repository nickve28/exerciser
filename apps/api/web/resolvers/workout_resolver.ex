defmodule Api.Resolvers.WorkoutResolver do
  @moduledoc false
  def list(args,  %{context: %{user_id: user_id}}) do
    payload = %{user_id: user_id}
    |> Map.merge(Map.take(args, [:limit, :offset]))

    Workout.Services.Workout.list(payload)
  end

  def get(%{id: id}, _) do
    Workout.Services.Workout.get(%{id: id})
  end

  def create(args, %{context: %{user_id: user_id}}) do
    payload = Map.merge(args, %{user_id: user_id})
    Workout.Services.Workout.create(payload)
  end

  def update(args, %{context: %{user_id: user_id}}) do
    payload = Map.merge(args, %{user_id: user_id})
    Workout.Services.Workout.update(payload)
  end

  def delete(%{id: id}, _) do
    Workout.Services.Workout.delete(%{id: id})
  end
end