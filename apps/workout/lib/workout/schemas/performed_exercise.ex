defmodule Workout.Schemas.PerformedExercise do
  @moduledoc false
  use Ecto.Schema
  import Ecto.Changeset

  schema "performed_exercises" do
    belongs_to :workout, Workout.Schemas.Workout
    field :exercise_id, :integer, null: false
    field :type, :string, null: false
    field :reps, :integer
    field :sets, :integer
    field :weight, :float
    field :duration, :float
    field :metric, :string
    field :amount, :float
    field :mode, :float
  end

  def changeset(changeset, payload) do
    changeset
    |> cast(payload, [:exercise_id, :weight, :reps, :sets])
    |> validate_required([:exercise_id, :weight, :reps, :sets])
  end
end