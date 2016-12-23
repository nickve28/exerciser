defmodule Workout.Repositories.Workout do
  alias Workout.Repo
  alias Workout.Schemas.Workout
  import Ecto.Query, only: [from: 2]

  def to_model(workout) do
    workout = Map.take(workout, [:id, :user_id, :workout_date])
    %{workout | workout_date: Ecto.DateTime.to_iso8601(workout[:workout_date])}
  end

  def list(%{user_id: user_id, limit: limit, offset: offset}) do
    result = Repo.all(from workout in Workout,
             where: workout.user_id == ^user_id,
             order_by: [desc: workout.workout_date],
             offset: ^offset,
             limit: ^limit)
    |> Enum.map(&to_model/1)
    {:ok, result}
  end
end
