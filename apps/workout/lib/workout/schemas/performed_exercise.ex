defmodule Workout.Schemas.PerformedExercise do
  @moduledoc false
  use Ecto.Schema
  import Ecto.Changeset

  schema "performed_exercises" do
    belongs_to :workout, Workout.Schemas.Workout
    field :exercise_id, :integer, null: false
    field :reps, :integer, null: false
    field :sets, :integer, null: false
    field :weight, :float, null: false
  end

  def changeset(changeset, payload) do
    changeset
    |> cast(payload, [:exercise_id, :weight, :reps, :sets])
    |> validate_required([:exercise_id, :weight, :reps, :sets])
  end
end