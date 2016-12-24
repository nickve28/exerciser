defmodule Workout.Repositories.Workout do
  alias Workout.Repo
  alias Workout.Schemas.{Workout, PerformedExercise}
  import Ecto.Query, only: [from: 2]

  def to_model(data) when is_list(data), do: Enum.map(data, &to_model/1)

  def to_model(%PerformedExercise{} = model) do
    Map.take(model, [:exercise_id, :reps, :weight])
  end

  def to_model(workout) do
    workout = Map.take(workout, [:id, :user_id, :workout_date, :performed_exercises, :description])
    %{workout | workout_date: Ecto.DateTime.to_iso8601(workout[:workout_date]),
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
end
