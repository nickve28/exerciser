defmodule Workout.Repositories.Workout do
  @moduledoc false
  alias Workout.Repo
  alias Workout.Schemas.{Workout, PerformedExercise}
  import Ecto.Query, only: [from: 2, where: 3, join: 5]

  @date_format "{YYYY}-{0M}-{0D}"

  def to_model(nil), do: nil

  def to_model(data) when is_list(data), do: Enum.map(data, &to_model/1)

  def to_model(%PerformedExercise{} = model) do
    Map.take(model, [:exercise_id, :reps, :weight, :sets])
  end

  def to_model(workout) do
    workout = Map.take(workout, [:id, :user_id, :workout_date, :performed_exercises, :description])
    %{workout | workout_date: Timex.format!(workout[:workout_date], @date_format),
                performed_exercises: to_model(workout[:performed_exercises])}
  end

  def list(%{user_id: user_id, limit: limit, offset: offset}) do
    result = Repo.all(from workout in Workout,
             where: workout.user_id == ^user_id,
             order_by: [desc: workout.workout_date],
             offset: ^offset,
             limit: ^limit,
             preload: [:performed_exercises])
    |> Enum.map(&to_model/1)
    {:ok, result}
  end

  defp preload_data(nil, _), do: nil

  defp preload_data(model, preload), do: Repo.preload(model, preload)

  def get(id) do
    result = Repo.get(Workout, id)
    |> preload_data(:performed_exercises)
    |> to_model

    {:ok, result}
  end

  def create(changeset) do
    with {:ok, workout} <- Repo.insert(changeset)
    do
      {:ok, to_model(workout)}
    else
      error -> error
    end
  end

  def update(changeset) do
    with {:ok, updated_model} <- Repo.update(changeset)
    do
      {:ok, to_model(updated_model)}
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
