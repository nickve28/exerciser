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
    |> cast_performed_exercises(payload[:performed_exercises])
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
    |> cast_performed_exercises(payload[:performed_exercises])
    |> to_output
  end

  defp cast_performed_exercises(changeset, exercises) do
    indices = 0..(exercises |> Enum.count)
    exercise_index = indices |> Enum.zip(exercises)

    changeset = Enum.reduce(exercise_index, [], fn {index, %{type: type} = exercise}, _memo ->
      validate_performed_exercise(changeset, type, exercise, index)
    end)

    put_assoc(changeset, :performed_exercises, exercises)
  end

  defp validate_performed_exercise(changeset, "strength", exercise, index) do
    changeset
    |> validate_property(:reps, index, exercise)
    |> validate_property(:sets, index, exercise)
    |> validate_property(:weight, index, exercise)
  end

  defp validate_performed_exercise(changeset, "endurance", exercise, index) do
    changeset
    |> validate_property(:duration, index, exercise)
    |> validate_property(:amount, index, exercise)
    |> validate_property(:metric, index, exercise)
    |> validate_property(:mode, index, exercise)
  end

  defp validate_property(changeset, property, index, payload) do
    changeset = case Map.get(payload, property) do
      nil -> add_error(changeset, to_assoc_error_key(property, index), "is required")
      _ -> changeset
    end
  end

  defp to_assoc_error_key(key, index) do
    :"#{key}_#{index}"
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
      errors ->
        mapped_errors = for {key, {value, _}} <- errors, do: {key, value}
        {:error, {:invalid, "The data sent was invalid", mapped_errors}}
    end
  end
end