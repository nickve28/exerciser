defmodule Workout.Repositories.Workout do
  @moduledoc false
  alias Workout.Repo
  alias Workout.Schemas.{Workout, PerformedExercise}
  import Ecto.Query

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
    |> Enum.map(&to_model/1)

    {:ok, result}
  end

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
