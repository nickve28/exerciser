defmodule Workout.Repositories.Workout do
  alias Workout.Repo
  alias Workout.Schemas.{Workout, PerformedExercise}
  import Ecto.Query, only: [from: 2]

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

  defp preload(nil, _), do: nil

  defp preload(model, preload), do: Repo.preload(model, preload)

  def get(id) do
    result = Repo.get(Workout, id)
    |> preload(:performed_exercises)
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
end
