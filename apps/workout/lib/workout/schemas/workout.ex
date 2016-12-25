defmodule Workout.Schemas.Workout do
  use Ecto.Schema
  import Ecto.Changeset

  schema "workouts" do
    field :workout_date, Timex.Ecto.DateTime
    field :description, :string
    field :user_id, :integer
    has_many :performed_exercises, Workout.Schemas.PerformedExercise
  end

  def validate_create(payload) do
    validation = %Workout.Schemas.Workout{}
    |> cast(payload, [:description, :user_id, :workout_date])
    |> put_assoc(:performed_exercises, payload[:performed_exercises])
    |> validate_required([:workout_date, :description, :user_id, :performed_exercises])

    case validation.errors do
      [] -> {:ok, payload}
      errors -> {:error, {:invalid, map_errors(errors)}}
    end
  end

  defp map_errors(errors) do
    errors
  end
end