defmodule Workout.Repositories.Workout do
  @moduledoc false
  import Workout.Models.Workout, only: [to_model: 1]

  alias Workout.Repo
  alias Workout.Schemas.{Workout, PerformedExercise}
  import Ecto.Query

  defp preload_data(nil, _), do: nil

  defp preload_data(model, preload), do: Repo.preload(model, preload)

  def list(payload) do
    from(workout in Workout)
    |> list(payload)
  end

  defp list(query, %{user_id: user_id} = payload) do
    query
    |> where([workout], workout.user_id == ^user_id)
    |> list(Map.drop(payload, [:user_id]))
  end

  defp list(query, %{exercise_id: exercise_id} = payload) do
    query
    |> join(:inner, [w], p in PerformedExercise, p.workout_id == w.id)
    |> where([w, p], p.exercise_id == ^exercise_id)
    |> list(Map.drop(payload, [:exercise_id]))
  end

  defp list(query, %{from: from} = payload) do
    query
    |> where([w], w.workout_date >= ^from)
    |> list(Map.drop(payload, [:from]))
  end

  defp list(query, %{until: until} = payload) do
    query
    |> where([w], w.workout_date <= ^until)
    |> list(Map.drop(payload, [:until]))
  end

  defp list(query, %{limit: set_limit} = payload) do
    query
    |> limit(^set_limit)
    |> list(Map.drop(payload, [:limit]))
  end

  defp list(query, %{offset: set_offset} = payload) do
    query
    |> offset(^set_offset)
    |> list(Map.drop(payload, [:offset]))
  end

  defp list(query, _) do
    result = query
    |> order_by([workout], desc: workout.workout_date)
    |> preload([:performed_exercises])
    |> Repo.all
    |> Enum.map(fn exercise ->
      {:ok, exercise_model} = to_model(exercise)
      exercise_model
    end)

    {:ok, result}
  end

  def get(id) do
    Repo.get(Workout, id)
    |> preload_data(:performed_exercises)
    |> to_model
  end

  def create(changeset) do
    with {:ok, workout} <- Repo.insert(changeset)
    do
      to_model(workout)
    else
      error -> error
    end
  end

  def update(changeset) do
    with {:ok, updated_model} <- Repo.update(changeset)
    do
      to_model(updated_model)
    else
      error -> error
    end
  end

  def delete(id) do
    Repo.delete_all(from workout in Workout,
                    where: ^id == workout.id)
  end

  def count(payload) do
    Workout
    |> count(payload)
  end

  defp count(query, %{user_id: user_id} = payload) do
    query
    |> where([w], w.user_id == ^user_id)
    |> count(Map.drop(payload, [:user_id]))
  end

  defp count(query, %{exercise_id: ids} = payload) do
    query
    |> join(:inner, [w], p in PerformedExercise, p.workout_id == w.id)
    |> where([w, p], p.exercise_id in ^ids)
    |> count(Map.drop(payload, [:exercise_id]))
  end

  defp count(query, %{}) do
    {:ok, Repo.aggregate(query, :count, :id)}
  end
end
