defmodule Workout.Schemas.Workout do
  @moduledoc false
  use Ecto.Schema
  import Ecto.Changeset

  @date_format "{YYYY}-{0M}-{0D}"

  schema "workouts" do
    field :workout_date, Timex.Ecto.DateTime
    field :description, :string
    field :user_id, :integer
    has_many :performed_exercises, Workout.Schemas.PerformedExercise, on_replace: :delete
  end

  def create_changeset(payload) do
    %Workout.Schemas.Workout{}
    |> change
    |> cast_to_date(:workout_date, payload[:workout_date])
    |> cast(payload, [:description, :user_id])
    |> put_assoc(:performed_exercises, payload[:performed_exercises])
    |> validate_required([:workout_date, :description, :user_id, :performed_exercises])
    |> to_output
  end

  def update_changeset(workout, payload) do
    workout_date = Timex.parse!(workout[:workout_date], @date_format)
    |> Timex.Ecto.DateTime.cast!

    result = %Workout.Schemas.Workout{id: workout[:id],
      workout_date: workout_date, description: workout[:description]}
    |> Workout.Repo.preload(:performed_exercises)
    |> cast(payload, [:id, :description])
    |> cast_to_date(:workout_date, payload[:workout_date])
    |> put_assoc(:performed_exercises, payload[:performed_exercises])
    |> to_output
  end

  defp cast_to_date(changeset, key, value) do
    if value do
      case Timex.parse(value, @date_format) do
        {:error, _} -> add_error(changeset, key, "date not valid")
        {:ok, date} -> put_change(changeset, key, Timex.Ecto.DateTime.cast!(date))
      end
    else
      changeset
    end
  end

  defp to_output(changeset) do
    case changeset.errors do
      [] -> {:ok, changeset}
      errors -> {:error, {:invalid, errors}}
    end
  end
end